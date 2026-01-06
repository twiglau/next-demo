import { httpBatchLink, createTRPCProxyClient } from "@trpc/client";
import { testRouter } from "./trpc-test";

const client = createTRPCProxyClient<typeof testRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});

export { client };
