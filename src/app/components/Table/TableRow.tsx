"use client";

import Image from "next/image";
import { useFixtures } from "@/lib/hooks/useFixtures";
import { useTeams } from "@/lib/hooks/useTeams";
import type { TeamData } from "@/lib/types/teams";
import TableCell from "./TableCell";
import { opponentsForTeamInRange, getAttack, getDefense } from "./utils";

interface Props {
  teamId: string;
  min: number;
  max: number;
  sortBy: "offense" | "defense";
}

export default function TableRow({ teamId, min, max, sortBy }: Props) {
  const teamsQuery = useTeams();
  const fixturesQuery = useFixtures();

  if (!teamsQuery.data || !fixturesQuery.data) return null;

  // team lookup table
  const teamById: Record<string, TeamData> = {};
  teamsQuery.data.forEach((team) => {
    teamById[team.team_id] = team;
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
    <tr className="align-middle">
      <td
        className="px-2 py-2 text-left min-w-48 text-sm font-semibold border-b border-gray-200"
        data-team-id={teamId}
        data-offense={attackStats.gw_attack}
        data-defense={defenseStats.gw_defense}
      >
        <div className="flex items-center gap-3">
          <Image
            src={teamById[teamId].logo_path}
            alt={teamById[teamId].name}
            width={24}
            height={24}
          />
          <span className="text-sm">{teamById[teamId].name}</span>
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
