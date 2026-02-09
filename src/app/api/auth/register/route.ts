import { NextResponse } from "next/server";

import { AuthError, registerUser, startUserSession } from "@/lib/auth/service";
import { registerSchema } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const parseResult = registerSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const user = await registerUser(parseResult.data);
    const session = await startUserSession({
      userId: user.id,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    });

    const response = NextResponse.json({ user });
    response.cookies.set(
      session.cookie.name,
      session.cookie.value,
      session.cookie.options
    );

    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    console.error("[register]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
