import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/auth";

export async function middleware(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
