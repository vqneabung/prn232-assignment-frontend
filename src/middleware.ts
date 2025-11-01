import { NextRequest, NextResponse } from "next/server";
import { authStore } from "./stores/auth/authStore";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const { email } = authStore.getState();

  // List các route cần protection
  const protectedRoutes = ["/dashboard", "/user"];

  // Check xem có phải protected route không
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Nếu không phải protected route, cho phép
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

    // Lấy auth_email từ cookie (được set bởi AppProvider từ localStorage)
    const authEmail = request.cookies.get("auth_email")?.value;
    // const authEmail = email;

    console.log("Middleware check authEmail:", authEmail);

  // Nếu không có email, redirect sang login
  if (!authEmail) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Email valid, allow request
  const response = NextResponse.next();
  response.headers.set("x-user-email", authEmail);

  return response;
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
