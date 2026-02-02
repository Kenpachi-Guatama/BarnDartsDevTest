export interface Season {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  season_id: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  season_id: string;
  home_team_id: string;
  away_team_id: string;
  location_id: string | null;
  scheduled_date: string;
  scheduled_time: string | null;
  home_score: number | null;
  away_score: number | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields (optional)
  home_team?: Team;
  away_team?: Team;
  location?: Location | null;
  season?: Season;
}

export interface News {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface TeamStanding {
  id: string;
  name: string;
  season_id: string;
  season_name: string;
  played: number;
  wins: number;
  losses: number;
  ties: number;
  points_for: number;
  points_against: number;
  // Calculated fields
  points?: number;
  pct?: number;
  diff?: number;
  streak?: string;
}

export interface MatchWithTeams extends Match {
  home_team: Team;
  away_team: Team;
  location: Location | null;
}
