import { createClient } from "./supabase";
import type { Season, Team, Match, News, Document, TeamStanding, Location, MatchWithTeams } from "@/types";

// Mock data for development when Supabase is not configured
const MOCK_STANDINGS: TeamStanding[] = [
  { id: "1", name: "Tyler the Tyrant", season_id: "s1", season_name: "Season 05", played: 9, wins: 8, losses: 1, ties: 0, points_for: 23, points_against: 4 },
  { id: "2", name: "Syd the Kyd", season_id: "s1", season_name: "Season 05", played: 9, wins: 7, losses: 2, ties: 0, points_for: 20, points_against: 7 },
  { id: "3", name: "King James", season_id: "s1", season_name: "Season 05", played: 10, wins: 7, losses: 3, ties: 0, points_for: 19, points_against: 11 },
  { id: "4", name: "Jay Rod", season_id: "s1", season_name: "Season 05", played: 10, wins: 6, losses: 4, ties: 0, points_for: 19, points_against: 11 },
  { id: "5", name: "Enrico Littlehands", season_id: "s1", season_name: "Season 05", played: 9, wins: 6, losses: 3, ties: 0, points_for: 18, points_against: 9 },
  { id: "6", name: "The Dartfather", season_id: "s1", season_name: "Season 05", played: 10, wins: 6, losses: 4, ties: 0, points_for: 17, points_against: 13 },
  { id: "7", name: "Kaba You", season_id: "s1", season_name: "Season 05", played: 10, wins: 5, losses: 5, ties: 0, points_for: 17, points_against: 13 },
  { id: "8", name: "Bills Mets", season_id: "s1", season_name: "Season 05", played: 10, wins: 4, losses: 6, ties: 0, points_for: 10, points_against: 20 },
  { id: "9", name: "Huyen Wins", season_id: "s1", season_name: "Season 05", played: 9, wins: 1, losses: 8, ties: 0, points_for: 2, points_against: 25 },
  { id: "10", name: "Master Matt", season_id: "s1", season_name: "Season 05", played: 9, wins: 0, losses: 9, ties: 0, points_for: 4, points_against: 23 },
  { id: "11", name: "Marquess Marquies", season_id: "s1", season_name: "Season 05", played: 5, wins: 0, losses: 5, ties: 0, points_for: 1, points_against: 14 },
  { id: "12", name: "Silly Shellito", season_id: "s1", season_name: "Season 05", played: 0, wins: 0, losses: 0, ties: 0, points_for: 0, points_against: 0 },
];

const MOCK_SEASONS: Season[] = [
  { id: "s1", name: "Season 05", start_date: "2025-01-01", end_date: "2025-04-30", is_active: true, created_at: "", updated_at: "" },
  { id: "s2", name: "Season 04", start_date: "2024-09-01", end_date: "2024-12-31", is_active: false, created_at: "", updated_at: "" },
];

const MOCK_NEWS: News[] = [
  {
    id: "n1",
    title: "Season 05 Playoffs Announced!",
    content: "The playoffs for Season 05 will begin on May 1st. Top 8 players will compete in a single-elimination tournament. Good luck to all participants!",
    is_published: true,
    published_at: "2025-04-15T10:00:00Z",
    created_at: "",
    updated_at: "",
  },
  {
    id: "n2",
    title: "New Location Added",
    content: "We've added a new venue for our matches - The Viking Hall. Check the schedule for upcoming matches at this location.",
    is_published: true,
    published_at: "2025-03-20T14:30:00Z",
    created_at: "",
    updated_at: "",
  },
  {
    id: "n3",
    title: "Welcome to Season 05",
    content: "A new season is upon us! We have 12 players competing this season. May the best dart thrower win!",
    is_published: true,
    published_at: "2025-01-05T09:00:00Z",
    created_at: "",
    updated_at: "",
  },
];

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "d1",
    title: "League Rules & Regulations",
    description: "Official rules and regulations for the King Family Dart League",
    file_url: "#",
    file_name: "league-rules.pdf",
    file_size: 245000,
    is_published: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "",
  },
  {
    id: "d2",
    title: "Season 05 Schedule",
    description: "Complete schedule for all Season 05 matches",
    file_url: "#",
    file_name: "season-05-schedule.pdf",
    file_size: 128000,
    is_published: true,
    created_at: "2025-01-02T00:00:00Z",
    updated_at: "",
  },
];

