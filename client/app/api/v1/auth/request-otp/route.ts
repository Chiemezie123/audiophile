import { NextResponse } from "next/server";

import { createOtpForEmail } from "@/lib/server/auth-store";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const otp = await createOtpForEmail(email);

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email.",
      devOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to create OTP." },
      { status: 500 }
    );
  }
}
