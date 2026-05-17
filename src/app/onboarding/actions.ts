'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redis } from '@/lib/redis';
import { sanitizeName, sanitizePhone, sanitizeCountry, sanitizeReference, sanitizeString } from '@/lib/sanitize';

export async function saveDraftOnboarding(formData: Partial<{
  role: string;
  fullName: string;
  phone: string;
  dob: string;
  country: string;
  step: number;
}>) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // Escape role input
  const safeRole = formData.role ? sanitizeString(formData.role) : undefined;

  try {
    if (safeRole) {
      await adminClient
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          role: safeRole as any
        });
    }

    const safeFullName = formData.fullName ? sanitizeName(formData.fullName) : undefined;
    const safePhone = formData.phone ? sanitizePhone(formData.phone) : undefined;
    const safeCountry = formData.country ? sanitizeCountry(formData.country) : undefined;
    const safeDob = formData.dob ? sanitizeString(formData.dob) : undefined;

    if (safeFullName || safePhone || safeDob || safeCountry) {
      const names = safeFullName?.split(' ') || [];
      const firstName = names[0] || undefined;
      const lastName = names.slice(1).join(' ') || undefined;

      const { data: existingProfiles, error: fetchError } = await adminClient
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching existing profiles for draft:', fetchError);
        return { success: false, error: fetchError.message };
      }

      if (existingProfiles && existingProfiles.length > 0) {
        const masterProfile = existingProfiles[0];
        
        const { error: profileError } = await adminClient
          .from('profiles')
          .update({
            ...(firstName && { first_name: firstName }),
            ...(lastName && { last_name: lastName }),
            ...(safePhone && { phone_number: safePhone }),
            ...(safeDob && { date_of_birth: safeDob }),
            ...(safeCountry && { country: safeCountry }),
            status: 'pending' // Keep it pending during draft
          })
          .eq('id', masterProfile.id);

        if (profileError) {
          console.error('Error updating master draft profile:', profileError);
          return { success: false, error: profileError.message };
        }

        // Clean up duplicates
        if (existingProfiles.length > 1) {
          const dupIds = existingProfiles.slice(1).map(p => p.id);
          const { error: deleteError } = await adminClient
            .from('profiles')
            .delete()
            .in('id', dupIds);
          
          if (deleteError) {
            console.error('Error cleaning up duplicate draft profiles:', deleteError);
          } else {
            console.log(`[Self-Heal] Successfully deleted ${dupIds.length} duplicate draft profiles for user ${user.id}`);
          }
        }
      } else {
        // Insert new draft profile
        const { error: profileError } = await adminClient
          .from('profiles')
          .insert({
            user_id: user.id,
            ...(firstName && { first_name: firstName }),
            ...(lastName && { last_name: lastName }),
            ...(safePhone && { phone_number: safePhone }),
            ...(safeDob && { date_of_birth: safeDob }),
            ...(safeCountry && { country: safeCountry }),
            status: 'pending'
          });

        if (profileError) {
          console.error('Error inserting draft profile:', profileError);
          return { success: false, error: profileError.message };
        }
      }
    }

    // Invalidate stale draft cache keys
    try {
      await Promise.all([
        redis.del(`user:record:${user.id}`),
        redis.del(`user:profile:${user.id}`)
      ]);
    } catch (cacheErr) {
      console.error('Error clearing draft Redis cache:', cacheErr);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Draft save error:', err);
    return { success: false };
  }
}

