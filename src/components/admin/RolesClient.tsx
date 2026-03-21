'use client';

import { useState } from 'react';
import { 
  ShieldCheck, UserPlus, Search, Activity, 
  Trash2, Mail, Clock, Shield, CheckCircle, Loader2, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RolesClient({ 
  adminUsers, 
  invitations,
  currentUserId,
  currentUserRole 
}: { 
  adminUsers: any[], 
  invitations: any[],
  currentUserId: string,
  currentUserRole: string
}) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send invitation');

      setIsInviteModalOpen(false);
      setEmail('');
      setRole('admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = adminUsers.filter(admin => 
    admin.email?.toLowerCase().includes(search.toLowerCase()) ||
    `${admin.profiles?.first_name} ${admin.profiles?.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const canRemove = (targetRole: string, targetId: string) => {
    if (targetRole === 'superadmin') return false;
    if (targetId === currentUserId) return false;
    if (currentUserRole === 'superadmin') return true;
    if (currentUserRole === 'admin' && ['admin', 'blogger', 'operations', 'finance'].includes(targetRole)) return true;
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Manage Roles & Admins</h1>
          <p className="text-gray-900 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Configure administrative accounts, manage permissions, and audit system activities.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-[#b50a0a] hover:bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-red-900/20 active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> Invite Admin Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Admin List */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Active Administrators</h2>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                   <input 
                      type="text" 
                      placeholder="Search admins..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:border-gray-100 focus:bg-white rounded-xl text-xs font-bold outline-none transition-all w-64 text-gray-900"
                   />
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-gray-600">
                 <tbody className="divide-y divide-gray-50">
                   {filteredAdmins.map((admin) => (
                     <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center font-black text-white text-xs shadow-lg">
                                {admin.email?.[0].toUpperCase()}
                             </div>
                             <div>
                                <p className="font-bold text-gray-900 leading-none">{admin.profiles?.first_name} {admin.profiles?.last_name}</p>
                                <p className="text-[10px] text-gray-900 mt-1 uppercase font-bold tracking-widest">{admin.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            admin.role === 'superadmin' ? 'bg-red-50 text-[#b50a0a]' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {admin.role}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          {canRemove(admin.role, admin.id) && (
                            <button className="p-2 text-gray-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                               <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          {admin.role === 'superadmin' && (
                            <Shield className="w-4 h-4 text-gray-200 inline-block" />
                          )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

           {/* Pending Invitations */}
           {invitations.length > 0 && (
             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-50">
                  <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Pending Invitations</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm text-gray-600">
                   <tbody className="divide-y divide-gray-50">
                     {invitations.map((invite) => (
                       <tr key={invite.id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                                  <Mail className="w-4 h-4" />
                               </div>
                               <div>
                                  <p className="font-bold text-gray-900 leading-none">{invite.email}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Clock className="w-2.5 h-2.5 text-gray-400" />
                                    <p className="text-[8px] text-gray-900 uppercase font-black tracking-widest">Expires: {new Date(invite.expires_at).toLocaleDateString()}</p>
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-400 text-[9px] font-black uppercase tracking-widest">
                              {invite.role}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button className="text-[9px] font-black uppercase tracking-widest text-[#b50a0a] hover:underline transition-all">Resend</button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           )}
        </div>

        {/* Audit Logs Sidebar - Simplified for now */}
        <div className="space-y-6">
           <div className="bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-200 relative overflow-hidden">
              <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
              <h2 className="text-[10px] font-black text-[#b50a0a] uppercase tracking-[0.2em] mb-4">System Roles Info</h2>
              <div className="space-y-4 relative z-10 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[#b50a0a] mb-1">Superadmin</p>
                    <p className="text-[9px] leading-relaxed text-gray-200">Full system control. Cannot be removed.</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-white mb-1">Admin</p>
                    <p className="text-[9px] leading-relaxed">Full access. Can be removed by Superadmin.</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-white mb-1">Blogger</p>
                    <p className="text-[9px] leading-relaxed">Access to Blog / CMS only.</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-white mb-1">Operations</p>
                    <p className="text-[9px] leading-relaxed">Profile management. No financial access.</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-white mb-1">Finance</p>
                    <p className="text-[9px] leading-relaxed text-gray-200">Financial / Subscription access.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsInviteModalOpen(false)}></div>
           <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in slide-in-from-bottom-4 duration-300">
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                 <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Invite New Admin</h3>
                 <p className="text-[9px] font-bold text-gray-900 uppercase tracking-widest mt-1">Send a secure invitation to join the team.</p>
              </div>

              <form onSubmit={handleInvite} className="space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@centerkick.com"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#b50a0a] focus:ring-4 focus:ring-red-900/5 outline-none transition-all font-bold text-sm text-black"
                    />
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] ml-1">Assign Role</label>
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#b50a0a] outline-none transition-all font-bold text-sm appearance-none text-black"
                    >
                       <option value="admin" className="text-black">Administrator</option>
                       <option value="blogger" className="text-black">Blogger / CMS Editor</option>
                       <option value="operations" className="text-black">Operations Specialist</option>
                       <option value="finance" className="text-black">Finance Manager</option>
                    </select>
                 </div>

                 {error && (
                   <div className="p-4 bg-red-50 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-xl border border-red-100">
                      {error}
                   </div>
                 )}

                 <button 
                   disabled={loading}
                   className="w-full py-4 bg-[#b50a0a] hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-900/20 flex items-center justify-center gap-2"
                 >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Send Invitation
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
