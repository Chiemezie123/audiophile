import { getSessionUserFromRequest } from "./session";

export async function requireAdminUser(request: Request) {
  const user = await getSessionUserFromRequest(request);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}
