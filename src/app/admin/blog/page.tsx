import { createClient } from '@/lib/supabase/server';
import { PlusCircle, Edit3, Trash2, FileText, Globe, Clock, Activity } from 'lucide-react';
import Link from 'next/link';

export default async function BlogDashboard() {
  const supabase = await createClient();
  
  const { data: posts } = await supabase
    .from('cms_posts')
    .select('*, author:users(email)')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Blog & News System</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Manage articles, categories, and media assets for the platform newsroom.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-100 text-gray-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-gray-50">
             Manage Categories
          </button>
          <Link 
            href="/admin/blog/new"
            className="bg-[#b50a0a] hover:bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-red-900/20 hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            Write Article
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Published Articles', value: posts?.filter(p => p.published_at).length || 0, icon: Globe },
          { label: 'Drafts', value: posts?.filter(p => !p.published_at).length || 0, icon: FileText },
          { label: 'Categories', value: '4', icon: Activity },
          { label: 'Media Assets', value: '24', icon: Clock },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                   <stat.icon className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                   <p className="text-2xl font-black text-gray-900 italic tracking-tight leading-none">{stat.value}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

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
                         <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors" title="Edit">
                           <Edit3 className="w-4 h-4" />
                         </button>
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
