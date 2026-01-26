import { withAppProcedure, router } from "../trpc-middlewares/trpc";
import { z } from "zod";
import { db } from "../db/db";
import { TRPCError } from "@trpc/server";
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { files } from "../db/schema";
import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { filesCanOrderByColumn } from "../db/validate-schema";

const filesOrderByColumnSchema = z
  .object({
    field: filesCanOrderByColumn.keyof(),
    order: z.enum(["asc", "desc"]),
  })
  .optional();

//TODO:不知道什么意思，先这样写
export type FilesOrderByColumn = z.infer<typeof filesOrderByColumnSchema>;

const fileOpenRoutes = router({
  // s3 生成上传url
  createPresignedUrl: withAppProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date();
      const isoString = date.toISOString();
      const dateString = isoString.split("T")[0];

      const app = ctx.app;
      if (!app || !app.storage) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      if (app.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const ext = input.filename.includes(".")
        ? input.filename.split(".").pop()
        : "";
      const nameWithoutExt = input.filename.includes(".")
        ? input.filename.slice(0, input.filename.lastIndexOf("."))
        : input.filename;

      const storage = app.storage;
      const params: PutObjectCommandInput = {
        Bucket: storage.configuration.bucket,
        Key: `${dateString}/${nameWithoutExt}-${uuidv4()}${ext ? `.${ext}` : ""}`,
        ContentType: input.contentType,
        ContentLength: input.size,
      };

      const command = new PutObjectCommand(params);
      const s3Client = new S3Client({
        region: storage.configuration.region,
        endpoint: storage.configuration.apiEndPoint,
        credentials: {
          accessKeyId: storage.configuration.accessKeyId,
          secretAccessKey: storage.configuration.secretAccessKey,
        },
      });
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 60 * 5, // 5 minutes
      });
      return { url, method: "PUT" as const };
    }),
  // 保存图片到数据库
  saveFile: withAppProcedure
    .input(
      z.object({
        name: z.string(),
        path: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user, app } = ctx;
      const url = new URL(input.path);

      const photo = await db
        .insert(files)
        .values({
          ...input,
          appId: app.id,
          id: uuidv4(),
          path: url.pathname,
          url: url.toString(),
          type: input.type,
          userId: user?.id,
          contentType: input.type,
        })
        .returning();

      return photo[0];
    }),
  // 查询图片列表
  listFiles: withAppProcedure
    .input(
      z.object({
        appId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await db.query.files.findMany({
        orderBy: [desc(files.createdAt)],
        where: (files, { eq }) =>
          and(eq(files.userId, user?.id), eq(files.appId, input.appId)),
      });
      return result;
    }),
  // 下拉加载更多（列表）
  infinityQueryFiles: withAppProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.string(), createdAt: z.string() }).optional(),
        limit: z.number().default(10),
        orderBy: filesOrderByColumnSchema,
        appId: z.string(),
      }),
    )
    .query(async (res) => {
      const {
        cursor,
        limit,
        orderBy = { field: "createdAt", order: "desc" },
      } = res.input;

      const appFilter = eq(files.appId, res.input.appId);
      const deletedFilter = isNull(files.deletedAt);
      const userFilter = eq(files.userId, res.ctx.user.id);

      const statement = db
        .select()
        .from(files)
        .limit(limit)
        .where(
          cursor
            ? and(
                sql`("files"."created_at", "files"."id") > (${new Date(cursor.createdAt).toISOString()}, ${cursor.id})`,
                deletedFilter,
                userFilter,
                appFilter,
              )
            : and(deletedFilter, userFilter, appFilter),
        );

      statement.orderBy(
        orderBy.order === "asc"
          ? asc(files[orderBy.field])
          : desc(files[orderBy.field]),
      );

      const result = await statement;
      return {
        items: result,
        nextCursor: result.length
          ? {
              id: result[result.length - 1].id,
              createdAt: result[result.length - 1].createdAt!,
            }
          : null,
      };
    }),
  // 删除图片
  deleteFile: withAppProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return db
        .update(files)
        .set({
          deletedAt: new Date(),
        })
        .where(eq(files.id, input));
    }),
});

export { fileOpenRoutes };
