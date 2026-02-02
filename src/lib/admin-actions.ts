"use server";

import { createServerSupabaseClient } from "./supabase-server";
import { revalidatePath } from "next/cache";

// ============================================
// SEASONS
// ============================================

export async function createSeason(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string | null;
  const is_active = formData.get("is_active") === "true";

  // If setting this season as active, deactivate others
  if (is_active) {
    await supabase.from("seasons").update({ is_active: false }).neq("id", "");
  }

  const { error } = await supabase.from("seasons").insert({
    name,
    start_date,
    end_date: end_date || null,
    is_active,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/seasons");
  revalidatePath("/");
}

export async function updateSeason(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string | null;
  const is_active = formData.get("is_active") === "true";

  // If setting this season as active, deactivate others
  if (is_active) {
    await supabase.from("seasons").update({ is_active: false }).neq("id", id);
  }

  const { error } = await supabase
    .from("seasons")
    .update({
      name,
      start_date,
      end_date: end_date || null,
      is_active,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/seasons");
  revalidatePath("/");
}

export async function deleteSeason(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("seasons").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/seasons");
  revalidatePath("/");
}

// ============================================
// TEAMS
// ============================================

export async function createTeam(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const season_id = formData.get("season_id") as string;

  const { error } = await supabase.from("teams").insert({
    name,
    season_id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/teams");
  revalidatePath("/");
}

export async function updateTeam(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const season_id = formData.get("season_id") as string;

  const { error } = await supabase
    .from("teams")
    .update({ name, season_id })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/teams");
  revalidatePath("/");
}

export async function deleteTeam(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("teams").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/teams");
  revalidatePath("/");
}

// ============================================
// LOCATIONS
// ============================================

export async function createLocation(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const address = formData.get("address") as string | null;

  const { error } = await supabase.from("locations").insert({
    name,
    address: address || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/locations");
}

export async function updateLocation(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const address = formData.get("address") as string | null;

  const { error } = await supabase
    .from("locations")
    .update({ name, address: address || null })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/locations");
}

export async function deleteLocation(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("locations").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/locations");
}

// ============================================
// MATCHES
// ============================================

export async function createMatch(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const season_id = formData.get("season_id") as string;
  const home_team_id = formData.get("home_team_id") as string;
  const away_team_id = formData.get("away_team_id") as string;
  const location_id = formData.get("location_id") as string | null;
  const scheduled_date = formData.get("scheduled_date") as string;
  const scheduled_time = formData.get("scheduled_time") as string | null;

  const { error } = await supabase.from("matches").insert({
    season_id,
    home_team_id,
    away_team_id,
    location_id: location_id || null,
    scheduled_date,
    scheduled_time: scheduled_time || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/matches");
  revalidatePath("/schedule");
}

export async function updateMatch(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const season_id = formData.get("season_id") as string;
  const home_team_id = formData.get("home_team_id") as string;
  const away_team_id = formData.get("away_team_id") as string;
  const location_id = formData.get("location_id") as string | null;
  const scheduled_date = formData.get("scheduled_date") as string;
  const scheduled_time = formData.get("scheduled_time") as string | null;
  const home_score = formData.get("home_score");
  const away_score = formData.get("away_score");
  const is_completed = formData.get("is_completed") === "true";

  const { error } = await supabase
    .from("matches")
    .update({
      season_id,
      home_team_id,
      away_team_id,
      location_id: location_id || null,
      scheduled_date,
      scheduled_time: scheduled_time || null,
      home_score: home_score ? parseInt(home_score as string) : null,
      away_score: away_score ? parseInt(away_score as string) : null,
      is_completed,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/matches");
  revalidatePath("/schedule");
  revalidatePath("/");
}

export async function deleteMatch(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("matches").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/matches");
  revalidatePath("/schedule");
  revalidatePath("/");
}

// ============================================
// NEWS
// ============================================

export async function createNews(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const is_published = formData.get("is_published") === "true";

  const { error } = await supabase.from("news").insert({
    title,
    content,
    is_published,
    published_at: is_published ? new Date().toISOString() : null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const is_published = formData.get("is_published") === "true";

  // Get current state to check if we're publishing for the first time
  const { data: current } = await supabase
    .from("news")
    .select("is_published, published_at")
    .eq("id", id)
    .single();

  const published_at =
    is_published && !current?.is_published
      ? new Date().toISOString()
      : current?.published_at;

  const { error } = await supabase
    .from("news")
    .update({
      title,
      content,
      is_published,
      published_at,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function deleteNews(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/news");
  revalidatePath("/news");
}

// ============================================
// DOCUMENTS
// ============================================

export async function createDocument(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const file_url = formData.get("file_url") as string;
  const file_name = formData.get("file_name") as string;
  const file_size = formData.get("file_size");
  const is_published = formData.get("is_published") === "true";

  const { error } = await supabase.from("documents").insert({
    title,
    description: description || null,
    file_url,
    file_name,
    file_size: file_size ? parseInt(file_size as string) : null,
    is_published,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/documents");
  revalidatePath("/docs");
}

export async function updateDocument(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const file_url = formData.get("file_url") as string;
  const file_name = formData.get("file_name") as string;
  const is_published = formData.get("is_published") === "true";

  const { error } = await supabase
    .from("documents")
    .update({
      title,
      description: description || null,
      file_url,
      file_name,
      is_published,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/documents");
  revalidatePath("/docs");
}

export async function deleteDocument(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/documents");
  revalidatePath("/docs");
}
