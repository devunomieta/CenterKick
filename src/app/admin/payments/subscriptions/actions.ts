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

  // Handle Paystack Plan Creation
  if (settings.paystackActive && settings.paystackSecret) {
    if (settings.plans) {
      for (const roleId of Object.keys(settings.plans)) {
        const plan = settings.plans[roleId];
        const amountNum = Number(plan.amount) || 0;
        
        if (amountNum > 0 && plan.frequency && plan.frequency !== 'Lifetime Access') {
          // Check if we need to create a new plan
          // Paystack requires interval to be: hourly, daily, weekly, monthly, quarterly, biannually, annually
          let interval = 'monthly';
          if (plan.frequency === 'Monthly') interval = 'monthly';
          if (plan.frequency === 'Quarterly') interval = 'quarterly';
          if (plan.frequency === 'Biannually') interval = 'biannually';
          if (plan.frequency === 'Yearly') interval = 'annually';

          const paystackPayload = {
            name: plan.name || `CenterKick ${roleId} Pro`,
            interval: interval,
            amount: amountNum * 100, // Amount in kobo/cents
          };

          try {
            const response = await fetch('https://api.paystack.co/plan', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${settings.paystackSecret}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(paystackPayload)
            });

            const data = await response.json();
            if (data.status && data.data && data.data.plan_code) {
              settings.plans[roleId].paystackPlanCode = data.data.plan_code;
            } else {
              console.error('Paystack plan creation failed:', data);
            }
          } catch (err) {
            console.error('Error hitting Paystack API:', err);
          }
        } else {
          // If free or lifetime, clear the plan code
          settings.plans[roleId].paystackPlanCode = null;
        }
      }
    }
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
