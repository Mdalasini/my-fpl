import { z } from "zod";

export const FixtureSchema = z.object({
  code: z.number(),
  event: z.number(),
  finished: z.number().pipe(z.coerce.boolean()),
  team_h: z.number(),
  team_a: z.number(),
  kickoff_time: z.string().pipe(z.coerce.date()),
  team_h_xg: z.number().nullable(),
  team_a_xg: z.number().nullable(),
});

export type Fixture = z.infer<typeof FixtureSchema>;

export type FixturesResponse = Fixture[];
