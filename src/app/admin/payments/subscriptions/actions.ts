'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updatePaymentSettings(settings: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!['superadmin', 'admin'].includes(userRecord?.role)) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('site_content')
    .upsert({
      page: 'settings',
      section: 'payment',
      content: settings,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page,section'
    });

  if (error) throw error;

  revalidatePath('/admin/payments/subscriptions');
  return { success: true };
}
