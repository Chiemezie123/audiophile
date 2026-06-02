import {
  createSessionTokenForUser,
  getUserFromToken,
  SECOND_SESSION_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  SESSION_REFRESH_MAX_AGE_SECONDS,
  verifyToken,
} from "./auth-store";
import { NextResponse } from "next/server";

export const clearAuthCookies = (response: NextResponse): NextResponse => {
  response.cookies.delete(SESSION_COOKIE_NAME);
  response.cookies.delete(SECOND_SESSION_COOKIE_NAME);
  return response;
};

export function getSessionTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  return (
    cookieHeader
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
      ?.split("=")[1] || null
  );
}

function getSecondSessionTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  return (
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${SECOND_SESSION_COOKIE_NAME}=`))
      ?.split("=")[1] || null
  );
}

export type SessionResolution = {
  user: Awaited<ReturnType<typeof getUserFromToken>>;
  accessTokenToSet: string | null;
  refreshTokenToSet: string | null;
  tokenForUser: string | null;
};

export function applySessionCookies(
  response: NextResponse,
  session: Pick<SessionResolution, "accessTokenToSet" | "refreshTokenToSet">
) {
  if (session.accessTokenToSet) {
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: session.accessTokenToSet,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
  }

  if (session.refreshTokenToSet) {
    response.cookies.set({
      name: SECOND_SESSION_COOKIE_NAME,
      value: session.refreshTokenToSet,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_REFRESH_MAX_AGE_SECONDS,
    });
  }
}

export async function resolveSessionFromRequest(
  request: Request
): Promise<SessionResolution> {
  const now = Date.now();
  const accessToken = getSessionTokenFromRequest(request);
  const accessPayload = accessToken ? verifyToken(accessToken) : null;

  if (accessPayload && now <= accessPayload.exp) {
    const user = await getUserFromToken(accessToken!);
    return {
      user,
      accessTokenToSet: null,
      refreshTokenToSet: null,
      tokenForUser: accessToken,
    };
  }

  const refreshToken = getSecondSessionTokenFromRequest(request);
  const refreshPayload = refreshToken ? verifyToken(refreshToken) : null;

  if (refreshPayload && now <= refreshPayload.exp) {
    const user = await getUserFromToken(refreshToken!);
    if (!user) {
      return {
        user: null,
        accessTokenToSet: null,
        refreshTokenToSet: null,
        tokenForUser: null,
      };
    }

    const nextAccessToken = createSessionTokenForUser({
      id: user.id,
      email: user.email,
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return {
      user,
      accessTokenToSet: nextAccessToken,
      refreshTokenToSet: null,
      tokenForUser: nextAccessToken,
    };
  }

  return {
    user: null,
    accessTokenToSet: null,
    refreshTokenToSet: null,
    tokenForUser: null,
  };
}

export async function getSessionUserFromRequest(request: Request) {
  const session = await resolveSessionFromRequest(request);
  return session.user;
}
