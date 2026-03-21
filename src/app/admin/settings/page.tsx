import { createClient } from '@/lib/supabase/server';
import { SettingsClient } from '@/components/admin/settings/SettingsClient';

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  
  const { data: config } = await supabase
    .from('site_content')
    .select('content')
    .eq('page', 'settings')
    .eq('section', 'system')
    .single();

  return <SettingsClient initialSettings={config?.content || {}} />;
}
