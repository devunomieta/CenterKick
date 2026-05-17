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
    const { data: existingProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching existing profiles for Google onboarding:', fetchError);
      return { success: false, error: fetchError.message };
    }

    if (existingProfiles && existingProfiles.length > 0) {
      const masterProfile = existingProfiles[0];
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          email: user.email,
          role: role,
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          dob: dob,
          country: country,
          status: 'pending'
        })
        .eq('id', masterProfile.id);

      if (profileError) {
        console.error('Error updating master Google profile:', profileError);
        return { success: false, error: profileError.message };
      }

      // Clean up duplicates
      if (existingProfiles.length > 1) {
        const dupIds = existingProfiles.slice(1).map(p => p.id);
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .in('id', dupIds);
        
        if (deleteError) {
          console.error('Error cleaning up duplicate Google profiles:', deleteError);
        }
      }
    } else {
      // Insert new profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
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
        console.error('Error inserting Google profile:', profileError);
        return { success: false, error: profileError.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Onboarding action crash:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
