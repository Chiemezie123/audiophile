import { NextResponse } from "next/server";

import {
  getSessionTokenFromRequest,
  getSessionUserFromRequest,
} from "@/lib/server/session";
import { updateUserProfileFromToken } from "@/lib/server/auth-store";

export async function GET(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  return NextResponse.json({ user, status: "success" });
}

export async function PATCH(request: Request) {
  const token = getSessionTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const firstName = typeof body?.firstName === "string" ? body.firstName : "";
    const lastName = typeof body?.lastName === "string" ? body.lastName : "";

    if (!firstName.trim() || !lastName.trim()) {
      return NextResponse.json(
        { message: "First name and last name are required." },
        { status: 400 }
      );
    }

    const user = await updateUserProfileFromToken(token, {
      firstName,
      lastName,
      phone: typeof body?.phone === "string" ? body.phone : "",
      shippingAddress:
        typeof body?.shippingAddress === "string" ? body.shippingAddress : "",
      shippingCity: typeof body?.shippingCity === "string" ? body.shippingCity : "",
      shippingState:
        typeof body?.shippingState === "string" ? body.shippingState : "",
      shippingCountry:
        typeof body?.shippingCountry === "string" ? body.shippingCountry : "",
      newsletterOptIn: Boolean(body?.newsletterOptIn),
    });

    if (!user) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    return NextResponse.json({ user, status: "success" });
  } catch {
    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 }
    );
  }
}
