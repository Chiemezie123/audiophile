import { NextResponse } from "next/server";

import { mergeCartItemsForUser } from "@/lib/server/commerce-store";
import {
  applySessionCookies,
  resolveSessionFromRequest,
} from "@/lib/server/session";

export async function POST(request: Request) {
  const session = await resolveSessionFromRequest(request);
  const user = session.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const body = await request.json();
  const items = Array.isArray(body?.items) ? body.items : [];
  const mergedItems = await mergeCartItemsForUser(user.id, items);

  const response = NextResponse.json({ items: mergedItems, status: "success" });
  applySessionCookies(response, session);
  return response;
}
