import { createClient } from '@/lib/supabase/server';
import { TransactionsClient } from '@/components/admin/payments/TransactionsClient';
import { redirect } from 'next/navigation';
import { DollarSign, CreditCard, Clock, TrendingUp } from 'lucide-react';

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: { 
    page?: string; 
    q?: string; 
    status?: string; 
    method?: string;
    year?: string;
    month?: string;
    day?: string;
  };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!['superadmin', 'admin', 'finance'].includes(userRecord?.role)) {
    redirect('/admin');
  }

  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('transactions')
    .select('*, profiles(first_name, last_name, email)', { count: 'exact' });

  if (searchParams.q) {
    query = query.or(`reference.ilike.%${searchParams.q}%,profiles.first_name.ilike.%${searchParams.q}%,profiles.last_name.ilike.%${searchParams.q}%`);
  }

  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }

  if (searchParams.method) {
    query = query.eq('method', searchParams.method);
  }

  if (searchParams.year) {
    const year = parseInt(searchParams.year);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31T23:59:59`;
    query = query.gte('created_at', startDate).lte('created_at', endDate);
  }

  if (searchParams.month && searchParams.year) {
    const year = parseInt(searchParams.year);
    const month = parseInt(searchParams.month);
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
    query = query.gte('created_at', startDate).lte('created_at', endDate);
  }

  const { data: transactions, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  // Fetch real stats
  const { data: revenueData } = await supabase
    .from('transactions')
    .select('amount')
    .eq('status', 'confirmed');
  
  const totalRevenue = revenueData?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

  const { count: activeSubs } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_subscribed', true);

  const { count: expiredSubs } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_subscribed', false)
    .not('updated_at', 'is', null); // Simplified "expired" logic for now

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: 'DollarSign', trend: '+12%', color: 'text-green-600' },
    { label: 'Active Subs', value: activeSubs?.toString() || '0', icon: 'UserCheck', trend: '+5%', color: 'text-blue-600' },
    { label: 'Expired Subs', value: expiredSubs?.toString() || '0', icon: 'UserX', trend: '-2%', color: 'text-red-600' },
  ];

  // Growth data (Mock for chart)
  const growthData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 1100 },
  ];

  return (
    <TransactionsClient 
      transactions={transactions || []} 
      totalCount={count || 0}
      currentPage={page}
      pageSize={pageSize}
      stats={stats}
      growthData={growthData}
    />
  );
}
