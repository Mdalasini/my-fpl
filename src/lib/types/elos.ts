import z from "zod";

export const TeamEloSchema = z.object({
  team_id: z.string(),
  off_elo: z.number(),
  def_elo: z.number(),
});

export type TeamElo = z.infer<typeof TeamEloSchema>;
