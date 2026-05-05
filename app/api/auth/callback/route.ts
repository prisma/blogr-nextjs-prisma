import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const jwks = createRemoteJWKSet(new URL("https://vercel.com/.well-known/jwks"));

type TokenData = {
  access_token: string;
  expires_in: number;
  id_token: string;
  scope: string;
  token_type: string;
};

type VercelIdToken = JWTPayload & {
  email?: string;
  name?: string;
  nonce?: string;
  picture?: string;
  preferred_username?: string;
  sub: string;
};

function getClientId() {
  const clientId = process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID;

  if (!clientId) {
    throw new Error("NEXT_PUBLIC_VERCEL_APP_CLIENT_ID is not set");
  }

  return clientId;
}

function getClientSecret() {
  const clientSecret = process.env.VERCEL_APP_CLIENT_SECRET;

  if (!clientSecret) {
    throw new Error("VERCEL_APP_CLIENT_SECRET is not set");
  }

  return clientSecret;
}

function validate(value: string | null | undefined, storedValue?: string) {
  return Boolean(value && storedValue && value === storedValue);
}

async function exchangeCodeForToken(
  code: string,
  codeVerifier: string,
  requestOrigin: string,
) {
  const response = await fetch("https://api.vercel.com/login/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: getClientId(),
      client_secret: getClientSecret(),
      code,
      code_verifier: codeVerifier,
      grant_type: "authorization_code",
      redirect_uri: `${requestOrigin}/api/auth/callback`,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange authorization code for token");
  }

  return (await response.json()) as TokenData;
}

async function verifyIdToken(idToken: string) {
  const { payload } = await jwtVerify(idToken, jwks, {
    audience: getClientId(),
    issuer: "https://vercel.com",
  });

  if (!payload.sub) {
    throw new Error("ID token is missing subject");
  }

  return payload as VercelIdToken;
}

async function syncUser(payload: VercelIdToken) {
  await prisma.user.upsert({
    where: { vercelId: payload.sub },
    update: {
      email: payload.email,
      name: payload.name ?? payload.preferred_username,
      image: payload.picture,
    },
    create: {
      vercelId: payload.sub,
      email: payload.email,
      name: payload.name ?? payload.preferred_username,
      image: payload.picture,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const storedState = request.cookies.get("oauth_state")?.value;
    const storedNonce = request.cookies.get("oauth_nonce")?.value;
    const codeVerifier = request.cookies.get("oauth_code_verifier")?.value;

    if (!code || !codeVerifier) {
      throw new Error("Authorization code and verifier are required");
    }

    if (!validate(state, storedState)) {
      throw new Error("State mismatch");
    }

    const tokenData = await exchangeCodeForToken(
      code,
      codeVerifier,
      request.nextUrl.origin,
    );
    const idToken = await verifyIdToken(tokenData.id_token);

    if (!validate(idToken.nonce, storedNonce)) {
      throw new Error("Nonce mismatch");
    }

    await syncUser(idToken);

    const cookieStore = await cookies();
    const secure = process.env.NODE_ENV === "production";

    cookieStore.set("access_token", tokenData.access_token, {
      httpOnly: true,
      maxAge: tokenData.expires_in,
      path: "/",
      sameSite: "lax",
      secure,
    });
    cookieStore.set("oauth_state", "", { maxAge: 0, path: "/" });
    cookieStore.set("oauth_nonce", "", { maxAge: 0, path: "/" });
    cookieStore.set("oauth_code_verifier", "", { maxAge: 0, path: "/" });

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
}
