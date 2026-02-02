"use client";

import { format, parseISO } from "date-fns";
import type { Document } from "@/types";
import { FileText, Download, Calendar } from "lucide-react";

interface DocumentsListProps {
  documents: Document[];
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsList({ documents }: DocumentsListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No documents available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <a
          key={doc.id}
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a] hover:border-red-500 transition-colors group"
        >
          <div className="flex items-start gap-4">
            <div className="bg-red-500/20 p-3 rounded-lg">
              <FileText className="text-red-500" size={24} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors">
                {doc.title}
              </h3>

              {doc.description && (
                <p className="text-gray-400 text-sm mt-1">
                  {doc.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {format(parseISO(doc.created_at), "MMM d, yyyy")}
                </span>
                {doc.file_size && (
                  <span>{formatFileSize(doc.file_size)}</span>
                )}
                <span className="uppercase">{doc.file_name.split(".").pop()}</span>
              </div>
            </div>

            <Download
              className="text-gray-500 group-hover:text-red-400 transition-colors"
              size={20}
            />
          </div>
        </a>
      ))}
    </div>
  );
}
