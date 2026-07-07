'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const validatePassword = (pass: string) => {
    return (
       pass.length >= 8 &&
       /[A-Z]/.test(pass) &&
       /[0-9]/.test(pass) &&
       /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    );
  };

  if (!password) {
    return { error: 'Password is required' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  if (!validatePassword(password)) {
    return { error: 'Password does not meet complexity requirements.' };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Password updated successfully. You can now log in.' };
}
