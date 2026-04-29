import { NextResponse } from "next/server";

import { updateUserProfileFromToken } from "@/lib/server/auth-store";
import {
  applySessionCookies,
  resolveSessionFromRequest,
} from "@/lib/server/session";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.split(" ")[1]
      : null;
    const session = bearerToken ? null : await resolveSessionFromRequest(request);
    const token = bearerToken || session?.tokenForUser || null;

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

    const response = NextResponse.json({ user, status: "success" });
    if (session) {
      applySessionCookies(response, session);
    }
    return response;
  } catch {
    return NextResponse.json(
      { message: "Failed to complete profile." },
      { status: 500 }
    );
  }
}
