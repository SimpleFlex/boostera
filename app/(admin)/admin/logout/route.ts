import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Clear the admin_session cookie
  res.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: false, // keep false for localhost
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
