import { appRouter } from "@/server/trpc-middlewares/router";
import { createCallerFactory } from "@trpc/server/unstable-core-do-not-import";

// TODO： 是什么意思
const serverCaller = createCallerFactory()(appRouter);

export { serverCaller };
