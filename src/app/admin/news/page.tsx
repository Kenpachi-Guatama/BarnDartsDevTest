"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createNews, updateNews, deleteNews } from "@/lib/admin-actions";
import { Plus, Edit2, Trash2, Newspaper } from "lucide-react";
import type { News } from "@/types";
import { format, parseISO } from "date-fns";

export default function NewsAdmin() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    const supabase = createClient();
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    setNews(data || []);
    setLoading(false);
  }

  async function handleSubmit(formData: FormData) {
    setError("");
    try {
      if (editingNews) {
        await updateNews(editingNews.id, formData);
      } else {
        await createNews(formData);
      }
      setShowForm(false);
      setEditingNews(null);
      loadNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }
    try {
      await deleteNews(id);
      loadNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-500">News</h1>
        <button
          onClick={() => {
            setEditingNews(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Article
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
            {editingNews ? "Edit Article" : "New Article"}
          </h2>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                name="title"
                type="text"
                required
                defaultValue={editingNews?.title}
                placeholder="Article title"
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Content</label>
              <textarea
                name="content"
                required
                rows={8}
                defaultValue={editingNews?.content}
                placeholder="Article content..."
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500 resize-y"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  name="is_published"
                  type="checkbox"
                  value="true"
                  defaultChecked={editingNews?.is_published ?? true}
                  className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-red-500 focus:ring-red-500"
                />
                <span className="text-sm text-gray-300">Publish immediately</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingNews ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingNews(null);
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
      ) : news.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          No news articles yet. Create your first article.
        </div>
      ) : (
        <div className="space-y-3">
          {news.map((article) => (
            <div
              key={article.id}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Newspaper className="text-red-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium text-white flex items-center gap-2">
                      {article.title}
                      {!article.is_published && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {article.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {article.published_at
                        ? `Published ${format(parseISO(article.published_at), "MMM d, yyyy")}`
                        : `Created ${format(parseISO(article.created_at), "MMM d, yyyy")}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingNews(article);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
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
