'use client';

import { useState } from 'react';
import { 
  Search, Filter, Download, ChevronLeft, ChevronRight, 
  CreditCard, DollarSign, Clock, TrendingUp, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Globe, User, CheckCircle, XCircle,
  UserCheck, UserX, BarChart3, Calendar, Activity
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DateDisplay } from '@/components/common/DateDisplay';

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  method: 'direct_transfer' | 'paystack_integration' | 'paystack_link' | 'other';
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export function TransactionsClient({
  transactions,
  totalCount,
  currentPage,
  pageSize,
  stats,
  growthData
}: {
  transactions: Transaction[],
  totalCount: number,
  currentPage: number,
  pageSize: number,
  stats: any[],
  growthData: { name: string, value: number }[]
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [timeframe, setTimeframe] = useState('Monthly');
  const totalPages = Math.ceil(totalCount / pageSize);

  // Dynamic Growth Data based on timeframe
  const getGrowthData = () => {
    switch (timeframe) {
      case 'Daily':
        return [
          { name: 'MON', value: 450 },
          { name: 'TUE', value: 380 },
          { name: 'WED', value: 850 },
          { name: 'THU', value: 620 },
          { name: 'FRI', value: 780 },
          { name: 'SAT', value: 1100 },
          { name: 'SUN', value: 950 },
        ];
      case 'Monthly':
        return [
          { name: 'WEEK 1', value: 2450 },
          { name: 'WEEK 2', value: 3100 },
          { name: 'WEEK 3', value: 2800 },
          { name: 'WEEK 4', value: 4250 },
        ];
      case 'Yearly':
        return [
          { name: 'JAN', value: 8500 },
          { name: 'FEB', value: 7200 },
          { name: 'MAR', value: 9800 },
          { name: 'APR', value: 11200 },
          { name: 'MAY', value: 10500 },
          { name: 'JUN', value: 12400 },
          { name: 'JUL', value: 11800 },
          { name: 'AUG', value: 13200 },
          { name: 'SEP', value: 12900 },
          { name: 'OCT', value: 14500 },
          { name: 'NOV', value: 15800 },
          { name: 'DEC', value: 18200 },
        ];
      default:
        return growthData;
    }
  };

  const currentGrowthData = getGrowthData();
  const maxGrowthValue = Math.max(...currentGrowthData.map(d => d.value), 1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) params.set('q', searchQuery);
    else params.delete('q');
    params.set('page', '1');
    router.push(`/admin/payments/transactions?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`/admin/payments/transactions?${params.toString()}`);
  };

  const handleDateChange = (year?: string, month?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (year) params.set('year', year);
    if (month) params.set('month', month);
    params.set('page', '1');
    router.push(`/admin/payments/transactions?${params.toString()}`);
  };

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/payments/transactions?${params.toString()}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 text-green-600 border-green-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'failed': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'direct_transfer': return 'Direct Transfer';
      case 'paystack_integration': return 'Paystack App';
      case 'paystack_link': return 'Paystack Link';
      default: return 'Other';
    }
  };

  const IconMap: { [key: string]: any } = {
    DollarSign,
    UserCheck,
    UserX,
    TrendingUp,
    BarChart3,
    Calendar,
    Activity
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Full-Width Growth Monitor (Repositioned to Top) */}
      <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-[#b50a0a]/30 via-transparent to-transparent"></div>
         <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#b50a0a]/10 blur-[100px] rounded-full"></div>
         
         <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#b50a0a] flex items-center justify-center shadow-2xl shadow-red-900/40">
                     <Activity className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Financial Growth <span className="text-[#b50a0a]">Monitor</span></h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Real-time performance metrics & projections</p>
                  </div>
               </div>

               <div className="flex bg-white/5 p-1.5 rounded-2xl gap-2 border border-white/5">
                  {['Daily', 'Monthly', 'Yearly'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-[#b50a0a] text-white shadow-lg shadow-red-900/40' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                      {t}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               <div className="lg:col-span-3 h-48 flex items-end justify-between gap-3 px-4">
                  {currentGrowthData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end">
                       <div className="relative w-full h-full flex flex-col justify-end">
                          <div 
                            className="w-full bg-white/10 rounded-t-xl transition-all duration-700 group-hover/bar:bg-[#b50a0a] group-hover/bar:shadow-[0_0_20px_rgba(181,10,10,0.4)]" 
                            style={{ height: `${(d.value / maxGrowthValue) * 100}%` }}
                          ></div>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all text-[9px] font-black text-[#b50a0a] whitespace-nowrap bg-white px-2 py-1 rounded-md shadow-xl">
                             ${d.value.toLocaleString()}
                          </div>
                       </div>
                       <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{d.name}</span>
                    </div>
                  ))}
               </div>

               <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-center space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Current Projection</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-[#b50a0a] italic">+$4,250.00</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                       <span className="text-gray-500 uppercase">Growth Rate</span>
                       <span className="text-green-500 font-black">+24.8%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="w-[68%] h-full bg-[#b50a0a] rounded-full shadow-[0_0_10px_rgba(181,10,10,0.5)]"></div>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Stats Cards (Second Row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = IconMap[stat.icon] || CreditCard;
          return (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.label === 'Total Revenue' ? 'bg-[#b50a0a] shadow-red-900/20' : 'bg-gray-900 shadow-gray-200'}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-black ${stat.color} bg-white px-2 py-1 rounded-full border border-gray-50 shadow-sm`}>
                        {stat.trend} <TrendingUp className="w-3 h-3" />
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                    {stat.label === 'Total Revenue' && <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">USD</span>}
                  </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Filterable Transaction Ledger */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest underline decoration-[#b50a0a] decoration-4 underline-offset-8">Transaction Archives</h2>
              </div>
              <div className="flex gap-4">
                 <select 
                   onChange={(e) => handleDateChange(e.target.value, searchParams.get('month') || undefined)}
                   value={searchParams.get('year') || new Date().getFullYear().toString()}
                   className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 text-gray-900"
                 >
                    {[2024, 2025, 2026].map(year => (
                       <option key={year} value={year}>{year}</option>
                    ))}
                 </select>
                 <select 
                   onChange={(e) => handleDateChange(searchParams.get('year') || undefined, e.target.value)}
                   value={searchParams.get('month') || ''}
                   className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 text-gray-900"
                 >
                    <option value="">Full Year</option>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                       <option key={m} value={i + 1}>{m}</option>
                    ))}
                 </select>
              </div>
           </div>
           
           <div className="flex flex-wrap gap-3">
              <form onSubmit={handleSearch} className="relative flex-1 min-w-[300px]">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input 
                   type="text"
                   placeholder="Search by Reference or Payer Name..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-[#b50a0a] transition-all text-gray-900 placeholder:text-gray-300"
                 />
              </form>
              <select 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                value={searchParams.get('status') || ''}
                className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-3 focus:ring-2 focus:ring-[#b50a0a] text-gray-900 appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%23b50a0a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat"
              >
                 <option value="">All Statuses</option>
                 <option value="confirmed">Confirmed</option>
                 <option value="pending">Pending</option>
                 <option value="failed">Failed</option>
              </select>
              <select 
                onChange={(e) => handleFilterChange('method', e.target.value)}
                value={searchParams.get('method') || ''}
                className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-3 focus:ring-2 focus:ring-[#b50a0a] text-gray-900 appearance-none pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%23b50a0a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat"
              >
                 <option value="">All Methods</option>
                 <option value="direct_transfer">Direct Transfer</option>
                 <option value="paystack_integration">Paystack Integration</option>
                 <option value="paystack_link">Paystack Link</option>
              </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-gray-100">
              <tr>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#b50a0a]">Reference / ID</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#b50a0a]">Payer Details</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#b50a0a]">Amount</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#b50a0a]">Gateway</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#b50a0a]">Status</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#b50a0a] text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {transactions.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                       <CreditCard className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No transactions recorded yet.</p>
                    </td>
                 </tr>
               ) : (
                 transactions.map((tx) => (
                   <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                            <span className="font-black text-gray-900 uppercase text-[11px] tracking-tight">{tx.reference}</span>
                            <span className="text-[8px] font-bold text-gray-900 uppercase tracking-widest mt-0.5">ID: {tx.id.slice(0, 8)}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-[10px]">
                               {tx.profiles?.first_name?.[0]}{tx.profiles?.last_name?.[0]}
                            </div>
                            <div>
                               <p className="font-bold text-gray-900 leading-none text-xs">{tx.profiles?.first_name} {tx.profiles?.last_name}</p>
                               <p className="text-[9px] font-black text-gray-900 mt-1">{tx.profiles?.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                            <span className="font-black text-gray-900 text-sm italic tracking-tighter">${tx.amount.toFixed(2)}</span>
                            <span className="text-[8px] font-black text-gray-900 uppercase tracking-widest">{tx.currency}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-black" />
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{getMethodLabel(tx.method)}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusColor(tx.status)}`}>
                            {tx.status === 'confirmed' ? <CheckCircle className="w-3 h-3" /> : tx.status === 'failed' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {tx.status}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex flex-col items-end">
                            <DateDisplay date={tx.created_at} className="text-[10px] font-bold text-gray-900 uppercase" />
                            <span className="text-[8px] font-black text-gray-900 uppercase tracking-widest mt-1">
                               {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                         </div>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-[#f8f9fa] border-t border-gray-100 flex items-center justify-between">
           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
              Viewing <span className="text-[#b50a0a]">{transactions.length}</span> of <span className="text-[#b50a0a]">{totalCount}</span> Transactions
           </p>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-black hover:border-black transition-all disabled:opacity-30 disabled:hover:border-gray-200 bg-white"
              >
                 <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                 {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => navigateToPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#b50a0a] text-white shadow-lg shadow-red-900/20' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                    >
                       {i + 1}
                    </button>
                 ))}
              </div>
              <button 
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-black hover:border-black transition-all disabled:opacity-30 bg-white"
              >
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
