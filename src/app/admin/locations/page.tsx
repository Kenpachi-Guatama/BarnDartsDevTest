"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createLocation, updateLocation, deleteLocation } from "@/lib/admin-actions";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import type { Location } from "@/types";

export default function LocationsAdmin() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    const supabase = createClient();
    const { data } = await supabase
      .from("locations")
      .select("*")
      .order("name");
    setLocations(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: FormData) {
    setError("");
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, formData);
      } else {
        await createLocation(formData);
      }
      setShowForm(false);
      setEditingLocation(null);
      loadLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this location?")) {
      return;
    }
    try {
      await deleteLocation(id);
      loadLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-500">Locations</h1>
        <button
          onClick={() => {
            setEditingLocation(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Location
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
            {editingLocation ? "Edit Location" : "New Location"}
          </h2>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={editingLocation?.name}
                placeholder="The Viking Hall"
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Address (optional)</label>
              <input
                name="address"
                type="text"
                defaultValue={editingLocation?.address || ""}
                placeholder="123 Main St, City, State"
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingLocation ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingLocation(null);
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
      ) : locations.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          No locations yet. Add a venue to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <MapPin className="text-red-500" size={20} />
                <div>
                  <h3 className="font-medium text-white">{location.name}</h3>
                  {location.address && (
                    <p className="text-sm text-gray-400">{location.address}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingLocation(location);
                    setShowForm(true);
                  }}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
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
