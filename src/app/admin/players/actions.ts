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
  const age = parseInt(formData.get('age') as string);
  const gender = formData.get('gender') as string;
  const foot = formData.get('foot') as string;
  const agentId = formData.get('agent_id') as string || null;

  // 1. Create User (Simplified for admin-add, usually you'd use auth.admin.createUser)
  // For now, we'll focus on the profile creation if the user exists or handle as invitation
  // Note: auth.admin requires service_role which is not recommended in basic server components
  
  // 2. Profile Creation/Update
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([{ email, role: 'player' }])
    .select()
    .single();

  if (userError) return { success: false, error: userError.message };

  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      user_id: userData.id,
      first_name: firstName,
      last_name: lastName,
      position,
      country,
      age,
      gender,
      foot,
      agent_id: agentId,
      status: 'active'
    }]);

  if (profileError) return { success: false, error: profileError.message };

  // 3. Send Registration Email
  await sendEmailNotification(
    email, 
    "Complete your CenterKick Registration", 
    `Hello ${firstName}, an admin has created your expert profile. Use this link to set your password and access your dashboard: https://centerkick.com/complete-registration?id=${userData.id}`
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
