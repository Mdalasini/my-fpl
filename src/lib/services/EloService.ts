import dbConnect from "../infra/libsql";
import { TotalEloChangeSchema } from "../types/eloChange";
import { TeamEloSchema, type TeamElo } from "../types/elos";

export async function getTeamElo(team_id: string): Promise<TeamElo> {
  const db = await dbConnect();
  const baseQuery = `SELECT team_id, off_elo, def_elo FROM team_elos WHERE team_id = ?`;
  const baseResult = await db.execute(baseQuery, [team_id]);
  if (baseResult.rows.length === 0) {
    throw new Error(`Team with id ${team_id} not found in team_elos`);
  }
  const base = TeamEloSchema.parse(baseResult.rows[0]);
  const changeQuery = `SELECT COALESCE(SUM(off_change), 0) as total_off, COALESCE(SUM(def_change), 0) as total_def FROM elo_changes WHERE team_id = ?`;
  const changeResult = await db.execute(changeQuery, [team_id]);
  const changes = TotalEloChangeSchema.parse(changeResult.rows[0]);
  return {
    team_id: base.team_id,
    off_elo: base.off_elo + changes.total_off,
    def_elo: base.def_elo + changes.total_def,
  };
}
