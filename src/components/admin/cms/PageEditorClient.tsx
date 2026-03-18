'use client';

import { useState } from 'react';
import { 
  X, Plus, Trash2, ChevronUp, ChevronDown, 
  Save, Eye, Layout, Type, Image as ImageIcon,
  CheckCircle, Loader2, List
} from 'lucide-react';
import { updatePageLayout, updateSectionContent } from '@/app/admin/manage-ui/actions';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Section {
  key: string;
  name: string;
}

interface PageEditorClientProps {
  page: {
    slug: string;
    name: string;
    layout: string[];
  };
  content: any[];
  categories: any[];
}

export default function PageEditorClient({ page, content, categories }: PageEditorClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [layout, setLayout] = useState<string[]>(page.layout);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(layout[0] || null);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newLayout = [...layout];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newLayout.length) return;
    
    [newLayout[index], newLayout[newIndex]] = [newLayout[newIndex], newLayout[index]];
    setLayout(newLayout);
    showToast('Layout updated locally', 'info');
  };

  const saveLayout = async () => {
    setIsSaving(true);
    const res = await updatePageLayout(page.slug, layout);
    if (res.success) {
      showToast('Page layout saved successfully', 'success');
      router.refresh();
    } else {
      showToast(res.error || 'Failed to save layout', 'error');
    }
    setIsSaving(false);
  };

  const getSectionContent = (key: string) => {
    return content.find(c => c.section === key)?.content || {};
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 animate-in fade-in duration-700">
      
      {/* Sidebar: Layout Manager */}
      <div className="lg:w-80 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 sticky top-24">
           <div>
              <Link href="/admin/manage-ui" className="text-[9px] font-black text-[#b50a0a] uppercase tracking-widest flex items-center gap-2 mb-4 hover:translate-x-1 transition-transform">
                 <ChevronUp className="w-3 h-3 -rotate-90" /> Back to Dashboard
              </Link>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">{page.name}</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Section Layout</p>
           </div>

           <div className="space-y-3">
              {layout.map((key, index) => (
                <div 
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeSection === key 
                    ? 'border-[#b50a0a] bg-red-50/50 shadow-md' 
                    : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200'
                  }`}
                >
                   <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black italic ${
                        activeSection === key ? 'bg-[#b50a0a] text-white' : 'bg-white text-gray-300'
                      }`}>
                         {index + 1}
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${
                        activeSection === key ? 'text-gray-900' : 'text-gray-500'
                      }`}>{key.replace('_', ' ')}</span>
                   </div>
                   
                   <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }}
                        className="p-1 hover:text-[#b50a0a] text-gray-300 disabled:opacity-30" 
                        disabled={index === 0}
                      >
                         <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }}
                        className="p-1 hover:text-[#b50a0a] text-gray-300 disabled:opacity-30" 
                        disabled={index === layout.length - 1}
                      >
                         <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
              ))}
           </div>

           <button 
             onClick={saveLayout}
             disabled={isSaving}
             className="w-full bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#b50a0a] transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:opacity-50"
           >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save New Layout
           </button>
        </div>
      </div>

      {/* Main Content: Section Editor */}
      <div className="flex-1 space-y-8">
         {activeSection ? (
           <SectionEditor 
             page={page.slug} 
             section={activeSection} 
             initialContent={getSectionContent(activeSection)} 
             categories={categories}
           />
         ) : (
           <div className="bg-white p-20 rounded-[3.5rem] border border-gray-100 shadow-sm text-center">
              <Layout className="w-20 h-20 text-gray-100 mx-auto mb-8" />
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Select a section to edit</h3>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">All changes will be reflected on the live site almost instantly.</p>
           </div>
         )}
      </div>
    </div>
  );
}

function SectionEditor({ page, section, initialContent, categories }: { page: string, section: string, initialContent: any, categories: any[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateSectionContent(page, section, content);
    if (res.success) {
      showToast('Section saved successfully', 'success');
      router.refresh();
    } else {
      showToast(res.error || 'Failed to save section', 'error');
    }
    setIsSaving(false);
  };

  const updateField = (field: string, value: any) => {
    setContent({ ...content, [field]: value });
  };

  return (
    <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10 animate-in slide-in-from-bottom-4 duration-500">
       <div className="flex items-center justify-between border-b border-gray-50 pb-8">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#b50a0a]">
                <EditIcon keyName={section} />
             </div>
             <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Editing: {section.replace('_', ' ')}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Modify text, visuals, and dynamic connections</p>
             </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#b50a0a] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-red-900/10 disabled:opacity-50"
          >
             {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
             Publish Changes
          </button>
       </div>

       <form onSubmit={handleSave} className="space-y-8">
          {Object.keys(renderFields(section, content, updateField, categories)).length > 0 ? (
            renderFields(section, content, updateField, categories)
          ) : (
            <div className="p-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">No configurable fields for this section yet.</p>
            </div>
          )}
       </form>
    </div>
  );
}

function EditIcon({ keyName }: { keyName: string }) {
  if (keyName.includes('hero')) return <Type className="w-6 h-6" />;
  if (keyName.includes('cta')) return <Loader2 className="w-6 h-6" />;
  if (keyName.includes('testimonials')) return <List className="w-6 h-6" />;
  return <Layout className="w-6 h-6" />;
}

/**
 * Dynamic form renderer based on section key
 */
function renderFields(section: string, content: any, onChange: (f: string, v: any) => void, categories: any[]) {
  // Common text input helper
  const TextInput = ({ label, field, placeholder, multiline = false }: any) => (
    <div className="space-y-2">
       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
       {multiline ? (
          <textarea 
            rows={4}
            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-[11px] font-bold focus:ring-2 focus:ring-[#b50a0a] transition-all text-black placeholder:text-gray-300 resize-none"
            placeholder={placeholder}
            value={content[field] || ''}
            onChange={(e) => onChange(field, e.target.value)}
          />
       ) : (
          <input 
            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-[11px] font-bold focus:ring-2 focus:ring-[#b50a0a] transition-all text-black placeholder:text-gray-300"
            placeholder={placeholder}
            value={content[field] || ''}
            onChange={(e) => onChange(field, e.target.value)}
          />
       )}
    </div>
  );

  // Common category selector helper
  const CategorySelect = ({ label, field }: any) => (
    <div className="space-y-2">
       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
       <select 
         className="w-full bg-gray-50 border-none rounded-2xl p-4 text-[11px] font-bold focus:ring-2 focus:ring-[#b50a0a] transition-all text-black"
         value={content[field] || ''}
         onChange={(e) => onChange(field, e.target.value)}
       >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
       </select>
    </div>
  );

  switch (section) {
    case 'hero':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <TextInput label="Hero Title" field="title" placeholder="Platform Newsroom..." />
           <TextInput label="Hero Subtitle" field="subtitle" placeholder="Exclusive updates..." />
           <div className="md:col-span-2 shadow-sm">
              <CategorySelect label="Featured Post Category" field="category_id" />
           </div>
        </div>
      );
    case 'cta':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <TextInput label="CTA Subtitle" field="subtitle" placeholder="Ready to Rise?" />
           <TextInput label="CTA Title" field="title" placeholder="Professional Football Network" />
           <TextInput label="Primary Button Text" field="primaryButtonText" placeholder="Contact Our Agency" />
           <TextInput label="Primary Button Link" field="primaryButtonLink" placeholder="/contact" />
        </div>
      );
    case 'news':
    case 'stories':
    case 'highlights':
      return (
         <div className="space-y-6">
            <TextInput label="Section Title" field="title" placeholder="Section Header..." />
            <CategorySelect label="Blog Category to Display" field="category_id" />
         </div>
      );
    case 'mission':
    case 'vision':
      return (
        <div className="space-y-6">
           <TextInput label="Title" field="title" placeholder="Our Mission..." />
           <TextInput label="Description" field="description" placeholder="To empower footballers..." multiline />
        </div>
      );
    case 'navbar':
      return (
        <div className="space-y-6">
           <TextInput label="Brand Name" field="brand" placeholder="CenterKick" />
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mt-4">Navigation links are currently managed via JSON in the database for version 1.</p>
        </div>
      );
    case 'footer':
      return (
        <div className="space-y-6">
           <TextInput label="Footer Description" field="description" placeholder="CenterKick is a football media platform..." multiline />
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mt-4">Columns and social links are managed via JSON in the database for version 1.</p>
        </div>
      );
    default:
      return <p className="text-xs text-gray-400 italic">Configuration for {section} is coming soon.</p>;
  }
}
