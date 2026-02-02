"use client";

import type { TeamStanding } from "@/types";

interface StandingsTableProps {
  standings: TeamStanding[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="standings-table">
        <thead>
          <tr className="border-b border-[#3a3a3a]">
            <th className="rank">#</th>
            <th className="team-name text-left">Team</th>
            <th className="hidden sm:table-cell">P</th>
            <th>W-L-T</th>
            <th className="hidden sm:table-cell">F</th>
            <th className="hidden sm:table-cell">A</th>
            <th className="hidden md:table-cell">+/-</th>
            <th>PTS</th>
            <th className="hidden sm:table-cell">PCT</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.id}>
              <td className="rank">{index + 1}</td>
              <td className="team-name">{team.name}</td>
              <td className="hidden sm:table-cell">{team.played}</td>
              <td>{team.wins}-{team.losses}-{team.ties}</td>
              <td className="hidden sm:table-cell">{team.points_for}</td>
              <td className="hidden sm:table-cell">{team.points_against}</td>
              <td className="hidden md:table-cell">
                <span className={team.diff && team.diff > 0 ? "text-green-500" : team.diff && team.diff < 0 ? "text-red-400" : ""}>
                  {team.diff && team.diff > 0 ? "+" : ""}{team.diff || 0}
                </span>
              </td>
              <td>
                <span className="pts">{team.points || 0}</span>
              </td>
              <td className="hidden sm:table-cell">
                {team.pct !== undefined ? team.pct.toFixed(3) : "0.000"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {standings.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No standings available for this season.
        </div>
      )}
    </div>
  );
}
