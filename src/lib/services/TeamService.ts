import dbConnect from "../infra/libsql";
import { type TeamData, TeamDataSchema } from "../types/teams";

export async function getTeams(): Promise<TeamData[]> {
  const db = await dbConnect();
  const result = await db.execute(
    `
    SELECT t.id, t.name, t.short_name, (MAX(e.off_elo) + COALESCE(SUM(c.off_change), 0)) AS off_rating, (MAX(e.def_elo) + COALESCE(SUM(c.def_change), 0)) AS def_rating
    FROM teams t
    LEFT JOIN team_elos e ON t.id = e.team_id
    LEFT JOIN elo_changes c ON t.id = c.team_id
    GROUP BY t.id, t.name, t.short_name
  `,
  );
  return result.rows.map((row) => TeamDataSchema.parse(row));
}
