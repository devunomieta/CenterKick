'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Shield, UserPlus, 
  MoreHorizontal, Edit, Trash2, ExternalLink, 
  ChevronLeft, ChevronRight, X, User, ChevronDown,
  Globe, Calendar, MapPin, Target, CheckCircle, Clock, CreditCard, Lock, Eye, Mail, Trophy, Activity, MessageSquare,
  Facebook, Instagram, Twitter, AlertCircle, Save, Undo, Plus, Briefcase, Link2
} from 'lucide-react';
import { RestrictedAccessInline, RestrictedAccess } from '@/components/admin/RestrictedAccess';
import { DateDisplay } from '@/components/common/DateDisplay';
import { getPendingEdits, processProfileEdit, getPlayerTransactions } from '@/app/admin/players/actions';
import { updateAgent } from '@/app/admin/agents/actions';
import Link from 'next/link';
import { COUNTRIES } from '@/lib/constants/countries';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { FlagIcon } from '@/components/common/FlagIcon';

interface Agent {
  id: string;
  user_id: string | null;
  email: string | null;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  country: string | null;
  age?: number;
  gender: string;
  agency_name: string;
  license_code?: string;
  is_subscribed: boolean;
  avatar_url?: string;
  bio?: string;
  users: {
    email: string;
    role: string;
    subscriptions?: Array<{
      current_period_end: string;
      status: string;
    }>;
  } | null;
}

