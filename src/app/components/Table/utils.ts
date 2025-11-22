import type { Fixture } from "@/lib/types/fixtures";
import type { TeamData } from "@/lib/types/teams";

let LEAGUE_MEAN = 0;
const TEAMBYID: Record<number, TeamData> = {};

interface Opponent {
  id: number;
  home: boolean;
}

export function initDifficultyModel(allTeams: TeamData[]): void {
  if (allTeams.length === 0) {
    return;
  }

  const allScores = allTeams.map((t) => t.off_rating - t.def_rating);
  const sum = allScores.reduce((acc, score) => acc + score, 0);
  const mean = sum / allScores.length;
  LEAGUE_MEAN = mean;

  allTeams.forEach((team) => {
    TEAMBYID[team.id] = team;
  });
}

export function opponentsForTeamInWeek(
  teamId: number,
  gameweek: number,
  fixtures: Fixture[],
): Opponent[] {
  return fixtures
    .filter((fixture) => fixture.event === gameweek)
    .map((fixture) => {
      if (fixture.team_h === teamId) return { id: fixture.team_a, home: true };
      if (fixture.team_a === teamId) return { id: fixture.team_h, home: false };
      return null;
    })
    .filter((opponent): opponent is Opponent => opponent !== null);
}

export function opponentsForTeamInRange(
  teamId: number,
  startWeek: number,
  endWeek: number,
  fixtures: Fixture[],
): Opponent[] {
  return fixtures
    .filter((fixture) => fixture.event >= startWeek && fixture.event <= endWeek)
    .map((fixture) => {
      if (fixture.team_h === teamId) return { id: fixture.team_a, home: true };
      if (fixture.team_a === teamId) return { id: fixture.team_h, home: false };
      return null;
    })
    .filter((opponent): opponent is Opponent => opponent !== null);
}

function squash(x: number, k = 0.01): number {
  return 1 / (1 + Math.exp(-k * (x - LEAGUE_MEAN)));
}

function combineWeighted(scores: number[]): number {
  if (scores.length === 0) return 0;
  return 1 - scores.reduce((acc, score) => acc * (1 - score), 1);
}

export function getAttack(
  offenseA: number,
  opponents: Opponent[],
  k = 0.01,
): { gw_attack: number; difficulty: "easy" | "medium" | "hard" | "invalid" } {
  if (opponents.length === 0) return { gw_attack: 0, difficulty: "invalid" };

  const scores = opponents.map((opponent) =>
    squash(offenseA - TEAMBYID[opponent.id].def_rating, k),
  );
  const gw_attack = combineWeighted(scores);

  const difficulty =
    gw_attack > 0.66 ? "easy" : gw_attack > 0.33 ? "medium" : "hard";

  return { gw_attack, difficulty };
}

export function getDefense(
  defenseA: number,
  opponents: Opponent[],
  k = 0.01,
): {
  gw_defense: number;
  difficulty: "easy" | "medium" | "hard" | "invalid";
} {
  if (opponents.length === 0) return { gw_defense: 0, difficulty: "invalid" };

  const scores = opponents.map((opponent) =>
    squash(defenseA - TEAMBYID[opponent.id].off_rating, k),
  );
  const gw_defense = combineWeighted(scores);

  const difficulty =
    gw_defense > 0.66 ? "easy" : gw_defense > 0.33 ? "medium" : "hard";

  return { gw_defense, difficulty };
}

export function sortByGameweek(
  src: Fixture[],
  gameweek: number,
  direction: "asc" | "desc",
  sortBy: "off" | "def",
): number[] {
  const teamScores: { teamId: number; score: number }[] = [];
  Object.keys(TEAMBYID).forEach((teamId) => {
    const numericTeamId = parseInt(teamId, 10);
    const opponents = opponentsForTeamInWeek(numericTeamId, gameweek, src);
    const team = TEAMBYID[numericTeamId];
    let score: number;
    if (sortBy === "off") {
      const { gw_attack } = getAttack(team.off_rating, opponents);
      score = gw_attack;
    } else {
      const { gw_defense } = getDefense(team.def_rating, opponents);
      score = gw_defense;
    }
    teamScores.push({ teamId: numericTeamId, score });
  });

  teamScores.sort((a, b) => {
    if (direction === "asc") {
      return a.score - b.score;
    } else {
      return b.score - a.score;
    }
  });

  return teamScores.map((item) => item.teamId);
}

export function sortByGameweekRange(
  src: Fixture[],
  startWeek: number,
  endWeek: number,
  direction: "asc" | "desc",
  sortBy: "off" | "def",
): number[] {
  const teamScores: { teamId: number; score: number }[] = [];
  Object.keys(TEAMBYID).forEach((teamId) => {
    const numericTeamId = parseInt(teamId, 10);
    const opponents = opponentsForTeamInRange(
      numericTeamId,
      startWeek,
      endWeek,
      src,
    );
    const team = TEAMBYID[numericTeamId];
    let score: number;
    if (sortBy === "off") {
      const { gw_attack } = getAttack(team.off_rating, opponents);
      score = gw_attack;
    } else {
      const { gw_defense } = getDefense(team.def_rating, opponents);
      score = gw_defense;
    }
    teamScores.push({ teamId: numericTeamId, score });
  });

  teamScores.sort((a, b) => {
    if (direction === "asc") {
      return a.score - b.score;
    } else {
      return b.score - a.score;
    }
  });

  return teamScores.map((item) => item.teamId);
}
