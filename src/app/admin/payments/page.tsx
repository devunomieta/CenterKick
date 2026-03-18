import { CreditCard, TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign, Filter, Download } from 'lucide-react';

export default function AdminPaymentsPage() {
  const stats = [
    { label: 'Total Revenue', value: '$12,450.00', icon: DollarSign, trend: '+12%', color: 'text-green-600' },
    { label: 'Active Subscriptions', value: '156', icon: CreditCard, trend: '+4%', color: 'text-blue-600' },
    { label: 'Pending Payouts', value: '$840.00', icon: ArrowUpRight, trend: '-2%', color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Financial Ledger</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Manage payment gateways, oversee transactions, and configure subscription tiers.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="bg-[#b50a0a] hover:bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-red-900/20">
             Subscription Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                   <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${stat.color}`}>
                   {stat.trend} <TrendingUp className="w-3 h-3" />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
             <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
           <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Transactions</h2>
           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">
              <Filter className="w-3 h-3" /> All Statuses
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-gray-100">
              <tr>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Reference</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">User</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {[
                 { ref: 'CK-PAY-9921', user: 'Owolabi Bamidele', amt: '$49.99', status: 'Confirmed', date: 'Oct 15, 2026' },
                 { ref: 'CK-PAY-9920', user: 'Coach Segun', amt: '$129.00', status: 'Pending', date: 'Oct 14, 2026' },
                 { ref: 'CK-PAY-9919', user: 'Agent Kingsley', amt: '$299.00', status: 'Confirmed', date: 'Oct 14, 2026' },
               ].map((tx, i) => (
                 <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6 font-black text-gray-900 uppercase text-[10px] tracking-widest">#{tx.ref}</td>
                    <td className="px-8 py-6">
                       <p className="font-bold text-gray-900 leading-none">{tx.user}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-900">{tx.amt}</td>
                    <td className="px-8 py-6">
                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${tx.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                          {tx.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right text-[10px] font-bold text-gray-400 uppercase">{tx.date}</td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
