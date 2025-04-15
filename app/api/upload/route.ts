import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Papa from "papaparse";

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const BATCH_SIZE = 20;
const DELAY_MS = 1000;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const emailMessage = formData.get("message") as string;
    const subject = formData.get("subject") as string;
    const senderName = formData.get("senderName") as string;
    const senderEmail = formData.get("senderEmail") as string;
    const replyTo = formData.get("replyTo") as string;
    const imageFile = formData.get("image") as File | null;

    if (!file)
      return NextResponse.json(
        { error: "No CSV file uploaded" },
        { status: 400 }
      );
    if (!emailMessage?.trim())
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    if (!subject?.trim())
      return NextResponse.json(
        { error: "Subject cannot be empty" },
        { status: 400 }
      );
    if (!isValidEmail(senderEmail))
      return NextResponse.json(
        { error: "Invalid sender email" },
        { status: 400 }
      );
    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json(
        { error: "CSV file too large" },
        { status: 400 }
      );
    if (imageFile && imageFile.size > 5 * 1024 * 1024)
      return NextResponse.json(
        { error: "Image file too large" },
        { status: 400 }
      );

    const buffer = Buffer.from(await file.arrayBuffer());
    const { data } = Papa.parse(buffer.toString(), {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) =>
        field === "email" ? value.trim().toLowerCase() : value,
    });

    const recipients = data
      .filter((row: any) => row.email && isValidEmail(row.email))
      .map((row: any) => ({
        email: row.email,
        name: row.name || "",
      }));

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No valid emails in CSV" },
        { status: 400 }
      );
    }

    // Prepare image attachment if exists
    let imageAttachment = [];
    if (imageFile) {
      imageAttachment = [
        {
          filename: imageFile.name,
          content: Buffer.from(await imageFile.arrayBuffer()),
          cid: "header-image",
        },
      ];
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
      tls: {
        rejectUnauthorized: false,
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

    const results = [];
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map(async (recipient) => {
          try {
            const info = await transporter.sendMail({
              from: `"${senderName || "Bulk Email Sender"}" <${senderEmail}>`,
              to: recipient.email,
              replyTo: replyTo || senderEmail,
              subject: subject,
              html: `
                <div style="font-family: Arial, sans-serif; width: 100%; margin: 0 auto; background: #000; padding: 20px; border-radius: 5px;">
                    <div style="text-align: center; margin-bottom: 20px; background: #f9f9f9; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px;">
                        <h1 style="color: #333; font-size: 44px; text-align: center; ">${subject}</h1>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="https://media.istockphoto.com/id/1434212178/photo/middle-eastern-lady-using-laptop-working-online-sitting-in-office.jpg?s=612x612&w=0&k=20&c=Qy_dzvLEN4ks5nxnl6FbAVEvV_9pdlcaiNtCuzF7Qbk=" alt="Header Image" style="max-width: 100%; height: auto; border-radius: 5px;" />
                        </div>
                        <p>Hello ${recipient.name || "there"},</p>
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
              status: "success",
              messageId: info.messageId,
            };
          } catch (error) {
            return {
              email: recipient.email,
              status: "failed",
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

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.status === "success"
    );
    const failed = results
      .filter((r) => r.status === "fulfilled" && r.value.status === "failed")
      .map((r) => (r as any).value);

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
  } catch (error: any) {
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
