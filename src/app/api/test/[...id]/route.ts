import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  console.log(cookieStore.get("next-auth.session-token"));

  return NextResponse.json({ data: id }, { status: 200 });
}
