import { createClient } from '@/lib/supabase/server';
import { Users, Shield, UserPlus, Filter, Search, CreditCard, Clock, CheckCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { CoachesClient } from '@/components/admin/coaches/CoachesClient';

export default async function AdminCoachesPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  // URL Params for filtering and pagination
  const tab = (resolvedParams.tab as string) || 'all';
  const page = parseInt((resolvedParams.page as string) || '1');
  const q = (resolvedParams.q as string) || '';
  const position = (resolvedParams.position as string) || '';
  const gender = (resolvedParams.gender as string) || '';
  const country = (resolvedParams.country as string) || '';
  const age = (resolvedParams.age as string) || '';

  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  // 1. Fetch Stats
  const [
    { count: totalCount },
    { count: pendingCount }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'coach').eq('is_subscribed', true).not('email', 'is', null),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'coach').eq('status', 'pending').not('email', 'is', null)
  ]);

  const subscribedCount = totalCount || 0;

  // 2. Fetch Coaches with Filters
  let query = supabase
    .from('profiles')
    .select('*, users!user_id(role, email)', { count: 'exact' })
    .eq('is_subscribed', true);

  // Apply role filter
  query = query.eq('role', 'coach');

  // Apply tab filters
  if (tab === 'pending') query = query.eq('status', 'pending');

  // Apply filters
  if (position) query = query.eq('position', position);
  if (gender) query = query.eq('gender', gender);
  if (age) query = query.eq('age', parseInt(age));
  if (country) query = query.ilike('country', `%${country}%`);

  // Apply search
  if (q) {
    query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,users.email.ilike.%${q}%,league.ilike.%${q}%`);
  }

  const { data: profiles, error, count: filteredTotal } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + (pageSize - 1));

  if (error) {
    console.error('Error fetching coaches:', error);
    return <div>Error loading coaches. Please try again.</div>;
  }

  // 2. Fetch Agents for the enrollment modal
  const { data: agents } = await supabase
    .from('profiles')
    .select('*, users(role, email)')
    .eq('role', 'agent');

  // Format profiles to match the expected Coach interface
  const formattedCoaches = (profiles || []).map(p => ({
    id: p.id,
    email: p.users?.email || 'N/A',
    created_at: p.created_at,
    first_name: p.first_name,
    last_name: p.last_name,
    status: p.status,
    position: p.position,
    country: p.country,
    age: p.age,
    gender: p.gender,
    is_subscribed: p.is_subscribed,
    league: p.league,
    agent_id: p.agent_id
  }));

  const stats = [
    { label: 'All Coaches', value: totalCount || 0, tab: 'all', color: 'text-gray-900', bg: 'bg-gray-100', icon: Users },
    { label: 'Subscribed', value: subscribedCount || 0, tab: 'subscribed', color: 'text-green-600', bg: 'bg-green-50', icon: CreditCard },
    { label: 'Prospects', value: 'VIEW', tab: 'prospects', color: 'text-gray-400', bg: 'bg-gray-50', icon: Users },
    { label: 'Pending Requests', value: pendingCount || 0, tab: 'pending', color: 'text-[#b50a0a]', bg: 'bg-red-50', icon: Clock },
  ];

  // 4. Fetch current admin role for RBAC
  const { data: { session } } = await supabase.auth.getSession();
  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', session?.user.id)
    .single();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">Coaching <span className="text-[#b50a0a]">Directory</span></h1>
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mt-2">Manage coaching staff, credentials and subscriptions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/coaches?add=true" className="bg-[#b50a0a] hover:bg-black text-white px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-red-900/10 active:scale-95">
            <UserPlus className="w-3.5 h-3.5" /> Enroll New Coach
          </Link>
        </div>
      </div>

      {/* Linked Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={stat.tab === 'prospects' ? `/admin/prospects?role=coach` : `/admin/coaches?tab=${stat.tab === 'subscribed' ? 'all' : stat.tab}&page=1`}
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
      <CoachesClient
        initialCoaches={formattedCoaches}
        agents={agents || []}
        totalCount={filteredTotal || 0}
        currentPage={page}
        pageSize={pageSize}
        role={userRecord?.role || 'player'}
      />
    </div>
  );
}
