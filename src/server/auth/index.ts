import {
  AuthOptions,
  DefaultSession,
  getServerSession as nextAuthGetServerSession,
} from "next-auth";
import { db } from "@/server/db/db";
import GitlabProvider from "next-auth/providers/gitlab";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

declare module "next-auth" {
  // 增加 session.user.id
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const authOption: AuthOptions = {
  adapter: DrizzleAdapter(db),
  callbacks: {
    async session(params) {
      // 回调成功，添加
      const { session, user } = params;
      if (session.user && user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  providers: [
    GitlabProvider({
      clientId: process.env.GITLAB_ID!,
      clientSecret: process.env.GITLAB_SECRET!,
    }),
  ],
};

function getServerSession() {
  return nextAuthGetServerSession(authOption);
}

export { authOption, getServerSession };
