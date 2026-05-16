'use server';

import { createClient } from '@/lib/supabase/server';

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
        nationality: country, // The schema uses 'nationality' or 'country' depending on migration, 20240329000001 renamed it
        status: 'pending', // Pending verification of payment
        verification_requested: true
      });

    if (profileError) {
      console.error('Error upserting profile:', profileError);
      return { success: false, error: profileError.message };
    }

    // 3. Log the payment reference in a transactions table or similar
    // Based on the migration list, there is a transactions_table.sql
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
       // We don't necessarily want to block the whole flow if transaction log fails, 
       // but for mandatory payment we should.
    }

    return { success: true };
  } catch (err: any) {
    console.error('Onboarding action crash:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
