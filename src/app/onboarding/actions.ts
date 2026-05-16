'use server';

import { createClient } from '@/lib/supabase/server';

export async function saveDraftOnboarding(formData: Partial<{
  role: string;
  fullName: string;
  phone: string;
  dob: string;
  country: string;
  step: number;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    if (formData.role) {
      await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          role: formData.role as any
        });
    }

    if (formData.fullName || formData.phone || formData.dob || formData.country) {
      const names = formData.fullName?.split(' ') || [];
      const firstName = names[0] || undefined;
      const lastName = names.slice(1).join(' ') || undefined;

      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...(firstName && { first_name: firstName }),
          ...(lastName && { last_name: lastName }),
          ...(formData.phone && { phone: formData.phone }),
          ...(formData.dob && { date_of_birth: formData.dob }),
          ...(formData.country && { nationality: formData.country }),
          status: 'pending' // Keep it pending during draft
        });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Draft save error:', err);
    return { success: false };
  }
}

export async function saveOnboarding(formData: {
  role: string;
  fullName: string;
  phone: string;
  dob: string;
  country: string;
  paymentReference: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { role, fullName, phone, dob, country, paymentReference } = formData;
  const names = fullName.split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';

  try {
    // 1. Update user record in users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        role: role as any,
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
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        date_of_birth: dob,
        nationality: country, 
        status: 'pending', 
        verification_requested: true
      });

    if (profileError) {
      console.error('Error upserting profile:', profileError);
      return { success: false, error: profileError.message };
    }

    // 3. Log the payment reference
    const { error: transError } = await supabase
       .from('transactions')
       .insert({
          user_id: user.id,
          amount: 15000,
          type: 'subscription',
          status: 'pending',
          reference: paymentReference,
          description: `Onboarding subscription for ${role}`
       });

    if (transError) {
       console.error('Error logging transaction:', transError);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Onboarding action crash:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
