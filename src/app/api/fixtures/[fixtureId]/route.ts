import { NextResponse } from "next/server";
import Game from "@/lib/domain/Game";
import dbConnect from "@/lib/infra/mongoose";
import type { Fixture } from "@/lib/types/fixtures";

interface UpdateFixtureBody {
  gameweek?: number;
  home_xg?: number | null;
  away_xg?: number | null;
}

export async function PATCH(
  request: Request,
  { params }: { params: { fixtureId: string } },
) {
  try {
    await dbConnect();

    const body: UpdateFixtureBody = await request.json();

    // Validation
    if (
      body.gameweek !== undefined &&
      (body.gameweek < 1 || body.gameweek > 38)
    ) {
      return NextResponse.json(
        { error: "Gameweek must be between 1 and 38" },
        { status: 400 },
      );
    }

    if (
      body.home_xg !== undefined &&
      body.home_xg !== null &&
      body.home_xg < 0
    ) {
      return NextResponse.json(
        { error: "Home xG cannot be negative" },
        { status: 400 },
      );
    }

    if (
      body.away_xg !== undefined &&
      body.away_xg !== null &&
      body.away_xg < 0
    ) {
      return NextResponse.json(
        { error: "Away xG cannot be negative" },
        { status: 400 },
      );
    }

    // Build update object with only provided fields
    const updateData: Partial<Fixture> = {};
    if (body.gameweek !== undefined) updateData.gameweek = body.gameweek;
    if (body.home_xg !== undefined) updateData.home_xg = body.home_xg;
    if (body.away_xg !== undefined) updateData.away_xg = body.away_xg;

    const { fixtureId } = await params;

    const updatedGame = await Game.findByIdAndUpdate(fixtureId, updateData, {
      new: true,
      runValidators: true,
    }).lean<Fixture>();

    if (!updatedGame) {
      return NextResponse.json({ error: "Fixture not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: updatedGame._id,
      home_id: updatedGame.home_id,
      away_id: updatedGame.away_id,
      gameweek: updatedGame.gameweek,
      season: updatedGame.season,
      home_xg: updatedGame.home_xg,
      away_xg: updatedGame.away_xg,
    });
  } catch (error) {
    console.error("Error updating fixture:", error);
    return NextResponse.json(
      { error: "Failed to update fixture" },
      { status: 500 },
    );
  }
}
