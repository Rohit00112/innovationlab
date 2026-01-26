import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/service";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getSessionUser(cookieStore);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}
