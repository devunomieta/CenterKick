'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendEmailNotification } from '../notifications/actions';

export async function addAgent(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get('email') as string;
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const agencyName = formData.get('agency_name') as string;
  const country = formData.get('country') as string;
  const licenseCode = formData.get('license_code') as string;
  const gender = formData.get('gender') as string;
  const age = parseInt(formData.get('age') as string);

  // 1. Create User
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([{ email, role: 'agent' }])
    .select()
    .single();

  if (userError) return { success: false, error: userError.message };

  // 2. Profile Creation
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      user_id: userData.id,
      first_name: firstName,
      last_name: lastName,
      agency_name: agencyName,
      country,
      license_code: licenseCode,
      gender,
      age,
      status: 'active'
    }]);

  if (profileError) return { success: false, error: profileError.message };

  // 3. Send Registration Email
  await sendEmailNotification(
    email, 
    "Complete your CenterKick Agent Registration", 
    `Hello ${firstName}, an admin has registered your agency profile. Use this link to set your password and access your dashboard: https://centerkick.com/complete-registration?id=${userData.id}`
  );

  revalidatePath('/admin/agents');
  return { success: true };
}

export async function updateAgent(id: string, data: any) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('user_id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/agents');
  return { success: true };
}

export async function deleteAgent(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/agents');
  return { success: true };
}
