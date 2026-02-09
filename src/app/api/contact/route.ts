import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email/service";

const contactPayloadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

const CONTACT_RECIPIENT = process.env.CONTACT_EMAIL || "innovation.lab@iic.edu.np";

function buildContactNotificationEmail(data: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 12px 16px; border-radius: 12px; margin-bottom: 16px;">
                        <span style="color: #fff; font-size: 24px; font-weight: bold;">✉</span>
                    </div>
                    <h1 style="margin: 0; font-size: 22px; color: #1a1a2e; font-weight: 700;">New Contact Form Message</h1>
                </div>

                <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 12px; font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; width: 100px;">From</td>
                            <td style="padding: 8px 12px; font-size: 15px; color: #333; font-weight: 600;">${data.fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                            <td style="padding: 8px 12px; font-size: 15px; color: #333;"><a href="mailto:${data.email}" style="color: #6366f1; text-decoration: none;">${data.email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Subject</td>
                            <td style="padding: 8px 12px; font-size: 15px; color: #333;">${data.subject}</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-bottom: 24px;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                    <div style="background: #f8f9fa; border-left: 4px solid #6366f1; border-radius: 0 8px 8px 0; padding: 16px 20px;">
                        <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
                    </div>
                </div>

                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
                    <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">Reply to ${data.fullName}</a>
                </div>

                <div style="margin-top: 24px; text-align: center;">
                    <p style="font-size: 12px; color: #bbb; margin: 0;">
                        This message was sent via the Innovation Lab contact form.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  return {
    subject: `[Contact Form] ${data.subject}`,
    html,
  };
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = contactPayloadSchema.parse(payload);

    // Build and send the email
    const { subject, html } = buildContactNotificationEmail(data);

    const result = await sendEmail({
      to: CONTACT_RECIPIENT,
      subject,
      html,
    });

    if (!result) {
      console.warn("[contact] Email not sent (SMTP may not be configured). Logging submission:", data);
    }

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