const MOCK_MATCHES: MatchWithTeams[] = [
  {
    id: "m1",
    season_id: "s1",
    home_team_id: "1",
    away_team_id: "2",
    location_id: "l1",
    scheduled_date: "2025-04-27",
    scheduled_time: "19:00",
    home_score: 2,
    away_score: 1,
    is_completed: true,
    created_at: "",
    updated_at: "",
    home_team: { id: "1", name: "Tyler the Tyrant", season_id: "s1", created_at: "", updated_at: "" },
    away_team: { id: "2", name: "Syd the Kyd", season_id: "s1", created_at: "", updated_at: "" },
    location: { id: "l1", name: "The Viking Hall", address: "123 Main St", created_at: "", updated_at: "" },
  },
  {
    id: "m2",
    season_id: "s1",
    home_team_id: "3",
    away_team_id: "4",
    location_id: "l1",
    scheduled_date: "2025-04-27",
    scheduled_time: "20:00",
    home_score: 2,
    away_score: 1,
    is_completed: true,
    created_at: "",
    updated_at: "",
    home_team: { id: "3", name: "King James", season_id: "s1", created_at: "", updated_at: "" },
    away_team: { id: "4", name: "Jay Rod", season_id: "s1", created_at: "", updated_at: "" },
    location: { id: "l1", name: "The Viking Hall", address: "123 Main St", created_at: "", updated_at: "" },
  },
  {
    id: "m3",
    season_id: "s1",
    home_team_id: "5",
    away_team_id: "6",
    location_id: "l1",
    scheduled_date: "2025-05-04",
    scheduled_time: "19:00",
    home_score: null,
    away_score: null,
    is_completed: false,
    created_at: "",
    updated_at: "",
    home_team: { id: "5", name: "Enrico Littlehands", season_id: "s1", created_at: "", updated_at: "" },
    away_team: { id: "6", name: "The Dartfather", season_id: "s1", created_at: "", updated_at: "" },
    location: { id: "l1", name: "The Viking Hall", address: "123 Main St", created_at: "", updated_at: "" },
  },
];

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  );
}

export async function getSeasons(): Promise<Season[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_SEASONS;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching seasons:", error);
    return MOCK_SEASONS;
  }

  return data || [];
}

export async function getActiveSeason(): Promise<Season | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_SEASONS.find((s) => s.is_active) || MOCK_SEASONS[0];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching active season:", error);
    return null;
  }

  return data;
}

export async function getStandings(seasonId?: string): Promise<TeamStanding[]> {
  if (!isSupabaseConfigured()) {
    const standings = MOCK_STANDINGS.map((s) => ({
      ...s,
      points: s.points_for,
      pct: s.played > 0 ? s.wins / s.played : 0,
      diff: s.points_for - s.points_against,
    }));
    return standings.sort((a, b) => (b.points || 0) - (a.points || 0));
  }

  const supabase = createClient();
  let query = supabase.from("team_standings").select("*");

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching standings:", error);
    return [];
  }

  // Calculate additional fields and sort
  const standings = (data || []).map((s: TeamStanding) => ({
    ...s,
    points: s.points_for,
    pct: s.played > 0 ? s.wins / s.played : 0,
    diff: s.points_for - s.points_against,
  }));

  return standings.sort((a, b) => (b.points || 0) - (a.points || 0));
}

export async function getSchedule(seasonId?: string): Promise<MatchWithTeams[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_MATCHES;
  }

  const supabase = createClient();
  let query = supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(*),
      away_team:teams!matches_away_team_id_fkey(*),
      location:locations(*)
    `)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching schedule:", error);
    return [];
  }

  return data || [];
}

export async function getNews(): Promise<News[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_NEWS;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }

  return data || [];
}

export async function getDocuments(): Promise<Document[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_DOCUMENTS;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  }

  return data || [];
}

export async function getTeams(seasonId?: string): Promise<Team[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_STANDINGS.map((s) => ({
      id: s.id,
      name: s.name,
      season_id: s.season_id,
      created_at: "",
      updated_at: "",
    }));
  }

  const supabase = createClient();
  let query = supabase.from("teams").select("*").order("name");

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching teams:", error);
    return [];
  }

  return data || [];
}

export async function getLocations(): Promise<Location[]> {
  if (!isSupabaseConfigured()) {
    return [{ id: "l1", name: "The Viking Hall", address: "123 Main St", created_at: "", updated_at: "" }];
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }

  return data || [];
}
