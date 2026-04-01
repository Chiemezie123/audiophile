import { NextResponse } from "next/server";

import {
  clearCartItemsForUser,
  replaceCartItemsForUser,
} from "@/lib/server/commerce-store";
import { getSessionUserFromRequest } from "@/lib/server/session";

export async function GET(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const { getCartItemsForUser } = await import("@/lib/server/commerce-store");
  const items = await getCartItemsForUser(user.id);
  return NextResponse.json({ items, status: "success" });
}

export async function PUT(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const body = await request.json();
  const items = Array.isArray(body?.items) ? body.items : [];
  const nextItems = await replaceCartItemsForUser(user.id, items);

  return NextResponse.json({ items: nextItems, status: "success" });
}

export async function DELETE(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  await clearCartItemsForUser(user.id);
  return NextResponse.json({ items: [], status: "success" });
}
