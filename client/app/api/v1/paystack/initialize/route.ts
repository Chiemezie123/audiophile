import crypto from "node:crypto";
import { NextResponse } from "next/server";

import {
  createPendingPaystackOrderFromCartForUser,
  deletePendingOrderByPaymentReference,
} from "@/lib/server/commerce-store";
import { initializePaystackTransaction } from "@/lib/server/paystack";
import { getSessionUserFromRequest } from "@/lib/server/session";

const requiredFields = [
  "billingName",
  "billingEmail",
  "billingPhone",
  "shippingAddress",
  "shippingZipCode",
  "shippingCity",
  "shippingCountry",
] as const;

export async function POST(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated."}, { status: 401 });
  }

  const body = await request.json();

  for (const field of requiredFields) {
    if (!body?.[field] || typeof body[field] !== "string") {
      return NextResponse.json(
        { message: `${field} is required.` },
        { status: 400 }
      );
    }
  }

  const paymentReference = `pstk-${crypto.randomUUID()}`;
  const pendingOrder = await createPendingPaystackOrderFromCartForUser(user.id, {
    ...body,
    paymentMethod: "paystack",
  }, paymentReference);

  if (!pendingOrder) {
    return NextResponse.json(
      { message: "Your cart is empty." },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const callbackUrl = new URL("/api/v1/paystack/callback", url.origin);
  callbackUrl.searchParams.set("orderId", pendingOrder.id);

  const currency = process.env.PAYSTACK_CURRENCY || "NGN";

  try {
    const result = await initializePaystackTransaction({
      email: body.billingEmail,
      amount: pendingOrder.grandTotal * 100,
      reference: paymentReference,
      callbackUrl: callbackUrl.toString(),
      currency,
      metadata: {
        orderId: pendingOrder.id,
        cancel_action: new URL("/checkout?paystack=cancelled", url.origin).toString(),
      },
    });

    return NextResponse.json(
      {
        authorizationUrl: result.authorization_url,
        reference: result.reference,
        orderId: pendingOrder.id,
        status: "success",
      },
      { status: 201 }
    );
  } catch (error) {
    await deletePendingOrderByPaymentReference(paymentReference);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to initialize Paystack payment.",
      },
      { status: 502 }
    );
  }
}
