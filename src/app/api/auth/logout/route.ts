import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { endUserSession } from "@/lib/auth/service";

export async function POST() {
  const cookieStore = await cookies();
  const clearedCookie = await endUserSession(cookieStore);

  const response = NextResponse.json({ success: true });

  if (clearedCookie) {
    response.cookies.set(
      clearedCookie.name,
      clearedCookie.value,
      clearedCookie.options
    );
  }

  return response;
}
