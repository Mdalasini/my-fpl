import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FixturesResponse, Fixture } from "../types/fixtures";

export function useFixtures(season: string) {
  return useQuery({
    queryKey: ["fixtures", season],
    queryFn: async () => {
      const res = await fetch(`/api/fixtures?season=${season}`);
      if (!res.ok) throw new Error("Failed to fetch fixtures");
      return res.json() as Promise<FixturesResponse>;
    },
    enabled: !!season,
  });
}

interface UpdateFixtureInput {
  gameweek?: number;
  home_xg?: number | null;
  away_xg?: number | null;
}

export function useUpdateFixture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fixtureId,
      data,
    }: {
      fixtureId: string;
      data: UpdateFixtureInput;
    }) => {
      const res = await fetch(`/api/fixtures/${fixtureId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update fixture");
      }
      return res.json() as Promise<Fixture>;
    },
    onSuccess: () => {
      // Invalidate all fixtures queries to refetch
      queryClient.invalidateQueries({ queryKey: ["fixtures"] });
    },
  });
}
