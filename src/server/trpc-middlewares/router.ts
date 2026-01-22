import { router } from "./trpc";
import { fileRoutes } from "../routes/file";
import { appsRouter } from "../routes/app";
import { storageRouter } from "../routes/storages";

const appRouter = router({
  file: fileRoutes,
  apps: appsRouter,
  storages: storageRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
