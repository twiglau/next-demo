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
  return createTRPCClient<OpenRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/api/open",
        headers: {
          "api-key": options.apiKey,
          "signed-token": options.signedToken,
        },
      }),
    ],
  });
};

export type { OpenRouter };
