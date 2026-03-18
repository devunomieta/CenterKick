import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from '@/lib/supabase/server';
import BlogFeedClient from "@/components/news/BlogFeedClient";

export default async function NewsPage() {
   const supabase = await createClient();
   
   // Fetch All Posts with Category and Tag data
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
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20">
            {/* Page Header */}
            <div className="bg-[#383838] py-12">
               <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
                  <h1 className="text-white text-5xl font-black tracking-tighter uppercase italic">Platform <span className="text-[#b50a0a]">Newsroom</span></h1>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Exclusive updates, transfer focus, and match highlights from centerkick.</p>
               </div>
            </div>

            <BlogFeedClient 
               initialPosts={posts || []} 
               categories={categories || []} 
               tags={tags || []} 
            />

            <div className="h-32" />
         </main>

         <Footer />
      </div>
   );
}
