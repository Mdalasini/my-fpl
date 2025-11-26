"use client";

import { useMemo } from "react";
import type { SortBy } from "../types";
import { useFDRData } from "../context/FDRDataProvider";
import { getDifficultyColors, getDifficultyFromPercentile } from "../utils";
import { OpponentChip } from "../shared";

interface FixtureRowProps {
  teamId: number;
  gameweek: number;
  sortBy: SortBy;
}

/**
 * Mobile fixture row displaying a single gameweek's fixtures for a team
 * Uses sleek, minimal styling with subtle difficulty indicators
 */
export function FixtureRow({ teamId, gameweek, sortBy }: FixtureRowProps) {
  const { difficultyScores, teamById, teams } = useFDRData();

  // Calculate all team scores for this gameweek for percentile ranking
  const allScoresForGameweek = useMemo(() => {
    if (!difficultyScores || !teams) return { attack: [], defense: [] };

    const attackScores: number[] = [];
    const defenseScores: number[] = [];

    for (const team of teams) {
      const score = difficultyScores.byTeam[team.id]?.[gameweek];
      if (score) {
        attackScores.push(score.attack.score);
        defenseScores.push(score.defense.score);
      }
    }

    return { attack: attackScores, defense: defenseScores };
  }, [difficultyScores, teams, gameweek]);

  if (!difficultyScores || !teamById) return null;

  const gameweekScore = difficultyScores.byTeam[teamId]?.[gameweek];
  if (!gameweekScore) {
    return (
      <div className="flex items-center justify-between py-3 px-4">
        <span className="text-sm font-medium text-slate-400 tabular-nums">
          {gameweek}
        </span>
        <span className="text-sm text-slate-300">—</span>
      </div>
    );
  }

  const { attack, defense } = gameweekScore;
  const score = sortBy === "offense" ? attack.score : defense.score;
  const allScores =
    sortBy === "offense"
      ? allScoresForGameweek.attack
      : allScoresForGameweek.defense;
  const difficulty = getDifficultyFromPercentile(score, allScores);
  const colors = getDifficultyColors(difficulty);
  const opponents = attack.opponents;

  return (
    <div
      className={`flex items-center justify-between py-3 px-4 ${colors.background}`}
      data-offense={attack.score.toFixed(3)}
      data-defense={defense.score.toFixed(3)}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-500 tabular-nums w-6">
          {gameweek}
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}
          aria-hidden="true"
          title={`Difficulty: ${difficulty}`}
        />
      </div>
      <div className="flex flex-col items-end gap-0.5">
        {opponents && opponents.length > 0 ? (
          opponents.map((opp) => {
            const opponentTeam = teamById[opp.id];
            if (!opponentTeam) return null;

            return (
              <OpponentChip key={opp.id} opponent={opp} team={opponentTeam} />
            );
          })
        ) : (
          <span className="text-sm text-slate-300">—</span>
        )}
      </div>
    </div>
  );
}
