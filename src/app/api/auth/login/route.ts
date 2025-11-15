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
    const response = NextResponse.next();

    // Set token in HttpOnly cookie
    response.cookies.set("token", authResponse.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Set userName and role in regular cookies
    if (authResponse.data.userName) {
      console.log("Setting userName cookie:", authResponse.data.userName);
      response.cookies.set("userName", authResponse.data.userName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    if (authResponse.data.role) {
      console.log("Setting role cookie:", authResponse.data.role);
      response.cookies.set("role", authResponse.data.role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    // Return token in response
    return NextResponse.json({ success: true, token: authResponse.data.token });
  } else {
    return new NextResponse(JSON.stringify({}), { status: 401 });
  }
}
