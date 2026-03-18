import { createClient } from '@/lib/supabase/server';
import { PlusCircle, Edit3, Trash2, FileText, Globe, Clock, Activity, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import BlogManagementClient from '@/components/admin/blog/BlogManagementClient';

export default async function BlogDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ status?: string }> 
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  
  const query = supabase
    .from('cms_posts')
    .select('*, author:users(email), category:blog_categories(name)');
    
  if (status === 'draft') {
    query.is('published_at', null);
  } else if (status === 'published') {
    query.not('published_at', 'is', null);
  }

  const { data: posts } = await query.order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');

  const { data: tags } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name');

  const { data: assets } = await supabase
    .from('blog_assets')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
             Blog <span className="text-[#b50a0a]">&</span> News Room
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#b50a0a]"></span>
             Centralized content management control center
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <BlogManagementClient 
            categories={categories || []} 
            tags={tags || []} 
            assets={assets || []} 
          />
          <div className="w-[1px] h-8 bg-gray-100 mx-2 hidden md:block"></div>
          <Link 
            href="/admin/blog/new"
            className="bg-[#b50a0a] hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-red-900/20 hover:-translate-y-1 active:translate-y-0"
          >
            <PlusCircle className="w-5 h-5" />
            Write New Article
          </Link>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-50/50 rounded-full blur-[100px]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            label: 'Published Articles', 
            value: (posts?.filter(p => p.published_at).length || 0), 
            icon: Globe,
            href: '/admin/blog?status=published',
            active: status === 'published'
          },
          { 
            label: 'Drafts', 
            value: (posts?.filter(p => !p.published_at).length || 0), 
            icon: FileText,
            href: '/admin/blog?status=draft',
            active: status === 'draft'
          },
        ].map((stat, i) => (
          <Link 
            key={i} 
            href={stat.href}
            className={`bg-white p-8 rounded-[2.5rem] border transition-all hover:shadow-xl hover:-translate-y-1 group ${
              stat.active ? 'border-[#b50a0a] ring-4 ring-red-500/5 shadow-lg' : 'border-gray-100 shadow-sm'
            }`}
          >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-colors ${
                     stat.active ? 'bg-[#b50a0a] text-white shadow-lg' : 'bg-gray-50 text-gray-400 group-hover:bg-[#b50a0a]/10 group-hover:text-[#b50a0a]'
                   }`}>
                      <stat.icon className="w-8 h-8 font-black" />
                   </div>
                   <div>
                      <p className={`text-[11px] font-black uppercase tracking-[0.2em] leading-none mb-2 ${
                        stat.active ? 'text-[#b50a0a]' : 'text-gray-400'
                      }`}>{stat.label}</p>
                      <p className="text-4xl font-black text-gray-900 italic tracking-tighter leading-none">{stat.value}</p>
                   </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 transition-all ${
                  stat.active ? 'bg-black text-white' : 'bg-white text-gray-300'
                }`}>
                   <ChevronRight className="w-5 h-5" />
                </div>
             </div>
          </Link>
        ))}
      </div>

      {status && (
        <div className="flex items-center justify-between bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#b50a0a] animate-pulse"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                Showing <span className="text-[#b50a0a] italic">{status}</span> articles only
             </p>
          </div>
          <Link 
            href="/admin/blog"
            className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-2"
          >
             Clear Filter
             <span className="w-5 h-5 bg-gray-50 rounded-full flex items-center justify-center">×</span>
          </Link>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Title & Excerpt</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Created</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                     <FileText className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                     <p className="text-xs font-black uppercase tracking-widest text-gray-400">No content found.</p>
                  </td>
                </tr>
              ) : (
                posts?.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="max-w-md">
                          <p className="font-bold text-gray-900 leading-tight group-hover:text-[#b50a0a] transition-colors">{post.title}</p>
                          <p className="text-[10px] text-gray-400 mt-1 truncate">{post.excerpt || 'No excerpt provided...'}</p>
                       </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {post.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${post.published_at ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${post.published_at ? 'text-green-600' : 'text-gray-400'}`}>
                          {post.published_at ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-[10px] font-bold text-gray-400 uppercase">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Link 
                           href={`/admin/blog/edit/${post.id}`}
                           className="p-2 text-gray-400 hover:text-gray-900 transition-colors" 
                           title="Edit"
                         >
                           <Edit3 className="w-4 h-4" />
                         </Link>
                         <button className="p-2 text-gray-400 hover:text-[#b50a0a] transition-colors" title="Delete">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
