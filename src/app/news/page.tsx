import { createClient } from '@/lib/supabase/server';
import BlogFeedClient from "@/components/news/BlogFeedClient";
import { getGlobalCMSData } from '@/app/admin/manage-ui/actions';

export default async function NewsPage() {
   const supabase = await createClient();
   const { navContent, footerContent } = await getGlobalCMSData();

   // Fetch layout
   const { data: pageData } = await supabase
      .from('site_pages')
      .select('*')
      .eq('slug', '/news')
      .single();

   const layout = pageData?.layout || ["header", "featured", "feed"];

   // Fetch all site content for this page
   const { data: siteContentData } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', '/news');

   const siteContent = Object.fromEntries(siteContentData?.map(c => [c.section, c.content]) || []);
   
   // Fetch All Posts for the feed
   const { data: posts } = await supabase
      .from('cms_posts')
      .select('*, category:blog_categories(name), post_tags(tag_id)')
      .eq('is_draft', false)
      .order('published_at', { ascending: false });

   const { data: categories } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

   const { data: tags } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name');

   return (
      <BlogFeedClient 
         layout={layout}
         siteContent={siteContent}
         initialPosts={posts || []} 
         categories={categories || []} 
         tags={tags || []} 
         navContent={navContent}
         footerContent={footerContent}
      />
   );
}
