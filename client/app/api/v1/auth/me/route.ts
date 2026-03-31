import { NextResponse } from "next/server";

import {
  getUserFromToken,
  SESSION_COOKIE_NAME,
} from "@/lib/server/auth-store";

export async function GET(request: Request) {
  const token =
    request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
      ?.split("=")[1] || null;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const user = await getUserFromToken(token);

  if (!user) {
    return NextResponse.json({ message: "Invalid session." }, { status: 401 });
  }

  return NextResponse.json({ user, status: "success" });
}
