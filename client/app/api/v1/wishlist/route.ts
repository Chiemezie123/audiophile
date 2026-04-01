import { NextResponse } from "next/server";

import {
  addWishlistItemForUser,
  getWishlistItemsForUser,
} from "@/lib/server/commerce-store";
import { getSessionUserFromRequest } from "@/lib/server/session";

export async function GET(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const items = await getWishlistItemsForUser(user.id);
  return NextResponse.json({ items, status: "success" });
}

export async function POST(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const { productSlug } = await request.json();
  if (!productSlug || typeof productSlug !== "string") {
    return NextResponse.json(
      { message: "Product slug is required." },
      { status: 400 }
    );
  }

  const items = await addWishlistItemForUser(user.id, productSlug);
  return NextResponse.json({ items, status: "success" });
}
