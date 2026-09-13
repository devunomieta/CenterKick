'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getEarnMembershipPageData() {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch active tasks
  const { data: tasks, error: tasksError } = await supabaseAdmin
    .from('earning_tasks')
    .select('*')
    .in('status', ['ACTIVE', 'PAUSED'])
    .order('created_at', { ascending: false });

  if (tasksError) {
    console.error('Error fetching earning tasks:', tasksError);
  }

  let userProfile = null;
  let userSubmissions: any[] = [];

  if (user) {
    // 2. Fetch user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, user_id, email, first_name, last_name, role')
      .eq('user_id', user.id)
      .single();

    userProfile = profile;

    if (profile?.id) {
      // 3. Fetch user task submissions with coupon code if issued
      const { data: subs, error: subsError } = await supabaseAdmin
        .from('task_submissions')
        .select(`
          *,
          earning_tasks (
            id,
            title,
            reward_duration_months,
            platform_link
          ),
          issued_coupon:coupon_codes (
            id,
            code,
            status,
            expiry_date
          )
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (subsError) {
        console.error('Error fetching user submissions:', subsError);
      } else {
        userSubmissions = subs || [];
      }
    }
  }

  return {
    tasks: tasks || [],
    userProfile,
    userSubmissions,
    isLoggedIn: Boolean(user)
  };
}

export async function submitEarnTaskProof(formData: FormData) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'Authentication required. Please log in to submit proof.' };
  }

  const taskId = formData.get('task_id') as string;
  const proofUrl = formData.get('proof_url') as string;
  const userNotes = formData.get('user_notes') as string;
  const proofFile = formData.get('proof_file') as File | null;

  if (!taskId) {
    return { error: 'Task ID is required.' };
  }

  // Fetch task to verify requirements
  const { data: task, error: taskErr } = await supabaseAdmin
    .from('earning_tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (taskErr || !task) {
    return { error: 'Task not found or campaign has ended.' };
  }

  if (task.status !== 'ACTIVE') {
    return { error: 'This campaign is currently paused or completed.' };
  }

  // Fetch user profile
  const { data: profile, error: profErr } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .eq('user_id', user.id)
    .single();

  if (profErr || !profile) {
    return { error: 'User profile not found.' };
  }

  // Check 1-submission-per-task limit
  const { data: existingSub } = await supabaseAdmin
    .from('task_submissions')
    .select('id, status')
    .eq('task_id', taskId)
    .eq('user_id', profile.id)
    .maybeSingle();

  if (existingSub) {
    if (existingSub.status === 'PENDING') {
      return { error: 'You already have a pending proof submission for this task. Please wait for admin review.' };
    }
    if (existingSub.status === 'APPROVED') {
      return { error: 'You have already completed and earned your voucher for this task!' };
    }
  }

  // Validate proof requirements
  if (task.require_proof_url && !proofUrl) {
    return { error: 'Proof URL is required for this task.' };
  }

  let proofFileUrl = '';

  if (proofFile && proofFile.size > 0) {
    const fileExt = proofFile.name.split('.').pop() || 'png';
    const fileName = `task-proof-${profile.id}-${Date.now()}.${fileExt}`;

    // Ensure receipts bucket exists
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    if (!buckets?.find(b => b.id === 'receipts')) {
      await supabaseAdmin.storage.createBucket('receipts', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
    }

    const { error: uploadError } = await supabaseAdmin.storage
      .from('receipts')
      .upload(fileName, proofFile);

    if (uploadError) {
      console.error('Error uploading proof file:', uploadError);
      return { error: 'Failed to upload proof screenshot. Please try again.' };
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from('receipts').getPublicUrl(fileName);
    proofFileUrl = publicUrl;
  }

  // Insert or update task submission
  const { data: submission, error: insertError } = await supabaseAdmin
    .from('task_submissions')
    .upsert({
      id: existingSub?.id || undefined,
      task_id: taskId,
      user_id: profile.id,
      user_email: profile.email || user.email,
      proof_url: proofUrl ? proofUrl.trim() : null,
      proof_file_url: proofFileUrl || null,
      user_notes: userNotes ? userNotes.trim() : null,
      status: 'PENDING',
      admin_notes: null,
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single();

  if (insertError) {
    console.error('Error recording task submission:', insertError);
    return { error: insertError.message };
  }

  revalidatePath('/earn-membership');
  return { success: true, submission };
}
