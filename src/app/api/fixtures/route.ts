import { NextResponse } from "next/server";
import { getFixtures } from "@/lib/services/FixtureService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season");

  if (!season) {
    return NextResponse.json(
      { error: "Season is a required parameter" },
      { status: 400 },
    );
  }

  const fixtures = await getFixtures(season);

  return NextResponse.json(fixtures);
}
