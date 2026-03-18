import { HomeClient } from '@/components/home/HomeClient';
import { createClient } from '@/lib/supabase/server';
import { getGlobalCMSData } from '@/app/admin/manage-ui/actions';

// Dummy profiles for carousel (8 items) - keep these in server to avoid cluttering client bundle if too big
const DUMMY_PLAYERS = [
   { name: 'Bamidele\nAdeniyi', num: 16, img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80" },
   { name: 'Yemi Daniel\nOlanrewaju', num: 24, img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80" },
   { name: 'Akere\nSamuel', num: 16, img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80" },
   { name: 'Chinedu\nOkonkwo', num: 9, img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80" },
   { name: 'Ibrahim\nMusa', num: 7, img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80" },
   { name: 'Olumide\nAjayi', num: 10, img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80" },
   { name: 'Tunde\nBello', num: 11, img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80" },
   { name: 'Emeka\nUche', num: 4, img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80" }
];

export default async function Home() {
   const supabase = await createClient();
   const { navContent, footerContent } = await getGlobalCMSData();

   // Fetch layout
   const { data: pageData } = await supabase
      .from('site_pages')
      .select('*')
      .eq('slug', '/')
      .single();

   const layout = pageData?.layout || ["hero", "stories", "news", "highlights", "cta", "testimonials"];

   // Fetch all site content for this page
   const { data: siteContentData } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', '/');

   const getSectionContent = (section: string) => siteContentData?.find(c => c.section === section)?.content || {};

   // Fetch posts based on section configurations
   const heroContent = getSectionContent('hero');
   const { data: heroPosts } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('is_draft', false)
      .eq('category_id', heroContent.category_id || '999d1e43-1e43-1e43-1e43-1e431e431e43') 
      .order('published_at', { ascending: false })
      .limit(3);

   // Fallback for Hero
   let finalHeroPosts = heroPosts || [];
   if (finalHeroPosts.length === 0) {
      const { data: fallbackHero } = await supabase
         .from('cms_posts')
         .select('*')
         .eq('is_draft', false)
         .order('published_at', { ascending: false })
         .limit(3);
      finalHeroPosts = fallbackHero || [];
   }

   const { data: storyPosts } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('is_draft', false)
      .order('published_at', { ascending: false })
      .limit(9);

   const { data: highlightPosts } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('is_draft', false)
      .order('published_at', { ascending: false })
      .limit(4);

   const { data: activeProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('status', 'active')
      .limit(8);

   const playersForCarousel = activeProfiles?.map(p => ({
     id: p.id,
     name: p.full_name || 'CenterKick Player',
     num: 0,
     img: p.avatar_url || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80"
   })) || DUMMY_PLAYERS;

   return (
      <HomeClient 
        layout={layout}
        heroPosts={finalHeroPosts}
        storyPosts={storyPosts || []}
        highlightPosts={highlightPosts || []}
        dummyPlayers={playersForCarousel}
        siteContent={Object.fromEntries(siteContentData?.map(c => [c.section, c.content]) || [])}
        navContent={navContent}
        footerContent={footerContent}
      />
   );
}
