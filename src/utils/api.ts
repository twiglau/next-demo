import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { testRouter } from "./trpc-router-test";

const trpcClientReact = createTRPCReact<typeof testRouter>({});

const trpcPureClient = trpcClientReact.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});

export { trpcClientReact, trpcPureClient };
