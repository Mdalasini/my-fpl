import { NextResponse } from "next/server";
import dbConnect from "@/lib/infra/mongoose";
import { updateFixture } from "@/lib/services/FixtureService";
import type { UpdateFixtureBody } from "@/lib/types/fixtures";

export async function PATCH(
  request: Request,
  { params }: { params: { fixtureId: number } },
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

    const { fixtureId } = await params;
    await updateFixture(body, fixtureId);

    return NextResponse.json({
      message: "Fixture updated successfully",
    });
  } catch (error) {
    console.error("Error updating fixture:", error);
    return NextResponse.json(
      { error: "Failed to update fixture" },
      { status: 500 },
    );
  }
}
