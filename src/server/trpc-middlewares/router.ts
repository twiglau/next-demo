import { router } from "./trpc";
import { fileRoutes } from "../routes/file";
import { appsRouter } from "../routes/app";
import { storageRouter } from "../routes/storages";
import { apiKeysRouter } from "../routes/api-keys";
import { usersRouter } from "../routes/user";

const appRouter = router({
  file: fileRoutes,
  apps: appsRouter,
  storages: storageRouter,
  apiKeys: apiKeysRouter,
  users: usersRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
