"use client";

import { useMemo, useState } from "react";
import type { Fixture } from "@/lib/types/fixtures";
import type { TeamData } from "@/lib/types/teams";
import { sortByGameweek, sortByGameweekRange } from "./utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  min: number;
  max: number;
  fixtures: Fixture[];
  teams: TeamData[];
  sortBy: "offense" | "defense";
  onOrderChange: (
    orderedTeamIds: string[],
    column: number,
    direction: "asc" | "desc",
  ) => void;
}

export default function TableHeader({
  min,
  max,
  fixtures,
  sortBy,
  onOrderChange,
}: Props) {
  const gameweeks = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

  const [sortColumn, setSortColumn] = useState<number>(-1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [lastSortBy, setLastSortBy] = useState<"offense" | "defense">(
    "offense",
  );

  function handleHeaderClick(column: number) {
    const defaultDir: "asc" | "desc" = sortBy === "offense" ? "desc" : "asc";
    const nextDirection: "asc" | "desc" =
      column === sortColumn && lastSortBy === sortBy
        ? sortDirection === "asc"
          ? "desc"
          : "asc"
        : defaultDir;

    const sortKey: "off" | "def" = sortBy === "offense" ? "off" : "def";

    let ordered: string[] = [];
    if (column === 0) {
      const startWeek = min;
      const overallMax =
        fixtures.length > 0
          ? Math.max(...fixtures.map((f) => f.gameweek))
          : max;
      const endWeek = Math.min(min + 5, overallMax);
      ordered = sortByGameweekRange(
        fixtures,
        startWeek,
        endWeek,
        nextDirection,
        sortKey,
      );
    } else {
      ordered = sortByGameweek(fixtures, column, nextDirection, sortKey);
    }

    setSortColumn(column);
    setSortDirection(nextDirection);
    setLastSortBy(sortBy);

    onOrderChange(ordered, column, nextDirection);
  }

  return (
    <thead>
      <tr>
        <th
          className="sticky left-0 z-10 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2 border-b border-gray-200 cursor-pointer"
          onClick={() => handleHeaderClick(0)}
        >
          <div className="flex justify-between items-center gap-1">
            <span>TEAM</span>
            <div className="w-4 h-4">
              {sortColumn === 0 &&
                (sortDirection === "asc" ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                ))}
            </div>
          </div>
        </th>
        {gameweeks.map((gameweek) => (
          <th
            key={gameweek}
            className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2 border-b border-gray-200 cursor-pointer"
            onClick={() => handleHeaderClick(gameweek)}
          >
            <div className="flex justify-between items-center gap-1">
              <span>GW {gameweek}</span>
              <div className="w-4 h-4">
                {sortColumn === gameweek &&
                  (sortDirection === "asc" ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronUp size={16} />
                  ))}
              </div>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
