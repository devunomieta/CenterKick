import { 
  Users, Shield, Star, FileText, ChevronRight, Activity, TrendingUp, 
  CreditCard, Globe, ArrowUpRight, ArrowDownRight, Search, Settings
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Platform stats
  const [
    { count: totalUsersCount },
    { count: pendingRequestsCount },
    { count: approvedProfilesCount },
    { count: blogPostsCount },
    { data: roleSubData }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('cms_posts').select('*', { count: 'exact', head: true }),
    // Fetch counts for specific roles and statuses
    supabase
      .from('profiles')
      .select('status, users(role)')
  ]);

  // Process sub counts
  const getSubCount = (role: string, status: string) => {
    return (roleSubData as Record<string, any>[])?.filter((p: Record<string, any>) => {
      const userRole = Array.isArray(p.users) ? p.users[0]?.role : p.users?.role;
      return userRole === role && p.status === status;
    }).length || 0;
  };

  const dashboardStats = [
    { label: 'Users', value: totalUsersCount || 0, icon: Users, path: '/admin/roles', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Requests', value: pendingRequestsCount || 0, icon: Shield, path: '/admin/players', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Approved Profiles', value: approvedProfilesCount || 0, icon: Star, path: '/admin/players', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Blog Posts', value: blogPostsCount || 0, icon: FileText, path: '/admin/blog', color: 'text-[#b50a0a]', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">System <span className="text-[#b50a0a]">Overview</span></h1>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <Globe className="w-3 h-3 text-[#b50a0a]" /> Global Mission Control Active
           </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Snapshot Date</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
           </div>
           <Link href="/admin/settings" className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
              <Activity className="w-4 h-4 text-gray-400" />
           </Link>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, i) => (
          <Link key={i} href={stat.path} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg hover:shadow-gray-200/40 transition-all duration-500">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
               <div className="flex items-end justify-between">
                  <p className="text-2xl font-black text-gray-900 italic tracking-tighter leading-none">{stat.value}</p>
                  <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-[#b50a0a] transition-colors" />
               </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Middle Section: Trends & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Financial Glance */}
         <div className="lg:col-span-2 bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-400/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b50a0a] rounded-full blur-[120px] opacity-10 -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
               <div className="flex items-center justify-between mb-8">
                  <div>
                     <h2 className="text-[9px] font-black text-[#b50a0a] uppercase tracking-[0.3em]">Financial Statistics</h2>
                     <p className="text-xl font-black italic mt-1 uppercase">Total Revenue</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-white/20" />
               </div>

               <div className="flex items-end gap-10">
                  <div>
                     <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">Earnings to date</p>
                     <p className="text-4xl font-black tracking-tighter leading-none">$14,280<span className="text-base text-[#b50a0a]">.00</span></p>
                  </div>
                  <div className="pb-1">
                     <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Growth 24%</span>
                     </div>
                  </div>
               </div>

               {/* Simulated Chart Bars */}
               <div className="mt-12 flex items-end justify-between h-24 gap-3">
                  {[40, 65, 45, 90, 60, 85, 100, 75, 55, 80, 70, 95].map((h, i) => (
                    <div key={i} className="flex-1 group relative">
                       <div 
                         className={`w-full bg-white/10 rounded-t-lg transition-all duration-1000 group-hover:bg-[#b50a0a] hover:h-full cursor-pointer`}
                         style={{ height: `${h}%` }}
                       ></div>
                    </div>
                  ))}
               </div>
               <div className="mt-4 flex items-center justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest px-1">
                  <span>Jan</span>
                  <span>Jul</span>
                  <span>Dec</span>
               </div>
            </div>
         </div>

         {/* Subscriptions Card */}
         <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
               <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">User Subscriptions</h2>
               <div className="space-y-5">
                  {[
                    { type: 'Players', subscribed: getSubCount('player', 'active'), unsubscribed: getSubCount('player', 'pending') },
                    { type: 'Coaches', subscribed: getSubCount('coach', 'active'), unsubscribed: getSubCount('coach', 'pending') },
                    { type: 'Agents', subscribed: getSubCount('agent', 'active'), unsubscribed: getSubCount('agent', 'pending') },
                  ].map((sub, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-2xl space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-tight text-gray-900">{sub.type}</span>
                          <span className="text-[9px] font-black text-[#b50a0a] uppercase tracking-widest">{sub.subscribed + sub.unsubscribed} Total</span>
                       </div>
                       <div className="flex gap-4">
                          <div className="flex-1">
                             <p className="text-[8px] font-bold text-gray-400 uppercase">Subscribed</p>
                             <p className="text-sm font-black text-gray-900">{sub.subscribed}</p>
                          </div>
                          <div className="flex-1 border-l border-gray-200 pl-4">
                             <p className="text-[8px] font-bold text-gray-400 uppercase">Unsubscribed</p>
                             <p className="text-sm font-black text-gray-400">{sub.unsubscribed}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <Link href="/admin/payments" className="mt-8 group flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-[#b50a0a] transition-all">
               <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:text-white transition-colors">Manage Subscriptions</span>
               </div>
               <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
         </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Role Management', desc: 'Admins & Staff Access', path: '/admin/roles', icon: Shield },
           { label: 'Platform Settings', desc: 'Global configuration', path: '/admin/settings', icon: Settings },
           { label: 'System Audit', desc: 'Activity & Event Logs', path: '/admin/roles', icon: Activity },
         ].map((tool, i) => (
           <Link key={i} href={tool.path} className="flex items-center gap-5 p-6 bg-white border border-gray-100 rounded-3xl hover:border-[#b50a0a] hover:shadow-xl hover:shadow-red-900/5 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-[#b50a0a] transition-all">
                 <tool.icon className="w-4 h-4" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-tight text-gray-900">{tool.label}</p>
                 <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">{tool.desc}</p>
              </div>
           </Link>
         ))}
      </div>
    </div>
  );
}
