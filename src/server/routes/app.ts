import { desc } from "drizzle-orm";
import { db } from "../db/db";
import { protectedProcedure, router } from "../trpc-middlewares/trpc";
import { apps } from "../db/schema";

export const appsRouter = router({
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
