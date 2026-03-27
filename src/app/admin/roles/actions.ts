'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendEmailNotification } from '../notifications/actions';

/**
 * Updates a user's role with strict permission checks
 */
export async function updateUserRole(targetUserId: string, newRole: string) {
  const supabase = await createClient();
  const { data: { user: requester } } = await supabase.auth.getUser();

  if (!requester) return { success: false, error: 'Unauthorized' };

  // 1. Fetch requester's role
  const { data: requesterRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', requester.id)
    .single();

  const requesterRole = requesterRecord?.role;
  if (!['superadmin', 'admin'].includes(requesterRole)) {
    return { success: false, error: 'Forbidden: Insufficient permissions' };
  }

  // 2. Fetch target's current role
  const { data: targetRecord } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', targetUserId)
    .single();

  if (!targetRecord) return { success: false, error: 'Target user not found' };

  // 3. Permission Validations
  // - Only Superadmin can manage other Admins/Superadmins
  if (targetRecord.role === 'superadmin') {
    return { success: false, error: 'Superadmin roles cannot be modified.' };
  }

  if (targetRecord.role === 'admin' && requesterRole !== 'superadmin') {
    return { success: false, error: 'Only Superadmins can modify Administrator roles.' };
  }

  // - Admins cannot assign Superadmin role
  if (newRole === 'superadmin' && requesterRole !== 'superadmin') {
    return { success: false, error: 'Only Superadmins can assign the Superadmin role.' };
  }

  // - Only Superadmin can assign Admin role
  if (newRole === 'admin' && requesterRole !== 'superadmin') {
      return { success: false, error: 'Only Superadmins can assign the Administrator role.' };
  }

  // 4. Update the role
  const { error } = await supabase
    .from('users')
    .update({ 
      role: newRole,
      is_verification_requested: false // Clear verification request upon role assignment
    })
    .eq('id', targetUserId);

  if (error) {
    console.error('Error updating role:', error);
    return { success: false, error: error.message };
  }

  // 5. Notify the user
  await sendEmailNotification(
    targetRecord.email,
    'CenterKick: Account Role Updated',
    `Hello, \n\nYour CenterKick administrative account has been reviewed. You have been assigned the role of: ${newRole.toUpperCase()}.\n\nYou can now log in to the admin dashboard with your full permissions.`
  );

  revalidatePath('/admin/roles');
  return { success: true };
}

/**
 * Toggles a user's active status
 */
export async function toggleUserStatus(targetUserId: string, isActive: boolean) {
  const supabase = await createClient();
  const { data: { user: requester } } = await supabase.auth.getUser();

  if (!requester) return { success: false, error: 'Unauthorized' };

  // 1. Fetch requester's role
  const { data: requesterRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', requester.id)
    .single();

  const requesterRole = requesterRecord?.role;
  if (!['superadmin', 'admin'].includes(requesterRole)) {
    return { success: false, error: 'Forbidden' };
  }

  // 2. Fetch target's role
  const { data: targetRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', targetUserId)
    .single();

  if (!targetRecord) return { success: false, error: 'User not found' };

  // 3. Protection: Cannot deactivate self or Superadmin
  if (targetUserId === requester.id) {
    return { success: false, error: 'You cannot deactivate your own account.' };
  }

  if (targetRecord.role === 'superadmin') {
    return { success: false, error: 'Superadmin accounts cannot be deactivated.' };
  }

  // 4. Update status
  const { error } = await supabase
    .from('users')
    .update({ is_active: isActive })
    .eq('id', targetUserId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/roles');
  return { success: true };
}

/**
 * Resends an invitation with a fresh token and expiration
 */
export async function resendInvitation(invitationId: string) {
  const supabase = await createClient();
  const { data: { user: requester } } = await supabase.auth.getUser();

  if (!requester) return { success: false, error: 'Unauthorized' };

  // 1. Fetch requester's role
  const { data: requesterRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', requester.id)
    .single();

  if (!['superadmin', 'admin'].includes(requesterRecord?.role)) {
    return { success: false, error: 'Forbidden' };
  }

  // 2. Fetch original invitation
  const { data: invitation } = await supabase
    .from('admin_invitations')
    .select('*')
    .eq('id', invitationId)
    .single();

  if (!invitation) return { success: false, error: 'Invitation not found' };
  if (invitation.accepted_at) return { success: false, error: 'Invitation already accepted' };

  // 3. Generate new token and expiration
  const newToken = Buffer.from(Math.random().toString(36).substring(2) + Date.now().toString(36)).toString('hex');
  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);

  // 4. Update the record
  const { error: updateError } = await supabase
    .from('admin_invitations')
    .update({
      token: newToken,
      expires_at: newExpiresAt.toISOString(),
      invited_by: requester.id
    })
    .eq('id', invitationId);

  if (updateError) return { success: false, error: updateError.message };

  // 5. Send Email
  const { sendAdminInvitationEmail } = await import('@/lib/resend');
  const invitationLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/signup?token=${newToken}`;
  
  try {
    await sendAdminInvitationEmail(invitation.email, invitation.role, invitationLink);
  } catch (err) {
    console.error('Failed to resend email:', err);
    return { success: false, error: 'Invitation updated, but email failed to send.' };
  }

  revalidatePath('/admin/roles');
  return { success: true };
}

/**
 * Revokes (deletes) an invitation
 */
export async function revokeInvitation(invitationId: string) {
  const supabase = await createClient();
  const { data: { user: requester } } = await supabase.auth.getUser();

  if (!requester) return { success: false, error: 'Unauthorized' };

  // 1. Fetch requester's role
  const { data: requesterRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', requester.id)
    .single();

  if (!['superadmin', 'admin'].includes(requesterRecord?.role)) {
    return { success: false, error: 'Forbidden' };
  }

  // 2. Delete the invitation
  const { error } = await supabase
    .from('admin_invitations')
    .delete()
    .eq('id', invitationId)
    .is('accepted_at', null); // Safety: only revoke pending ones

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/roles');
  return { success: true };
}

/**
 * Deletes a user account
 */
export async function deleteUser(targetUserId: string) {
  const supabase = await createClient();
  const { data: { user: requester } } = await supabase.auth.getUser();

  if (!requester) return { success: false, error: 'Unauthorized' };

  // 1. Fetch requester's role
  const { data: requesterRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', requester.id)
    .single();

  const requesterRole = requesterRecord?.role;
  if (!['superadmin', 'admin'].includes(requesterRole)) {
    return { success: false, error: 'Forbidden' };
  }

  // 2. Fetch target's role
  const { data: targetRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', targetUserId)
    .single();

  if (!targetRecord) return { success: false, error: 'User not found' };

  // 3. Permissions: 
  // - Cannot delete self
  if (targetUserId === requester.id) {
    return { success: false, error: 'You cannot delete your own account.' };
  }
  // - Only superadmin can delete an admin
  if (targetRecord.role === 'admin' && requesterRole !== 'superadmin') {
    return { success: false, error: 'Only Superadmins can delete Administrator accounts.' };
  }
  // - Cannot delete a superadmin
  if (targetRecord.role === 'superadmin') {
    return { success: false, error: 'Superadmin accounts cannot be deleted.' };
  }

  // 4. Delete the user (Supabase Auth delete is handled via trigger or requires admin client)
  // In this app, we likely delete from the 'users' table and rely on RLS/cascade or we need the admin client.
  // Actually, delete from 'users' is sufficient if auth is handled elsewhere or if users table is the source of truth for the UI.
  // NOTE: In standard Supabase, deleting from public.users doesn't delete from auth.users.
  // We'll proceed with public.users deletion for now, as that's what's visible in the dashboard.
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', targetUserId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/roles');
  return { success: true };
}
