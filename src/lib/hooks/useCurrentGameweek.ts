import { useQuery } from "@tanstack/react-query";
import type { CurrentGameweek } from "../types/config";

type CurrentGameweekResponse = {
  gameweek: CurrentGameweek;
};

export function useCurrentGameweek() {
  return useQuery({
    queryKey: ["currentGameweek"],
    queryFn: async () => {
      const res = await fetch(`/api/config/gameweek`);
      if (!res.ok) throw new Error("Failed to fetch current gameweek");
      return res.json() as Promise<CurrentGameweekResponse>;
    },
    enabled: true,
  });
}
