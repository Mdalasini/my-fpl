"use client";

import { useState } from "react";
import type { Fixture } from "@/lib/types/fixtures";
import { useUpdateFixture } from "@/lib/hooks/useFixtures";

interface FixtureCardProps {
  fixture: Fixture;
  teamsMap: Map<number, string>;
}

export default function FixtureCard({ fixture, teamsMap }: FixtureCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [gameweek, setGameweek] = useState(fixture.event);
  const [homeXg, setHomeXg] = useState(fixture.team_h_xg ?? "");
  const [awayXg, setAwayXg] = useState(fixture.team_a_xg ?? "");
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useUpdateFixture();

  const homeTeamName = teamsMap.get(fixture.team_h) || fixture.team_h;
  const awayTeamName = teamsMap.get(fixture.team_a) || fixture.team_a;

  const handleSave = async () => {
    try {
      setError(null);

      const updateData: {
        team_h_xg?: number | null;
        team_a_xg?: number | null;
      } = {};

      if (homeXg !== (fixture.team_h_xg ?? "")) {
        updateData.team_h_xg =
          homeXg === "" ? null : parseFloat(homeXg as string);
      }

      if (awayXg !== (fixture.team_a_xg ?? "")) {
        updateData.team_a_xg =
          awayXg === "" ? null : parseFloat(awayXg as string);
      }

      await updateMutation.mutateAsync({
        fixtureId: fixture.code,
        data: updateData,
      });

      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save fixture");
    }
  };

  const handleCancel = () => {
    setGameweek(fixture.event);
    setHomeXg(fixture.team_h_xg ?? "");
    setAwayXg(fixture.team_a_xg ?? "");
    setError(null);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsEditing(true);
          }
        }}
        className="group w-full text-left bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 mb-3 cursor-pointer border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900 flex items-center flex-wrap gap-2">
              <span className="text-blue-700">{homeTeamName}</span>
              {homeXg !== "" && (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
                  xG {homeXg}
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mx-1">
                vs
              </span>
              {awayXg !== "" && (
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-200">
                  xG {awayXg}
                </span>
              )}
              <span className="text-blue-700">{awayTeamName}</span>
            </p>
          </div>
          <div className="text-xs sm:text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full ring-1 ring-inset ring-blue-200">
            GW {gameweek}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 mb-3 border border-gray-200 shadow-sm">
      <div className="space-y-4">
        {/* Team Match Display */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-gray-900 font-semibold">{homeTeamName}</span>
            <label htmlFor={`home-xg-${fixture.code}`} className="sr-only">
              Home Team xG
            </label>
            <input
              id={`home-xg-${fixture.code}`}
              type="number"
              value={homeXg}
              onChange={(e) => setHomeXg(e.target.value)}
              placeholder="xG"
              step="0.1"
              min="0"
              className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
            vs
          </span>
          <div className="flex items-center gap-2 justify-end flex-1">
            <label htmlFor={`away-xg-${fixture.code}`} className="sr-only">
              Away Team xG
            </label>
            <input
              id={`away-xg-${fixture.code}`}
              type="number"
              value={awayXg}
              onChange={(e) => setAwayXg(e.target.value)}
              placeholder="xG"
              step="0.1"
              min="0"
              className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
            <span className="text-gray-900 font-semibold">{awayTeamName}</span>
          </div>
        </div>

        {/* Gameweek Input */}
        <div className="flex items-center gap-3 bg-gray-50/60 p-3 rounded-lg border border-gray-100">
          <label
            htmlFor={`gw-${fixture.code}`}
            className="text-sm font-medium text-gray-700 mr-2"
          >
            Gameweek:
          </label>
          <input
            id={`gw-${fixture.code}`}
            type="number"
            value={gameweek}
            onChange={(e) =>
              setGameweek(Math.max(1, parseInt(e.target.value) || 1))
            }
            step="1"
            min="1"
            className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={updateMutation.isPending}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {updateMutation.isPending ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
