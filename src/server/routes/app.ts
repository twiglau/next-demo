import { desc } from "drizzle-orm";
import { db } from "../db/db";
import { protectedProcedure, router } from "../trpc-middlewares/trpc";
import { apps } from "../db/schema";
import { createAppSchema } from "../db/validate-schema";
import { v4 as uuidV4 } from "uuid";

export const appsRouter = router({
  createApp: protectedProcedure
    .input(createAppSchema.pick({ name: true, description: true }))
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(apps)
        .values({
          id: uuidV4(),
          name: input.name,
          description: input.description,
          userId: ctx.session.user.id,
        })
        .returning();

      return result[0];
    }),

  listApps: protectedProcedure.query(async ({ ctx }) => {
    const result = await db.query.apps.findMany({
      where: (apps, { eq, and, isNull }) => {
        return and(eq(apps.userId, ctx.session.user.id), isNull(apps.deleteAt));
      },
      orderBy: [desc(apps.createAt)],
    });

    return result;
  }),
});
