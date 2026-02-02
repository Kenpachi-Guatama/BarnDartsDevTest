"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createSeason, updateSeason, deleteSeason } from "@/lib/admin-actions";
import { Plus, Edit2, Trash2, Trophy } from "lucide-react";
import type { Season } from "@/types";

export default function SeasonsAdmin() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSeasons();
  }, []);

  async function loadSeasons() {
    const supabase = createClient();
    const { data } = await supabase
      .from("seasons")
      .select("*")
      .order("start_date", { ascending: false });
    setSeasons(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: FormData) {
    setError("");
    try {
      if (editingSeason) {
        await updateSeason(editingSeason.id, formData);
      } else {
        await createSeason(formData);
      }
      setShowForm(false);
      setEditingSeason(null);
      loadSeasons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this season? This will also delete all teams and matches in this season.")) {
      return;
    }
    try {
      await deleteSeason(id);
      loadSeasons();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-500">Seasons</h1>
        <button
          onClick={() => {
            setEditingSeason(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Season
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingSeason ? "Edit Season" : "New Season"}
          </h2>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={editingSeason?.name}
                placeholder="Season 06"
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                <input
                  name="start_date"
                  type="date"
                  required
                  defaultValue={editingSeason?.start_date}
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">End Date</label>
                <input
                  name="end_date"
                  type="date"
                  defaultValue={editingSeason?.end_date || ""}
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  name="is_active"
                  type="checkbox"
                  value="true"
                  defaultChecked={editingSeason?.is_active}
                  className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-red-500 focus:ring-red-500"
                />
                <span className="text-sm text-gray-300">Active Season (shown by default)</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingSeason ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSeason(null);
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
      ) : seasons.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          No seasons yet. Create your first season to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {seasons.map((season) => (
            <div
              key={season.id}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Trophy className="text-red-500" size={20} />
                <div>
                  <h3 className="font-medium text-white flex items-center gap-2">
                    {season.name}
                    {season.is_active && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {season.start_date} - {season.end_date || "Ongoing"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingSeason(season);
                    setShowForm(true);
                  }}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(season.id)}
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
