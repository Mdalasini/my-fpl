"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFixtures } from "@/lib/hooks/useFixtures";
import { useTeams } from "@/lib/hooks/useTeams";
import type { Fixture } from "@/lib/types/fixtures";
import { useEffect, useRef, useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableControls from "./TableControls";
import { initDifficultyModel } from "./utils";

const queryClient = new QueryClient();
const SEASON = "2025-2026";
const WINDOW_SIZE = 10;

function getMinMaxGameweek(fixtures: Fixture[]): { min: number; max: number } {
  if (fixtures.length === 0) {
    return {
      min: 0,
      max: 0,
    };
  }

  const gameweeks = fixtures.map((fixture) => fixture.gameweek);

  return {
    min: Math.min(...gameweeks),
    max: Math.max(...gameweeks),
  };
}

function getUniqueTeamIds(fixtures: Fixture[]): string[] {
  const teamIds = new Set<string>();

  fixtures.forEach((fixture) => {
    teamIds.add(fixture.home_id);
    teamIds.add(fixture.away_id);
  });

  return Array.from(teamIds);
}

export default function FixtureTable() {
  return (
    <QueryClientProvider client={queryClient}>
      <Table />
    </QueryClientProvider>
  );
}

function Table() {
  const fixturesQuery = useFixtures(SEASON);
  const teamsQuery = useTeams(SEASON);
  const [window, setWindow] = useState([1, 1 + WINDOW_SIZE - 1]);
  const [sortBy, setSortBy] = useState<"offense" | "defense">("offense");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortColumn, setSortColumn] = useState<number>(-1);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (!tableRef.current) return;

    const table = tableRef.current;
    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    const rows = Array.from(
      tbody.querySelectorAll("tr"),
    ) as HTMLTableRowElement[];

    rows.sort((a, b) => {
      let aVal: number, bVal: number;
      const aCells = a.querySelectorAll("td");
      const bCells = b.querySelectorAll("td");

      const aCell = aCells[sortColumn] as HTMLTableCellElement;
      const bCell = bCells[sortColumn] as HTMLTableCellElement;

      if (sortBy === "offense") {
        aVal = parseFloat(aCell?.dataset.offense || "0");
        bVal = parseFloat(bCell?.dataset.offense || "0");
      } else {
        aVal = parseFloat(aCell?.dataset.defense || "0");
        bVal = parseFloat(bCell?.dataset.defense || "0");
      }

      if (sortDirection === "asc") {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });

    rows.forEach((row) => {
      tbody.appendChild(row);
    });
  }, [sortDirection, sortColumn, sortBy]);

  if (!fixturesQuery.data || !teamsQuery.data) return <div>Loading...</div>;

  initDifficultyModel(teamsQuery.data);

  const gameweekStats = getMinMaxGameweek(fixturesQuery.data);
  const [windowMin, windowMax] = window;

  function handleWindowChange(direction: "next" | "prev") {
    setWindow(([min, max]) => {
      if (direction === "next") {
        const nextMax = Math.min(gameweekStats.max, max + 1);
        const nextMin = Math.min(min + 1, nextMax - WINDOW_SIZE + 1);
        return [nextMin, nextMax];
      }
      const nextMin = Math.max(gameweekStats.min, min - 1);
      const nextMax = Math.max(nextMin + WINDOW_SIZE - 1, min - 1);
      return [nextMin, nextMax];
    });
  }

  function handleSortByChange(newSortBy: "offense" | "defense") {
    setSortBy(newSortBy);
  }

  function handleSort(column: number) {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      if (sortBy === "offense") {
        setSortDirection("desc");
      } else {
        setSortDirection("asc");
      }
    }
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-4 w-full">
      <TableControls
        onWindowChange={handleWindowChange}
        onSortByChange={handleSortByChange}
        sortBy={sortBy}
        windowMin={windowMin}
        windowMax={windowMax}
        minWeek={gameweekStats.min}
        maxWeek={gameweekStats.max}
      />
      <div className="overflow-x-auto whitespace-nowrap">
        <table
          className="table-auto w-full border-separate border-spacing-x-2 border-spacing-y-4"
          ref={tableRef}
        >
          <TableHeader
            min={windowMin}
            max={windowMax}
            handleSort={handleSort}
          />
          <tbody>
            {getUniqueTeamIds(fixturesQuery.data).map((teamId) => (
              <TableRow
                season={SEASON}
                sortBy={sortBy}
                key={teamId}
                teamId={teamId}
                min={windowMin}
                max={windowMax}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
