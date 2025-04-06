// app/api/test-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    emailUser: process.env.EMAIL_USER || "not_found",
    emailPass: process.env.EMAIL_PASS ? "exists" : "not_found",
    nodeEnv: process.env.NODE_ENV,
  });
}
