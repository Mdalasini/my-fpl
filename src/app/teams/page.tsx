"use client";

import { useMemo } from "react";
import { CURRENT_SEASON } from "@/lib/config/season";
import { useTeams } from "@/lib/hooks/useTeams";
import TeamCard from "@/app/components/TeamCard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function TeamsDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

function Dashboard() {
  const { data: teams, isLoading, error } = useTeams(CURRENT_SEASON);

  // Sort teams by name
  const sortedTeams = useMemo(() => {
    if (!teams) return [];
    return [...teams].sort((a, b) => a.name.localeCompare(b.name));
  }, [teams]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams Dashboard</h1>
          <p className="text-gray-600 mt-2">Season: {CURRENT_SEASON}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-64 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams Dashboard</h1>
          <p className="text-gray-600 mt-2">Season: {CURRENT_SEASON}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <h2 className="font-semibold mb-2">Error Loading Teams</h2>
          <p className="text-sm mb-4">{error.message}</p>
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
  if (!teams || teams.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams Dashboard</h1>
          <p className="text-gray-600 mt-2">Season: {CURRENT_SEASON}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No teams found for this season.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Teams Dashboard</h1>
        <p className="text-gray-600 mt-2">Season: {CURRENT_SEASON}</p>
        <p className="text-sm text-gray-500 mt-1">
          Viewing {teams.length} teams for this season
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTeams.map((team) => (
          <TeamCard key={team.team_id} team={team} />
        ))}
      </div>
    </div>
  );
}
