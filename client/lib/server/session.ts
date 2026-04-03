import { getUserFromToken, SESSION_COOKIE_NAME } from "./auth-store";

export function getSessionTokenFromRequest(request: Request) {
  return (
    request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
      ?.split("=")[1] || null
  );
}

export async function getSessionUserFromRequest(request: Request) {
  const token = getSessionTokenFromRequest(request);

  if (!token) {
    return null;
  }

  return getUserFromToken(token);
}
