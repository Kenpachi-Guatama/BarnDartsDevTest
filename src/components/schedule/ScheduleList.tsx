"use client";

import { format, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import type { MatchWithTeams } from "@/types";
import { MapPin, Calendar, Clock } from "lucide-react";

interface ScheduleListProps {
  matches: MatchWithTeams[];
}

export function ScheduleList({ matches }: ScheduleListProps) {
  const today = startOfDay(new Date());

  // Group matches by date
  const matchesByDate = matches.reduce((acc, match) => {
    const date = match.scheduled_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as Record<string, MatchWithTeams[]>);

  const sortedDates = Object.keys(matchesByDate).sort();

  // Separate upcoming and past matches
  const upcomingDates = sortedDates.filter((date) =>
    isAfter(parseISO(date), today) || format(parseISO(date), "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
  );
  const pastDates = sortedDates
    .filter((date) => isBefore(parseISO(date), today))
    .reverse();

  const renderMatchCard = (match: MatchWithTeams) => {
    const isCompleted = match.is_completed;

    return (
      <div
        key={match.id}
        className={`bg-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a] ${
          isCompleted ? "opacity-80" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Teams */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className={`font-medium ${isCompleted && match.home_score! > match.away_score! ? "text-green-400" : ""}`}>
                {match.home_team?.name || "TBD"}
              </span>
              {isCompleted && (
                <span className="text-xl font-bold text-red-500">
                  {match.home_score}
                </span>
              )}
            </div>
            <div className="text-gray-500 text-sm my-1">vs</div>
            <div className="flex items-center gap-3">
              <span className={`font-medium ${isCompleted && match.away_score! > match.home_score! ? "text-green-400" : ""}`}>
                {match.away_team?.name || "TBD"}
              </span>
              {isCompleted && (
                <span className="text-xl font-bold text-red-500">
                  {match.away_score}
                </span>
              )}
            </div>
          </div>

          {/* Match Info */}
          <div className="flex flex-col gap-1 text-sm text-gray-400">
            {match.scheduled_time && (
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{match.scheduled_time}</span>
              </div>
            )}
            {match.location && (
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>{match.location.name}</span>
              </div>
            )}
            {isCompleted && (
              <span className="text-green-500 font-medium">Final</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDateSection = (date: string, matchList: MatchWithTeams[]) => (
    <div key={date} className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={18} className="text-red-500" />
        <h3 className="text-lg font-semibold">
          {format(parseISO(date), "EEEE, MMMM d, yyyy")}
        </h3>
      </div>
      <div className="space-y-3">
        {matchList.map(renderMatchCard)}
      </div>
    </div>
  );

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No matches scheduled for this season.
      </div>
    );
  }

  return (
    <div>
      {/* Upcoming Matches */}
      {upcomingDates.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-red-400 mb-6 pb-2 border-b border-[#3a3a3a]">
            Upcoming Matches
          </h2>
          {upcomingDates.map((date) => renderDateSection(date, matchesByDate[date]))}
        </div>
      )}

      {/* Past Results */}
      {pastDates.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-400 mb-6 pb-2 border-b border-[#3a3a3a]">
            Recent Results
          </h2>
          {pastDates.map((date) => renderDateSection(date, matchesByDate[date]))}
        </div>
      )}
    </div>
  );
}
