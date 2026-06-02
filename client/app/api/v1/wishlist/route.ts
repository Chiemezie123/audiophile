import { NextResponse } from "next/server";

import {
  addWishlistItemForUser,
  getWishlistItemsForUser,
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

  const items = await getWishlistItemsForUser(user.id);
  const response = NextResponse.json({ items, status: "success" });
  applySessionCookies(response, session);
  return response;
}

export async function POST(request: Request) {
  const session = await resolveSessionFromRequest(request);
  const user = session.user;

  if (!user) {
    const res = NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    return clearAuthCookies(res);
  }

  const { productSlug } = await request.json();
  if (!productSlug || typeof productSlug !== "string") {
    return NextResponse.json(
      { message: "Product slug is required." },
      { status: 400 }
    );
  }

  const items = await addWishlistItemForUser(user.id, productSlug);
  const response = NextResponse.json({ items, status: "success" });
  applySessionCookies(response, session);
  return response;
}
