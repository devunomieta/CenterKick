'use server';

import { createClient } from '@/lib/supabase/server';
import { sendEmailNotification } from '../admin/notifications/actions';

/**
 * Resends the invitation/onboarding email or a subscription reminder
 */
export async function resendInvitation(email: string, role: string, lastName: string, type: 'invite' | 'reminder' = 'invite') {
  const supabase = await createClient();
  
  // Get the profile to ensure we have the right ID for the link
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name')
    .eq('email', email)
    .maybeSingle();

  if (!profile) return { success: false, error: "Profile not found" };

  // Fetch dynamic payment settings from DB
  const { data: settingsRecord } = await supabase
    .from('site_content')
    .select('content')
    .eq('page', 'settings')
    .eq('section', 'payment')
    .maybeSingle();

  const settings = (settingsRecord?.content as any) || {};
  const normalizedRole = role === 'athlete' ? 'player' : role;
  const rolePlan = settings?.plans?.[normalizedRole];
  const amountStr = rolePlan?.amount ? `₦${Number(rolePlan.amount).toLocaleString()}` : '';
  const priceNotice = amountStr ? ` (${amountStr})` : '';

  const link = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://centerkick.com'}/register?email=${encodeURIComponent(email)}&role=${role}`;
  
  const subject = type === 'reminder' 
    ? `Action Required: Renew your CenterKick ${role} Subscription`
    : `Complete your CenterKick ${role} Registration`;

  const message = type === 'reminder'
    ? `Hello ${profile.first_name || lastName}, 

We noticed your CenterKick ${role} subscription${priceNotice} has expired. 
To continue enjoying full access to our professional network and tools, please re-activate your account.

You can log in and manage your subscription here:
${link}

Best regards,
The CenterKick Team`
    : `Hello ${profile.first_name || (role === 'athlete' ? 'Player' : role)} ${lastName}, 
  
An admin has invited you to join CenterKick as a ${role}. 
Your professional profile is ready and waiting for you!

Please use the link below to set your password and activate your account:
${link}

If the link above doesn't work, copy and paste this into your browser.

Best regards,
The CenterKick Team`;

  const res = await sendEmailNotification(email, subject, message);
  return res;
}
