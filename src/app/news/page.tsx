import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, SlidersHorizontal, ArrowRight, ChevronRight, Filter, Calendar as CalendarIcon, Newspaper, Star } from "lucide-react";
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function NewsPage() {
   const supabase = await createClient();
   
   // Fetch Latest 3 for the top section
   const { data: latestPosts } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('published_at', 'not.is.null')
      .order('published_at', { ascending: false })
      .limit(3);

   // Fetch All for the grid
   const { data: allPosts } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('published_at', 'not.is.null')
      .order('published_at', { ascending: false });

   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20">
            {/* Page Header */}
            <div className="bg-[#383838] py-8">
               <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
                  <h1 className="text-white text-3xl font-black tracking-wide uppercase">News <span className="text-[#b50a0a]">& Updates</span></h1>
               </div>
            </div>

            {/* Sub-Navigation */}
            <div className="bg-[#292929] border-b border-gray-800">
               <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
                  <ul className="flex items-center gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth whitespace-nowrap">
                     <li>
                        <Link href="/news" className="text-[#b50a0a] text-[10px] font-bold uppercase tracking-widest py-4 block">
                           All News
                        </Link>
                     </li>
                     <li>
                        <Link href="/news/match-fixtures" className="text-white hover:text-[#b50a0a] transition-colors text-[10px] font-bold uppercase tracking-widest py-4 block">
                           Match Fixtures
                        </Link>
                     </li>
                     <li>
                        <Link href="/news/transfer-focus" className="text-white hover:text-[#b50a0a] transition-colors text-[10px] font-bold uppercase tracking-widest py-4 block">
                           Transfer Focus
                        </Link>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 py-12">
               {/* Search Bar */}
               <div className="flex justify-center mb-16">
                  <div className="relative w-full max-w-[600px]">
                     <input 
                        type="text" 
                        placeholder="Search articles..." 
                        className="w-full border-b-2 border-gray-900 py-3 pl-4 pr-24 text-sm font-bold text-gray-900 focus:outline-none placeholder:text-gray-400"
                     />
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4 text-[#b50a0a]">
                        <Search className="w-4 h-4 cursor-pointer hover:text-red-900 transition-colors" />
                        <span className="text-gray-300">|</span>
                        <Filter className="w-4 h-4 cursor-pointer hover:text-red-900 transition-colors hidden sm:block" />
                     </div>
                  </div>
               </div>

               {/* Latest News Section */}
               {latestPosts && latestPosts.length > 0 && (
                  <section className="mb-16 animate-in fade-in duration-700">
                     <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#b50a0a] flex items-center justify-center shadow-lg shadow-red-900/10">
                              <Star className="w-5 h-5 text-white" />
                           </div>
                           <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Featured Stories</h2>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestPosts.map((post) => (
                           <Link href={`/news/${post.slug}`} key={post.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all group flex flex-col h-full">
                              <div className="h-56 overflow-hidden relative">
                                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                 {post.cover_image_url ? (
                                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                 ) : (
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center text-[#b50a0a] opacity-80">
                                       <Newspaper className="w-12 h-12" />
                                    </div>
                                 )}
                                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-900 z-20">
                                    {post.type}
                                 </div>
                              </div>
                              <div className="p-8 flex flex-col flex-1 justify-between">
                                 <h3 className="font-black text-gray-900 text-lg leading-tight mb-4 group-hover:text-[#b50a0a] transition-colors line-clamp-2 italic">
                                    {post.title}
                                 </h3>
                                 <div className="flex items-center gap-2 text-gray-400">
                                    <CalendarIcon className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                       {new Date(post.published_at).toLocaleDateString()}
                                    </span>
                                 </div>
                              </div>
                           </Link>
                        ))}
                     </div>
                  </section>
               )}

               {/* All News Section */}
               <section className="mb-12 pt-12 border-t border-gray-50">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-10">All News & Feed</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {!allPosts || allPosts.length === 0 ? (
                        <div className="col-span-1 md:col-span-3 py-20 text-center bg-gray-50 rounded-[40px] border border-gray-100">
                           <Newspaper className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                           <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">No articles found in the feed.</p>
                        </div>
                     ) : (
                        allPosts.map((post) => (
                           <Link href={`/news/${post.slug}`} key={post.id} className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
                              <div className="h-44 overflow-hidden relative">
                                 <div className="absolute inset-0 bg-black/10 group-hover:opacity-0 transition-opacity z-10" />
                                 <img src={post.cover_image_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              </div>
                              <div className="p-6 flex flex-col flex-1 justify-between">
                                 <h3 className="font-bold text-gray-900 text-sm leading-snug mb-4 group-hover:text-[#b50a0a] transition-colors line-clamp-2">
                                    {post.title}
                                 </h3>
                                 <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                       {new Date(post.published_at).toLocaleDateString()}
                                    </span>
                                    <span className="text-[8px] font-black text-[#b50a0a] uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                       Read Article <ArrowRight className="w-3 h-3" />
                                    </span>
                                 </div>
                              </div>
                           </Link>
                        ))
                     )}
                  </div>
               </section>

               {/* Load More Button */}
               {allPosts && allPosts.length > 12 && (
                  <div className="flex justify-center mt-12 mb-8">
                     <button className="bg-gray-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-[0.3em] px-12 py-4 rounded-xl shadow-xl transition-all hover:-translate-y-1">
                        Load More Articles
                     </button>
                  </div>
               )}

            </div>
         </main>

         <Footer />
      </div>
   );
}
