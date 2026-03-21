'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendEmailNotification } from '../notifications/actions';

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

  // Calculate age from DOB
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }

  // 1. Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  // 2. Profile Creation (Unlinked enrollment)
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      user_id: existingUser?.id || null,
      email: email,
      first_name: firstName,
      last_name: lastName,
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

  // 3. Send Registration Email
  await sendEmailNotification(
    email, 
    "Welcome to CenterKick - Your Profile is Ready", 
    `Hello ${firstName}, an admin has enrolled you in CenterKick. Click here to complete your registration and access your dashboard: https://centerkick.com/register?email=${encodeURIComponent(email)}`
  );

  revalidatePath('/admin/players');
  return { success: true };
}

export async function updatePlayer(id: string, data: any) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('user_id', id);

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
