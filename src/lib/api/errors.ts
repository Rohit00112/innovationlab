import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export function toErrorResponse(error: unknown, fallbackMessage = "Internal server error") {
  if (error instanceof ApiError) {
    const body = error.details
      ? { message: error.message, details: error.details }
      : { message: error.message };

    return NextResponse.json(body, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ message: fallbackMessage }, { status: 500 });
}
