import dbConnect from "../infra/libsql";
import { type TeamData, TeamDataSchema } from "../types/teams";

export async function getTeams(): Promise<TeamData[]> {
  const db = await dbConnect();
  const result = await db.execute(
    `
    SELECT t.team_id, t.name, t.short_name, (e.off_elo + COALESCE(SUM(c.off_change), 0)) AS off_rating, (e.def_elo + COALESCE(SUM(c.def_change), 0)) AS def_rating, l.logo_path
    FROM teams t
    LEFT JOIN team_elos e ON t.team_id = e.team_id
    LEFT JOIN team_logos l ON t.team_id = l.team_id
    LEFT JOIN fixture_elo_changes c ON t.team_id = c.team_id
    INNER JOIN (
      SELECT DISTINCT team_id
      FROM (
        SELECT home_id AS team_id FROM fixtures WHERE season = (SELECT value FROM app_config WHERE key = 'current_season')
        UNION
        SELECT away_id AS team_id FROM fixtures WHERE season = (SELECT value FROM app_config WHERE key = 'current_season')
      )
    ) f ON t.team_id = f.team_id
    GROUP BY t.team_id, t.name, t.short_name, e.off_elo, e.def_elo, l.logo_path
  `,
  );
  return result.rows.map((row) => TeamDataSchema.parse(row));
}
