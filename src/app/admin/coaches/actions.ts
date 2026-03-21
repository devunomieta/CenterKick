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

export async function addCoach(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get('email') as string;
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;
  const position = formData.get('position') as string;
  const country = formData.get('country') as string;
  const age = parseInt(formData.get('age') as string);
  const agentId = formData.get('agent_id') as string || null;
  const gender = formData.get('gender') as string;
  const league = formData.get('league') as string;

  // 1. Check if user already exists in auth
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  // Generate unique slug
  const slug = await getUniqueSlug(supabase, 'coach', firstName, lastName);

  // 2. Profile Creation (Unlinked enrollment)
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      user_id: existingUser?.id || null,
      email: email,
      role: 'coach',
      first_name: firstName,
      last_name: lastName,
      slug,
      position,
      country,
      age,
      gender,
      league,
      agent_id: agentId,
      status: 'active'
    }]);

  if (profileError) return { success: false, error: profileError.message };

  // 3. Send Registration Email
  await sendEmailNotification(
    email, 
    "Complete your CenterKick Coach Registration", 
    `Hello Coach ${lastName}, an admin has created your professional profile. Use this link to set your password and access your coaching dashboard: ${process.env.NEXT_PUBLIC_SITE_URL}/register?email=${encodeURIComponent(email)}&role=coach`
  );

  revalidatePath('/admin/coaches');
  return { success: true };
}

export async function updateCoach(id: string, data: any) {
  const supabase = await createClient();
  
  if (data.first_name || data.last_name) {
    let fname = data.first_name;
    let lname = data.last_name;
    
    if (!fname || !lname) {
      const { data: current } = await supabase.from('profiles').select('first_name, last_name, role').eq('id', id).single();
      fname = fname || current?.first_name;
      lname = lname || current?.last_name;
      data.slug = await getUniqueSlug(supabase, current?.role || 'coach', fname, lname);
    } else {
       const { data: current } = await supabase.from('profiles').select('role').eq('id', id).single();
       data.slug = await getUniqueSlug(supabase, current?.role || 'coach', fname, lname);
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/coaches');
  return { success: true };
}

export async function deleteCoach(id: string) {
  const supabase = await createClient();
  
  // Get profile to check for linked user
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('id', id)
    .single();

  if (profile?.user_id) {
    // Deleting from 'users' cascades to 'profiles'
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', profile.user_id);
    if (error) return { success: false, error: error.message };
  } else {
    // Just delete the unlinked profile
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/admin/coaches');
  return { success: true };
}
