import { NextRequest, NextResponse } from "next/server";

const adminRoutes = [
  "/dashboard",
  "/products",
  "/orders",
  "/categories",
  "/banners",
  "/occasions",
  "/craftsmanship",
  "/vouchers",
  "/customers",
  "/reviews",
  "/reports",
  "/settings",
];

function isAdminRoute(pathname: string) {
  return adminRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  const adminHost = (process.env.ADMIN_HOST || "admin.floofashionn.com").toLowerCase();
  const isAdminHost = host === adminHost;

  // Local development retains /admin routes and does not require host aliases.
  if (!host || host === "localhost" || host === "127.0.0.1") return NextResponse.next();

  if (isAdminHost) {
    if (url.pathname === "/") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
      url.pathname = url.pathname === "/admin" ? "/dashboard" : url.pathname.slice("/admin".length);
      return NextResponse.redirect(url);
    }
    if (url.pathname === "/login" || isAdminRoute(url.pathname)) {
      url.pathname = url.pathname === "/dashboard" ? "/admin" : `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.redirect(new URL(url.pathname + url.search, `https://${process.env.STOREFRONT_HOST || "floofashionn.com"}`));
  }

  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
    const adminPath = url.pathname === "/admin" ? "/dashboard" : url.pathname.slice("/admin".length);
    return NextResponse.redirect(new URL(adminPath + url.search, `https://${adminHost}`));
  }
  if (isAdminRoute(url.pathname)) {
    return NextResponse.redirect(new URL(url.pathname + url.search, `https://${adminHost}`));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
