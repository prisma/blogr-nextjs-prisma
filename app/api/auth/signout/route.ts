import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (accessToken) {
    const credentials = `${process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID}:${process.env.VERCEL_APP_CLIENT_SECRET}`;

    await fetch("https://api.vercel.com/login/oauth/token/revoke", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(credentials).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ token: accessToken }),
    });
  }

  cookieStore.set("access_token", "", { maxAge: 0, path: "/" });

  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
