'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function requestVerification(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const paymentReference = formData.get('payment_reference') as string;

  if (!paymentReference) {
    return { error: 'Payment reference is required' };
  }

  // Fetch the profile id and role to create the transaction
  const { data: profile, error: profileFetchError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (profileFetchError || !profile) {
    return { error: 'Profile not found' };
  }

  // Fetch dynamic amount from pricing_plans
  const { data: plan } = await supabase
    .from('pricing_plans')
    .select('amount')
    .eq('role', profile.role)
    .eq('is_active', true)
    .single();

  const amount = plan ? Number(plan.amount) : 15000;

  const { error } = await supabase
    .from('profiles')
    .update({
      verification_requested: true,
      payment_reference: paymentReference,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id);

  if (error) {
    console.error('Error requesting verification:', error);
    return { error: error.message };
  }

  // Log the payment reference in transactions as well
  const adminClient = createAdminClient();
  const { error: transError } = await adminClient
     .from('transactions')
     .insert({
        user_id: profile.id, // Using correct profiles.id reference
        amount: amount,
        currency: 'NGN',
        status: 'pending',
        reference: paymentReference,
        method: 'direct_transfer',
        metadata: {
           type: 'subscription',
           description: `Billing Claim: Onboarding subscription for ${profile.role}`
        }
     });

  if (transError) {
     console.error('Error logging transaction:', transError);
  }

  revalidatePath('/dashboard/subscription');
  return { success: true };
}

export async function getUserTransactions() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    return { transactions: [] };
  }

  const adminClient = createAdminClient();
  const { data: transactions, error } = await adminClient
    .from('transactions')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user transactions:', error);
    return { error: error.message };
  }

  return { transactions: transactions || [] };
}

export async function getPricingPlan(role: string) {
  const supabase = await createClient();
  const { data: plan, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('role', role)
    .eq('is_active', true)
    .single();

  if (error || !plan) return null;
  return plan;
}
