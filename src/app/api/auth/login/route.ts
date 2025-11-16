import { commonApiPost } from "@/lib/api/common/common-api";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userName, password } = await req.json();

  console.log("Login attempt for user:", userName);

  // Validate user credentials
  const authResponse = await commonApiPost("/auth/login", { userName, password });
  console.log("Authentication response:", authResponse);

  if (!authResponse.success) {
    return new NextResponse(JSON.stringify({}), { status: 401 });
  }

  if (authResponse.data && authResponse.data.token) {
    // Create response with success data
    const response = NextResponse.json({
      success: true,
      token: authResponse.data.token,
      userName: authResponse.data.userName,
      role: authResponse.data.role,
    });

    // Set token in HttpOnly cookie
    response.cookies.set("token", authResponse.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Set userName and role in regular cookies
    if (authResponse.data.userName) {
      console.log("Setting userName cookie:", authResponse.data.userName);
      response.cookies.set("userName", authResponse.data.userName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    if (authResponse.data.role) {
      console.log("Setting role cookie:", authResponse.data.role);
      response.cookies.set("role", authResponse.data.role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Return response with cookies
    return response;
  } else {
    return new NextResponse(JSON.stringify({}), { status: 401 });
  }
}
