import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CurrentGameweek } from "../types/config";

type CurrentGameweekResponse = {
  gameweek: CurrentGameweek;
};

type UpdateCurrentGameweekBody = {
  gameweek: number;
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

export function useUpdateCurrentGameweek() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCurrentGameweekBody) => {
      const res = await fetch(`/api/config/gameweek`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update current gameweek");
      }
      return res.json() as Promise<{ message: string }>;
    },
    onSuccess: () => {
      // Invalidate the current gameweek query to refetch
      queryClient.invalidateQueries({ queryKey: ["currentGameweek"] });
    },
  });
}
