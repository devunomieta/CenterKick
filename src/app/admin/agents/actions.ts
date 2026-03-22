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

  // 1. Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  // Generate unique slug
  const slug = await getUniqueSlug(supabase, 'agent', firstName, lastName);

  // 2. Profile Creation (Unlinked enrollment)
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      user_id: existingUser?.id || null,
      email: email,
      role: 'agent',
      first_name: firstName,
      last_name: lastName,
      slug,
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
    `Hello ${firstName}, an admin has registered your agency profile on CenterKick. Use this link to set your password and access your dashboard: ${process.env.NEXT_PUBLIC_SITE_URL}/register?email=${encodeURIComponent(email)}&role=agent`
  );

  revalidatePath('/admin/agents');
  return { success: true };
}

export async function updateAgent(id: string, data: any) {
  const supabase = await createClient();
  
  if (data.first_name || data.last_name) {
    let fname = data.first_name;
    let lname = data.last_name;
    
    if (!fname || !lname) {
      const { data: current } = await supabase.from('profiles').select('first_name, last_name, role').eq('id', id).single();
      fname = fname || current?.first_name;
      lname = lname || current?.last_name;
      data.slug = await getUniqueSlug(supabase, current?.role || 'agent', fname, lname);
    } else {
       const { data: current } = await supabase.from('profiles').select('role').eq('id', id).single();
       data.slug = await getUniqueSlug(supabase, current?.role || 'agent', fname, lname);
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/agents');
  return { success: true };
}

export async function deleteAgent(id: string) {
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

  revalidatePath('/admin/agents');
  return { success: true };
}

export async function migrateAllAgentSlugs() {
  const supabase = await createClient();
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role, slug')
    .eq('role', 'agent');

  if (error) return { success: false, error: error.message };
  
  let count = 0;
  for (const profile of (profiles || [])) {
    const newSlug = await getUniqueSlug(supabase, 'agent', profile.first_name, profile.last_name);
    
    // Only update if it's actually different (ignoring case if needed, but getUniqueSlug handles it)
    if (profile.slug !== newSlug) {
      await supabase
        .from('profiles')
        .update({ slug: newSlug })
        .eq('id', profile.id);
      count++;
    }
  }

  revalidatePath('/admin/agents');
  return { success: true, count };
}
