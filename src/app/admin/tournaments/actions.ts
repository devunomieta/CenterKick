'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createTournament(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const description = formData.get('description') as string;
  const start_date = formData.get('start_date') as string;
  const end_date = formData.get('end_date') as string;
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('tournaments')
    .insert([{
      name,
      slug,
      type,
      description,
      start_date: start_date || null,
      end_date: end_date || null,
      is_active: true
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating tournament:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/tournaments');
  return { success: true, data };
}

export async function updateTournament(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const start_date = formData.get('start_date') as string;
  const end_date = formData.get('end_date') as string;
  const is_active = formData.get('is_active') === 'true';

  const { error } = await supabase
    .from('tournaments')
    .update({
      name,
      description,
      start_date: start_date || null,
      end_date: end_date || null,
      is_active,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/tournaments/${id}`);
  revalidatePath('/admin/tournaments');
  return { success: true };
}

export async function deleteTournament(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/admin/tournaments');
  return { success: true };
}

export async function addTeam(tournamentId: string, formData: FormData) {
  const supabase = await createClient();
  const team_name = formData.get('team_name') as string;

  const { error } = await supabase
    .from('tournament_teams')
    .insert([{ tournament_id: tournamentId, team_name }]);

  if (error) return { error: error.message };

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  return { success: true };
}

export async function removeTeam(id: string, tournamentId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tournament_teams')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  return { success: true };
}

export async function addFixture(tournamentId: string, formData: FormData) {
  const supabase = await createClient();
  const home_team_id = formData.get('home_team_id') as string;
  const away_team_id = formData.get('away_team_id') as string;
  const match_date = formData.get('match_date') as string;
  const venue = formData.get('venue') as string;
  const round = formData.get('round') as string;

  const { error } = await supabase
    .from('fixtures')
    .insert([{
      tournament_id: tournamentId,
      home_team_id,
      away_team_id,
      match_date,
      venue,
      round,
      status: 'scheduled'
    }]);

  if (error) return { error: error.message };

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  return { success: true };
}

export async function updateFixture(id: string, tournamentId: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('fixtures')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  return { success: true };
}

export async function deleteFixture(id: string, tournamentId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('fixtures')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  return { success: true };
}

export async function recordMatchEvent(fixtureId: string, tournamentId: string, eventData: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('match_events')
    .insert([{ fixture_id: fixtureId, ...eventData }]);

  if (error) return { error: error.message };

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  return { success: true };
}
