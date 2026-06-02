import { NextResponse } from "next/server";

import {
  createOrderFromCartForUser,
  getOrdersForUser,
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

  const orders = await getOrdersForUser(user.id);
  const response = NextResponse.json({ orders, status: "success" });
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

  const body = await request.json();
  const requiredFields = [
    "billingName",
    "billingEmail",
    "billingPhone",
    "shippingAddress",
    "shippingZipCode",
    "shippingCity",
    "shippingCountry",
    "paymentMethod",
  ] as const;

  for (const field of requiredFields) {
    if (!body?.[field] || typeof body[field] !== "string") {
      return NextResponse.json(
        { message: `${field} is required.` },
        { status: 400 }
      );
    }
  }

  if (body.paymentMethod !== "cash") {
    return NextResponse.json(
      { message: "Unsupported payment method for direct order creation." },
      { status: 400 }
    );
  }

  const order = await createOrderFromCartForUser(user.id, body);

  if (!order) {
    return NextResponse.json(
      { message: "Your cart is empty." },
      { status: 400 }
    );
  }

  const response = NextResponse.json(
    { order, status: "success" },
    { status: 201 }
  );
  applySessionCookies(response, session);
  return response;
}
