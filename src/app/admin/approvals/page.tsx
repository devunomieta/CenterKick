import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ApprovalsClient } from '@/components/admin/approvals/ApprovalsClient';
import { redirect } from 'next/navigation';

export default async function AdminApprovalsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const adminClient = createAdminClient(); // Bypasses RLS to reliably fetch all queues
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/login');
  }

  // Fetch current user's role to check permissions
  const { data: userRecord } = await adminClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!['superadmin', 'admin', 'operations', 'finance'].includes(userRecord?.role)) {
    redirect('/admin');
  }

  const resolvedParams = await searchParams;
  const currentTab = (resolvedParams.tab as string) || 'staff';

  // Fetch all queues in parallel
  const [
    { data: pendingStaff },
    { data: pendingEdits }
  ] = await Promise.all([
    // 1. Fetch staff unassigned verification queue
    adminClient
      .from('users')
      .select('*, profiles(first_name, last_name, email, country)')
      .eq('role', 'unassigned')
      .eq('is_verification_requested', true)
      .order('created_at', { ascending: false }),

    // 2. Fetch Pending Profile Edits
    adminClient
      .from('profile_edits')
      .select('*, profiles(first_name, last_name, email, role, country)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
  ]);

  return (
    <div className="space-y-6">
      <ApprovalsClient 
        pendingStaff={pendingStaff || []}
        pendingEdits={pendingEdits || []}
        activeTab={currentTab}
        currentUserRole={userRecord?.role || 'admin'}
      />
    </div>
  );
}
