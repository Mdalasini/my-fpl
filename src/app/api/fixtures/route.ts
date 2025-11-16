import { NextResponse } from "next/server";
import { getFixtures } from "@/lib/services/FixtureService";

export async function GET(request: Request) {
  const fixtures = await getFixtures();

  return NextResponse.json(fixtures);
}
