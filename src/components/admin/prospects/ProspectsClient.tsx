'use client';

import { useState } from 'react';
import { 
  Search, Mail, User, Globe, Calendar, 
  MapPin, CheckCircle, Clock, AlertCircle,
  RefreshCcw, ExternalLink
} from 'lucide-react';
import { resendInvitation } from '@/app/actions/auth';
import { useToast } from '@/context/ToastContext';
import { DateDisplay } from '@/components/common/DateDisplay';

interface Prospect {
  id: string;
  email: string | null;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  country: string | null;
  date_of_birth: string | null;
  created_at: string;
}

export function ProspectsClient({ initialProspects }: { initialProspects: Prospect[] }) {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const { showToast } = useToast();

  const filteredProspects = prospects.filter(p => 
    (p.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleResend = async (prospect: Prospect) => {
    if (!prospect.email) return;
    
    setLoading(prospect.id);
    try {
      const result = await resendInvitation(
        prospect.email, 
        prospect.role, 
        prospect.last_name
      );
      
      if (result.success) {
        showToast('Invitation resent successfully', 'success');
      } else {
        const errorMsg = (result as { error?: string }).error || 'Failed to resend invitation';
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-[2rem] border-2 border-gray-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search prospects by name or email..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#b50a0a]/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border-2 border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[10px] font-black underline decoration-[#b50a0a] decoration-2 underline-offset-8 text-gray-400 uppercase tracking-[0.2em]">Prospect Details</th>
                <th className="px-8 py-6 text-[10px] font-black underline decoration-[#b50a0a] decoration-2 underline-offset-8 text-gray-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-8 py-6 text-[10px] font-black underline decoration-[#b50a0a] decoration-2 underline-offset-8 text-gray-400 uppercase tracking-[0.2em]">Location</th>
                <th className="px-8 py-6 text-[10px] font-black underline decoration-[#b50a0a] decoration-2 underline-offset-8 text-gray-400 uppercase tracking-[0.2em]">Enrolled On</th>
                <th className="px-8 py-6 text-[10px] font-black underline decoration-[#b50a0a] decoration-2 underline-offset-8 text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProspects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-200" />
                      </div>
                      <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No matching prospects found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProspects.map((prospect) => (
                  <tr key={prospect.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-[#b50a0a] text-xs">
                          {prospect.first_name?.[0]}{prospect.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{prospect.first_name} {prospect.last_name}</p>
                          <p className="text-[10px] font-bold text-gray-400 lowercase">{prospect.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {prospect.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-3 h-3 text-[#b50a0a]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{prospect.country || 'Global'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          <DateDisplay date={prospect.created_at} />
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleResend(prospect)}
                        disabled={loading === prospect.id}
                        className="inline-flex items-center gap-2 bg-white border-2 border-gray-100 hover:border-[#b50a0a] hover:text-[#b50a0a] text-gray-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                      >
                        {loading === prospect.id ? (
                          <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                        {loading === prospect.id ? 'Sending...' : 'Resend Invitation'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[#b50a0a]/5 border-2 border-[#b50a0a]/10 rounded-[2rem] p-6 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#b50a0a] flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Understanding Prospects</h4>
          <p className="text-xs text-gray-600 leading-relaxed mt-1">
            Prospects are professional profiles created by administrators through direct enrollment. 
            These profiles remain "unlinked" until the user signs up using the same email address. 
            Once linked, the prospect record is automatically promoted to a full registered account.
          </p>
        </div>
      </div>
    </div>
  );
}
