"use client";

import { useFixtures } from "@/lib/hooks/useFixtures";
import { useTeams } from "@/lib/hooks/useTeams";
import type { TeamData } from "@/lib/types/teams";
import { opponentsForTeamInWeek, getAttack, getDefense } from "./utils";

interface Props {
  teamId: string;
  gameweek: number;
  sortBy: "offense" | "defense";
}

const difficultyColorMap = {
  easy: "bg-lime-300",
  medium: "bg-neutral-100",
  hard: "bg-red-300",
  invalid: "bg-neutral-50",
};

export default function TableCell({ teamId, gameweek, sortBy }: Props) {
  const fixturesQuery = useFixtures();
  const teamsQuery = useTeams();

  if (!fixturesQuery.data || !teamsQuery.data) return null;

  const weekOpponents = opponentsForTeamInWeek(
    teamId,
    gameweek,
    fixturesQuery.data,
  );

  // team lookup table
  const teamById: Record<string, TeamData> = {};
  teamsQuery.data.forEach((team) => {
    teamById[team.team_id] = team;
  });

  const attackStats = getAttack(teamById[teamId].off_rating, weekOpponents);
  const defenseStats = getDefense(teamById[teamId].def_rating, weekOpponents);

  const difficulty =
    sortBy === "offense" ? attackStats.difficulty : defenseStats.difficulty;
  const bgColor = difficultyColorMap[difficulty];

  return (
    <td
      className={`h-14 px-2 py-1 text-center text-sm align-middle rounded-md ${bgColor}`}
      data-offense={attackStats.gw_attack}
      data-defense={defenseStats.gw_defense}
      data-offense-difficulty={attackStats.difficulty}
      data-defense-difficulty={defenseStats.difficulty}
    >
      <div className="flex flex-col items-center justify-center w-full h-full gap-1">
        {weekOpponents && weekOpponents.length > 0 ? (
          weekOpponents.map((opp) => (
            <div key={opp.team_id} className="text-sm truncate w-full px-1">
              {opp.home
                ? `H:${teamById[opp.team_id].short_name}`
                : `A:${teamById[opp.team_id].short_name}`}
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm">-</div>
        )}
      </div>
    </td>
  );
}
