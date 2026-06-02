import { NextResponse } from "next/server";

import {
  applySessionCookies,
  clearAuthCookies,
  resolveSessionFromRequest,
} from "@/lib/server/session";
import { updateUserProfileFromToken } from "@/lib/server/auth-store";

export async function GET(request: Request) {
  const session = await resolveSessionFromRequest(request);
  const user = session.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const response = NextResponse.json({ user, status: "success" });
  applySessionCookies(response, session);
  return response;
}

export async function PATCH(request: Request) {
  const session = await resolveSessionFromRequest(request);
  const token = session.tokenForUser;

  if (!token || !session.user) {
    const res = NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    return clearAuthCookies(res);
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

    const response = NextResponse.json({ user, status: "success" });
    applySessionCookies(response, session);
    return response;
  } catch {
    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 }
    );
  }
}
