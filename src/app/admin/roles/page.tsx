import { createClient } from '@/lib/supabase/server';
import { ShieldCheck, UserPlus, Search, Activity, Lock, Unlock } from 'lucide-react';

export default async function AdminRolesPage() {
  const supabase = await createClient();
  
  const { data: adminUsers } = await supabase
    .from('users')
    .select('*, profiles(*)')
    .eq('role', 'superadmin')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Manage Roles & Admins</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Configure administrative accounts, manage permissions, and audit system activities.</p>
        </div>
        <button className="bg-[#b50a0a] hover:bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-red-900/20">
          <UserPlus className="w-4 h-4" /> invitation Admin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Admin List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Administrators</h2>
                <Search className="w-4 h-4 text-gray-300" />
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-gray-600">
                 <tbody className="divide-y divide-gray-50">
                   {adminUsers?.map((admin) => (
                     <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-[#b50a0a] flex items-center justify-center font-black text-white text-xs shadow-lg shadow-red-900/20">
                                {admin.email?.[0].toUpperCase()}
                             </div>
                             <div>
                                <p className="font-bold text-gray-900 leading-none">{admin.profiles?.first_name} {admin.profiles?.last_name}</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">{admin.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="px-2.5 py-1 rounded-lg bg-red-50 text-[#b50a0a] text-[9px] font-black uppercase tracking-widest">Superadmin</span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#b50a0a] transition-colors">Permissions</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>

        {/* Audit Logs Sidebar */}
        <div className="space-y-6">
           <div className="bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-200 relative overflow-hidden">
              <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
              <h2 className="text-[10px] font-black text-[#b50a0a] uppercase tracking-[0.2em] mb-4">Live Activity</h2>
              <div className="space-y-4 relative z-10">
                 {[
                   { user: 'centerkickdev@gmail.com', action: 'Modified System Settings', time: '2m ago' },
                   { user: 'centerkickdev@gmail.com', action: 'Created CMS Post', time: '14m ago' },
                   { user: 'System', action: 'Automated Backup Completed', time: '1h ago' },
                 ].map((log, i) => (
                   <div key={i} className="border-l-2 border-[#b50a0a]/30 pl-4 py-1">
                      <p className="text-[10px] font-bold text-white leading-tight">{log.action}</p>
                      <p className="text-[8px] text-gray-500 uppercase font-black mt-1 tracking-widest">{log.time} • {log.user}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">View Full Audit Trail</button>
           </div>
        </div>
      </div>
    </div>
  );
}
