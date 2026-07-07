'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';

export async function getPendingEdits() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('profile_edits')
    .select('*, profile:profiles(user_id, first_name, last_name, role)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending edits:', error);
    return [];
  }

  return data || [];
}

export async function approveEdit(editId: string) {
  const supabase = createAdminClient();
  
  // Get the edit record
  const { data: edit, error: fetchError } = await supabase
    .from('profile_edits')
    .select('*, profile:profiles(user_id, first_name, last_name, contact_email)')
    .eq('id', editId)
    .single();

  if (fetchError || !edit) {
    return { error: 'Edit not found' };
  }

  // Update profile with new value
  const updateData: any = {};
  updateData[edit.field_name] = edit.new_value;

  const { error: updateError } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', edit.profile_id);

  if (updateError) {
    return { error: updateError.message };
  }

  // Mark edit as approved
  const { error: statusError } = await supabase
    .from('profile_edits')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', editId);

  if (statusError) {
    return { error: statusError.message };
  }

  // Notify User
  if (edit.profile?.user_id) {
    await supabase.from('notifications').insert({
      user_id: edit.profile.user_id,
      title: 'Profile Edit Approved',
      message: `Your requested edit for '${edit.field_name}' has been approved.`,
      type: 'success',
      action_url: '/dashboard/profile'
    });
    
    if (edit.profile.contact_email) {
      await sendEmail({
        to: edit.profile.contact_email,
        subject: 'CenterKick - Profile Edit Approved',
        html: `<p>Hi ${edit.profile.first_name || 'User'},</p><p>Your requested edit for '${edit.field_name}' has been approved and is now live on your profile.</p>`
      });
    }
  }

  revalidatePath('/admin/approvals/edits');
  return { success: true };
}

export async function rejectEdit(editId: string, reason?: string) {
  const supabase = createAdminClient();
  
  const { data: edit } = await supabase
    .from('profile_edits')
    .select('*, profile:profiles(user_id, first_name, last_name, contact_email)')
    .eq('id', editId)
    .single();

  const { error } = await supabase
    .from('profile_edits')
    .update({ status: 'rejected', reason: reason || 'Declined by Administrator', updated_at: new Date().toISOString() })
    .eq('id', editId);

  if (error) {
    return { error: error.message };
  }

  if (edit && edit.profile?.user_id) {
    await supabase.from('notifications').insert({
      user_id: edit.profile.user_id,
      title: 'Profile Edit Declined',
      message: `Your requested edit for '${edit.field_name}' was declined. ${reason || ''}`,
      type: 'error',
      action_url: '/dashboard/profile'
    });

    if (edit.profile.contact_email) {
      await sendEmail({
        to: edit.profile.contact_email,
        subject: 'CenterKick - Profile Edit Declined',
        html: `<p>Hi ${edit.profile.first_name || 'User'},</p><p>Your requested edit for '${edit.field_name}' was declined by an administrator.</p><p>Reason: ${reason || 'Not specified'}</p>`
      });
    }
  }

  revalidatePath('/admin/approvals/edits');
  return { success: true };
}
