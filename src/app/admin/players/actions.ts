'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendEmailNotification } from '../notifications/actions';
import { generateBaseSlug, generateRandomSuffix } from '@/lib/utils/slug';

async function getUniqueSlug(supabase: any, role: string, firstName: string, lastName: string) {
  const baseSlug = generateBaseSlug(role, firstName, lastName);
  
  // Check if slug exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('slug')
    .eq('slug', baseSlug)
    .maybeSingle();

  if (!existing) return baseSlug;

  // If exists, add random suffix
  return `${baseSlug}-${generateRandomSuffix()}`;
}

export async function addPlayer(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get('email') as string;
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const position = formData.get('position') as string;
  const country = formData.get('country') as string;
  const dob = formData.get('date_of_birth') as string; // YYYY-MM-DD
  const gender = formData.get('gender') as string;
  const foot = formData.get('foot') as string;
  const agentId = formData.get('agent_id') as string || null;

  // 1. Check if user already exists in auth (via users table)
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  // 2. Check if a prospect profile already exists for this email
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, user_id')
    .eq('email', email)
    .maybeSingle();

  if (existingProfile) {
    if (existingProfile.user_id) {
       return { success: false, error: "This email is already registered as a member." };
    } else {
       return { success: false, error: "This athlete is already enrolled as a prospect." };
    }
  }

  // Generate unique slug
  const slug = await getUniqueSlug(supabase, 'player', firstName, lastName);

  // 3. Profile Creation (Unlinked enrollment)
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      user_id: existingUser?.id || null,
      email: email,
      role: 'player',
      first_name: firstName,
      last_name: lastName,
      slug,
      position,
      country,
      date_of_birth: dob,
      gender,
      foot,
      agent_id: agentId,
      agent_status: agentId ? 'pending' : 'accepted',
      status: 'active'
    }]);

  if (profileError) return { success: false, error: profileError.message };

  // 4. Send Registration Email
  await sendEmailNotification(
    email, 
    "Welcome to CenterKick - Your Profile is Ready", 
    `Hello ${firstName}, an admin has enrolled you in CenterKick. Click here to complete your registration and access your dashboard: ${process.env.NEXT_PUBLIC_SITE_URL}/register?email=${encodeURIComponent(email)}&role=player`
  );

  revalidatePath('/admin/players');
  return { success: true };
}

export async function updatePlayer(id: string, data: any) {
  const supabase = await createClient();
  
  // If first_name or last_name is updated, recalculate slug if it's missing or if we want to enforce new format
  if (data.first_name || data.last_name) {
    // Get current names if only one is provided
    let fname = data.first_name;
    let lname = data.last_name;
    
    if (!fname || !lname) {
      const { data: current } = await supabase.from('profiles').select('first_name, last_name, role').eq('id', id).single();
      fname = fname || current?.first_name;
      lname = lname || current?.last_name;
      data.slug = await getUniqueSlug(supabase, current?.role || 'player', fname, lname);
    } else {
       const { data: current } = await supabase.from('profiles').select('role').eq('id', id).single();
       data.slug = await getUniqueSlug(supabase, current?.role || 'player', fname, lname);
    }
  }
  
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/players');
  return { success: true };
}

export async function deletePlayer(id: string) {
  const supabase = await createClient();
  
  // Note: Deleting from 'users' will cascade if foreign keys are set correctly
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/players');
  return { success: true };
}

export async function getPlayerTransactions(profileId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', profileId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function getPendingEdits(profileId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profile_edits')
    .select('*')
    .eq('profile_id', profileId)
    .eq('status', 'pending');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function processProfileEdit(editId: string, action: 'approve' | 'reject') {
  const supabase = await createClient();
  
  if (action === 'reject') {
    const { error } = await supabase
      .from('profile_edits')
      .update({ status: 'rejected' })
      .eq('id', editId);
    
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // Approve: 1. Get the edit details
  const { data: edit, error: fetchError } = await supabase
    .from('profile_edits')
    .select('*')
    .eq('id', editId)
    .single();
  
  if (fetchError || !edit) return { success: false, error: fetchError?.message || 'Edit not found' };

  // 2. Update the profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ [edit.field_name]: edit.new_value })
    .eq('id', edit.profile_id);
  
  if (updateError) return { success: false, error: updateError.message };

  // 3. Mark edit as approved
  const { error: statusError } = await supabase
    .from('profile_edits')
    .update({ status: 'approved' })
    .eq('id', editId);
  
  if (statusError) return { success: false, error: statusError.message };

  revalidatePath('/admin/players');
  return { success: true };
}

export async function getPlayerStats(playerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('player_career_stats')
    .select('*')
    .eq('player_id', playerId)
    .order('season', { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function addPlayerStat(data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('player_career_stats')
    .insert([data]);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/players');
  return { success: true };
}

export async function updatePlayerStat(id: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('player_career_stats')
    .update(data)
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/players');
  return { success: true };
}

export async function deletePlayerStat(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('player_career_stats')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/players');
  return { success: true };
}

export async function getPlayerTransfers(playerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('player_transfer_history')
    .select('*')
    .eq('player_id', playerId)
    .order('transfer_date', { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function addPlayerTransfer(data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('player_transfer_history')
    .insert([data]);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/players');
  return { success: true };
}

export async function updatePlayerTransfer(id: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('player_transfer_history')
    .update(data)
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/players');
  return { success: true };
}

export async function deletePlayerTransfer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('player_transfer_history')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/players');
  return { success: true };
}
