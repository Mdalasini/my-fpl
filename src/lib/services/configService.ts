import dbConnect from "../infra/libsql";
import {
  CurrentSeasonSchema,
  CurrentGameweekSchema,
  type CurrentSeason,
  type CurrentGameweek,
} from "../types/config";

export async function getCurrentSeason(): Promise<CurrentSeason> {
  const db = await dbConnect();
  const result = await db.execute(
    "SELECT value FROM app_config WHERE key = 'current_season'",
  );
  if (result.rows.length === 0) {
    throw new Error("Current season not found in app_config");
  }
  return CurrentSeasonSchema.parse(result.rows[0].value);
}

export async function getCurrentGameweek(): Promise<CurrentGameweek> {
  const db = await dbConnect();
  const result = await db.execute(
    "SELECT * FROM fixtures WHERE kickoff_time > CURRENT_DATE ORDER BY event ASC LIMIT 1",
  );
  if (result.rows.length === 0) {
    throw new Error("Current gameweek not found in fixtures");
  }
  return CurrentGameweekSchema.parse(result.rows[0].event);
}

export async function updateCurrentGameweek(gameweek: number): Promise<void> {
  const db = await dbConnect();
  await db.execute(
    "UPDATE app_config SET value = ? WHERE key = 'current_gameweek'",
    [gameweek.toString()],
  );
}
