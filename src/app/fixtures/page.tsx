"use client";

import { useMemo } from "react";
import { CURRENT_SEASON } from "@/lib/config/season";
import { useFixtures } from "@/lib/hooks/useFixtures";
import { useTeams } from "@/lib/hooks/useTeams";
import FixtureCard from "@/app/components/FixtureCard";
import type { Fixture } from "@/lib/types/fixtures";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function FixturesDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

function Dashboard() {
  const {
    data: fixtures,
    isLoading: fixturesLoading,
    error: fixturesError,
  } = useFixtures(CURRENT_SEASON);
  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
  } = useTeams(CURRENT_SEASON);

  // Create a map of team_id to team short_name for quick lookup
  const teamsMap = useMemo(() => {
    const map = new Map<string, string>();
    if (teams) {
      teams.forEach((team) => {
        map.set(team.team_id, team.short_name);
      });
    }
    return map;
  }, [teams]);

  // Group fixtures by gameweek
  const fixturesByGameweek = useMemo(() => {
    if (!fixtures) return new Map<number, Fixture[]>();

    const grouped = new Map<number, Fixture[]>();
    const sorted = [...fixtures].sort((a, b) => a.gameweek - b.gameweek);

    sorted.forEach((fixture) => {
      if (!grouped.has(fixture.gameweek)) {
        grouped.set(fixture.gameweek, []);
      }
      const gameweekFixtures = grouped.get(fixture.gameweek);
      if (gameweekFixtures) {
        gameweekFixtures.push(fixture);
      }
    });

    return grouped;
  }, [fixtures]);

  const gameweeks = useMemo(() => {
    return Array.from(fixturesByGameweek.keys()).sort((a, b) => a - b);
  }, [fixturesByGameweek]);

  // Loading state
  if (fixturesLoading || teamsLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fixtures Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Season: {CURRENT_SEASON}</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-16 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (fixturesError || teamsError) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fixtures Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Season: {CURRENT_SEASON}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <h2 className="font-semibold mb-2">Error Loading Data</h2>
          <p className="text-sm mb-4">
            {fixturesError?.message ||
              teamsError?.message ||
              "Failed to load data"}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fixtures Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Season: {CURRENT_SEASON}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No fixtures found for this season.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fixtures Dashboard</h1>
        <p className="text-gray-600 mt-2">Season: {CURRENT_SEASON}</p>
        <p className="text-sm text-gray-500 mt-1">
          Click on any fixture to edit gameweek and xG values
        </p>
      </div>

      {/* Fixtures by Gameweek */}
      <div className="space-y-8">
        {gameweeks.map((gameweek) => (
          <div key={gameweek}>
            {/* Gameweek Header */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Gameweek {gameweek}
              </h2>
              <div className="mt-1 h-1 w-20 bg-blue-500 rounded"></div>
            </div>

            {/* Fixtures */}
            <div className="space-y-2">
              {fixturesByGameweek.get(gameweek)?.map((fixture) => (
                <FixtureCard
                  key={fixture._id}
                  fixture={fixture}
                  teamsMap={teamsMap}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
