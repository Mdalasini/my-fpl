"use client";

import { useMemo, useState, useEffect } from "react";
import { CURRENT_GAMEWEEK } from "@/lib/config/gameweek";
import { useFixtures } from "@/lib/hooks/useFixtures";
import { useTeams } from "@/lib/hooks/useTeams";
import {
  useCurrentGameweek,
  useUpdateCurrentGameweek,
} from "@/lib/hooks/useCurrentGameweek";
import FixtureCard from "@/app/components/FixtureCard";
import type { Fixture } from "@/lib/types/fixtures";
import { AltArrowLeft, AltArrowRight } from "@solar-icons/react";
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
  } = useFixtures();
  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
  } = useTeams();
  const { data: currentGwData } = useCurrentGameweek();
  const updateCurrentGw = useUpdateCurrentGameweek();

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

  const minGameweek = gameweeks.length > 0 ? gameweeks[0] : 1;
  const maxGameweek =
    gameweeks.length > 0 ? gameweeks[gameweeks.length - 1] : 1;

  const [currentGameweek, setCurrentGameweek] = useState(CURRENT_GAMEWEEK);

  useEffect(() => {
    if (gameweeks.length > 0 && !gameweeks.includes(currentGameweek)) {
      setCurrentGameweek(minGameweek);
    }
  }, [gameweeks, currentGameweek, minGameweek]);

  // Loading state
  if (fixturesLoading || teamsLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fixtures Dashboard
          </h1>
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
        <p className="text-sm text-gray-500 mt-1">
          Click on any fixture to edit gameweek and xG values
        </p>
      </div>

      {/* Fixtures by Gameweek */}
      <div className="space-y-8">
        <div>
          {/* Gameweek Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              disabled={currentGameweek === minGameweek}
              className="px-3 py-1 text-sm border rounded-md disabled:text-gray-400"
              onClick={() =>
                setCurrentGameweek((prev) => Math.max(minGameweek, prev - 1))
              }
            >
              <div className="flex items-center gap-2">
                <AltArrowLeft />
                <span>Prev GW</span>
              </div>
            </button>
            <span className="text-sm text-gray-600">
              Gameweek {currentGameweek}
            </span>
            <button
              type="button"
              disabled={currentGameweek === maxGameweek}
              className="px-3 py-1 text-sm border rounded-md disabled:text-gray-400"
              onClick={() =>
                setCurrentGameweek((prev) => Math.min(maxGameweek, prev + 1))
              }
            >
              <div className="flex items-center gap-2">
                <span>Next GW</span>
                <AltArrowRight />
              </div>
            </button>
          </div>
        </div>

        {/* Fixtures */}
        <div className="space-y-2">
          {fixturesByGameweek
            .get(currentGameweek)
            ?.map((fixture) => (
              <FixtureCard
                key={fixture.id}
                fixture={fixture}
                teamsMap={teamsMap}
              />
            )) || (
            <p className="text-gray-600">No fixtures for this gameweek.</p>
          )}
        </div>

        {/* Set Current Gameweek */}
        {currentGwData && currentGameweek !== currentGwData.gameweek && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() =>
                updateCurrentGw.mutate({ gameweek: currentGameweek })
              }
              disabled={updateCurrentGw.isPending}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {updateCurrentGw.isPending ? "Updating..." : "Set Current GW"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
