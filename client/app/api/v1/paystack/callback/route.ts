import { NextResponse } from "next/server";

import {
  getOrderByPaymentReference,
  markOrderAsPaidByReference,
} from "@/lib/server/commerce-store";
import { verifyPaystackTransaction } from "@/lib/server/paystack";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");
  const failureUrl = new URL("/checkout?paystack=failed", url.origin);

  if (!reference) {
    return NextResponse.redirect(failureUrl);
  }

  try {
    const [verification, order] = await Promise.all([
      verifyPaystackTransaction(reference),
      getOrderByPaymentReference(reference),
    ]);

    if (!order) {
      return NextResponse.redirect(failureUrl);
    }

    const expectedAmount = order.grandTotal * 100;
    const normalizedStatus = verification.status.toLowerCase();

    if (normalizedStatus !== "success" || verification.amount !== expectedAmount) {
      return NextResponse.redirect(failureUrl);
    }

    const paidOrder = await markOrderAsPaidByReference(reference);

    if (!paidOrder) {
      return NextResponse.redirect(failureUrl);
    }

    const successUrl = new URL("/my-orders", url.origin);
    successUrl.searchParams.set("paystack", "success");
    successUrl.searchParams.set("order", paidOrder.id);

    return NextResponse.redirect(successUrl);
  } catch {
    return NextResponse.redirect(failureUrl);
  }
}
