"use client";

import { useState } from "react";
import type { Fixture } from "@/lib/types/fixtures";
import { useUpdateFixture } from "@/lib/hooks/useFixtures";

interface FixtureCardProps {
  fixture: Fixture;
  teamsMap: Map<string, string>;
}

export default function FixtureCard({ fixture, teamsMap }: FixtureCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [gameweek, setGameweek] = useState(fixture.gameweek);
  const [homeXg, setHomeXg] = useState(fixture.home_xg ?? "");
  const [awayXg, setAwayXg] = useState(fixture.away_xg ?? "");
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useUpdateFixture();

  const homeTeamName = teamsMap.get(fixture.home_id) || fixture.home_id;
  const awayTeamName = teamsMap.get(fixture.away_id) || fixture.away_id;

  const handleSave = async () => {
    try {
      setError(null);

      const updateData: {
        gameweek?: number;
        home_xg?: number | null;
        away_xg?: number | null;
      } = {};

      if (gameweek !== fixture.gameweek) {
        updateData.gameweek = gameweek;
      }

      if (homeXg !== (fixture.home_xg ?? "")) {
        updateData.home_xg =
          homeXg === "" ? null : parseFloat(homeXg as string);
      }

      if (awayXg !== (fixture.away_xg ?? "")) {
        updateData.away_xg =
          awayXg === "" ? null : parseFloat(awayXg as string);
      }

      await updateMutation.mutateAsync({
        fixtureId: fixture._id,
        data: updateData,
      });

      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save fixture");
    }
  };

  const handleCancel = () => {
    setGameweek(fixture.gameweek);
    setHomeXg(fixture.home_xg ?? "");
    setAwayXg(fixture.away_xg ?? "");
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
        className="w-full text-left bg-white shadow rounded-lg p-4 mb-2 cursor-pointer hover:shadow-md transition-shadow border-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900">
              <span className="text-blue-600">{homeTeamName}</span>
              {homeXg !== "" && (
                <span className="text-gray-600 font-normal ml-2">
                  ({homeXg})
                </span>
              )}
              <span className="text-gray-400 mx-3">vs</span>
              {awayXg !== "" && (
                <span className="text-gray-600 font-normal mr-2">
                  ({awayXg})
                </span>
              )}
              <span className="text-blue-600">{awayTeamName}</span>
            </p>
          </div>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
            GW: {gameweek}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-2 border-2 border-blue-500">
      <div className="space-y-4">
        {/* Team Match Display */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor={`home-xg-${fixture._id}`} className="sr-only">
              Home Team xG
            </label>
            <input
              id={`home-xg-${fixture._id}`}
              type="number"
              value={homeXg}
              onChange={(e) => setHomeXg(e.target.value)}
              placeholder="xG"
              step="0.1"
              min="0"
              className="w-20 border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
            />
            <span className="ml-2 text-gray-900 font-semibold">
              {homeTeamName}
            </span>
            <span className="text-gray-400 mx-2">vs</span>
            <span className="text-gray-900 font-semibold">{awayTeamName}</span>
            <label htmlFor={`away-xg-${fixture._id}`} className="sr-only">
              Away Team xG
            </label>
            <input
              id={`away-xg-${fixture._id}`}
              type="number"
              value={awayXg}
              onChange={(e) => setAwayXg(e.target.value)}
              placeholder="xG"
              step="0.1"
              min="0"
              className="ml-2 w-20 border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Gameweek Input */}
        <div className="flex items-center gap-4">
          <label
            htmlFor={`gw-${fixture._id}`}
            className="text-sm font-medium text-gray-700"
          >
            Gameweek:
          </label>
          <input
            id={`gw-${fixture._id}`}
            type="number"
            value={gameweek}
            onChange={(e) =>
              setGameweek(Math.max(1, parseInt(e.target.value) || 1))
            }
            step="1"
            min="1"
            className="w-24 border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={updateMutation.isPending}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
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