export async function saveOnboarding(formData: {
  role: string;
  fullName: string;
  phone: string;
  dob: string;
  country: string;
  paymentReference: string;
  paymentMethod?: string;
  proofName?: string;
  proofEmail?: string;
  proofFileName?: string;
}) {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  // High-security input sanitization
  const safeRole = sanitizeString(formData.role);
  const safeFullName = sanitizeName(formData.fullName);
  const safePhone = sanitizePhone(formData.phone);
  const safeDob = sanitizeString(formData.dob);
  const safeCountry = sanitizeCountry(formData.country);
  const safePaymentReference = sanitizeReference(formData.paymentReference);
  const safePaymentMethod = formData.paymentMethod ? sanitizeString(formData.paymentMethod) : undefined;
  const safeProofName = formData.proofName ? sanitizeName(formData.proofName) : undefined;
  const safeProofEmail = formData.proofEmail ? sanitizeString(formData.proofEmail) : undefined;
  const safeProofFileName = formData.proofFileName ? sanitizeString(formData.proofFileName) : undefined;
  
  const names = safeFullName.split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';

  try {
    // 1. Fetch dynamic amount from settings
    const { data: settings } = await supabase
      .from('site_content')
      .select('content')
      .eq('page', 'settings')
      .eq('section', 'payment')
      .single();

    const plans = settings?.content?.plans || {};
    const amount = Number(plans[safeRole]?.amount || 15000);

    // 2. Update user record in users table
    const { error: userError } = await adminClient
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        role: safeRole as any,
        is_active: true
      });

    if (userError) {
      console.error('Error upserting user:', userError);
      return { success: false, error: userError.message };
    }

    // 3. Create/Update profile record in profiles table
    // Query existing profiles for the user to handle cleanups and self-heal duplicates
    const { data: existingProfiles, error: fetchError } = await adminClient
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching existing profiles:', fetchError);
      return { success: false, error: fetchError.message };
    }

    let profileId: string;
    
    if (existingProfiles && existingProfiles.length > 0) {
      const masterProfile = existingProfiles[0];
      profileId = masterProfile.id;

      // Update the master profile
      const { error: profileError } = await adminClient
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone_number: safePhone, 
          date_of_birth: safeDob,
          country: safeCountry, 
          status: 'pending', 
          verification_requested: true
        })
        .eq('id', profileId);

      if (profileError) {
        console.error('Error updating master profile:', profileError);
        return { success: false, error: profileError.message };
      }

      // Clean up all other duplicate profiles for this user
      if (existingProfiles.length > 1) {
        const dupIds = existingProfiles.slice(1).map(p => p.id);
        const { error: deleteError } = await adminClient
          .from('profiles')
          .delete()
          .in('id', dupIds);
        
        if (deleteError) {
          console.error('Error cleaning up duplicate profiles:', deleteError);
        } else {
          console.log(`[Self-Heal] Successfully deleted ${dupIds.length} duplicate profiles for user ${user.id}`);
        }
      }
    } else {
      // Insert new profile
      const { data: profileData, error: profileError } = await adminClient
        .from('profiles')
        .insert({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          phone_number: safePhone, 
          date_of_birth: safeDob,
          country: safeCountry, 
          status: 'pending', 
          verification_requested: true
        })
        .select('id')
        .single();

      if (profileError || !profileData) {
        console.error('Error inserting profile:', profileError);
        return { success: false, error: profileError?.message || 'Failed to create profile.' };
      }
      profileId = profileData.id;
    }

    // 4. Log the payment reference in transactions
    const { error: transError } = await adminClient
       .from('transactions')
       .insert({
          user_id: profileId, // Using correct profiles.id reference
          amount: amount,
          currency: 'NGN',
          status: 'pending',
          reference: safePaymentReference,
          method: safePaymentMethod === 'bank' ? 'direct_transfer' : 'paystack_integration',
          metadata: {
             type: 'subscription',
             description: safePaymentMethod === 'bank' 
               ? `Bank Settlement: ${safeProofName} (${safeProofEmail}) - File: ${safeProofFileName || 'None'}`
               : `Onboarding subscription for ${safeRole}`
          }
       });

    if (transError) {
       console.error('Error logging transaction:', transError);
    }

    // 5. Invalidate stale dashboard session cache keys to prevent redirect loops
    try {
      await Promise.all([
        redis.del(`user:record:${user.id}`),
        redis.del(`user:profile:${user.id}`)
      ]);
      console.log(`[Redis] Successfully invalidated cache keys for user: ${user.id}`);
    } catch (cacheErr) {
      console.error('Error clearing onboarding Redis cache keys:', cacheErr);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Onboarding action crash:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}
