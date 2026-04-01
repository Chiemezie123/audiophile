import { NextResponse } from "next/server";

import { mergeCartItemsForUser } from "@/lib/server/commerce-store";
import { getSessionUserFromRequest } from "@/lib/server/session";

export async function POST(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const body = await request.json();
  const items = Array.isArray(body?.items) ? body.items : [];
  const mergedItems = await mergeCartItemsForUser(user.id, items);

  return NextResponse.json({ items: mergedItems, status: "success" });
}
