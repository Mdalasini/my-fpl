import { z } from "zod";

// Schema for the current gameweek
export const CurrentGameweekSchema = z.coerce.number();

// Types derived from schemas
export type CurrentGameweek = z.infer<typeof CurrentGameweekSchema>;
