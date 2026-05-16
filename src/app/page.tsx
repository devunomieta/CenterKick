import { HomeClient } from '@/components/home/HomeClient';
import { createClient } from '@/lib/supabase/server';
import { getGlobalCMSData } from '@/app/admin/manage-ui/actions';
import { getCachedData } from '@/lib/redis';

// Dummy profiles for carousel (8 items)
const DUMMY_PLAYERS = [
   { name: 'Bamidele\nAdeniyi', num: "16", img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80" },
   { name: 'Yemi Daniel\nOlanrewaju', num: "24", img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80" },
   { name: 'Akere\nSamuel', num: "16", img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80" },
   { name: 'Chinedu\nOkonkwo', num: "9", img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80" },
   { name: 'Ibrahim\nMusa', num: "7", img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80" },
   { name: 'Olumide\nAjayi', num: "10", img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80" },
   { name: 'Tunde\nBello', num: "11", img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80" },
   { name: 'Emeka\nUche', num: "4", img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80" }
];

export default async function Home() {
   const supabase = await createClient();
   const { navContent, footerContent, siteSettings } = await getGlobalCMSData();

   // Fetch layout from cache
   const layout = await getCachedData('home_layout', async () => {
      const { data: pageData } = await supabase
         .from('site_pages')
         .select('*')
         .eq('slug', '/')
         .single();
      const defaultLayout = ["hero", "stories", "players", "coach_agents", "testimonials", "highlights", "cta"];
      return pageData?.layout || defaultLayout;
   }, 3600);
   
   // Fetch all site content for this page from cache
   const siteContentData = await getCachedData('home_site_content', async () => {
      const { data } = await supabase
         .from('site_content')
         .select('*')
         .eq('page', '/');
      return data || [];
   }, 1800);

   const getSectionContent = (section: string) => siteContentData?.find((c: any) => c.section === section)?.content || {};

   // Fetch posts from cache
   const heroContent = getSectionContent('hero');
   const heroPosts = await getCachedData(`home_hero_posts:${heroContent.category_id || 'default'}`, async () => {
      const { data } = await supabase
         .from('cms_posts')
         .select('*')
         .eq('is_draft', false)
         .eq('category_id', heroContent.category_id || '999d1e43-1e43-1e43-1e43-1e431e431e43') 
         .order('published_at', { ascending: false })
         .limit(3);
      
      if (!data || data.length === 0) {
        const { data: fallback } = await supabase
          .from('cms_posts')
          .select('*')
          .eq('is_draft', false)
          .order('published_at', { ascending: false })
          .limit(3);
        return fallback || [];
      }
      return data;
   }, 600);

   const storyPosts = await getCachedData('home_story_posts', async () => {
      const { data } = await supabase
         .from('cms_posts')
         .select('*')
         .eq('is_draft', false)
         .order('published_at', { ascending: false })
         .limit(9);
      return data || [];
   }, 600);

   const highlightPosts = await getCachedData('home_highlight_posts', async () => {
      const { data } = await supabase
         .from('cms_posts')
         .select('*')
         .eq('is_draft', false)
         .order('published_at', { ascending: false })
         .limit(4);
      return data || [];
   }, 600);

   const activeProfiles = await getCachedData('home_active_profiles', async () => {
      const { data } = await supabase
         .from('profiles')
         .select('id, full_name, avatar_url')
         .eq('status', 'active')
         .limit(8);
      return data || [];
   }, 1800);

   const playersForCarousel = activeProfiles?.map(p => ({
     id: p.id,
     name: p.full_name || 'CenterKick Player',
     num: "0",
     img: p.avatar_url || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80"
   })) || DUMMY_PLAYERS;

   return (
      <HomeClient 
        layout={layout}
        heroPosts={heroPosts}
        storyPosts={storyPosts || []}
        highlightPosts={highlightPosts || []}
        dummyPlayers={playersForCarousel}
        siteContent={Object.fromEntries(siteContentData?.map((c: any) => [c.section, c.content]) || [])}
        navContent={navContent}
        footerContent={footerContent}
        siteSettings={siteSettings}
      />
   );
}
