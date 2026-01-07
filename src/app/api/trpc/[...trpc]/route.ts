import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";
import { testRouter } from "@/utils/trpc-router-test";
import { getServerSession } from "@/server/auth";

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc/",
    req: request,
    router: testRouter,
    createContext: async () => {
      const session = await getServerSession();
      if (!session?.user) {
        throw new Error("Unauthorized");
      }
      return {
        session,
      };
    },
  });
};

export { handler as GET, handler as POST };
