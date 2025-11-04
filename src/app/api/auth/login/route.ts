import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Dummy authentication logic
  if (email === "user@example.com" && password === "password") {
    const response = new NextResponse(JSON.stringify({}), { status: 200 });
    // Set a cookie to simulate session management
    response.cookies.set("auth_email", email, { httpOnly: true, path: "/" });
    return response;
  } else {
    return new NextResponse(JSON.stringify({}), { status: 401 });
  }
}
