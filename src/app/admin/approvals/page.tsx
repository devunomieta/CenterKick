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
    { data: pendingEdits },
    { data: prospects },
    { data: pendingPayments }
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
      .order('created_at', { ascending: false }),

    // 3. Fetch Prospects (Unlinked profiles with user_id = null)
    adminClient
      .from('profiles')
      .select('*, transactions(status)')
      .is('user_id', null)
      .not('email', 'is', null)
      .order('created_at', { ascending: false }),

    // 4. Fetch Pending Payments (Direct transfers awaiting confirmation)
    adminClient
      .from('transactions')
      .select('*, profiles(first_name, last_name, email, role)')
      .eq('status', 'pending')
      .eq('method', 'direct_transfer')
      .order('created_at', { ascending: false })
  ]);

  return (
    <div className="space-y-6">
      <ApprovalsClient 
        pendingStaff={pendingStaff || []}
        pendingEdits={pendingEdits || []}
        prospects={prospects || []}
        pendingPayments={pendingPayments || []}
        activeTab={currentTab}
        currentUserRole={userRecord?.role || 'admin'}
      />
    </div>
  );
}
