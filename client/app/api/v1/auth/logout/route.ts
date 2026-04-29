import { NextResponse } from "next/server";
import {
  SECOND_SESSION_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "@/lib/server/auth-store";
import { replaceCartItemsForUser } from "@/lib/server/commerce-store";
import { getSessionUserFromRequest } from "@/lib/server/session";

export async function POST(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (user) {
    try {
      const body = await request.json().catch(() => null);
      const items = Array.isArray(body?.items) ? body.items : null;

      if (items) {
        await replaceCartItemsForUser(user.id, items);
      }
    } catch (error) {
      console.error("Failed to persist cart during logout:", error);
    }
  }

  const response = NextResponse.json({
    status: "success",
    message: "Logged out successfully.",
  });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set({
    name: SECOND_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
