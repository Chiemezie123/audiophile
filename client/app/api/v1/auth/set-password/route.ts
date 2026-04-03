import { NextResponse } from "next/server";

import {
  createOrUpdatePasswordUser,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/server/auth-store";

export async function POST(request: Request) {
  try {
    const { email, password, confirmPassword } = await request.json();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Email, password, and confirm password are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Password and confirm password do not match." },
        { status: 400 }
      );
    }

    const result = await createOrUpdatePasswordUser(email, password);
    const response = NextResponse.json(
      { user: result.user, status: "success" },
      { status: 201 }
    );

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: result.token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Failed to create account." },
      { status: 500 }
    );
  }
}
