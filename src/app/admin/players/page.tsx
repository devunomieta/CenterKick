import { createClient } from '@/lib/supabase/server';
import { Users, Shield, UserPlus, Filter, Search, CreditCard, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { PlayersClient } from '@/components/admin/players/PlayersClient';

export default async function AdminPlayersPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient();

  // URL Params for filtering and pagination
  const tab = (searchParams.tab as string) || 'all';
  const page = parseInt((searchParams.page as string) || '1');
  const q = (searchParams.q as string) || '';
  const position = (searchParams.position as string) || '';
  const gender = (searchParams.gender as string) || '';
  const country = (searchParams.country as string) || '';
  const age = (searchParams.age as string) || '';
  const foot = (searchParams.foot as string) || '';

  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  // 1. Fetch Stats
  const [
    { count: totalCount },
    { count: subscribedCount },
    { count: pendingCount }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'player'),
    supabase.from('profiles').select('*, users!inner(role)', { count: 'exact', head: true }).eq('users.role', 'player').eq('is_subscribed', true),
    supabase.from('profiles').select('*, users!inner(role)', { count: 'exact', head: true }).eq('users.role', 'player').eq('status', 'pending')
  ]);

  const unsubscribedCount = (totalCount || 0) - (subscribedCount || 0);

  // 2. Fetch Players with Filters
  let query = supabase
    .from('users')
    .select('*, profiles!inner(*)', { count: 'exact' }) // Using inner join for profile filtering
    .eq('role', 'player')
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (tab === 'subscribed') query = query.eq('profiles.is_subscribed', true);
  if (tab === 'unsubscribed') query = query.eq('profiles.is_subscribed', false);
  if (tab === 'pending') query = query.eq('profiles.status', 'pending');

  if (position) query = query.eq('profiles.position', position);
  if (gender) query = query.eq('profiles.gender', gender);
  if (country) query = query.ilike('profiles.country', `%${country}%`);
  if (age) query = query.eq('profiles.age', parseInt(age));
  if (foot) query = query.eq('profiles.foot', foot);

  if (q) {
    query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`, { foreignTable: 'profiles' });
  }

  const { data: players, count: filteredTotal } = await query;

  // 3. Fetch Agents for linking
  const { data: agents } = await supabase
    .from('users')
    .select('*, profiles!inner(*)')
    .eq('role', 'agent');

  const stats = [
    { label: 'All Players', value: totalCount || 0, tab: 'all', color: 'text-gray-900', bg: 'bg-gray-100', icon: Users },
    { label: 'Subscribed', value: subscribedCount || 0, tab: 'subscribed', color: 'text-green-600', bg: 'bg-green-50', icon: CreditCard },
    { label: 'Unsubscribed', value: unsubscribedCount || 0, tab: 'unsubscribed', color: 'text-gray-400', bg: 'bg-gray-50', icon: Users },
    { label: 'Pending Requests', value: pendingCount || 0, tab: 'pending', color: 'text-[#b50a0a]', bg: 'bg-red-50', icon: Clock },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">Player's <span className="text-[#b50a0a]">Profiles</span></h1>
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mt-2">Manage players profile and subscriptions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/players?add=true" className="bg-[#b50a0a] hover:bg-black text-white px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-red-900/10 active:scale-95">
            <UserPlus className="w-3.5 h-3.5" /> Enroll New Player
          </Link>
        </div>
      </div>

      {/* Linked Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={`/admin/players?tab=${stat.tab}&page=1`}
            className={`bg-white p-5 rounded-[1.5rem] border-2 transition-all duration-300 relative overflow-hidden group active:scale-95 ${tab === stat.tab ? 'border-[#b50a0a] shadow-xl shadow-red-900/10' : 'border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md'}`}
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className={`text-[9px] font-black uppercase tracking-widest ${tab === stat.tab ? 'text-gray-900' : 'text-gray-400'}`}>{stat.label}</p>
              <p className={`text-2xl font-black italic tracking-tighter ${tab === stat.tab ? 'text-[#b50a0a]' : 'text-gray-900'}`}>{stat.value}</p>
            </div>
            {tab === stat.tab && (
              <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-[#b50a0a] rounded-full"></div>
            )}
          </Link>
        ))}
      </div>

      {/* Client Management Portal */}
      <PlayersClient
        initialPlayers={(players as any) || []}
        agents={(agents as any) || []}
        totalCount={filteredTotal || 0}
        currentPage={page}
        pageSize={pageSize}
      />
    </div>
  );
}
