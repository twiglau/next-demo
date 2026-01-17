import { router } from "./trpc";
import { fileRoutes } from "../routes/file";

const appRouter = router({
  file: fileRoutes,
});

export { appRouter };
export type AppRouter = typeof appRouter;
