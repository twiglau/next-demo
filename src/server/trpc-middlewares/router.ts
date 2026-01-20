import { router } from "./trpc";
import { fileRoutes } from "../routes/file";
import { appsRouter } from "../routes/app";

const appRouter = router({
  file: fileRoutes,
  apps: appsRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
