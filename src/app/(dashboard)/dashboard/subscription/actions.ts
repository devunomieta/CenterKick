'use server';

import { createClient } from '@/lib/supabase/server';
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

  revalidatePath('/dashboard/subscription');
  return { success: true };
}
