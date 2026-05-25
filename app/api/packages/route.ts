import { NextResponse } from "next/server";
import { PACKAGES } from "@/lib/packages";

export async function GET() {
  return NextResponse.json({ success: true, packages: PACKAGES });
}
