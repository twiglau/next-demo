import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { type OpenRouter } from "@/server/trpc-middlewares/open-router";

const apiClient = createTRPCClient<OpenRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/open",
    }),
  ],
});

export { apiClient };
export type { OpenRouter };
