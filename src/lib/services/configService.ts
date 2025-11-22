import dbConnect from "../infra/libsql";
import { type CurrentGameweek, CurrentGameweekSchema } from "../types/config";

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
