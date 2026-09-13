import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Calculates subscription period end date based on:
 * 1. User Account Type / Role configured plan frequency in site_content payment settings
 * 2. Transaction metadata explicit billing frequency / duration
 * 3. Default fallback of +6 months if unconfigured
 */
export async function calculateSubscriptionPeriodEnd(
  userRole?: string | null,
  planName?: string | null,
  metadata?: any,
  startDate: Date = new Date()
): Promise<Date> {
  const resultDate = new Date(startDate.getTime());
  const role = (userRole || 'player').toLowerCase();

  // 1. Fetch system payment settings from site_content
  try {
    const admin = createAdminClient();
    const { data: settings } = await admin
      .from('site_content')
      .select('content')
      .eq('page', 'settings')
      .eq('section', 'payment')
      .maybeSingle();

    const rolePlan = settings?.content?.plans?.[role];
    const frequency = rolePlan?.frequency;

    if (frequency) {
      const freqUpper = String(frequency).toUpperCase();
      if (freqUpper.includes('LIFETIME')) {
        resultDate.setFullYear(resultDate.getFullYear() + 100);
        return resultDate;
      }
      if (freqUpper.includes('YEARLY') || freqUpper.includes('ANNUAL')) {
        resultDate.setFullYear(resultDate.getFullYear() + 1);
        return resultDate;
      }
      if (freqUpper.includes('BIANNUAL') || freqUpper.includes('6 MONTH')) {
        resultDate.setMonth(resultDate.getMonth() + 6);
        return resultDate;
      }
      if (freqUpper.includes('QUARTERLY') || freqUpper.includes('3 MONTH')) {
        resultDate.setMonth(resultDate.getMonth() + 3);
        return resultDate;
      }
      if (freqUpper.includes('MONTHLY') || freqUpper.includes('1 MONTH')) {
        resultDate.setMonth(resultDate.getMonth() + 1);
        return resultDate;
      }
    }
  } catch (error) {
    console.error('Error fetching site_content for subscription duration:', error);
  }

  // 2. Check metadata / plan name fallback
  if (metadata?.duration_months && typeof metadata.duration_months === 'number') {
    resultDate.setMonth(resultDate.getMonth() + metadata.duration_months);
    return resultDate;
  }

  const combinedPlan = `${planName || ''} ${metadata?.billing_interval || ''} ${metadata?.frequency || ''}`.toUpperCase();
  if (combinedPlan.includes('YEAR') || combinedPlan.includes('ANNUAL')) {
    resultDate.setFullYear(resultDate.getFullYear() + 1);
    return resultDate;
  }
  if (combinedPlan.includes('MONTH')) {
    resultDate.setMonth(resultDate.getMonth() + 1);
    return resultDate;
  }

  // 3. Default fallback if unconfigured: +6 months
  resultDate.setMonth(resultDate.getMonth() + 6);
  return resultDate;
}
