import { NextResponse } from "next/server";
import { getTeams } from "@/lib/services/TeamService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season");

  if (!season) {
    return NextResponse.json(
      { error: "Season is a required parameter" },
      { status: 400 },
    );
  }

  const teams = await getTeams(season);

  return NextResponse.json(teams);
}
