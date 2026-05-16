import { createClient } from '@/lib/supabase/server';
import { getCachedData } from './redis';

/**
 * Fetches site settings (logos, titles, etc) with Redis caching.
 */
export async function getCachedSettings() {
  return getCachedData('site_settings', async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from('site_content')
      .select('content')
      .eq('page', 'settings')
      .eq('section', 'system')
      .single();
    
    return data?.content || null;
  }, 3600);
}

/**
 * Fetches global CMS data (Navbar, Footer, and Settings) in a single cached call.
 * This is the most efficient way to fetch branding for any page.
 */
export async function getGlobalCMSData() {
  return getCachedData('global_cms_data_v2', async () => {
    const supabase = await createClient();
    
    const { data: globalData } = await supabase
      .from('site_content')
      .select('*')
      .in('page', ['navbar', 'footer', 'settings']);

    const navContent = globalData?.find(c => c.page === 'navbar' && c.section === 'navbar')?.content || null;
    const footerContent = globalData?.find(c => c.page === 'footer' && c.section === 'footer')?.content || null;
    const siteSettings = globalData?.find(c => c.page === 'settings' && c.section === 'system')?.content || null;

    return { navContent, footerContent, siteSettings };
  }, 3600);
}

/**
 * Fetches recent news posts with a shorter cache (5 minutes).
 */
export async function getCachedRecentNews() {
  return getCachedData('recent_news', async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('is_draft', false)
      .order('published_at', { ascending: false })
      .limit(10);
    
    return data || [];
  }, 300);
}

/**
 * Invalidate a specific cache key
 */
export async function invalidateCache(key: string) {
  const { redis } = await import('./redis');
  await redis.del(key);
}
