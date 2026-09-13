'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { generateCouponCodePrefix } from '@/types/coupons';

export async function getAdminEarningTasks() {
  const supabase = createAdminClient();
  const { data: tasks, error } = await supabase
    .from('earning_tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching earning tasks:', error);
    return { tasks: [] };
  }
  return { tasks: tasks || [] };
}

export async function getAdminTaskSubmissions(statusFilter?: string) {
  const supabase = createAdminClient();
  let query = supabase
    .from('task_submissions')
    .select(`
      *,
      earning_tasks (
        title,
        reward_duration_months,
        platform_link,
        target_role
      )
    `)
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'ALL') {
    query = query.eq('status', statusFilter);
  }

  const { data: submissions, error } = await query;

  if (error) {
    console.error('Error fetching task submissions:', error);
    return { submissions: [] };
  }
  return { submissions: submissions || [] };
}

export async function createEarningTask(formData: {
  title: string;
  description: string;
  instructions: string;
  rewardDurationMonths: number;
  targetRole: string;
  platformLink?: string;
  requireProofUrl: boolean;
  requireProofFile: boolean;
  maxRewardClaims?: number;
}) {
  const supabase = createAdminClient();

  const { data: task, error } = await supabase
    .from('earning_tasks')
    .insert({
      title: formData.title.trim(),
      description: formData.description.trim(),
      instructions: formData.instructions.trim(),
      reward_duration_months: formData.rewardDurationMonths || 6,
      target_role: formData.targetRole || 'ALL',
      platform_link: formData.platformLink ? formData.platformLink.trim() : null,
      require_proof_url: formData.requireProofUrl,
      require_proof_file: formData.requireProofFile,
      max_reward_claims: formData.maxRewardClaims || null,
      status: 'ACTIVE'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating earning task:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/coupons/tasks');
  revalidatePath('/earn-membership');
  return { success: true, task };
}

export async function toggleEarningTaskStatus(taskId: string, currentStatus: string) {
  const supabase = createAdminClient();
  const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';

  const { error } = await supabase
    .from('earning_tasks')
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq('id', taskId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/coupons/tasks');
  revalidatePath('/earn-membership');
  return { success: true, nextStatus };
}

export async function approveTaskSubmission(submissionId: string, adminNotes?: string) {
  const supabase = createAdminClient();
  const serverSupabase = await createClient();

  const { data: { user } } = await serverSupabase.auth.getUser();

  // 1. Fetch submission with task details
  const { data: sub, error: subError } = await supabase
    .from('task_submissions')
    .select(`
      *,
      earning_tasks (
        id,
        title,
        reward_duration_months,
        target_role,
        total_claims_count
      )
    `)
    .eq('id', submissionId)
    .single();

  if (subError || !sub) {
    return { success: false, error: 'Submission record not found.' };
  }

  if (sub.status === 'APPROVED') {
    return { success: false, error: 'Submission has already been approved.' };
  }

  const task = sub.earning_tasks;
  const rewardMonths = task?.reward_duration_months || 6;
  const targetRole = task?.target_role || 'ALL';

  // 2. Auto-generate unique 1-time single-use coupon tied to user's email
  const code = generateCouponCodePrefix('EARN');
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year validity

  const { data: coupon, error: couponError } = await supabase
    .from('coupon_codes')
    .insert({
      code,
      title: `Task Reward: ${task?.title || 'Promotional Campaign'}`,
      coupon_type: 'FULL_COVER',
      discount_value: 100,
      duration_months: rewardMonths,
      target_tier: targetRole === 'ALL' ? 'ALL' : targetRole.toUpperCase(),
      max_redemptions: 1,
      redemption_count: 0,
      status: 'AVAILABLE',
      recipient_email: sub.user_email,
      is_gift: true,
      expiry_date: expiryDate.toISOString()
    })
    .select('*')
    .single();

  if (couponError || !coupon) {
    console.error('Error generating activation coupon:', couponError);
    return { success: false, error: 'Failed to generate activation voucher code.' };
  }

  // 3. Update task_submission status to APPROVED
  const { error: updateSubErr } = await supabase
    .from('task_submissions')
    .update({
      status: 'APPROVED',
      admin_notes: adminNotes || 'Task proof verified and approved.',
      reviewed_by: user?.id || null,
      reviewed_at: new Date().toISOString(),
      issued_coupon_id: coupon.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', submissionId);

  if (updateSubErr) {
    return { success: false, error: updateSubErr.message };
  }

  // 4. Increment task total claims count
  if (task?.id) {
    await supabase
      .from('earning_tasks')
      .update({
        total_claims_count: (task.total_claims_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', task.id);
  }

  // 5. Send Resend email notification with voucher code
  try {
    const { sendEmail } = await import('@/lib/email');
    await sendEmail({
      to: sub.user_email,
      subject: `🎉 Congratulations! Your Free ${rewardMonths}-Month Membership Code is Ready`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 16px;">
          <h2 style="color: #b50a0a; margin-bottom: 10px;">Your Task Proof Has Been Approved!</h2>
          <p>Hello,</p>
          <p>Thank you for completing the task: <strong>${task?.title}</strong>.</p>
          <p>Your promotional voucher for <strong>${rewardMonths} Months Free Membership</strong> has been generated:</p>
          
          <div style="background-color: #f9fafb; border: 2px dashed #b50a0a; padding: 15px; text-align: center; border-radius: 12px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; font-family: monospace; letter-spacing: 2px; color: #111;">${code}</span>
          </div>

          <p style="font-size: 13px; color: #666;">This voucher code is single-use and exclusively reserved for <strong>${sub.user_email}</strong>.</p>

          <div style="text-align: center; margin-top: 25px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://centerkick.com'}/dashboard/subscription" 
               style="background-color: #b50a0a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
               Redeem Voucher Now →
            </a>
          </div>
        </div>
      `
    });
  } catch (emailErr) {
    console.error('Error sending voucher email notification:', emailErr);
  }

  revalidatePath('/admin/coupons/tasks');
  revalidatePath('/earn-membership');
  return { success: true, couponCode: code };
}

export async function rejectTaskSubmission(submissionId: string, rejectionReason: string) {
  const supabase = createAdminClient();
  const serverSupabase = await createClient();

  const { data: { user } } = await serverSupabase.auth.getUser();

  const { data: sub, error: subError } = await supabase
    .from('task_submissions')
    .select(`
      *,
      earning_tasks (title)
    `)
    .eq('id', submissionId)
    .single();

  if (subError || !sub) {
    return { success: false, error: 'Submission record not found.' };
  }

  const { error: updateErr } = await supabase
    .from('task_submissions')
    .update({
      status: 'REJECTED',
      admin_notes: rejectionReason || 'Proof verification failed. Please review guidelines and resubmit.',
      reviewed_by: user?.id || null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', submissionId);

  if (updateErr) {
    return { success: false, error: updateErr.message };
  }

  // Notify user via Resend email
  try {
    const { sendEmail } = await import('@/lib/email');
    await sendEmail({
      to: sub.user_email,
      subject: `Update on your task submission: ${sub.earning_tasks?.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 16px;">
          <h3 style="color: #b50a0a;">Task Proof Review Update</h3>
          <p>Hello,</p>
          <p>Your submission for <strong>${sub.earning_tasks?.title}</strong> requires correction.</p>
          <p><strong>Admin Review Feedback:</strong></p>
          <blockquote style="background-color: #fff1f1; border-left: 4px solid #b50a0a; padding: 10px 15px; margin: 15px 0;">
            ${rejectionReason || 'Proof link/file could not be verified.'}
          </blockquote>
          <p>Please visit <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://centerkick.com'}/earn-membership">CenterKick Earn Membership</a> to re-submit valid proof.</p>
        </div>
      `
    });
  } catch (emailErr) {
    console.error('Error sending rejection email:', emailErr);
  }

  revalidatePath('/admin/coupons/tasks');
  revalidatePath('/earn-membership');
  return { success: true };
}