interface ProfileEdit {
  id: string;
  profile_id: string;
  field_name: string;
  old_value: string;
  new_value: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface AgentProfileClientProps {
  agent: Agent;
}

export default function AgentProfileClient({ agent }: AgentProfileClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'bio' | 'clients' | 'billing'>('profile');
  const [playerTransactions, setPlayerTransactions] = useState<any[]>([]);
  const [pendingEdits, setPendingEdits] = useState<ProfileEdit[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingEdits, setIsLoadingEdits] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedFields, setEditedFields] = useState<Partial<Agent>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeTab === 'billing') {
      const fetchTransactions = async () => {
        setIsLoadingTransactions(true);
        const res = await getPlayerTransactions(agent.id);
        if (res.success) setPlayerTransactions(res.data || []);
        setIsLoadingTransactions(false);
      };
      fetchTransactions();
    }
  }, [agent.id, activeTab]);

  useEffect(() => {
    const fetchEdits = async () => {
      setIsLoadingEdits(true);
      const res = await getPendingEdits(agent.id);
      if (res.success) setPendingEdits(res.data || []);
      setIsLoadingEdits(false);
    };
    fetchEdits();
  }, [agent.id]);

  const handleEditAction = async (editId: string, action: 'approve' | 'reject') => {
    const res = await processProfileEdit(editId, action);
    if (res.success) {
      toast.showToast(`Change ${action}d successfully`, 'success');
      const updatedEdits = await getPendingEdits(agent.id);
      if (updatedEdits.success) setPendingEdits(updatedEdits.data || []);
      router.refresh();
    } else {
      toast.showToast(res.error || 'Failed to process edit', 'error');
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const res = await updateAgent(agent.id, editedFields);
    if (res.success) {
      toast.showToast('Agent profile updated successfully', 'success');
      setIsEditMode(false);
      setEditedFields({});
      router.refresh();
    } else {
      toast.showToast(res.error || 'Failed to update agent profile', 'error');
    }
    setIsSaving(false);
  };

  const updateField = (field: keyof Agent, value: any) => {
    setEditedFields(prev => ({ ...prev, [field]: value }));
  };

  const displayValue = (field: keyof Agent, defaultValue: any) => {
    return editedFields.hasOwnProperty(field) ? editedFields[field] : defaultValue;
  };

  const PendingEditBadge = ({ field }: { field: string }) => {
    const edit = pendingEdits.find(e => e.field_name === field);
    if (!edit) return null;

    return (
      <div className="flex items-center gap-2 mt-1 animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="bg-yellow-50 border border-yellow-100 px-2 py-0.5 rounded text-[10px] font-bold text-yellow-700 flex items-center gap-1.5 shadow-sm">
          <span className="opacity-50">PROPOSED:</span> {edit.new_value}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => handleEditAction(edit.id, 'approve')}
            className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm"
          >
            <CheckCircle className="w-3 h-3" />
          </button>
          <button 
            onClick={() => handleEditAction(edit.id, 'reject')}
            className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-700 pb-20 bg-[#fcfcfc]">
      {/* Back Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-8 sticky top-0 z-[100] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/agents"
            className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-all border border-gray-100"
          >
             <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-black italic uppercase tracking-tighter text-[#b50a0a]">Agent Portal</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{agent.first_name} {agent.last_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isEditMode ? (
            <div className="flex gap-3">
              <button 
                onClick={() => { setIsEditMode(false); setEditedFields({}); }}
                className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <Undo className="w-3.5 h-3.5" /> Cancel
              </button>
              <button 
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-8 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a] transition-all flex items-center gap-2 shadow-xl shadow-gray-200"
              >
                {isSaving ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditMode(true)}
              className="px-8 py-2.5 bg-[#b50a0a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-red-900/10"
            >
              <Edit className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Premium Header */}
      <div className="relative w-full h-[400px] bg-[#0a0a0b] flex overflow-hidden group shrink-0 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover object-center opacity-30"
            alt="office background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 via-transparent to-[#0a0a0b]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent"></div>
        </div>

        <div className="max-w-[1200px] mx-auto w-full h-full relative flex px-8 pt-12">
          <div className="w-[30%] h-full relative flex items-end justify-center">
            <div className="absolute bottom-0 w-[140%] h-[80%] bg-emerald-600/20 blur-[100px] rounded-full"></div>
            <img
              src={agent.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"}
              alt={agent.first_name}
              className="h-[105%] w-auto object-cover object-top drop-shadow-[0_20px_60px_rgba(16,185,129,0.4)] relative z-10 transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="w-[70%] flex flex-col justify-center items-start pl-16 text-white z-20">
            <div className="mb-8">
              <h2 className="flex flex-col leading-[0.8] tracking-tighter uppercase">
                <span className="text-6xl md:text-8xl font-black">{agent.first_name}</span>
                <span className="text-7xl md:text-9xl font-black text-[#ffffff] opacity-100">{agent.last_name}</span>
              </h2>
            </div>

            <div className="flex items-center gap-8 mb-8">
               <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl">
                  <Shield className="w-6 h-6 text-emerald-500" />
                  <span className="text-lg font-black uppercase tracking-widest">{agent.agency_name || 'Independent'}</span>
                  <FlagIcon country={agent.country || ''} className="w-6 h-4" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">License No.</span>
                  <span className="text-xl font-black uppercase italic">{agent.license_code || 'UNLICENSED'}</span>
               </div>
            </div>

            <div className="flex items-center gap-8">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Corporate Presence</p>
               <div className="flex gap-6">
                  <Facebook className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-all hover:scale-125" />
                  <Instagram className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-all hover:scale-125" />
                  <Twitter className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-all hover:scale-125" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[73px] z-[90] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="flex items-center gap-12 overflow-x-auto [&::-webkit-scrollbar]:hidden pt-6">
             {[
               { id: 'profile', label: 'Agency Identity' },
               { id: 'bio', label: 'Company Profile' },
               { id: 'clients', label: 'Talent Roster' },
               { id: 'billing', label: 'Billing & Subs' }
             ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative text-[11px] font-black uppercase tracking-[0.25em] whitespace-nowrap pb-6 px-2 hover:text-[#b50a0a] transition-all ${
                    activeTab === tab.id ? 'text-[#b50a0a]' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#b50a0a] animate-in slide-in-from-left duration-300"></div>
                  )}
                </button>
             ))}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-[1200px] mx-auto w-full px-8 py-16">
         {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  <div className="lg:col-span-12 flex flex-col gap-12">
                     <div>
                        <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic underline underline-offset-8 decoration-[#b50a0a]/30 mb-12">Agency Data</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
                           {[
                              { label: 'First Name', value: agent.first_name, field: 'first_name', type: 'text' },
                              { label: 'Last Name', value: agent.last_name, field: 'last_name', type: 'text' },
                              { label: 'Agency Name', value: agent.agency_name, field: 'agency_name', type: 'text' },
                              { label: 'License Code', value: agent.license_code || 'N/A', field: 'license_code', type: 'text' },
                              { label: 'Country', value: agent.country, field: 'country', type: 'select', options: COUNTRIES },
                              { label: 'Age', value: agent.age || 'N/A', field: 'age', type: 'number' },
                              { label: 'Gender', value: agent.gender, field: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                           ].map((item, i) => (
                              <div key={i} className="flex flex-col border-b border-gray-100 pb-4 group">
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{item.label}</span>
                                 <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                       {isEditMode ? (
                                          item.type === 'select' ? (
                                             <select 
                                               value={displayValue(item.field as any, item.value)}
                                               onChange={(e) => updateField(item.field as any, e.target.value)}
                                               className="w-full bg-gray-50 border-none rounded-lg p-2 text-[13px] font-black uppercase text-gray-900 focus:ring-1 focus:ring-[#b50a0a]"
                                             >
                                                {(item.options || []).map((opt: string) => (
                                                   <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                             </select>
                                          ) : (
                                             <input 
                                               type={item.type}
                                               value={displayValue(item.field as any, item.value || '')}
                                               onChange={(e) => updateField(item.field as any, e.target.value)}
                                               className="w-full bg-gray-50 border-none rounded-lg p-2 text-[13px] font-black uppercase text-gray-900 focus:ring-1 focus:ring-[#b50a0a]"
                                             />
                                          )
                                       ) : (
                                          <div className="text-[14px] font-black text-gray-900 uppercase">
                                             {item.value || 'N/A'}
                                          </div>
                                       )}
                                       <PendingEditBadge field={item.field} />
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'bio' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="max-w-4xl">
                  <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic mb-12">Company Profile</h3>
                  {isEditMode ? (
                     <textarea 
                        className="w-full bg-white border border-gray-100 rounded-3xl p-10 text-lg font-bold text-gray-600 leading-relaxed shadow-xl h-[400px] focus:ring-2 focus:ring-[#b50a0a] outline-none"
                        value={displayValue('bio', agent.bio || '')}
                        onChange={(e) => updateField('bio', e.target.value)}
                        placeholder="Enter agency description..."
                     />
                  ) : (
                     <div className="bg-white border border-gray-50 rounded-[3rem] p-16 shadow-2xl relative">
                        <p className="text-2xl font-bold text-gray-500 leading-relaxed italic relative z-10">
                           {agent.bio || "No company profile provided."}
                        </p>
                     </div>
                  )}
                  <PendingEditBadge field="bio" />
               </div>
            </div>
         )}

         {activeTab === 'clients' && (
            <div className="animate-in fade-in duration-700">
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic">Talent Roster</h3>
                  <button className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a] transition-all">
                     <Plus className="w-3.5 h-3.5" /> Add New Talent
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                     { name: 'Kylian Mbappé', role: 'Forward', age: 25, value: '€180M', image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800&auto=format&fit=crop' },
                     { name: 'Erling Haaland', role: 'Striker', age: 23, value: '€200M', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop' },
                     { name: 'Jude Bellingham', role: 'Midfielder', age: 20, value: '€150M', image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop' }
                  ].map((talent, i) => (
                     <div key={i} className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="aspect-[4/5] overflow-hidden">
                           <img src={talent.image} alt={talent.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b50a0a] mb-2">{talent.role}</p>
                           <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">{talent.name}</h4>
                           <div className="flex items-center justify-between">
                              <div className="flex gap-4">
                                 <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Age</span>
                                    <span className="text-xs font-black">{talent.age}</span>
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Market Value</span>
                                    <span className="text-xs font-black">{talent.value}</span>
                                 </div>
                              </div>
                              <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#b50a0a] transition-all">
                                 <Eye className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {activeTab === 'billing' && (
            <div className="animate-in fade-in duration-700 space-y-12">
               <div className="bg-gray-900 rounded-[3rem] p-16 text-white shadow-2xl">
                  <div className="flex items-center justify-between mb-12">
                     <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400">Subscription Hub</h3>
                     <span className={`${agent.is_subscribed ? 'bg-green-500' : 'bg-emerald-600'} px-8 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest`}>
                        {agent.is_subscribed ? 'Agency Premium' : 'Network Access'}
                     </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Expiration Date</p>
                        <p className="text-4xl font-black italic tracking-tighter">
                           {agent.users?.subscriptions?.[0]?.current_period_end ? (
                              <DateDisplay date={agent.users.subscriptions[0].current_period_end} />
                           ) : 'UNSET'}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
