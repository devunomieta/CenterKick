'use client';

import { useState } from 'react';
import {
  Search, Mail, User, Globe, Calendar,
  MapPin, CheckCircle, Clock, AlertCircle,
  RefreshCcw, ExternalLink, Eye, X, Filter, Target, Footprints, UserCheck
} from 'lucide-react';
import { resendInvitation } from '@/app/actions/auth';
import { useToast } from '@/context/ToastContext';
import { DateDisplay } from '@/components/common/DateDisplay';
import { useRouter } from 'next/navigation';
import { FlagIcon } from '@/components/common/FlagIcon';

interface Prospect {
  id: string;
  email: string | null;
  first_name: string;
  last_name: string;
  status: string;
  role: string;
  country: string;
  created_at: string;
}

export function ProspectsClient({ 
  initialProspects,
  totalCount,
  currentPage,
  pageSize
}: { 
  initialProspects: Prospect[],
  totalCount: number,
  currentPage: number,
  pageSize: number
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PLAYERS' | 'COACHES' | 'AGENTS'>('ALL');

  const totalPages = Math.ceil(totalCount / pageSize);

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`/admin/prospects?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    params.set('page', '1');
    router.push(`/admin/prospects?${params.toString()}`);
  };

  const handleTabChange = (tab: 'ALL' | 'PLAYERS' | 'COACHES' | 'AGENTS') => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    if (tab === 'ALL') {
      params.delete('role');
    } else {
      params.set('role', tab.slice(0, -1).toLowerCase());
    }
    params.set('page', '1');
    router.push(`/admin/prospects?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('q', searchQuery);
  };

  const handleResendInv = async (email: string, lastName: string, role: string) => {
    const res = await resendInvitation(email, role as any, lastName);
    if (res.success) {
      showToast("Invitation email resent successfully.", "success");
    } else {
      showToast("Failed to resend invitation.", "error");
    }
  };

  const handleOpenProfile = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsProfileOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search & Tabs */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
           <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
              {['ALL', 'PLAYERS', 'COACHES', 'AGENTS'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab as any)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? 'bg-white shadow-xl shadow-gray-200/50 text-[#b50a0a]' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>
           
           <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#b50a0a] transition-all text-gray-900 placeholder:text-gray-400"
              />
           </form>
        </div>

        {/* Prospects Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f8f9fa] border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#b50a0a]">Prospect Identity</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#b50a0a]">Role Type</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#b50a0a]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#b50a0a] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {initialProspects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                     <Mail className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No prospects currently requiring Attention.</p>
                  </td>
                </tr>
              ) : (
                initialProspects.map((prospect) => (
                  <tr key={prospect.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center font-black text-white text-sm shrink-0 shadow-lg shadow-gray-200/50">
                             {(prospect.first_name || 'U')[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                             <div className="flex items-center gap-2 mb-0.5">
                                <p className="font-black text-gray-900 leading-none truncate overflow-hidden max-w-[150px]">{prospect.first_name} {prospect.last_name}</p>
                                <FlagIcon country={prospect.country} className="w-3 h-2" />
                             </div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate overflow-hidden max-w-[200px]">{prospect.email || 'No email'}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-900 border border-gray-200/50">
                          {prospect.role === 'player' ? <Target className="w-3 h-3" /> : prospect.role === 'coach' ? <Footprints className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          {prospect.role}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${prospect.status === 'new' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                             <span className={`text-[9px] font-black uppercase tracking-widest ${prospect.status === 'new' ? 'text-blue-600' : 'text-orange-600'}`}>
                                {prospect.status === 'new' ? 'NEW' : 'EXPIRED'}
                             </span>
                          </div>
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                             Since <DateDisplay date={prospect.created_at} />
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenProfile(prospect)}
                            className="p-2 text-gray-300 hover:text-black transition-colors rounded-xl hover:bg-white border border-transparent hover:border-gray-100"
                          >
                             <Eye className="w-4 h-4" />
                          </button>
                          <button 
                             onClick={() => handleResendInv(prospect.email!, prospect.last_name, prospect.role)}
                             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-900 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                          >
                             <RefreshCcw className="w-3.5 h-3.5" />
                             {prospect.status === 'expired' ? 'Send Reminder' : 'Resend Invitation'}
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Showing <span className="text-gray-900">{initialProspects.length}</span> of <span className="text-gray-900">{totalCount}</span> Profiles
           </p>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => navigateToPage(currentPage - 1)}
                className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-black hover:border-black transition-all disabled:opacity-30" 
                disabled={currentPage === 1}
              >
                 <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                 {Array.from({ length: totalPages }).map((_, i) => (
                   <button 
                     key={i} 
                     onClick={() => navigateToPage(i + 1)}
                     className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#b50a0a] text-white' : 'hover:bg-gray-50 text-gray-400'}`}
                   >
                      {i + 1}
                   </button>
                 ))}
              </div>
              <button 
                onClick={() => navigateToPage(currentPage + 1)}
                className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-black hover:border-black transition-all disabled:opacity-30" 
                disabled={currentPage === totalPages}
              >
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

      {/* Profile Detail Modal */}
      {isProfileOpen && selectedProspect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setIsProfileOpen(false)}>
           <div 
             className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in duration-300"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Close Button */}
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-8 right-8 w-11 h-11 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all z-10"
              >
                 <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="p-10 pb-6">
                 {/* Header */}
                 <div className="flex items-center gap-6 mb-10">
                    <div className="w-20 h-20 rounded-3xl bg-[#0f172a] flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-gray-200/50">
                       {(selectedProspect.first_name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-2">
                           {selectedProspect.first_name} {selectedProspect.last_name}
                        </h2>
                        <p className="text-[10px] font-black text-[#b50a0a] uppercase tracking-[0.2em]">
                           {selectedProspect.role} Prospect
                        </p>
                    </div>
                 </div>

                 {/* Info Grid */}
                 <div className="grid grid-cols-2 gap-y-10 mb-10">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                          <Mail className="w-3.5 h-3.5" /> Email Address
                       </div>
                       <p className="text-[15px] font-black text-gray-900 leading-tight truncate pr-4">{selectedProspect.email}</p>
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                          <MapPin className="w-3.5 h-3.5" /> Location
                       </div>
                       <p className="text-[15px] font-black text-gray-900 leading-tight flex items-center gap-2 uppercase">
                          <FlagIcon country={selectedProspect.country} className="w-4 h-2.5" /> {selectedProspect.country || 'N/A'}
                       </p>
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5" /> Enrolled On
                       </div>
                       <p className="text-[15px] font-black text-gray-900 leading-tight uppercase">
                          <DateDisplay date={selectedProspect.created_at} />
                       </p>
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" /> Birthdate
                       </div>
                       <p className="text-[15px] font-black text-gray-900 leading-tight uppercase">
                          --
                       </p>
                    </div>
                 </div>

                 {/* Status card */}
                 <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-8 mb-10">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Profile Status</p>
                       <span className="bg-[#dce9ff] text-[#2563eb] rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                          {selectedProspect.status === 'new' ? 'New Prospect' : 'Expired Enrollment'}
                       </span>
                    </div>
                    <p className="text-gray-400 text-[11px] leading-relaxed italic mt-6">
                       This profile has not yet been claimed by the athlete. You can remind them to complete their registration by using the button below.
                    </p>
                 </div>

                 {/* Action Button */}
                 <button 
                   onClick={() => handleResendInv(selectedProspect.email!, selectedProspect.last_name, selectedProspect.role)}
                   className="w-full bg-black text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.25em] text-[11px] hover:bg-[#b50a0a] transition-all shadow-xl shadow-gray-200/50 active:scale-[0.98]"
                 >
                    {selectedProspect.status === 'expired' ? 'Send Reminder' : 'Resend Invitation'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-[#b50a0a]/5 border-2 border-[#b50a0a]/10 rounded-[2rem] p-6 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#b50a0a] flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Understanding Prospects</h4>
          <p className="text-xs text-gray-600 leading-relaxed mt-1">
            Prospects are professional profiles created by administrators.
            <strong className="text-gray-900"> NEW</strong> means they haven&apos;t paid yet.
            <strong className="text-gray-900"> EXPIRED</strong> means they were previously subscribed but missed a payment or canceled.
          </p>
        </div>
      </div>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from 'lucide-react';
