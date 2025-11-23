"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { Fixture } from "@/lib/types/fixtures";
import { sortByGameweek, sortByGameweekRange } from "./utils";

interface Props {
  min: number;
  max: number;
  fixtures: Fixture[];
  sortBy: "offense" | "defense";
  onOrderChange: (
    orderedTeamIds: number[],
    column: number,
    direction: "asc" | "desc",
  ) => void;
  gameweekRange: number;
}

export default function TableHeader({
  min,
  max,
  fixtures,
  sortBy,
  onOrderChange,
  gameweekRange,
}: Props) {
  const gameweeks = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

  const highlightedGameweeks = useMemo(() => {
    const highlighted = new Set<number>();
    for (let i = 0; i < gameweekRange; i++) {
      highlighted.add(min + i);
    }
    return highlighted;
  }, [min, gameweekRange]);

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

    let ordered: number[] = [];
    if (column === 0) {
      const startWeek = min;
      const overallMax =
        fixtures.length > 0 ? Math.max(...fixtures.map((f) => f.event)) : max;
      const endWeek = Math.min(min + gameweekRange, overallMax);
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
            className={`text-left text-xs font-medium uppercase tracking-wider px-3 py-2 border-b border-gray-200 cursor-pointer ${
              highlightedGameweeks.has(gameweek)
                ? "bg-blue-50 text-gray-900 font-semibold"
                : "bg-gray-50 text-gray-500"
            }`}
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
