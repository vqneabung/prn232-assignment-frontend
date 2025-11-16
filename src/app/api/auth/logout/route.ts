import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Delete all auth cookies
  response.cookies.delete("token");
  response.cookies.delete("userName");
  response.cookies.delete("role");

  return response;
}
