import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "@/server/auth";
import { headers } from "next/headers";
import { db } from "../db/db";

const t = initTRPC.create();
const { router, procedure } = t;

const loggedMiddleware = t.middleware(async ({ ctx, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;
  console.log(`[DEBUG] api time: ${duration}ms`);
  return result;
});

const withSessionMiddleware = t.middleware(async ({ ctx, next }) => {
  const session = await getServerSession();

  return next({
    ctx: { session },
  });
});

const withLoggerProcedure = procedure.use(loggedMiddleware);
const protectedProcedure = procedure
  .use(loggedMiddleware)
  .use(withSessionMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }
    return next({
      ctx: { session: ctx.session! },
    });
  });

const withAppProcedure = withLoggerProcedure.use(async ({ ctx, next }) => {
  const header = await headers();
  const apiKey = header.get("api-key");
  const signedToken = header.get("signed-token");
  if (apiKey) {
    const apiKeyAndAppUser = await db.query.apiKeys.findFirst({
      where: (apiKeys, { eq, and, isNull }) =>
        and(eq(apiKeys.key, apiKey), isNull(apiKeys.deletedAt)),
      with: {
        app: {
          with: {
            user: true,
          },
        },
      },
    });

    if (apiKeyAndAppUser == null) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return next({
      ctx: {
        app: apiKeyAndAppUser.app,
        user: apiKeyAndAppUser.app.user,
      },
    });
  }

  throw new TRPCError({ code: "FORBIDDEN" });
});

export { router, protectedProcedure, withAppProcedure };
