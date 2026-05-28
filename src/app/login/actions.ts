'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { redis } from '@/lib/redis';
import { sendOtpEmail } from '@/lib/resend';
import { createAdminClient } from '@/lib/supabase/admin';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch user role and status to determine redirect and access
  const { data: userRecord } = await supabase
    .from('users')
    .select('role, is_active')
    .eq('id', data.user.id)
    .single();

  // Retrieve profile status to identify if this is a new pending account awaiting payment confirmation
  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('user_id', data.user.id)
    .maybeSingle();

  const isPendingNewAccount = !profile || profile.status === 'pending';

  if (userRecord && !userRecord.is_active && !isPendingNewAccount) {
    await supabase.auth.signOut();
    return { error: 'Your account is currently inactive. Please contact an administrator.' };
  }

  const role = userRecord?.role || 'player';
  
  // Custom redirects based on role
  let redirectPath = '/dashboard';
  if (role === 'superadmin' || role === 'admin') {
    redirectPath = '/admin';
  } else if (['blogger', 'operations', 'finance'].includes(role)) {
    redirectPath = '/admin'; // Staff roles also go to admin overview
  }

  revalidatePath('/', 'layout');
  redirect(redirectPath);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Check if account already exists in public.users
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingUser) {
    return { error: 'An account with this email already exists.' };
  }

  // Generate 6-digit OTP code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save registration data to Redis with a 10-minute expiry
  const redisKey = `signup:otp:${email}`;
  try {
    await redis.set(redisKey, JSON.stringify({ password, otp }), { ex: 600 });
  } catch (redisError) {
    console.error('[Redis Error] Failed to save OTP registration data:', redisError);
    return { error: 'Temporary storage error. Please try again.' };
  }

  // Send the OTP via Resend
  try {
    await sendOtpEmail(email, otp);
  } catch (emailError: any) {
    console.error('[Email Error] Failed to send OTP code via Resend:', emailError);
    return { error: 'Failed to send verification email. Please double check your email address.' };
  }

  return { success: true, message: 'Verification code sent.' };
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient();

  const redisKey = `signup:otp:${email}`;
  let pendingDataStr: string | null = null;
  try {
    pendingDataStr = await redis.get(redisKey);
  } catch (redisError) {
    console.error('[Redis Error] Failed to get OTP registration data:', redisError);
    return { error: 'Verification system error. Please try again.' };
  }

  if (!pendingDataStr) {
    return { error: 'Verification code has expired or was not requested. Please sign up again.' };
  }

  const pendingData = JSON.parse(pendingDataStr);

  if (pendingData.otp !== token.trim()) {
    return { error: 'Invalid verification code.' };
  }

  // OTP verified successfully! Let's register and confirm the user in Supabase Auth.
  const adminClient = createAdminClient();
  let authUser;

  const { data: authData, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password: pendingData.password,
    email_confirm: true,
  });

  if (createError) {
    // If user already exists in auth.users but not in public.users, they are a dangling unconfirmed user.
    if (createError.message.includes('already exists') || createError.status === 422) {
      // Find the dangling auth user ID by listing users
      const { data: listData } = await adminClient.auth.admin.listUsers();
      const danglingUser = listData?.users?.find(u => u.email === email);
      
      if (danglingUser) {
        // Delete the dangling auth user and try creating again
        await adminClient.auth.admin.deleteUser(danglingUser.id);
        const { data: retryData, error: retryError } = await adminClient.auth.admin.createUser({
          email,
          password: pendingData.password,
          email_confirm: true,
        });

        if (retryError) {
          return { error: retryError.message };
        }
        authUser = retryData.user;
      } else {
        return { error: 'This email is already registered.' };
      }
    } else {
      return { error: createError.message };
    }
  } else {
    authUser = authData.user;
  }

  // Now sign the user in to establish their session cookie
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: pendingData.password,
  });

  if (signInError) {
    console.error('[SignIn Error] Failed to authenticate user after registration:', signInError);
    return { error: 'Failed to sign in. Please try logging in manually.' };
  }

  // Clean up Redis key
  try {
    await redis.del(redisKey);
  } catch (redisError) {
    console.error('[Redis Error] Failed to delete OTP key:', redisError);
  }

  // After verification, ensure the user is logged in and redirect to onboarding
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
