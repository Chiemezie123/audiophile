import { NextResponse } from "next/server";

import {
  createOrderFromCartForUser,
  getOrdersForUser,
} from "@/lib/server/commerce-store";
import { getSessionUserFromRequest } from "@/lib/server/session";

export async function GET(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const orders = await getOrdersForUser(user.id);
  return NextResponse.json({ orders, status: "success" });
}

export async function POST(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
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

  return NextResponse.json({ order, status: "success" }, { status: 201 });
}
