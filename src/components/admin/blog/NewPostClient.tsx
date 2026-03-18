'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import { 
  Save, Globe, Eye, Settings, Image as ImageIcon, 
  ChevronLeft, X, Check, Loader2, Link as LinkIcon,
  Bold, Italic, List, Heading1, Heading2, Quote, Undo, Redo, Plus, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { createPost, updatePost, uploadBlogImage } from '@/app/admin/blog/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

interface NewPostClientProps {
  categories: any[];
  tags: any[];
  post?: any; // For editing
}

export default function NewPostClient({ categories, tags, post }: NewPostClientProps) {
  const router = useRouter();
  const { showToast, hideToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    category_id: post?.category_id || '',
    cover_image_url: post?.cover_image_url || '',
    is_draft: post?.is_draft ?? true,
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    og_image_url: post?.og_image_url || '',
  });

  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.post_tags?.map((pt: any) => pt.tag_id) || []
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-3xl shadow-lg border border-gray-100 my-8',
        },
      }),
      BubbleMenuExtension,
    ],
    content: post?.content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[500px] max-w-none px-8 py-12 bg-white rounded-3xl border border-gray-100 shadow-sm',
      },
    },
  });

  // Auto-generate slug if not manually edited
  useEffect(() => {
    if (!post && formData.title && !formData.slug) {
      setFormData(prev => ({ 
        ...prev, 
        slug: formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') 
      }));
    }
  }, [formData.title, post]);

  const handleSave = async (publish: boolean) => {
    if (!editor) return;
    setIsLoading(true);

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, String(value));
    });
    submissionData.set('content', editor.getHTML());
    submissionData.set('published', publish ? 'true' : 'false');
    submissionData.set('tags', JSON.stringify(selectedTags));

    const res = post 
      ? await updatePost(post.id, submissionData) 
      : await createPost(submissionData);

    if (res?.error) {
      showToast(res.error, 'error');
    } else {
      showToast(post ? 'Post updated successfully' : 'Post published successfully', 'success');
      router.push('/admin/blog');
    }
    setIsLoading(false);
  };

  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="flex flex-wrap items-center gap-1 p-2 mb-4 bg-gray-50 rounded-2xl border border-gray-100">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file || !editor) return;
            
            const toastId = showToast('Uploading image...', 'loading');
            const uploadData = new FormData();
            uploadData.append('file', file);
            
            const res = await uploadBlogImage(uploadData);
            hideToast(toastId);

            if (res.url) {
              editor.chain().focus().setImage({ src: res.url }).run();
              showToast('Image uploaded successfully', 'success');
            } else {
              showToast(res.error || 'Upload failed', 'error');
            }
          }}
        />
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('bold') ? 'bg-black text-white' : 'hover:bg-white text-gray-400'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('italic') ? 'bg-black text-white' : 'hover:bg-white text-gray-400'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-black text-white' : 'hover:bg-white text-gray-400'}`}
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : 'hover:bg-white text-gray-400'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('bulletList') ? 'bg-black text-white' : 'hover:bg-white text-gray-400'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition-all ${editor.isActive('blockquote') ? 'bg-black text-white' : 'hover:bg-white text-gray-400'}`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg hover:bg-white text-gray-400 transition-all"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded-lg hover:bg-white text-gray-400 transition-all"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded-lg hover:bg-white text-gray-400 transition-all"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-32 animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-12">
        <Link 
          href="/admin/blog" 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => handleSave(false)}
             disabled={isLoading}
             className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 flex items-center gap-2"
           >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Draft
           </button>
           <button 
             onClick={() => handleSave(true)}
             disabled={isLoading}
             className="px-8 py-3 bg-[#b50a0a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-red-900/10"
           >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              Publish Post
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Editor Section */}
        <div className="lg:col-span-8 space-y-8">
           <div className="space-y-4">
              <input 
                 type="text" 
                 placeholder="Enter Post Title..." 
                 className="w-full bg-transparent border-none p-0 text-5xl font-black italic uppercase tracking-tighter text-black placeholder:text-gray-200 focus:ring-0 leading-tight"
                 value={formData.title}
                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                 <LinkIcon className="w-3 h-3" />
                 https://centerkick.com/news/
                 <input 
                    type="text" 
                    className="bg-gray-50 border-none rounded px-2 py-0.5 text-black focus:ring-1 focus:ring-[#b50a0a] w-auto"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                 />
              </div>
           </div>

           <div className="space-y-2">
              <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest ml-1">Excerpt / Summary</p>
              <textarea 
                 rows={3} 
                 placeholder="Brief summary for listing pages..."
                 className="w-full bg-white border border-gray-100 rounded-[2rem] p-6 text-[11px] font-bold focus:ring-2 focus:ring-[#b50a0a] transition-all text-black placeholder:text-gray-300 resize-none shadow-sm"
                 value={formData.excerpt}
                 onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
           </div>

           <div className="space-y-4">
              <MenuBar />
              {editor && (
                <BubbleMenu editor={editor} shouldShow={({ editor: e }: any) => e.isActive('image')}>
                  <div className="flex bg-black text-white rounded-xl shadow-2xl p-1 overflow-hidden border border-white/10 backdrop-blur-md">
                    <button 
                      onClick={() => editor.chain().focus().deleteSelection().run()}
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-600 rounded-lg transition-all text-[9px] font-black uppercase tracking-widest"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Image
                    </button>
                  </div>
                </BubbleMenu>
              )}
              <EditorContent editor={editor} />
           </div>
        </div>

        {/* Sidebar Configuration */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#b50a0a]" /> Post Settings
                 </h4>
                 
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Primary Category</label>
                    <select 
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-black"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    >
                       <option value="">Uncategorized</option>
                       {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                       ))}
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Tags</label>
                    <div className="flex flex-wrap gap-2">
                       {tags.map(tag => (
                          <button 
                            key={tag.id}
                            onClick={() => {
                               if (selectedTags.includes(tag.id)) {
                                  setSelectedTags(selectedTags.filter(id => id !== tag.id));
                               } else {
                                  setSelectedTags([...selectedTags, tag.id]);
                               }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                               selectedTags.includes(tag.id) 
                               ? 'bg-black text-white' 
                               : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                             {tag.name}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-50">
                 <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#b50a0a]" /> Media Assets
                 </h4>
                  <div 
                    onClick={() => coverInputRef.current?.click()}
                    className="aspect-video bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-[#b50a0a]/30 transition-all overflow-hidden relative"
                  >
                     <input 
                        type="file" 
                        ref={coverInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if (!file) return;
                           
                           const toastId = showToast('Uploading cover image...', 'loading');
                           const uploadData = new FormData();
                           uploadData.append('file', file);
                           
                           const res = await uploadBlogImage(uploadData);
                           hideToast(toastId);

                           if (res.url) {
                              setFormData({ ...formData, cover_image_url: res.url });
                              showToast('Cover image uploaded', 'success');
                           } else {
                              showToast(res.error || 'Upload failed', 'error');
                           }
                        }}
                     />
                     {formData.cover_image_url ? (
                        <>
                           <img src={formData.cover_image_url} className="w-full h-full object-cover" alt="Cover" />
                           <button 
                             onClick={(e) => {
                                e.stopPropagation();
                                setFormData({ ...formData, cover_image_url: '' });
                             }}
                             className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-xl"
                           >
                              <X className="w-5 h-5" />
                           </button>
                        </>
                     ) : (
                        <>
                           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                              <Plus className="w-6 h-6 text-gray-300" />
                           </div>
                           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Set Cover Image</p>
                           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 italic">Click to upload premium visual</p>
                        </>
                     )}
                  </div>
                  <input 
                     type="text" 
                     placeholder="Or paste direct image URL..." 
                     className="w-full bg-gray-50 border-none rounded-xl p-3 text-[10px] font-bold focus:ring-1 focus:ring-[#b50a0a] text-black placeholder:text-gray-400"
                     value={formData.cover_image_url}
                     onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                 <Globe className="w-4 h-4 text-[#b50a0a]" /> SEO Optimization
              </h4>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Meta Title</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-[10px] font-bold focus:ring-1 focus:ring-[#b50a0a] text-black placeholder:text-gray-300" 
                      placeholder="SEO Title..." 
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Meta Description</label>
                    <textarea 
                      rows={4} 
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-[10px] font-bold focus:ring-1 focus:ring-[#b50a0a] text-black placeholder:text-gray-300 resize-none" 
                      placeholder="SEO Description..." 
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
