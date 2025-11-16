import {
  getCurrentGameweek,
  updateCurrentGameweek,
} from "@/lib/services/configService";
import { UpdateCurrentGameweekSchema } from "@/lib/types/config";
import { NextResponse } from "next/server";

export async function GET() {
  const gameweek = await getCurrentGameweek();
  return NextResponse.json({ gameweek });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { gameweek } = UpdateCurrentGameweekSchema.parse(body);
    await updateCurrentGameweek(parseInt(gameweek));
    return NextResponse.json({ message: "Gameweek updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request or update failed" },
      { status: 400 },
    );
  }
}
