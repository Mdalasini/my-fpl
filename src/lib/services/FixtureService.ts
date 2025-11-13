import dbConnect from "../infra/libsql";
import {
  type Fixture,
  FixtureSchema,
  type UpdateFixtureBody,
} from "../types/fixtures";

export async function getFixtures(season: string): Promise<Fixture[]> {
  const db = await dbConnect();
  const result = await db.execute("SELECT * FROM fixtures WHERE season = ?", [
    season,
  ]);
  return result.rows.map((row) => FixtureSchema.parse(row));
}

export async function updateFixture(
  update: UpdateFixtureBody,
  id: number,
): Promise<void> {
  const db = await dbConnect();
  const updates: string[] = [];
  const params: (number | null)[] = [];
  if (update.home_xg !== undefined) {
    updates.push("home_xg = ?");
    params.push(update.home_xg);
  }
  if (update.away_xg !== undefined) {
    updates.push("away_xg = ?");
    params.push(update.away_xg);
  }
  if (update.gameweek !== undefined) {
    updates.push("gameweek = ?");
    params.push(update.gameweek);
  }
  if (updates.length === 0) {
    return;
  }
  const sql = `UPDATE fixtures SET ${updates.join(", ")} WHERE id = ?`;
  params.push(id);
  await db.execute(sql, params);
}
