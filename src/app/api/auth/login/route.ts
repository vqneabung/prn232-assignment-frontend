import { BaseResponse } from "@/types/type";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    // Dummy authentication logic
    if (email === "user@example.com" && password === "password") {
        return new Response(JSON.stringify({}), { status: 200 });
    } else {
        return new Response(JSON.stringify({}), { status: 401 });
    }

}
