'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendPasswordResetEmail } from '@/lib/resend';
import { checkRateLimit } from '@/lib/rate-limit';

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'Email is required' };
  }

  const rateLimit = checkRateLimit(email);
  if (!rateLimit.allowed) {
    return { error: `Too many requests. Please wait ${rateLimit.waitTime} seconds before trying again.` };
  }

  try {
    const supabaseAdmin = createAdminClient();

    // 1. Generate the reset link manually
    const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`,
      }
    });

    if (linkError) {
      console.error('Error generating reset link:', linkError);
      return { error: 'Failed to generate reset link. Please try again later.' };
    }

    // 2. Construct a direct verification link that works cross-browser
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const directResetLink = `${origin}/auth/callback?token_hash=${data.properties.hashed_token}&type=recovery&next=/reset-password`;

    // 3. Send the link via Resend
    await sendPasswordResetEmail(email, directResetLink);

    return { success: true, message: 'Check your email for the password reset link.' };
  } catch (error: any) {
    console.error('Resend flow failed:', error);

    // Fallback to standard Supabase method if admin flow fails (e.g. missing service key)
    const { createStandardClient } = await import('@/lib/supabase/standard');
    const supabase = createStandardClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`,
    });

    if (resetError) {
      return { error: resetError.message };
    }

    return { success: true, message: 'Check your email for the password reset link (Sent via Supabase).' };
  }
}
