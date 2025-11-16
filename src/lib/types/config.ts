import { z } from "zod";

// Schema for the current season
export const CurrentSeasonSchema = z.string();

// Schema for the current gameweek
export const CurrentGameweekSchema = z.coerce.number();

// Schema for updating current gameweek
export const UpdateCurrentGameweekSchema = z.object({
  gameweek: z
    .number()
    .int()
    .min(1)
    .max(38)
    .transform((n) => n.toString()),
});

// Types derived from schemas
export type CurrentSeason = z.infer<typeof CurrentSeasonSchema>;
export type CurrentGameweek = z.infer<typeof CurrentGameweekSchema>;
export type UpdateCurrentGameweek = z.infer<typeof UpdateCurrentGameweekSchema>;
