import { NextResponse } from "next/server";

import {
  createOrUpdateGoogleUser,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/server/auth-store";

type GoogleTokenResponse = {
  access_token: string;
  id_token?: string;
};

type GoogleUserInfo = {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

function parseCookie(request: Request, name: string) {
  return (
    request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1) || null
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = parseCookie(request, "fuzzybeats_google_oauth_state");
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    new URL("/api/v1/auth/google/callback", request.url).toString();

  const loginUrl = new URL("/login", request.url);

  if (!code || !state || !storedState || state !== storedState) {
    loginUrl.searchParams.set("oauth", "invalid_state");
    return NextResponse.redirect(loginUrl);
  }

  if (!clientId || !clientSecret) {
    loginUrl.searchParams.set("oauth", "unavailable");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      loginUrl.searchParams.set("oauth", "token_failed");
      return NextResponse.redirect(loginUrl);
    }

    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

    const userInfoResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      loginUrl.searchParams.set("oauth", "userinfo_failed");
      return NextResponse.redirect(loginUrl);
    }

    const userInfo = (await userInfoResponse.json()) as GoogleUserInfo;

    if (!userInfo.email || !userInfo.sub) {
      loginUrl.searchParams.set("oauth", "userinfo_invalid");
      return NextResponse.redirect(loginUrl);
    }

    const result = await createOrUpdateGoogleUser({
      email: userInfo.email,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      photo: userInfo.picture,
      googleId: userInfo.sub,
    });

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: result.token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    response.cookies.set({
      name: "fuzzybeats_google_oauth_state",
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch {
    loginUrl.searchParams.set("oauth", "oauth_failed");
    return NextResponse.redirect(loginUrl);
  }
}
