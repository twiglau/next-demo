import { router } from "./trpc";
import { fileRoutes } from "../routes/file";
import { appsRouter } from "../routes/app";
import { storageRouter } from "../routes/storages";
import { apiKeysRouter } from "../routes/api-keys";

const appRouter = router({
  file: fileRoutes,
  apps: appsRouter,
  storages: storageRouter,
  apiKeys: apiKeysRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
