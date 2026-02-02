"use client";

import { useRouter } from "next/navigation";
import type { Season } from "@/types";

interface SeasonSelectorProps {
  seasons: Season[];
  activeSeason: Season | null;
}

export function SeasonSelector({ seasons, activeSeason }: SeasonSelectorProps) {
  const router = useRouter();

  const handleSeasonChange = (seasonId: string) => {
    if (seasonId) {
      router.push(`/?season=${seasonId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <label htmlFor="season-select" className="text-gray-400 text-sm">
          Season:
        </label>
        <select
          id="season-select"
          className="bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
          defaultValue={activeSeason?.id || ""}
          onChange={(e) => handleSeasonChange(e.target.value)}
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
              {season.is_active ? " (Current)" : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
