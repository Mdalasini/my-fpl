"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFixtures } from "@/lib/hooks/useFixtures";
import { useTeams } from "@/lib/hooks/useTeams";
import { useCurrentGameweek } from "@/lib/hooks/useCurrentGameweek";
import type { Fixture } from "@/lib/types/fixtures";
import { useMemo, useState, useEffect } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableControls from "./TableControls";
import { initDifficultyModel } from "./utils";

const queryClient = new QueryClient();
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

export default function FixtureTable() {
  return (
    <QueryClientProvider client={queryClient}>
      <Table />
    </QueryClientProvider>
  );
}

function Table() {
  const fixturesQuery = useFixtures();
  const teamsQuery = useTeams();
  const gameweekQuery = useCurrentGameweek();
  const [window, setWindow] = useState([1, 1 + WINDOW_SIZE - 1]); // Default initial state
  const [sortBy, setSortBy] = useState<"offense" | "defense">("offense");

  // Set initial window based on fetched current gameweek
  useEffect(() => {
    if (gameweekQuery.data) {
      const gameweek = gameweekQuery.data.gameweek;
      setWindow([gameweek, gameweek + WINDOW_SIZE - 1]);
    }
  }, [gameweekQuery.data]);

  // Initialize difficulty model for utils used by child rows/cells
  if (teamsQuery.data) initDifficultyModel(teamsQuery.data);

  const gameweekStats = fixturesQuery.data
    ? getMinMaxGameweek(fixturesQuery.data)
    : { min: 0, max: 0 };
  const [windowMin, windowMax] = window;

  // Header-managed ordering: fall back to default order when unset
  const defaultTeamIds = useMemo(
    () => (teamsQuery.data ? teamsQuery.data.map((t) => t.team_id) : []),
    [teamsQuery.data],
  );
  const [orderedTeamIds, setOrderedTeamIds] = useState<string[] | null>(null);

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

  if (!fixturesQuery.data || !teamsQuery.data) return <div>Loading...</div>;

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
        <table className="table-auto w-full border-separate border-spacing-x-2 border-spacing-y-4">
          <TableHeader
            min={windowMin}
            max={windowMax}
            fixtures={fixturesQuery.data}
            teams={teamsQuery.data}
            sortBy={sortBy}
            onOrderChange={(ids) => setOrderedTeamIds(ids)}
          />
          <tbody>
            {(orderedTeamIds ?? defaultTeamIds).map((teamId) => (
              <TableRow
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
