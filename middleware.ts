import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Simple admin protection (can be enhanced)
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  
  // For demo purposes, we're not enforcing strict protection
  // In production, add proper authentication
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
