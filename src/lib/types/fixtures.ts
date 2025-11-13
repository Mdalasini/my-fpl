import { z } from "zod";

export const FixtureSchema = z.object({
  id: z.number(),
  home_id: z.string(),
  away_id: z.string(),
  gameweek: z.number(),
  season: z.string(),
  home_xg: z.number().nullable(),
  away_xg: z.number().nullable(),
});

export interface UpdateFixtureBody {
  home_xg?: number | null;
  away_xg?: number | null;
  gameweek?: number;
}

export type Fixture = z.infer<typeof FixtureSchema>;

export type FixturesResponse = Fixture[];
