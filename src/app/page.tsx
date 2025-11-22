"use client";

import { useCurrentGameweek } from "@/lib/hooks/useCurrentGameweek";
import { useFixtures } from "@/lib/hooks/useFixtures";
import { useTeams } from "@/lib/hooks/useTeams";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  initDifficultyModel,
  TableControls,
  TableHeader,
  TableRow,
} from "./components/Table";
import type { Fixture } from "@/lib/types/fixtures";

const WINDOW_SIZE = 10;

const queryClient = new QueryClient();

export default function FDRTable() {
  return (
    <QueryClientProvider client={queryClient}>
      <Table />
    </QueryClientProvider>
  );
}

function Table() {
  const teamsQuery = useTeams();
  const fixturesQuery = useFixtures();
  const gameweekQuery = useCurrentGameweek();
  const [window, setWindow] = useState([1, 1 + WINDOW_SIZE - 1]);
  const [sortBy, setSortBy] = useState<"offense" | "defense">("offense");
  const [orderedTeamIds, setOrderedTeamIds] = useState<number[] | null>(null);
  const [gameweekRange, setGameweekRange] = useState(5);

  // set initial window based on fetched current gameweek
  useEffect(() => {
    if (gameweekQuery.data) {
      const gameweek = gameweekQuery.data.gameweek;
      setWindow([gameweek, gameweek + WINDOW_SIZE - 1]);
    }
  }, [gameweekQuery.data]);

  if (teamsQuery.data) {
    initDifficultyModel(teamsQuery.data);
  }

  const gameweekStats = fixturesQuery.data
    ? getMinMaxGameweek(fixturesQuery.data)
    : { min: 0, max: 0 };
  const [windowMin, windowMax] = window;

  // Header-managed ordering: fall back to default order when unset
  const defaultTeamIds = useMemo(() => {
    if (!teamsQuery.data) return [];
    return [...teamsQuery.data]
      .sort((a, b) => a.short_name.localeCompare(b.short_name))
      .map((team) => team.id);
  }, [teamsQuery.data]);

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

  if (teamsQuery.isLoading || fixturesQuery.isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fixture Difficulty Table
          </h1>
        </div>
        {/* TODO: ADD LOADING PULSE */}
      </div>
    );
  }

  if (teamsQuery.isError || fixturesQuery.isError) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fixture Difficulty Table
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            <h2 className="font-semibold mb-2">
              Something went wrong trying to load FDR table.
            </h2>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (
    !teamsQuery.data ||
    teamsQuery.data.length === 0 ||
    !fixturesQuery.data ||
    fixturesQuery.data.length === 0
  ) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fixture Difficulty Table
          </h1>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No fixtures found for this season.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Fixture Difficulty Table
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Color indicates relative difficulty for the selected perspective.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 w-full">
        <TableControls
          onWindowChange={handleWindowChange}
          onSortByChange={handleSortByChange}
          sortBy={sortBy}
          windowMin={windowMin}
          windowMax={windowMax}
          minWeek={gameweekStats.min}
          maxWeek={gameweekStats.max}
          gameWeekRange={gameweekRange}
          onGameWeekRangeChange={setGameweekRange}
        />
        <div className="overflow-x-auto mt-5">
          <table className="table-auto w-full border-separate border-spacing-x-2 border-spacing-y-4">
            <TableHeader
              min={windowMin}
              max={windowMax}
              fixtures={fixturesQuery.data}
              sortBy={sortBy}
              onOrderChange={(ids) => setOrderedTeamIds(ids)}
              gameweekRange={gameweekRange}
            />
            <tbody className="bg-white">
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
      </div>
    </div>
  );
}

function getMinMaxGameweek(fixtures: Fixture[]): { min: number; max: number } {
  if (fixtures.length === 0) {
    return {
      min: 0,
      max: 0,
    };
  }

  const gameweeks = fixtures.map((fixture) => fixture.event);

  return {
    min: Math.min(...gameweeks),
    max: Math.max(...gameweeks),
  };
}
