'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function adminSignupAction(formData: FormData, email: string, token: string) {
  const supabase = await createClient();

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const location = formData.get('location') as string;
  const dob = formData.get('dob') as string;
  const password = formData.get('password') as string;

  // 1. Double check the invitation is still valid
  const { data: invitation, error: inviteError } = await supabase
    .from('admin_invitations')
    .select('*')
    .eq('token', token)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (inviteError || !invitation) {
    return { error: 'Invitation is no longer valid or has already been used.' };
  }

  // 2. Sign up the user
  const { data, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        location: location,
        date_of_birth: dob,
        role: 'unassigned',
      },
    },
  });

  if (signupError) return { error: signupError.message };

  // 3. Mark invitation as accepted
  await supabase
    .from('admin_invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('token', token);

  return { success: true };
}
