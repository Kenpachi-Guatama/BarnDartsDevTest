"use client";

import { format, parseISO } from "date-fns";
import type { News } from "@/types";
import { Calendar } from "lucide-react";

interface NewsListProps {
  news: News[];
}

export function NewsList({ news }: NewsListProps) {
  if (news.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No news articles available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {news.map((article) => (
        <article
          key={article.id}
          className="bg-[#2a2a2a] rounded-lg p-6 border border-[#3a3a3a]"
        >
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <Calendar size={14} />
            <time dateTime={article.published_at}>
              {format(parseISO(article.published_at), "MMMM d, yyyy")}
            </time>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">
            {article.title}
          </h2>

          <div className="text-gray-300 whitespace-pre-wrap">
            {article.content}
          </div>
        </article>
      ))}
    </div>
  );
}
