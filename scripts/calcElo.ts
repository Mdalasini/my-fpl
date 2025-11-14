import { CURRENT_SEASON } from "@/lib/config/season";
import { getTeamElo, recordEloChange } from "@/lib/services/EloService";
import { getFixturesNotInEloChanges } from "@/lib/services/FixtureService";
import type { EloChange } from "@/lib/types/eloChange";
import { getTeams } from "@/lib/services/TeamService";

const fixtures = await getFixturesNotInEloChanges(CURRENT_SEASON);
fixtures.sort((a, b) => a.gameweek - b.gameweek);
const teams = await getTeams(CURRENT_SEASON);
const shortNameById = new Map(teams.map((t) => [t.team_id, t.short_name]));

console.info(
  `[ELO] Starting ELO calculation for season=${CURRENT_SEASON} fixtures=${fixtures.length}`,
);

let processed = 0;
let skipped = 0;
let errors = 0;

for (const fixture of fixtures) {
  try {
    const homeSN = shortNameById.get(fixture.home_id) ?? `${fixture.home_id}`;
    const awaySN = shortNameById.get(fixture.away_id) ?? `${fixture.away_id}`;
    if (fixture.home_xg == null || fixture.away_xg == null) {
      skipped += 1;
      console.warn(
        `[ELO][skip] fixture=${fixture.id} ${homeSN} vs ${awaySN} missing_xg home_xg=${fixture.home_xg} away_xg=${fixture.away_xg}`,
      );
      continue;
    }

    console.info(
      `[ELO][fixture:start] id=${fixture.id} ${homeSN} vs ${awaySN} home_xg=${fixture.home_xg} away_xg=${fixture.away_xg}`,
    );

    const homeElo = await getTeamElo(fixture.home_id);
    const awayElo = await getTeamElo(fixture.away_id);

    const expectedHomeXg = ((homeElo.off_elo - awayElo.def_elo) / 100) * 0.3;
    const deltaOff = fixture.home_xg - expectedHomeXg;
    const homeOffChange = 20 * deltaOff;
    const awayDefChange = -20 * deltaOff;

    const expectedConcededHome =
      ((awayElo.off_elo - homeElo.def_elo) / 100) * 0.3;
    const deltaDef = fixture.away_xg - expectedConcededHome;
    const homeDefChange = 20 * deltaDef;
    const awayOffChange = -20 * deltaDef;

    const homeEloChange: EloChange = {
      fixture_id: fixture.id,
      team_id: fixture.home_id,
      off_change: homeOffChange,
      def_change: homeDefChange,
    };

    const awayEloChange: EloChange = {
      fixture_id: fixture.id,
      team_id: fixture.away_id,
      off_change: awayOffChange,
      def_change: awayDefChange,
    };

    await recordEloChange(homeEloChange);
    await recordEloChange(awayEloChange);

    processed += 1;
    console.info(
      `[ELO][fixture:done] id=${fixture.id} ${homeSN} vs ${awaySN} home_off=${homeOffChange.toFixed(2)} home_def=${homeDefChange.toFixed(2)} away_off=${awayOffChange.toFixed(2)} away_def=${awayDefChange.toFixed(2)}`,
    );
  } catch (err) {
    errors += 1;
    const message = err instanceof Error ? err.message : String(err);
    const homeSN = shortNameById.get(fixture.home_id) ?? `${fixture.home_id}`;
    const awaySN = shortNameById.get(fixture.away_id) ?? `${fixture.away_id}`;
    console.error(
      `[ELO][fixture:error] id=${fixture.id} ${homeSN} vs ${awaySN} message=${message}`,
    );
  }
}
console.info(
  `[ELO] Completed. processed=${processed} skipped=${skipped} errors=${errors}`,
);
