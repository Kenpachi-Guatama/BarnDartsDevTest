"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createTeam, updateTeam, deleteTeam } from "@/lib/admin-actions";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import type { Team, Season } from "@/types";

export default function TeamsAdmin() {
  const [teams, setTeams] = useState<(Team & { season?: Season })[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();

    const [teamsResult, seasonsResult] = await Promise.all([
      supabase
        .from("teams")
        .select("*, season:seasons(*)")
        .order("name"),
      supabase
        .from("seasons")
        .select("*")
        .order("start_date", { ascending: false }),
    ]);

    setTeams(teamsResult.data || []);
    setSeasons(seasonsResult.data || []);

    // Set default selected season to active season
    const activeSeason = seasonsResult.data?.find((s) => s.is_active);
    if (activeSeason) {
      setSelectedSeason(activeSeason.id);
    }

    setLoading(false);
  }

  async function handleSubmit(formData: FormData) {
    setError("");
    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, formData);
      } else {
        await createTeam(formData);
      }
      setShowForm(false);
      setEditingTeam(null);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this team?")) {
      return;
    }
    try {
      await deleteTeam(id);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  const filteredTeams = selectedSeason
    ? teams.filter((t) => t.season_id === selectedSeason)
    : teams;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-500">Teams</h1>
        <button
          onClick={() => {
            setEditingTeam(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Team
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
            {editingTeam ? "Edit Team" : "New Team"}
          </h2>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Team/Player Name</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={editingTeam?.name}
                placeholder="The Dartfather"
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Season</label>
              <select
                name="season_id"
                required
                defaultValue={editingTeam?.season_id || selectedSeason}
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
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingTeam ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTeam(null);
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
      ) : filteredTeams.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          {selectedSeason
            ? "No teams in this season yet."
            : "No teams yet. Create your first team to get started."}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Users className="text-red-500" size={20} />
                <div>
                  <h3 className="font-medium text-white">{team.name}</h3>
                  <p className="text-sm text-gray-400">{team.season?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingTeam(team);
                    setShowForm(true);
                  }}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
