import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
    },
})

const FROM_ADDRESS = process.env.SMTP_FROM || "noreply@innovationlab.edu.np"

function isEmailConfigured(): boolean {
    return !!(process.env.SMTP_HOST && process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.SMTP_PASSWORD))
}

interface SendEmailOptions {
    to: string | string[]
    subject: string
    html: string
    text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
    if (!isEmailConfigured()) {
        console.warn("[email] SMTP not configured, skipping email send to:", to)
        return null
    }

    try {
        const info = await transporter.sendMail({
            from: FROM_ADDRESS,
            to: Array.isArray(to) ? to.join(", ") : to,
            subject,
            html,
            text: text ?? html.replace(/<[^>]*>/g, ""),
        })
        console.log("[email] Sent:", info.messageId, "to:", to)
        return info
    } catch (error) {
        console.error("[email] Failed to send:", error)
        return null
    }
}

interface RegistrationEmailData {
    eventTitle: string
    eventStartDate?: Date | null
    participantName: string
    registrationType: "individual" | "team"
    teamName?: string | null
    teamMembers?: Array<{ name: string; email?: string; londonmetId?: string }> | null
}

export function buildRegistrationConfirmationEmail(data: RegistrationEmailData) {
    const { eventTitle, eventStartDate, participantName, registrationType, teamName, teamMembers } = data

    const formattedDate = eventStartDate
        ? new Date(eventStartDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Asia/Kathmandu",
        })
        : null

    const formattedTime = eventStartDate
        ? new Date(eventStartDate).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            timeZone: "Asia/Kathmandu",
        })
        : null

    // Build full members list including team leader
    const allMembers = registrationType === "team"
        ? [
            { name: participantName, role: "Team Leader" },
            ...(teamMembers ?? []).map(m => ({ name: m.name, role: "Member" })),
        ]
        : []

    const teamSection = registrationType === "team" && allMembers.length > 0
        ? `
        <div style="margin-top: 20px; padding: 16px; background-color: #f8f9fa; border-radius: 8px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #333;">Team: ${teamName || "Unnamed Team"}</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd; font-size: 13px; color: #666;">#</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd; font-size: 13px; color: #666;">Name</th>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd; font-size: 13px; color: #666;">Role</th>
                    </tr>
                </thead>
                <tbody>
                    ${allMembers.map((m, i) => `
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 14px;">${i + 1}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: ${m.role === 'Team Leader' ? '600' : '400'};">${m.name || "—"}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; color: ${m.role === 'Team Leader' ? '#6366f1' : '#666'};">${m.role}</td>
                    </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
        `
        : ""

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
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 12px 16px; border-radius: 12px; margin-bottom: 16px;">
                        <span style="color: #fff; font-size: 24px; font-weight: bold;">✓</span>
                    </div>
                    <h1 style="margin: 0; font-size: 24px; color: #1a1a2e; font-weight: 700;">Registration Confirmed!</h1>
                </div>

                <!-- Content -->
                <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 8px;">
                    Hi <strong>${participantName}</strong>,
                </p>
                <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 24px;">
                    Your ${registrationType === "team" ? "team " : ""}registration for <strong>${eventTitle}</strong> has been confirmed.
                </p>

                <!-- Event Card -->
                <div style="background: linear-gradient(135deg, #f0f0ff, #f8f0ff); border: 1px solid #e0d8f0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                    <p style="margin: 0 0 4px 0; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Event</p>
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a2e;">${eventTitle}</p>
                    ${formattedDate ? `
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
                        📅 ${formattedDate}${formattedTime ? ` at ${formattedTime}` : ""}
                    </p>
                    ` : ""}
                    ${registrationType === "team" && teamName ? `
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
                        🏷️ Team: <strong>${teamName}</strong>
                    </p>
                    ` : ""}
                </div>

                ${teamSection}

                <!-- Footer -->
                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; text-align: center;">
                    <p style="font-size: 13px; color: #999; margin: 0;">
                        Innovation Lab · Itahari International College
                    </p>
                    <p style="font-size: 12px; color: #bbb; margin: 8px 0 0 0;">
                        This is an automated confirmation. Please do not reply to this email.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `

    const subject = `Registration Confirmed: ${eventTitle}`

    return { subject, html }
}
