'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getTournaments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tournaments')
    .select('id, name')
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching tournaments:', error);
    return [];
  }
  return data || [];
}

export async function getTournamentTeams(tournamentId: string) {
  if (!tournamentId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tournament_teams')
    .select('id, team_name, team_logo_url')
    .eq('tournament_id', tournamentId);
  
  if (error) {
    console.error('Error fetching tournament teams:', error);
    return [];
  }
  return data || [];
}

export async function completeRegistration(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const role = formData.get('role') as string;
  const phone = formData.get('phone') as string;
  const dob = formData.get('dob') as string;
  const tournamentId = formData.get('tournament_id') as string;
  const tournamentTeamId = formData.get('tournament_team_id') as string;

  const names = fullName.split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';

  // 1. Sign up the user with metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
        role: role,
        country: role === 'athlete' ? formData.get('country') || '' : '',
        dob: dob,
        tournament_id: tournamentId || '',
        tournament_team_id: tournamentTeamId || ''
      }
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // Redirect to success page to explain the "Under Review" status
  redirect('/register/success');
}
