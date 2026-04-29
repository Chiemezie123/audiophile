import { NextResponse } from "next/server";

import {
  createSessionTokenForUser,
  SECOND_SESSION_COOKIE_NAME,
  loginUser,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  SESSION_REFRESH_MAX_AGE_SECONDS,
} from "@/lib/server/auth-store";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    if (!result) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      user: result.user,
      status: "success",
    });
    const refreshToken = createSessionTokenForUser({
      id: result.user.id,
      email: result.user.email,
      maxAge: SESSION_REFRESH_MAX_AGE_SECONDS,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: result.token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    response.cookies.set({
      name: SECOND_SESSION_COOKIE_NAME,
      value: refreshToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_REFRESH_MAX_AGE_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Failed to log in." },
      { status: 500 }
    );
  }
}
