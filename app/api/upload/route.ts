import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Papa from "papaparse";

interface CsvRow {
  email: string;
  name?: string;
}

interface Recipient {
  email: string;
  name: string;
}

interface EmailResult {
  email: string;
  status: "success" | "failed";
  messageId?: string;
  error?: string;
}

const BATCH_SIZE = 20;
const DELAY_MS = 1000;

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateInputs = (
  file: File | null,
  emailMessage: string | null,
  subject: string | null,
  senderEmail: string | null
): { error?: string; status?: number } | null => {
  if (!file) return { error: "No CSV file uploaded", status: 400 };
  if (!emailMessage?.trim())
    return { error: "Message cannot be empty", status: 400 };
  if (!subject?.trim())
    return { error: "Subject cannot be empty", status: 400 };
  if (!senderEmail || !isValidEmail(senderEmail))
    return { error: "Invalid sender email", status: 400 };
  if (file.size > 5 * 1024 * 1024)
    return { error: "CSV file too large", status: 400 };
  return null;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const emailMessage = formData.get("message") as string | null;
    const subject = formData.get("subject") as string | null;
    const senderName = formData.get("senderName") as string | null;
    const senderEmail = formData.get("senderEmail") as string | null;
    const replyTo = formData.get("replyTo") as string | null;
    const imageFile = formData.get("image") as File | null;

    const validationError = validateInputs(
      file,
      emailMessage,
      subject,
      senderEmail
    );
    if (validationError) {
      return NextResponse.json(
        { error: validationError.error },
        { status: validationError.status }
      );
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file too large" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file!.arrayBuffer());
    const { data } = Papa.parse<CsvRow>(buffer.toString("utf-8"), {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) =>
        field === "email" ? value.trim().toLowerCase() : value,
    });

    const recipients: Recipient[] = data
      .filter(
        (row): row is { email: string; name?: string } =>
          !!row.email && isValidEmail(row.email)
      )
      .map((row) => ({
        email: row.email,
        name: row.name || "there",
      }));

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No valid emails in CSV" },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 60000,
      socketTimeout: 120000,
    });

    try {
      await transporter.verify();
    } catch (error) {
      console.error("SMTP Error:", error);
      return NextResponse.json(
        {
          error: "Email service unavailable",
          details: error instanceof Error ? error.message : "Connection failed",
        },
        { status: 502 }
      );
    }

    const results: EmailResult[] = [];

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map(async (recipient) => {
          try {
            const info = await transporter.sendMail({
              from: `"${senderName || "Bulk Email Sender"}" <${senderEmail}>`,
              to: recipient.email,
              replyTo: replyTo || senderEmail || undefined,
              subject: subject!,
              html: `
                <div style="font-family: Arial, sans-serif; background: #000; padding: 20px; border-radius: 5px;">
                  <div style="text-align: center; margin: 0 auto; background: #f9f9f9; max-width: 600px; padding: 20px; border-radius: 5px;">
                    <h1 style="color: #333; font-size: 44px;">${subject}</h1>
                    <p>Hello ${recipient.name},</p>
                    <div style="white-space: pre-line; line-height: 1.6;">
                      ${emailMessage}
                    </div>
                    <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
                      <em>Please reply to this email if you didn't request this message.</em>
                    </p>
                  </div>
                </div>
              `,
            });

            return {
              email: recipient.email,
              status: "success" as const,
              messageId: info.messageId,
            };
          } catch (error) {
            return {
              email: recipient.email,
              status: "failed" as const,
              error: error instanceof Error ? error.message : "Send failed",
            };
          }
        })
      );

      results.push(...batchResults);

      if (i + BATCH_SIZE < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
    }

    const successful = results.filter((r) => r.status === "success");
    const failed = results.filter((r) => r.status === "failed");

    return NextResponse.json({
      success: true,
      stats: {
        total: recipients.length,
        successful: successful.length,
        failed: failed.length,
      },
      failedRecipients: failed,
      message: `Sent ${successful.length} of ${recipients.length} emails successfully`,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      {
        error: "Processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
