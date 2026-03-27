'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch user role and status to determine redirect and access
  const { data: userRecord } = await supabase
    .from('users')
    .select('role, is_active')
    .eq('id', data.user.id)
    .single();

  if (userRecord && !userRecord.is_active) {
    await supabase.auth.signOut();
    return { error: 'Your account is currently inactive. Please contact an administrator.' };
  }

  const role = userRecord?.role || 'player';
  
  // Custom redirects based on role
  let redirectPath = '/dashboard';
  if (role === 'superadmin' || role === 'admin') {
    redirectPath = '/admin';
  } else if (['blogger', 'operations', 'finance'].includes(role)) {
    redirectPath = '/admin'; // Staff roles also go to admin overview
  }

  revalidatePath('/', 'layout');
  redirect(redirectPath);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Check your email for the confirmation link.' };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
