import { commonApiPost } from "@/lib/api/common/common-api";
import { NextResponse } from "next/server";
import type { AuthResponse } from "@/types/type";

export async function POST(req: Request) {
  const { userName, password } = await req.json();

  console.log("Login attempt for user:", userName);

  // Validate user credentials
  const authResponse = await commonApiPost<AuthResponse>("/auth/login", { userName, password });
  console.log("Authentication response:", authResponse);

  if (!authResponse.success || !authResponse.data) {
    return new NextResponse(JSON.stringify({}), { status: 401 });
  }

  const authData = authResponse.data;

  // Create response with success data
  const response = NextResponse.json({
    success: true,
    token: authData.token,
    userName: authData.userName,
    role: authData.role,
  });

  // Set token in HttpOnly cookie
  response.cookies.set("token", authData.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Set userName and role in regular cookies
  console.log("Setting userName cookie:", authData.userName);
  response.cookies.set("userName", authData.userName, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  console.log("Setting role cookie:", authData.role);
  response.cookies.set("role", authData.role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Return response with cookies
  return response;
}
