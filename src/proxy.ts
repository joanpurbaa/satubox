import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "sb_session";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!req.cookies.has(SESSION_COOKIE)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};