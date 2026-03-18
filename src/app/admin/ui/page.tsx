import { Layout, PenTool, Image, Type, Save, Eye } from 'lucide-react';

export default function AdminUIPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">UI Management</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Customize site content, banners, and layout for key pages.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 hover:bg-gray-50">
            <Eye className="w-4 h-4" /> Preview Site
          </button>
          <button className="bg-[#b50a0a] hover:bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-red-900/20">
            <Save className="w-4 h-4" /> Save All Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Page List */}
        <div className="space-y-4">
           <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Editable Pages</h2>
           {[
             { name: 'Landing Page', icon: Layout, active: true },
             { name: 'About Us', icon: FileText, active: false },
             { name: 'Contact Page', icon: PenTool, active: false },
             { name: 'Navbar & Footer', icon: Type, active: false },
           ].map((page, i) => (
             <button key={i} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border ${page.active ? 'bg-white border-[#b50a0a] shadow-lg shadow-red-900/5' : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200'}`}>
                <page.icon className={`w-5 h-5 ${page.active ? 'text-[#b50a0a]' : 'text-gray-400'}`} />
                <span className={`text-sm font-black uppercase tracking-widest ${page.active ? 'text-gray-900' : 'text-gray-500'}`}>{page.name}</span>
             </button>
           ))}
        </div>

        {/* Editor Area */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <div>
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Main Hero Section</h3>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">LANDING PAGE CONTENT</p>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Hero Headline</label>
                    <input 
                      type="text" 
                      defaultValue="Empowering the Next Generation of African Football Stars" 
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-[#b50a0a] transition-all"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Hero Subheadline</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-[#b50a0a] transition-all"
                      defaultValue="Connect with elite scouts, professional coaches, and world-class agents. Your journey to the pitch starts here."
                    />
                 </div>
                 <div className="pt-4">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#b50a0a] hover:text-black transition-colors">
                       <Image className="w-4 h-4" /> Change Hero Background Image
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
import { FileText } from 'lucide-react';
