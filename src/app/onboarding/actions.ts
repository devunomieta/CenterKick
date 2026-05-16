'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function saveDraftOnboarding(formData: Partial<{
  role: string;
  fullName: string;
  phone: string;
  dob: string;
  country: string;
  step: number;
}>) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    if (formData.role) {
      await adminClient
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

      await adminClient
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...(firstName && { first_name: firstName }),
          ...(lastName && { last_name: lastName }),
          ...(formData.phone && { phone_number: formData.phone }),
          ...(formData.dob && { date_of_birth: formData.dob }),
          ...(formData.country && { country: formData.country }),
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
  paymentMethod?: string;
  proofName?: string;
  proofEmail?: string;
  proofFileName?: string;
}) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { 
    role, fullName, phone, dob, country, 
    paymentReference, paymentMethod, proofName, 
    proofEmail, proofFileName 
  } = formData;
  
  const names = fullName.split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';

  try {
    // 1. Fetch dynamic amount from settings
    const { data: settings } = await supabase
      .from('site_content')
      .select('content')
      .eq('page', 'settings')
      .eq('section', 'payment')
      .single();

    const plans = settings?.content?.plans || {};
    const amount = Number(plans[role]?.amount || 15000);

    // 2. Update user record in users table
    const { error: userError } = await adminClient
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

    // 3. Create/Update profile record in profiles table
    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone, 
        date_of_birth: dob,
        country: country, 
        status: 'pending', 
        verification_requested: true
      });

    if (profileError) {
      console.error('Error upserting profile:', profileError);
      return { success: false, error: profileError.message };
    }

    // 4. Log the payment reference in transactions
    const { error: transError } = await adminClient
       .from('transactions')
       .insert({
          user_id: user.id,
          amount: amount,
          type: 'subscription',
          status: 'pending',
          reference: paymentReference,
          description: paymentMethod === 'bank' 
            ? `Bank Settlement: ${proofName} (${proofEmail}) - File: ${proofFileName || 'None'}`
            : `Onboarding subscription for ${role}`
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
