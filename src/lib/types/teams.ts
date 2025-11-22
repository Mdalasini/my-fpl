import { z } from "zod";

export const TeamDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  short_name: z.string(),
  off_rating: z.number(),
  def_rating: z.number(),
});

export type TeamData = z.infer<typeof TeamDataSchema>;

export type TeamsResponse = TeamData[];
