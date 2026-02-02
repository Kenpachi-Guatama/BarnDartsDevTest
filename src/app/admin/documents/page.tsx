"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createDocument, updateDocument, deleteDocument } from "@/lib/admin-actions";
import { Plus, Edit2, Trash2, FileText, Upload } from "lucide-react";
import type { Document } from "@/types";
import { format, parseISO } from "date-fns";

export default function DocumentsAdmin() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string; size: number } | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    const supabase = createClient();
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    setDocuments(data || []);
    setLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("documents")
        .getPublicUrl(data.path);

      setUploadedFile({
        url: publicUrl,
        name: file.name,
        size: file.size,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    setError("");

    // Add file info to form data if uploaded
    if (uploadedFile) {
      formData.set("file_url", uploadedFile.url);
      formData.set("file_name", uploadedFile.name);
      formData.set("file_size", uploadedFile.size.toString());
    } else if (editingDoc) {
      formData.set("file_url", editingDoc.file_url);
      formData.set("file_name", editingDoc.file_name);
    } else {
      setError("Please upload a file");
      return;
    }

    try {
      if (editingDoc) {
        await updateDocument(editingDoc.id, formData);
      } else {
        await createDocument(formData);
      }
      setShowForm(false);
      setEditingDoc(null);
      setUploadedFile(null);
      loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }
    try {
      await deleteDocument(id);
      loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-red-500">Documents</h1>
        <button
          onClick={() => {
            setEditingDoc(null);
            setUploadedFile(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Add Document
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
            {editingDoc ? "Edit Document" : "New Document"}
          </h2>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                name="title"
                type="text"
                required
                defaultValue={editingDoc?.title}
                placeholder="Document title"
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description (optional)</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={editingDoc?.description || ""}
                placeholder="Brief description of the document"
                className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-red-500 resize-y"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">File</label>
              {editingDoc && !uploadedFile && (
                <p className="text-sm text-gray-400 mb-2">
                  Current file: {editingDoc.file_name}
                </p>
              )}
              {uploadedFile && (
                <p className="text-sm text-green-400 mb-2">
                  Uploaded: {uploadedFile.name}
                </p>
              )}
              <label className="flex items-center gap-2 cursor-pointer bg-[#1a1a1a] border border-[#3a3a3a] rounded px-4 py-3 hover:border-red-500 transition-colors">
                <Upload size={20} className="text-gray-400" />
                <span className="text-gray-400">
                  {uploading ? "Uploading..." : "Choose file"}
                </span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Supported: PDF, Word, Excel, Text files
              </p>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  name="is_published"
                  type="checkbox"
                  value="true"
                  defaultChecked={editingDoc?.is_published ?? true}
                  className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-red-500 focus:ring-red-500"
                />
                <span className="text-sm text-gray-300">Publish immediately</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={uploading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {editingDoc ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingDoc(null);
                  setUploadedFile(null);
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
      ) : documents.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          No documents yet. Upload your first document.
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <FileText className="text-red-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium text-white flex items-center gap-2">
                      {doc.title}
                      {!doc.is_published && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </h3>
                    {doc.description && (
                      <p className="text-sm text-gray-400 mt-1">
                        {doc.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {doc.file_name} · {format(parseISO(doc.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingDoc(doc);
                      setUploadedFile(null);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
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
