import crypto from "node:crypto";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

function generateSecureRandomString() {
  return crypto.randomBytes(32).toString("base64url");
}

function getClientId() {
  const clientId = process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID;

  if (!clientId) {
    throw new Error("NEXT_PUBLIC_VERCEL_APP_CLIENT_ID is not set");
  }

  return clientId;
}

export async function GET(request: NextRequest) {
  const state = generateSecureRandomString();
  const nonce = generateSecureRandomString();
  const codeVerifier = generateSecureRandomString();
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: "/",
    sameSite: "lax",
    secure,
  });
  cookieStore.set("oauth_nonce", nonce, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: "/",
    sameSite: "lax",
    secure,
  });
  cookieStore.set("oauth_code_verifier", codeVerifier, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: "/",
    sameSite: "lax",
    secure,
  });

  const params = new URLSearchParams({
    client_id: getClientId(),
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    nonce,
    redirect_uri: `${request.nextUrl.origin}/api/auth/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
  });

  return NextResponse.redirect(
    `https://vercel.com/oauth/authorize?${params.toString()}`,
  );
}
