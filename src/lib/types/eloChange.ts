import z from "zod";

export interface EloChange {
  fixture_id: number;
  team_id: string;
  off_change: number;
  def_change: number;
}

export const TotalEloChangeSchema = z.object({
  total_off: z.number(),
  total_def: z.number(),
});

export type TotalEloChange = z.infer<typeof TotalEloChangeSchema>;
