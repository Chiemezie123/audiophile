import { NextResponse } from "next/server";

import { createOtpForEmail, userExistsByEmail } from "@/lib/server/auth-store";
import { getMailerDebugConfig, sendOtpEmail } from "@/lib/server/mailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const exists = await userExistsByEmail(email);

    if (exists) {
      return NextResponse.json(
        {
          message: "An account with this email already exists. Please log in.",
          shouldLogin: true,
        },
        { status: 409 }
      );
    }

    const otp = await createOtpForEmail(email);
    console.log("Sending OTP to email:", email);
    console.log("OTP:", otp);

    if (process.env.NODE_ENV === "production") {
    
      await sendOtpEmail({ email, otp });
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email.",
      devOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  }
  catch (error) {
    console.error("request-otp failed", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      nodeEnv: process.env.NODE_ENV,
      mailer: getMailerDebugConfig(),
    });

    return NextResponse.json(
      { message: "Failed to create OTP." },
      { status: 500 }
    );
  }
}
