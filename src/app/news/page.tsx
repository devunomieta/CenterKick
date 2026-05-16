import { createClient } from '@/lib/supabase/server';
import BlogFeedClient from "@/components/news/BlogFeedClient";
import { getCachedData } from '@/lib/redis';
import { getGlobalCMSData } from '@/lib/cms';

export default async function NewsPage() {
   const supabase = await createClient();
   const { navContent, footerContent, siteSettings } = await getGlobalCMSData();

   // Fetch layout from cache
   const layout = await getCachedData('news_layout', async () => {
      const { data: pageData } = await supabase
         .from('site_pages')
         .select('*')
         .eq('slug', '/news')
         .single();
      return pageData?.layout || ["header", "featured", "feed"];
   }, 3600);

   // Fetch all site content for this page from cache
   const siteContent = await getCachedData('news_site_content', async () => {
      const { data } = await supabase
         .from('site_content')
         .select('*')
         .eq('page', '/news');
      return Object.fromEntries(data?.map(c => [c.section, c.content]) || []);
   }, 1800);
   
   // Fetch All Posts from cache
   const posts = await getCachedData('news_all_posts', async () => {
      const { data } = await supabase
         .from('cms_posts')
         .select('*, category:blog_categories(name), post_tags(tag_id)')
         .eq('is_draft', false)
         .order('published_at', { ascending: false });
      return data || [];
   }, 600);

   const categories = await getCachedData('blog_categories', async () => {
      const { data } = await supabase
         .from('blog_categories')
         .select('*')
         .order('name');
      return data || [];
   }, 3600);

   const tags = await getCachedData('blog_tags', async () => {
      const { data } = await supabase
         .from('blog_tags')
         .select('*')
         .order('name');
      return data || [];
   }, 3600);

   return (
      <BlogFeedClient 
         layout={layout}
         siteContent={siteContent}
         initialPosts={posts || []} 
         categories={categories || []} 
         tags={tags || []} 
         navContent={navContent}
         footerContent={footerContent}
         siteSettings={siteSettings}
      />
   );
}
