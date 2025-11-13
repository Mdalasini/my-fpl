import dbConnect from "../infra/libsql";
import { type TeamData, TeamDataSchema } from "../types/teams";

export async function getTeams(season: string): Promise<TeamData[]> {
  const db = await dbConnect();
  const result = await db.execute(
    `
    SELECT t.team_id, t.name, t.short_name, e.off_elo AS off_rating, e.def_elo AS def_rating, l.logo_path
    FROM teams t
    LEFT JOIN team_elos e ON t.team_id = e.team_id
    LEFT JOIN team_logos l ON t.team_id = l.team_id
    INNER JOIN (
      SELECT DISTINCT team_id
      FROM (
        SELECT home_id AS team_id FROM fixtures WHERE season = ?
        UNION
        SELECT away_id AS team_id FROM fixtures WHERE season = ?
      )
    ) f ON t.team_id = f.team_id
  `,
    [season, season],
  );
  return result.rows.map((row) => TeamDataSchema.parse(row));
}
