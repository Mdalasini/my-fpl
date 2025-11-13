import { NextResponse } from "next/server";
import Game from "@/lib/domain/Game";
import dbConnect from "@/lib/infra/mongoose";
import type { Fixture, FixturesResponse } from "@/lib/types/fixtures";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season");

  if (!season) {
    return NextResponse.json(
      { error: "Season is a required parameter" },
      { status: 400 },
    );
  }

  await dbConnect();

  const games = await Game.find({ season }).lean<Fixture[]>();

  const fixtures: FixturesResponse = games.map((game) => ({
    _id: game._id,
    home_id: game.home_id,
    away_id: game.away_id,
    home_xg: game.home_xg,
    away_xg: game.away_xg,
    season: game.season,
    gameweek: game.gameweek,
  }));

  return NextResponse.json(fixtures);
}
