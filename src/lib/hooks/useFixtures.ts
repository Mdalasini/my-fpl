import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  FixturesResponse,
  Fixture,
  UpdateFixtureBody,
} from "../types/fixtures";

export function useFixtures() {
  return useQuery({
    queryKey: ["fixtures"],
    queryFn: async () => {
      const res = await fetch(`/api/fixtures`);
      if (!res.ok) throw new Error("Failed to fetch fixtures");
      return res.json() as Promise<FixturesResponse>;
    },
    enabled: true,
  });
}

export function useUpdateFixture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fixtureId,
      data,
    }: {
      fixtureId: number;
      data: UpdateFixtureBody;
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
