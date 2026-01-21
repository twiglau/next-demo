import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";
import { appRouter } from "@/server/trpc-middlewares/router";
import { getServerSession } from "@/server/auth";

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: async () => {
      const session = await getServerSession();
      return {
        session,
      };
    },
  });
};

export { handler as GET, handler as POST };
