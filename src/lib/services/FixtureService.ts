import dbConnect from "../infra/libsql";
import {
  type Fixture,
  FixtureSchema,
  type UpdateFixtureBody,
} from "../types/fixtures";

export async function getFixtures(): Promise<Fixture[]> {
  const db = await dbConnect();
  const result = await db.execute("SELECT * FROM fixtures");
  return result.rows.map((row) => FixtureSchema.parse(row));
}

export async function getFixture(code: number): Promise<Fixture | null> {
  const db = await dbConnect();
  const result = await db.execute("SELECT * FROM fixtures WHERE code = ?", [
    code,
  ]);
  if (result.rows.length === 0) return null;
  return FixtureSchema.parse(result.rows[0]);
}

export async function getFixturesNotInEloChanges(): Promise<Fixture[]> {
  const db = await dbConnect();
  const result = await db.execute(
    `
    SELECT * FROM fixtures
    WHERE code NOT IN (SELECT fixture_code FROM fixture_elo_changes)
    AND (team_h_xg IS NOT NULL OR team_a_xg IS NOT NULL)
  `,
  );
  return result.rows.map((row) => FixtureSchema.parse(row));
}

export async function updateFixture(
  update: UpdateFixtureBody,
  id: number,
): Promise<void> {
  const db = await dbConnect();
  const updates: string[] = [];
  const params: (number | null)[] = [];
  if (update.team_h_xg !== undefined) {
    updates.push("home_xg = ?");
    params.push(update.team_h_xg);
  }
  if (update.team_a_xg !== undefined) {
    updates.push("away_xg = ?");
    params.push(update.team_a_xg);
  }
  if (updates.length === 0) {
    return;
  }
  const sql = `UPDATE fixtures SET ${updates.join(", ")} WHERE id = ?`;
  params.push(id);
  await db.execute(sql, params);
}
