import { NextResponse } from "next/server";
import Elo from "@/lib/domain/Elo";
import Game from "@/lib/domain/Game";
import Team from "@/lib/domain/Team";
import TeamLogo from "@/lib/domain/TeamLogo";
import dbConnect from "@/lib/infra/mongoose";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season");

  if (!season) {
    return NextResponse.json(
      { error: "Season is a required parameter" },
      { status: 400 },
    );
  }

  await dbConnect();

  const games = await Game.find({ season });
  const teamIds = [...new Set(games.flatMap((g) => [g.home_id, g.away_id]))];

  const teams = await Team.find({ team_id: { $in: teamIds } });
  const teamLogos = await TeamLogo.find({ team_id: { $in: teamIds } });
  const elos = await Elo.find({ team_id: { $in: teamIds } });

  const teamsData = teams.map((team) => {
    const teamLogo = teamLogos.find((logo) => logo.team_id === team.team_id);
    const teamElo = elos.find((elo) => elo.team_id === team.team_id);

    return {
      team_id: team.team_id,
      name: team.name,
      short_name: team.short_name,
      off_rating: teamElo ? teamElo.off_elo : null,
      def_rating: teamElo ? teamElo.def_elo : null,
      logo_path: teamLogo ? teamLogo.logo_path : null,
    };
  });

  return NextResponse.json(teamsData);
}
