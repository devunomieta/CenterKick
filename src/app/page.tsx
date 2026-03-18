import { HomeClient } from '@/components/home/HomeClient';
import { createClient } from '@/lib/supabase/server';

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

   // Fetch featured posts for Hero (up to 3)
   const { data: heroPosts } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('published_at', 'not.is.null')
      .order('published_at', { ascending: false })
      .limit(3);

   // Fetch top stories (up to 9 for 3 pages of pagination)
   const { data: storyPosts } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('type', 'story')
      .eq('published_at', 'not.is.null')
      .order('published_at', { ascending: false })
      .limit(9);

   // Fetch news for the 4-card row
   const { data: newsPosts } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('type', 'news')
      .eq('published_at', 'not.is.null')
      .order('published_at', { ascending: false })
      .limit(4);

   // Fetch highlights for the 4-card row
   const { data: highlightPosts } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('type', 'highlight')
      .eq('published_at', 'not.is.null')
      .order('published_at', { ascending: false })
      .limit(4);

   // Fetch active profiles for carousel (up to 8)
   const { data: activeProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('status', 'active')
      .limit(8);

   const playersForCarousel = activeProfiles?.map(p => ({
     id: p.id,
     name: p.full_name || 'CenterKick Player',
     num: 0, // Profile table doesn't have 'jersey_number' yet, we can add it later or use 0
     img: p.avatar_url || "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80"
   })) || DUMMY_PLAYERS;

   // Fetch site content (CTA, etc.)
   const { data: siteContent } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', 'landing');

   // Helper to find specific section content
   const getContent = (section: string) => siteContent?.find(c => c.section === section)?.content || {};

   return (
      <HomeClient 
        heroPosts={heroPosts || []}
        storyPosts={storyPosts || []}
        newsPosts={newsPosts || []}
        dummyPlayers={playersForCarousel}
        highlightPosts={highlightPosts || []}
        siteContent={{
          cta: getContent('cta'),
          testimonials: getContent('testimonials'),
          highlightsIntro: getContent('highlights_intro')
        }}
      />
   );
}
