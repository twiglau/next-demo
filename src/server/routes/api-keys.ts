import z from "zod";
import { v4 as uuidV4 } from "uuid";
import { protectedProcedure, router } from "../trpc-middlewares/trpc";
import { db } from "../db/db";
import { apiKeys } from "../db/schema";

export const apiKeysRouter = router({
  listApiKeys: protectedProcedure
    .input(z.object({ appId: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.query.apiKeys.findMany({
        where: (apis, { eq, and, isNull }) =>
          and(eq(apis.appId, input.appId), isNull(apis.deletedAt)),
      });
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
