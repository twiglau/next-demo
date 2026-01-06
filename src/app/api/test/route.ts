import { NextRequest, NextResponse } from "next/server";

import z from "zod";

const schema = z.object({
  name: z.string().max(10).min(3),
  email: z.string().email(),
});

// 每次请求都会重新执行，线上不会缓存
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;

  const name = query.get("name");
  const email = query.get("email");

  const result = schema.safeParse({ name, email });

  if (!result.success) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json({ data: "hello word" }, { status: 200 });
}
