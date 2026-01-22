import { fileOpenRoutes } from "../routes/file-open";
import { router } from "./trpc";

const openRouter = router({
  file: fileOpenRoutes,
});

export { openRouter };
export type OpenRouter = typeof openRouter;
