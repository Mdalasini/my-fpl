export interface Fixture {
  _id: string;
  home_id: string;
  away_id: string;
  gameweek: number;
  season: string;
  home_xg: number | null;
  away_xg: number | null;
}

export type FixturesResponse = Fixture[];
