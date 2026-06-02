import FootballDataManagement from '@/components/admin/settings/FootballDataManagement';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DataManagementPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Enforce Access: Superadmin, Admin, and Operations only
  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userRecord || !['superadmin', 'admin', 'operations'].includes(userRecord.role)) {
    redirect('/admin');
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50/30">
      <FootballDataManagement />
    </div>
  );
}
