import { createClient } from '@/lib/supabase/server';
import { getProspects } from '@/app/actions/auth';
import { ProspectsClient } from '@/components/admin/prospects/ProspectsClient';
import { Users, Mail, Clock, CreditCard } from 'lucide-react';

export default async function AdminProspectsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const role = (resolvedParams.role as string) || '';
  const prospects = await getProspects(role);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">Registration <span className="text-[#b50a0a]">Prospects</span></h1>
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mt-2">Manage unlinked profiles and resend enrollment invitations.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center mb-4">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total {role ? role + 's' : 'Prospects'}</p>
          <p className="text-2xl font-black text-gray-900 italic tracking-tighter">{prospects.length}</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#b50a0a] flex items-center justify-center mb-4">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">New / Awaiting Link</p>
          <p className="text-2xl font-black text-[#b50a0a] italic tracking-tighter">
            {prospects.filter(p => !p.transactions || p.transactions.length === 0).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border-2 border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <CreditCard className="w-4 h-4" />
          </div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Expired Subscriptions</p>
          <p className="text-2xl font-black text-green-600 italic tracking-tighter">
            {prospects.filter(p => p.transactions && p.transactions.some((t: any) => t.status === 'confirmed')).length}
          </p>
        </div>
      </div>

      <ProspectsClient initialProspects={prospects} activeRole={role} />
    </div>
  );
}
