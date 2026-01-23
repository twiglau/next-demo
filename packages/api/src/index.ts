import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { type OpenRouter } from "./open-router-dts";

export const apiClient = createTRPCClient<OpenRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/open",
    }),
  ],
});

export const createApiClient = (options: {
  apiKey?: string;
  signedToken?: string;
}) => {
  const headers: Record<string, string> = {};
  if (options.apiKey) {
    headers["api-key"] = options.apiKey;
  }
  if (options.signedToken) {
    headers["signed-token"] = options.signedToken;
  }

  return createTRPCClient<OpenRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/api/open",
        headers,
      }),
    ],
  });
};

export type { OpenRouter };
