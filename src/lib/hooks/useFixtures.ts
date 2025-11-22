import { useQuery } from "@tanstack/react-query";
import type { Fixture } from "../types/fixtures";

export function useFixtures() {
  return useQuery({
    queryKey: ["fixtures"],
    queryFn: async () => {
      const res = await fetch(`/api/fixtures`);
      if (!res.ok) throw new Error("Failed to fetch fixtures");
      return res.json() as Promise<Fixture[]>;
    },
    enabled: true,
  });
}
