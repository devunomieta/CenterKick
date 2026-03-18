import { createClient } from '@/lib/supabase/server';
import { 
  Users, 
  TrendingUp, 
  ExternalLink, 
  Star, 
  Target, 
  Eye, 
  Calendar,
  ChevronRight,
  Plus,
  Shield,
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: userRecord, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user?.id)
    .single();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, agent:users!profiles_agent_id_fkey(id, profiles(*))')
    .eq('user_id', user?.id)
    .single();

  const role = userRecord?.role || 'player';
  const name = profile ? `${profile.first_name} ${profile.last_name}` : user?.email?.split('@')[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {userError && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-100 rounded-2xl space-y-2 text-yellow-700">
               <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-xs font-black uppercase tracking-widest">Warning: Profile Access Issue</span>
               </div>
               <div className="pl-8 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  <p>Auth Email: <span className="text-gray-900">{user?.email}</span></p>
                  <p className="text-red-500 font-black mt-2">DB Error: {userError.message}</p>
               </div>
            </div>
          )}
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
            Welcome back, <span className="text-[#b50a0a]">{name}</span>
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            "Here's what's happening with your profile today."
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/${role === 'player' ? 'athletes' : role + 's'}/${profile?.id}`} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
             View Public Profile <ExternalLink className="w-3 h-3" />
          </Link>
          <Link href="/dashboard/profile" className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg hover:-translate-y-0.5">
             Edit Profile <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Profile Views', value: '1,284', icon: Eye, trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Network Reach', value: '452', icon: Users, trend: '+5%', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Appearances', value: '12', icon: Target, trend: 'Last 30d', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Market Value', value: 'PRO', icon: TrendingUp, trend: 'Activate Plan', color: 'text-[#b50a0a]', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black ${stat.trend.includes('+') ? 'text-green-600' : 'text-gray-400'} uppercase tracking-widest`}>{stat.trend}</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900 italic tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed/Content Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-[#b50a0a]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
                  Performance Snapshot
                </h3>
              </div>
              <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#b50a0a]">
                Manage Stats
              </button>
            </div>
            <div className="p-8">
              <div className="h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center p-8">
                <TrendingUp className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Detailed Analytics Locked</p>
                <p className="text-[10px] font-medium text-gray-400 max-w-[200px] leading-relaxed">Upgrade to a Professional Plan to see your performance metrics and heatmaps.</p>
                <Link href="/dashboard/subscription" className="mt-4 text-[10px] font-black text-[#b50a0a] uppercase tracking-widest hover:underline">Activate Selection ₦15,000</Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#b50a0a]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Industry News</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <span className="text-[9px] font-black text-[#b50a0a] uppercase tracking-[0.2em]">Global Market</span>
                  <h4 className="text-sm font-bold text-gray-900 mt-1 group-hover:underline underline-offset-4 decoration-[#b50a0a]">Transfer Window: Latest developments in European scout networks.</h4>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">Scouts from 12 clubs are active in the West African region this weekend...</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar/Activity Column */}
        <div className="space-y-8">
          <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#b50a0a] blur-[100px] opacity-20 -z-5"></div>
            <h3 className="text-lg font-black uppercase tracking-tighter mb-4 leading-none">Complete <br /> Your Profile</h3>
            <p className="text-[10px] font-medium text-gray-400 leading-relaxed mb-6">Profiles with 100% completion receive up to 5x more scouting interest.</p>
            <div className="space-y-4">
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="w-[65%] h-full bg-[#b50a0a]"></div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#b50a0a]">65% Complete</p>
            </div>
            <Link href="/dashboard/profile" className="mt-8 block">
              <button className="w-full bg-[#b50a0a] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                Continue Setup <ChevronRight className="w-3 h-3" />
              </button>
            </Link>
          </div>

          {profile?.agent?.profiles && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 group">
              <div className="flex items-center gap-3 mb-6">
                 <Shield className="w-4 h-4 text-[#b50a0a]" />
                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Representation</h3>
              </div>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                    <img 
                       src={profile.agent.profiles.avatar_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop"} 
                       className="w-full h-full object-cover" 
                       alt={profile.agent.profiles.first_name} 
                    />
                 </div>
                 <div>
                    <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{profile.agent.profiles.first_name} {profile.agent.profiles.last_name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{profile.agent.profiles.agency_name || 'Independent Agent'}</p>
                 </div>
              </div>
              <Link href={`/agents/${profile.agent.id}`}>
                 <button className="w-full py-3 rounded-xl border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-[#b50a0a] hover:border-[#b50a0a]/20 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                    View Agency Profile <ArrowRight className="w-3 h-3" />
                 </button>
              </Link>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { type: 'View', txt: 'Scout from RFC Liege viewed your profile', time: '2h ago' },
                { type: 'Update', txt: 'You updated your career statistics', time: '5h ago' },
                { type: 'Alert', txt: 'Your subscription expires in 12 days', time: '1d ago' },
              ].map((act, i) => (
                 <div key={i} className="flex gap-4">
                   <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${act.type === 'Alert' ? 'bg-[#b50a0a]' : 'bg-green-500'}`}></div>
                   <div>
                     <p className="text-[11px] font-bold text-gray-900 leading-tight">{act.txt}</p>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{act.time}</p>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
