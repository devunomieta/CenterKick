'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getPricingPlans() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .order('role', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function savePricingPlan(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;
  const role = formData.get('role') as string;
  const plan_name = formData.get('plan_name') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const duration_months = parseInt(formData.get('duration_months') as string);
  const is_active = formData.get('is_active') === 'true';

  if (id) {
    const { error } = await supabase
      .from('pricing_plans')
      .update({ role, plan_name, amount, duration_months, is_active })
      .eq('id', id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase
      .from('pricing_plans')
      .insert([{ role, plan_name, amount, duration_months, is_active }]);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/admin/pricing');
  return { success: true };
}

export async function deletePricingPlan(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('pricing_plans')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/pricing');
  return { success: true };
}
