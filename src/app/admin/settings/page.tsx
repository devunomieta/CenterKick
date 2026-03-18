import { Settings, Mail, Globe, Lock, Trash2, RefreshCw, Layers, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const sections = [
    { title: 'Global Configuration', label: 'Core', icon: Globe },
    { title: 'Mail & SMTP Settings', label: 'Infrastructure', icon: Mail },
    { title: 'Security & Access', label: 'System', icon: Shield },
    { title: 'Banners & Assets', label: 'Branding', icon: Layers },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">System Settings</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Configure global platform variables, manage integrations, and perform system maintenance.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Clear System Cache
          </button>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:bg-black">
            Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Navigation */}
         <div className="space-y-2">
            {sections.map((section, i) => (
              <button key={i} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all border ${i === 0 ? 'bg-white border-gray-200 shadow-sm' : 'border-transparent hover:bg-white hover:border-gray-100'}`}>
                 <div className="flex items-center gap-3">
                    <section.icon className={`w-4 h-4 ${i === 0 ? 'text-[#b50a0a]' : 'text-gray-400'}`} />
                    <span className={`text-[11px] font-black uppercase tracking-widest ${i === 0 ? 'text-gray-900' : 'text-gray-500'}`}>{section.title}</span>
                 </div>
              </button>
            ))}
         </div>

         {/* Settings Form */}
         <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-12">
               {/* 1. SMTP Section */}
               <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                     <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">SMTP Configuration</h3>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">For system emails and notifications</p>
                     </div>
                     <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Connected</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SMTP Host</label>
                        <input type="text" defaultValue="smtp.centerkick.net" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-[#b50a0a]" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SMTP Port</label>
                        <input type="text" defaultValue="587" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-[#b50a0a]" />
                     </div>
                  </div>
               </section>

               {/* 2. Platform Section */}
               <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                     <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Platform Controls</h3>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Authentication and visibility</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     {[
                       { label: 'Allow User Registration', active: true },
                       { label: 'Enable Public Search', active: true },
                       { label: 'Maintenance Mode', active: false },
                     ].map((toggle, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">{toggle.label}</span>
                          <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${toggle.active ? 'bg-[#b50a0a]' : 'bg-gray-300'}`}>
                             <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggle.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                          </div>
                       </div>
                     ))}
                  </div>
               </section>

               <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700">
                     <Trash2 className="w-4 h-4" /> Reset to Factory Defaults
                  </button>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest italic">Last modified: Oct 16, 2026 by centerkickdev@gmail.com</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
