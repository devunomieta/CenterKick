'use server';

import { createClient } from '@/lib/supabase/server';
import { sendEmailNotification } from '../admin/notifications/actions';

export type AccountStatus = 'REGISTERED' | 'PROSPECT' | 'NONE';

/**
 * Checks the status of an email in the system.
 * REGISTERED: Has a record in auth.users
 * PROSPECT: Has a record in public.profiles but no user_id (or unlinked)
 * NONE: No record found
 */
export async function checkAccountStatus(email: string): Promise<{ status: AccountStatus; role?: string; id?: string }> {
  const supabase = await createClient();

  // 1. Check if user exists in public.profiles (our source of truth for all members)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, user_id, role, email')
    .eq('email', email)
    .maybeSingle();

  if (error || !profile) {
    return { status: 'NONE' };
  }

  // 2. Check if linked to auth
  if (profile.user_id) {
    return { status: 'REGISTERED', role: profile.role, id: profile.id };
  }

  return { status: 'PROSPECT', role: profile.role, id: profile.id };
}

/**
 * Retrieves all "prospect" profiles (those not yet linked to an auth user)
 */
export async function getProspects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .is('user_id', null)
    .not('email', 'is', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prospects:', error);
    return [];
  }

  return data;
}

/**
 * Resends the invitation/onboarding email to a prospect
 */
export async function resendInvitation(email: string, role: string, lastName: string) {
  const supabase = await createClient();
  
  // Get the profile to ensure we have the right ID for the link
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name')
    .eq('email', email)
    .maybeSingle();

  if (!profile) return { success: false, error: "Profile not found" };

  const link = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://centerkick.com'}/register?email=${encodeURIComponent(email)}&role=${role}`;
  
  const subject = `Complete your CenterKick ${role} Registration`;
  const message = `Hello ${profile.first_name || role === 'athlete' ? 'Player' : role} ${lastName}, 
  
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
