import { NextResponse } from "next/server";

import {
  clearCartItemsForUser,
  replaceCartItemsForUser,
} from "@/lib/server/commerce-store";
import {
  applySessionCookies,
  clearAuthCookies,
  resolveSessionFromRequest,
} from "@/lib/server/session";


export async function GET(request: Request) {
  const session = await resolveSessionFromRequest(request);
  const user = session.user;

  if (!user) {
    const res = NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    return clearAuthCookies(res);
    }

  const { getCartItemsForUser } = await import("@/lib/server/commerce-store");
  const items = await getCartItemsForUser(user.id);
  const response = NextResponse.json({ items, status: "success" });
  applySessionCookies(response, session);
  return response;
}

export async function PUT(request: Request) {
  const session = await resolveSessionFromRequest(request);
  const user = session.user;

  if (!user) {
    const res = NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    return clearAuthCookies(res);
  }

  const body = await request.json();
  const items = Array.isArray(body?.items) ? body.items : [];
  const nextItems = await replaceCartItemsForUser(user.id, items);

  const response = NextResponse.json({ items: nextItems, status: "success" });
  applySessionCookies(response, session);
  return response;
}

export async function DELETE(request: Request) {
  const session = await resolveSessionFromRequest(request);
  const user = session.user;

  if (!user) {
    const res = NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    return clearAuthCookies(res);
  }

  await clearCartItemsForUser(user.id);
  const response = NextResponse.json({ items: [], status: "success" });
  applySessionCookies(response, session);
  return response;
}
