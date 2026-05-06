'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

async function uploadTournamentLogo(file: File | null) {
  if (!file || file.size === 0) return null;

  const MAX_SIZE = 4 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (file.size > MAX_SIZE) throw new Error('File is too large. Max 4MB allowed.');
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Only JPG and PNG images are allowed');

  const supabase = await createClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const optimizedBuffer = await sharp(buffer)
    .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
  const filePath = `tournaments/${fileName}`;

  const { error } = await supabase.storage
    .from('site-assets')
    .upload(filePath, optimizedBuffer, { contentType: 'image/webp', upsert: true });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabase.storage
    .from('site-assets')
    .getPublicUrl(filePath);

  return publicUrl;
}


export async function createTournament(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const description = formData.get('description') as string;
  const start_date = formData.get('start_date') as string;
  const end_date = formData.get('end_date') as string;
  const logoFile = formData.get('logo') as File | null;
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  let logo_url = null;
  try {
    logo_url = await uploadTournamentLogo(logoFile);
  } catch (err: any) {
    return { error: err.message };
  }

  const { data, error } = await supabase
    .from('tournaments')
    .insert([{
      name,
      slug,
      type,
      description,
      logo_url,
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
  const logoFile = formData.get('logo') as File | null;

  let logo_url = formData.get('current_logo_url') as string | null;
  
  if (logoFile && logoFile.size > 0) {
    try {
      logo_url = await uploadTournamentLogo(logoFile);
    } catch (err: any) {
      return { error: err.message };
    }
  }

  const { error } = await supabase
    .from('tournaments')
    .update({
      name,
      description,
      logo_url,
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

async function uploadTeamLogo(file: File | null) {
  if (!file || file.size === 0) return null;

  const MAX_SIZE = 4 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (file.size > MAX_SIZE) throw new Error('File is too large. Max 4MB allowed.');
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Only JPG and PNG images are allowed');

  const supabase = await createClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const optimizedBuffer = await sharp(buffer)
    .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
  const filePath = `teams/${fileName}`;

  const { error } = await supabase.storage
    .from('site-assets')
    .upload(filePath, optimizedBuffer, { contentType: 'image/webp', upsert: true });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabase.storage
    .from('site-assets')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function addTeam(tournamentId: string, formData: FormData) {
  const supabase = await createClient();
  const team_name = formData.get('team_name') as string;
  const logoFile = formData.get('team_logo') as File | null;

  let team_logo_url = null;
  if (logoFile && logoFile.size > 0) {
    try {
      team_logo_url = await uploadTeamLogo(logoFile);
    } catch (err: any) {
      return { error: err.message };
    }
  }

  const { error } = await supabase
    .from('tournament_teams')
    .insert([{ tournament_id: tournamentId, team_name, team_logo_url }]);

  if (error) return { error: error.message };

  revalidatePath(`/admin/tournaments/${tournamentId}`);
  return { success: true };
}

export async function getTeamRoster(teamId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*, users:user_id(role)')
    .eq('tournament_team_id', teamId);

  if (error) {
    console.error('Error fetching team roster:', error);
    return [];
  }
  return data || [];
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
