import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  updateUserProfileFromToken,
} from "@/lib/server/auth-store";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.split(" ")[1]
      : null;
    const cookieToken =
      request.headers
        .get("cookie")
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
        ?.split("=")[1] || null;
    const token = bearerToken || cookieToken;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token is required." },
        { status: 401 }
      );
    }

    const { firstName, lastName } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: "First name and last name are required." },
        { status: 400 }
      );
    }

    const user = await updateUserProfileFromToken(token, {
      firstName,
      lastName,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    return NextResponse.json({ user, status: "success" });
  } catch {
    return NextResponse.json(
      { message: "Failed to complete profile." },
      { status: 500 }
    );
  }
}
