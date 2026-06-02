import { createClient } from '@/lib/supabase/server';
import { SettingsClient } from '@/components/admin/settings/SettingsClient';
import { redirect } from 'next/navigation';

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Enforce System Settings: Superadmin only
  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userRecord || userRecord.role !== 'superadmin') {
    redirect('/admin');
  }

  const { data: config } = await supabase
    .from('site_content')
    .select('content')
    .eq('page', 'settings')
    .eq('section', 'system')
    .single();

  return <SettingsClient initialSettings={config?.content || {}} />;
}
