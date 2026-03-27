'use client';

import { useState } from 'react';
import { Edit3, Trash2, Globe, FileText, Loader2, MoreVertical, Eye } from 'lucide-react';
import Link from 'next/link';
import { deletePost, togglePostStatus } from '@/app/admin/blog/actions';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

interface BlogListClientProps {
  initialPosts: any[];
}

export default function BlogListClient({ initialPosts }: BlogListClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    setLoadingId(id);
    const res = await deletePost(id);
    if (res?.error) {
      showToast(res.error, 'error');
    } else {
      showToast('Post deleted successfully', 'success');
      router.refresh();
    }
    setLoadingId(null);
  };

  const handleToggleStatus = async (id: string, currentPublishedAt: any) => {
    setLoadingId(id);
    const res = await togglePostStatus(id, !!currentPublishedAt);
    if (res?.error) {
      showToast(res.error, 'error');
    } else {
      showToast(currentPublishedAt ? 'Post moved to Drafts' : 'Post published', 'success');
      router.refresh();
    }
    setLoadingId(null);
  };

  if (initialPosts.length === 0) {
    return (
      <div className="px-8 py-20 text-center">
        <FileText className="w-12 h-12 text-gray-100 mx-auto mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">No content found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-[#f8f9fa] border-b border-gray-100">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Title & Excerpt</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Created</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {initialPosts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-8 py-6">
                <div className="max-w-md">
                  <p className="font-bold text-gray-900 leading-tight group-hover:text-[#b50a0a] transition-colors line-clamp-1">{post.title}</p>
                  <p className="text-[10px] text-gray-400 mt-1 truncate">{post.excerpt || 'No excerpt provided...'}</p>
                </div>
              </td>
              <td className="px-8 py-6 whitespace-nowrap">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  {post.category?.name || 'Uncategorized'}
                </span>
              </td>
              <td className="px-8 py-6 whitespace-nowrap">
                <button 
                  onClick={() => handleToggleStatus(post.id, post.published_at)}
                  disabled={loadingId === post.id}
                  className="flex items-center gap-2 group/status"
                >
                  <div className={`w-1.5 h-1.5 rounded-full transition-transform group-hover/status:scale-150 ${post.published_at ? 'bg-green-500 shadow-sm shadow-green-500/50' : 'bg-gray-300'}`}></div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${post.published_at ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}>
                    {post.published_at ? 'Published' : 'Draft'}
                  </span>
                  {loadingId === post.id && <Loader2 className="w-3 h-3 animate-spin text-gray-400" />}
                </button>
              </td>
              <td className="px-8 py-6 whitespace-nowrap text-[10px] font-bold text-gray-400 uppercase">
                {new Date(post.created_at).toLocaleDateString()}
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link 
                    href={`/news/${post.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors" 
                    title="View Public Link"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link 
                    href={`/admin/blog/edit/${post.id}`}
                    className="p-2 text-gray-400 hover:text-gray-900 transition-colors" 
                    title="Edit Content"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={loadingId === post.id}
                    className="p-2 text-gray-400 hover:text-[#b50a0a] transition-colors" 
                    title="Delete Permanently"
                  >
                    {loadingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
