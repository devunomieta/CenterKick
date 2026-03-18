import { createClient } from '@/lib/supabase/server';
import MediaAssetsClient from '@/components/admin/blog/MediaAssetsClient';

export default async function MediaAssetsPage() {
  const supabase = await createClient();
  
  const { data: assets } = await supabase
    .from('blog_assets')
    .select('*')
    .order('created_at', { ascending: false });

  return <MediaAssetsClient assets={assets || []} />;
}
