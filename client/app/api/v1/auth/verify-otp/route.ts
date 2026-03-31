import { NextResponse } from "next/server";

import { verifyOtpForEmail } from "@/lib/server/auth-store";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const isValid = await verifyOtpForEmail(email, otp);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified.",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to verify OTP." },
      { status: 500 }
    );
  }
}
