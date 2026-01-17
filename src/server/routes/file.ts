import { protectedProcedure, router } from "../trpc-middlewares/trpc";
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

const fileRoutes = router({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
        appId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date();
      const isoString = date.toISOString();
      const dateString = isoString.split("T")[0];
      const app = await db.query.apps.findFirst({
        where: (apps, { eq }) => eq(apps.id, input.appId),
        with: { storage: true },
      });
      if (!app || !app.storage) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      if (app.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const storage = app.storage;
      const params: PutObjectCommandInput = {
        Bucket: storage.configuration.bucket,
        Key: `${dateString}/${input.filename}-${uuidv4()}`,
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
});

export { fileRoutes };
