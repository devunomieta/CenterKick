'use server';

import { createClient } from '@/lib/supabase/server';

export async function saveGoogleOnboarding(formData: {
  role: string;
  fullName: string;
  phone: string;
  dob: string;
  country: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { role, fullName, phone, dob, country } = formData;
  const names = fullName.split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';

  try {
    // 1. Create/Update user record in users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        role: role,
        is_active: true
      });

    if (userError) {
      console.error('Error upserting user:', userError);
      return { success: false, error: userError.message };
    }

    // 2. Create/Update profile record in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        role: role,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        dob: dob,
        country: country,
        status: 'pending'
      });

    if (profileError) {
      console.error('Error upserting profile:', profileError);
      return { success: false, error: profileError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Onboarding action crash:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
