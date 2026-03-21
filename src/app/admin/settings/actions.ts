'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadSiteAsset(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('file') as File;
  const path = formData.get('path') as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify role
  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!['superadmin', 'admin'].includes(userRecord?.role)) {
    throw new Error('Unauthorized');
  }

  const fileName = `${path}-${Date.now()}.${file.name.split('.').pop()}`;
  
  // Ensure bucket exists (helpful for dev environments if migration wasn't run)
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.id === 'site-assets')) {
    await supabase.storage.createBucket('site-assets', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'],
      fileSizeLimit: 2097152 // 2MB
    });
  }

  const { data, error } = await supabase.storage
    .from('site-assets')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('site-assets')
    .getPublicUrl(fileName);

  // Shorten URL to just after /public
  const shortenedUrl = publicUrl.split('/public/')[1] ? `/${publicUrl.split('/public/')[1]}` : publicUrl;

  return { publicUrl: shortenedUrl };
}

export async function updateSystemSettings(settings: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!['superadmin', 'admin'].includes(userRecord?.role)) {
    throw new Error('Permission denied: Administrator role required');
  }

  const { error } = await supabase
    .from('site_content')
    .upsert({
      page: 'settings',
      section: 'system',
      content: settings,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'page,section'
    });

  if (error) {
    console.error('Database Error (site_content):', error);
    throw new Error(`Failed to update settings: ${error.message}`);
  }

  revalidatePath('/admin/settings');
  revalidatePath('/', 'layout'); // Ensure metadata updates sitewide
  return { success: true };
}

import { Resend } from 'resend';

export async function sendTestEmail(apiKey: string, fromEmail: string, targetEmail: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify role
  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!['superadmin', 'admin'].includes(userRecord?.role)) {
    throw new Error('Unauthorized');
  }

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail || 'CenterKick <onboarding@resend.dev>',
      to: [targetEmail],
      subject: 'CenterKick - Connection Test',
      html: `
        <div style="font-family: sans-serif; padding: 40px; color: #171717; background-color: #f9fafb; border-radius: 20px; border: 1px solid #e5e7eb;">
            <h1 style="color: #B91C1C; margin-bottom: 24px;">Connection Secure!</h1>
            <p>This is a test email from your CenterKick System Settings.</p>
            <p>If you are reading this, your Resend API integration is correctly configured and active.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
                Verified at: ${new Date().toLocaleString()}
            </p>
        </div>
      `,
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    throw new Error(`Email failed: ${err.message || 'Unknown error'}`);
  }
}

export async function clearSystemCache() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Logic to clear application cache or triggering revalidation
  revalidatePath('/', 'layout');
  
  return { success: true };
}
