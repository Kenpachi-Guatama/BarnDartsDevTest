import { StandingsTable } from "@/components/standings/StandingsTable";
import { SeasonSelector } from "@/components/standings/SeasonSelector";
import { getStandings, getSeasons, getActiveSeason } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const [standings, seasons, activeSeason] = await Promise.all([
    getStandings(),
    getSeasons(),
    getActiveSeason(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Standings</h1>

      <SeasonSelector seasons={seasons} activeSeason={activeSeason} />

      <div className="mt-6">
        <StandingsTable standings={standings} />
      </div>
    </div>
  );
}
