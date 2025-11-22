import { NextResponse } from "next/server";
import { getCurrentGameweek } from "@/lib/services/configService";

export async function GET() {
  const gameweek = await getCurrentGameweek();
  return NextResponse.json({ gameweek });
}
