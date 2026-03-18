'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase.rpc('mark_all_notifications_read', {
    target_user_id: user.id
  });

  if (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function createAdminNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('notifications')
    .insert([{
      user_id: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      link: data.link
    }]);

  if (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function sendEmailNotification(email: string, subject: string, body: string) {
  // Mock SMTP integration
  console.log(`[SMTP] Sending email to ${email}: ${subject}`);
  // In a real scenario, use nodemailer or a service like Resend/SendGrid
  return { success: true };
}
