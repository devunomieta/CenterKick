'use client';

import { useState } from 'react';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

export default function CMSDashboard() {
  const [isComposing, setIsComposing] = useState(false);
  const [content, setContent] = useState('');

  const posts = [
    { id: 1, title: 'Tactical breakdown of the weekend', type: 'News', status: 'Published', date: 'Oct 14, 2026' },
    { id: 2, title: 'Bamidele signs new agent', type: 'Story', status: 'Draft', date: 'Oct 12, 2026' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Management System</h1>
        {!isComposing && (
          <button 
            onClick={() => setIsComposing(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            New Post
          </button>
        )}
      </div>

      {isComposing ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
             <h2 className="text-xl font-bold text-gray-900">Compose New Post</h2>
             <button onClick={() => setIsComposing(false)} className="text-gray-500 hover:text-gray-900 text-sm font-medium">Cancel</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg font-bold" placeholder="Post Title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
                <select className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-2 focus:ring-primary bg-white outline-none">
                  <option>News</option>
                  <option>Story</option>
                  <option>Highlight</option>
                </select>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-500">Click to upload image</span>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition-colors shadow-sm">
                Publish Post
              </button>
              <button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-bold transition-colors shadow-sm">
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-700">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded text-xs font-semibold">{post.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${post.status === 'Published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{post.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                         <Edit3 className="w-4 h-4" />
                       </button>
                       <button className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
