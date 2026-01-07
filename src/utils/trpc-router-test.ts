import { getServerSession } from "@/server/auth";
import { initTRPC, TRPCError } from "@trpc/server";

export async function createTRPCContext() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  return {
    session,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create();

const { router, procedure } = t;

const middleware = t.middleware(async ({ ctx, next }) => {
  const result = await next();

  return result;
});

const protectedProcedure = procedure.use(middleware);

export const testRouter = router({
  test: protectedProcedure.query(async ({ ctx }) => {
    console.log("testRouter ctx:", ctx.session);
    return {
      hello: "world",
    };
  }),
});
