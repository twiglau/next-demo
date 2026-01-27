import z from "zod";
import { v4 as uuidV4 } from "uuid";
import { protectedProcedure, router } from "../trpc-middlewares/trpc";
import { db } from "../db/db";
import { apiKeys } from "../db/schema";
import { TRPCError } from "@trpc/server";

export const apiKeysRouter = router({
  listApiKeys: protectedProcedure
    .input(z.object({ appId: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.query.apiKeys.findMany({
        where: (apis, { eq, and, isNull }) =>
          and(eq(apis.appId, input.appId), isNull(apis.deletedAt)),
        columns: {
          key: false,
        },
      });
    }),
  requestKey: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const apiKey = await db.query.apiKeys.findFirst({
        where: (keys, { eq, isNull, and }) =>
          and(eq(keys.id, input), isNull(keys.deletedAt)),
        with: {
          app: {
            with: {
              user: true,
            },
          },
        },
      });

      if (apiKey?.app.user.id !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return apiKey.key;
    }),
  createApiKey: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        appId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(apiKeys)
        .values({
          key: uuidV4(),
          clientId: uuidV4(),
          name: input.name,
          appId: input.appId,
        })
        .returning();

      return result[0];
    }),
});
