import { NextResponse } from "next/server";
import Game from "@/lib/domain/Game";
import dbConnect from "@/lib/infra/mongoose";

export async function PUT(request: Request) {
  const { home_id, away_id, gameweek } = await request.json();

  if (!home_id || !away_id || !gameweek) {
    return NextResponse.json(
      { error: "home_id, away_id, and gameweek are required parameters" },
      { status: 400 },
    );
  }

  await dbConnect();

  const result = await Game.updateOne(
    { home_id, away_id },
    { $set: { gameweek } },
  );

  if (result.modifiedCount === 0) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
