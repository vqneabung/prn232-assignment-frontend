import { commonApiPost } from "@/lib/api/common/common-api";

export async function POST(req: Request) {
  const { userName, password, roleId } = await req.json();

  console.log("Registration attempt for user:", userName);

  // Call registration API
  const registerResponse = await commonApiPost("/auth/register", { userName, password, roleId });

  if (!registerResponse.success) {
    return new Response(JSON.stringify({}), { status: 400 });
  }

  return new Response(JSON.stringify({}), { status: 200 });
}
