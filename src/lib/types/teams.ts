import { z } from "zod";

export const TeamDataSchema = z.object({
  team_id: z.string(),
  name: z.string(),
  short_name: z.string(),
  off_rating: z.number(),
  def_rating: z.number(),
  logo_path: z.string(),
});

export type TeamData = z.infer<typeof TeamDataSchema>;

export type TeamsResponse = TeamData[];
