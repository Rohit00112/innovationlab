import { NextResponse } from "next/server";
import { z } from "zod";

const contactPayloadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = contactPayloadSchema.parse(payload);

    console.log("Contact form submission", {
      ...data,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message:
          "Thanks for reaching out. Someone from the Innovation Lab team will reply soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed for the submitted contact form.",
          issues: error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    console.error("Contact form submission failed", error);

    return NextResponse.json(
      {
        message: "We could not process your request right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}
