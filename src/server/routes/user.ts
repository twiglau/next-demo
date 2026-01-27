import { db } from "../db/db";
import { protectedProcedure, router } from "../trpc-middlewares/trpc";

export const usersRouter = router({
  getPlan: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });
    return user?.plan;
  }),
});
