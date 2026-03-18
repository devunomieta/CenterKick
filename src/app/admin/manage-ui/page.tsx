import { createClient } from '@/lib/supabase/server';
import ManageUIClient from '@/components/admin/cms/ManageUIClient';

export default async function ManageUIPage() {
  const supabase = await createClient();
  
  const { data: pages } = await supabase
    .from('site_pages')
    .select('*')
    .order('name');

  return <ManageUIClient pages={pages || []} />;
}
