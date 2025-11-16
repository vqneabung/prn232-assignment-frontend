import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // List các route cần protection
  const protectedRoutes = {
    admin: ["/admin"],
    manager: ["/manager"],
    moderator: ["/moderator"],
    examiner: ["/examiner"],
  };

  // Kiểm tra nếu route hiện tại cần protection
  const requiresAuth = Object.entries(protectedRoutes).find(([, routes]) =>
    routes.some((route) => {
      // Match exact route or anything that starts with route/
      return pathname === route || pathname.startsWith(route + "/");
    }),
  );

  console.log("Protected route check:", { pathname, requiresAuth });

  // Nếu không cần auth, cho phép truy cập
  if (!requiresAuth) {
    return NextResponse.next();
  }

  // Get token và role từ cookies
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value ?? "";
  const expiredAt = request.cookies.get("expiredAt")?.value;

  console.log("Auth check:", { token, role });

  // Nếu không có token, redirect về login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (expiredAt) {
    const expiredDate = new Date(expiredAt);
    const now = new Date();
    if (now > expiredDate) {
      console.log("Token expired at:", expiredAt);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Kiểm tra role có phù hợp không
  const [requiredRole] = requiresAuth;
  if (role.toLowerCase() !== requiredRole.toLowerCase()) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Cho phép truy cập
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
