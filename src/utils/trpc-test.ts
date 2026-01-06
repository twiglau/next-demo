import { initTRPC } from "@trpc/server";

const t = initTRPC.create();
const { router, procedure } = t;

export const testRouter = router({
  test: procedure.query(() => {
    return {
      hello: "world",
    };
  }),
});
