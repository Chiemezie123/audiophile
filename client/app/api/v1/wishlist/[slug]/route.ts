import { NextResponse } from "next/server";

import { removeWishlistItemForUser } from "@/lib/server/commerce-store";
import { getSessionUserFromRequest } from "@/lib/server/session";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const { slug } = await context.params;
  const items = await removeWishlistItemForUser(user.id, slug);
  return NextResponse.json({ items, status: "success" });
}
