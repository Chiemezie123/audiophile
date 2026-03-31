import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL("/signup", request.url);
  url.searchParams.set("oauth", "unavailable");
  return NextResponse.redirect(url);
}
