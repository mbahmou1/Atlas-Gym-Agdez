import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "atlasgym_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

const PUBLIC_PAGES = ["/", "/gym", "/shop", "/contact", "/faq", "/login"];

function isPublicPage(pathname: string) {
  if (PUBLIC_PAGES.includes(pathname)) return true;
  if (pathname.startsWith("/shop/")) return true;
  return false;
}

function isPublicApi(pathname: string, method: string) {
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname === "/api/products" && method === "GET") return true;
  if (pathname.startsWith("/api/products/") && method === "GET") return true;
  if (pathname === "/api/orders" && method === "POST") return true;
  return false;
}

const ADMIN_PAGES = [
  "/dashboard",
  "/members",
  "/subscriptions",
  "/payments",
  "/late-payments",
];

const ADMIN_SHOP_PAGES = ["/products", "/orders"];

function isAdminPage(pathname: string) {
  return (
    ADMIN_PAGES.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    ADMIN_SHOP_PAGES.some((p) => pathname === p)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (isPublicPage(pathname)) return NextResponse.next();
  if (pathname.startsWith("/api/") && isPublicApi(pathname, method)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = getSecret();

  if (pathname.startsWith("/api/")) {
    if (!token || !secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (isAdminPage(pathname) || pathname === "/login") {
    if (pathname === "/login") {
      if (token && secret) {
        try {
          await jwtVerify(token, secret);
          return NextResponse.redirect(new URL("/dashboard", request.url));
        } catch {
          return NextResponse.next();
        }
      }
      return NextResponse.next();
    }

    if (!token || !secret) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/members/:path*",
    "/subscriptions/:path*",
    "/payments/:path*",
    "/late-payments/:path*",
    "/products/:path*",
    "/orders/:path*",
    "/api/:path*",
  ],
};
