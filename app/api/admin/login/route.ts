import { NextResponse } from "next/server";
import { SignJWT } from "jose";

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("Missing ADMIN_JWT_SECRET");
  return new TextEncoder().encode(secret);
}

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: false, // keep false for localhost
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
