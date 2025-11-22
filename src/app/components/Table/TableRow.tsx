"use client";

import { useFixtures } from "@/lib/hooks/useFixtures";
import { useTeams } from "@/lib/hooks/useTeams";
import type { TeamData } from "@/lib/types/teams";
import TableCell from "./TableCell";
import { opponentsForTeamInRange, getAttack, getDefense } from "./utils";

interface Props {
  teamId: number;
  min: number;
  max: number;
  sortBy: "offense" | "defense";
}

export default function TableRow({ teamId, min, max, sortBy }: Props) {
  const teamsQuery = useTeams();
  const fixturesQuery = useFixtures();

  if (!teamsQuery.data || !fixturesQuery.data) return null;

  // team lookup table
  const teamById: Record<number, TeamData> = {};
  teamsQuery.data.forEach((team) => {
    teamById[team.id] = team;
  });

  const opponents = opponentsForTeamInRange(
    teamId,
    min,
    max,
    fixturesQuery.data,
  );

  const attackStats = getAttack(teamById[teamId].off_rating, opponents);
  const defenseStats = getDefense(teamById[teamId].def_rating, opponents);

  const gameweeks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <tr className="even:bg-gray-50/30">
      <td
        className="sticky left-0 z-10 bg-white even:bg-gray-50/30 px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100"
        data-team-id={teamId}
        data-offense={attackStats.gw_attack}
        data-defense={defenseStats.gw_defense}
      >
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          <span className="tabular-nums">{teamById[teamId].short_name}</span>
        </div>
      </td>

      {gameweeks.map((gameweek) => (
        <TableCell
          key={gameweek}
          teamId={teamId}
          gameweek={gameweek}
          sortBy={sortBy}
        />
      ))}
    </tr>
  );
}
