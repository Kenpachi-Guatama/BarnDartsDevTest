import { ScheduleList } from "@/components/schedule/ScheduleList";
import { SeasonSelector } from "@/components/standings/SeasonSelector";
import { getSchedule, getSeasons, getActiveSeason } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const [matches, seasons, activeSeason] = await Promise.all([
    getSchedule(),
    getSeasons(),
    getActiveSeason(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Schedule</h1>

      <SeasonSelector seasons={seasons} activeSeason={activeSeason} />

      <div className="mt-6">
        <ScheduleList matches={matches} />
      </div>
    </div>
  );
}
