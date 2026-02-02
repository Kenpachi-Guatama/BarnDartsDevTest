"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createMatch, updateMatch, deleteMatch } from "@/lib/admin-actions";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import type { Match, Team, Season, Location } from "@/types";

type MatchWithRelations = Match & {
  home_team?: Team;
  away_team?: Team;
  location?: Location;
  season?: Season;
};

export default function MatchesAdmin() {
  const [matches, setMatches] = useState<MatchWithRelations[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchWithRelations | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();

    const [matchesResult, teamsResult, seasonsResult, locationsResult] = await Promise.all([
      supabase
        .from("matches")
        .select("*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*), location:locations(*), season:seasons(*)")
        .order("scheduled_date", { ascending: false }),
      supabase.from("teams").select("*").order("name"),
      supabase.from("seasons").select("*").order("start_date", { ascending: false }),
      supabase.from("locations").select("*").order("name"),
    ]);

    setMatches(matchesResult.data || []);
    setTeams(teamsResult.data || []);
    setSeasons(seasonsResult.data || []);
    setLocations(locationsResult.data || []);

    const activeSeason = seasonsResult.data?.find((s) => s.is_active);
    if (activeSeason) {
      setSelectedSeason(activeSeason.id);
    }

    setLoading(false);
  }

  async function handleSubmit(formData: FormData) {
    setError("");
    try {
      if (editingMatch) {
        await updateMatch(editingMatch.id, formData);
      } else {
        await createMatch(formData);
      }
      setShowForm(false);
      setEditingMatch(null);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this match?")) {
      return;
    }
    try {
      await deleteMatch(id);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  const filteredMatches = selectedSeason
    ? matches.filter((m) => m.season_id === selectedSeason)
    : matches;

  const seasonTeams = selectedSeason
    ? teams.filter((t) => t.season_id === selectedSeason)
    : teams;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-500">Matches</h1>
        <button
          onClick={() => {
            setEditingMatch(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Match
        </button>
      </div>

      {/* Season filter */}
      <div className="mb-6">
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
        >
          <option value="">All Seasons</option>
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingMatch ? "Edit Match" : "New Match"}
          </h2>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Season</label>
              <select
                name="season_id"
                required
                defaultValue={editingMatch?.season_id || selectedSeason}
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
              >
                <option value="">Select a season</option>
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Home Team</label>
                <select
                  name="home_team_id"
                  required
                  defaultValue={editingMatch?.home_team_id}
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Select team</option>
                  {seasonTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Away Team</label>
                <select
                  name="away_team_id"
                  required
                  defaultValue={editingMatch?.away_team_id}
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Select team</option>
                  {seasonTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Location</label>
              <select
                name="location_id"
                defaultValue={editingMatch?.location_id || ""}
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
              >
                <option value="">Select location (optional)</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input
                  name="scheduled_date"
                  type="date"
                  required
                  defaultValue={editingMatch?.scheduled_date}
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Time (optional)</label>
                <input
                  name="scheduled_time"
                  type="time"
                  defaultValue={editingMatch?.scheduled_time || ""}
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {editingMatch && (
              <>
                <div className="border-t border-[#3a3a3a] pt-4 mt-4">
                  <h3 className="font-medium text-white mb-3">Match Score</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Enter games won by each team (0-3). Total must equal 3.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        {editingMatch.home_team?.name} Score
                      </label>
                      <input
                        name="home_score"
                        type="number"
                        min="0"
                        max="3"
                        defaultValue={editingMatch.home_score ?? ""}
                        className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        {editingMatch.away_team?.name} Score
                      </label>
                      <input
                        name="away_score"
                        type="number"
                        min="0"
                        max="3"
                        defaultValue={editingMatch.away_score ?? ""}
                        className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        name="is_completed"
                        type="checkbox"
                        value="true"
                        defaultChecked={editingMatch.is_completed}
                        className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-red-500 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-300">Match Completed</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingMatch ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMatch(null);
                }}
                className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-center py-12">Loading...</div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          No matches scheduled. Add a match to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Calendar className="text-red-500" size={20} />
                  <div>
                    <div className="font-medium text-white">
                      {match.home_team?.name} vs {match.away_team?.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {match.scheduled_date}
                      {match.scheduled_time && ` at ${match.scheduled_time}`}
                      {match.location && ` - ${match.location.name}`}
                    </div>
                    {match.is_completed && (
                      <div className="text-sm mt-1">
                        <span className="text-green-400 font-medium">
                          Final: {match.home_score} - {match.away_score}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingMatch(match);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(match.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
