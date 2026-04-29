import { NextResponse } from "next/server";

import { removeWishlistItemForUser } from "@/lib/server/commerce-store";
import {
  applySessionCookies,
  clearAuthCookies,
  resolveSessionFromRequest,
} from "@/lib/server/session";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const session = await resolveSessionFromRequest(request);
  const user = session.user;

  if (!user) {
    const res = NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    return clearAuthCookies(res);
  }

  const { slug } = await context.params;
  const items = await removeWishlistItemForUser(user.id, slug);
  const response = NextResponse.json({ items, status: "success" });
  applySessionCookies(response, session);
  return response;
}
