import { NextResponse } from "next/server";

import {
  applySessionCookies,
  resolveSessionFromRequest,
} from "@/lib/server/session";

export async function GET(request: Request) {
  const session = await resolveSessionFromRequest(request);
  const user = session.user;

  if (!user) {
    return NextResponse.json({ message: "Invalid session." }, { status: 401 });
  }

  const response = NextResponse.json({ user, status: "success" });
  applySessionCookies(response, session);
  return response;
}
