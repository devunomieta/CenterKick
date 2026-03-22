'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Users, Search, Filter, Shield, UserPlus, 
  MoreHorizontal, Edit, Trash2, ExternalLink, 
  ChevronLeft, ChevronRight, X, User, ChevronDown,
  Globe, Calendar, MapPin, Target, CheckCircle, Clock, CreditCard, Lock, Eye, Mail, Trophy, Activity, MessageSquare,
  Facebook, Instagram, Twitter, AlertCircle, Save, Undo, Plus, Briefcase, Link2, LayoutDashboard, UserCircle, FileText, Image as ImageIcon, Newspaper, DollarSign, Settings
} from 'lucide-react';
import { RestrictedAccessInline, RestrictedAccess } from '@/components/admin/RestrictedAccess';
import { DateDisplay } from '@/components/common/DateDisplay';
import { getPendingEdits, processProfileEdit, getPlayerTransactions, uploadPlayerImage } from '@/app/admin/players/actions';
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
  slug?: string;
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
  const [editingSection, setEditingSection] = useState<'identity' | 'agency' | 'bio' | null>(null);
  const [editedFields, setEditedFields] = useState<Partial<Agent>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

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
      setEditingSection(null);
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

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadPlayerImage(formData);
      if (res.url) {
        const updateRes = await updateAgent(agent.id, { avatar_url: res.url });
        if (updateRes.success) {
          toast.showToast('Profile picture updated', 'success');
          router.refresh();
        } else {
          toast.showToast(updateRes.error || 'Database update failed', 'error');
        }
      } else {
        toast.showToast(res.error || 'Upload failed', 'error');
      }
    } catch (err) {
      toast.showToast('An unexpected error occurred', 'error');
    } finally {
      setAvatarUploading(false);
    }
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
    <div className="flex flex-col min-h-screen bg-[#f8fafc] animate-in fade-in duration-500">
      <input 
        type="file" 
        ref={avatarInputRef}
        className="hidden" 
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
      />
      
      {/* Dashboard Top Bar - Sticky */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-[-32px] z-[100] shadow-sm mx-[-32px] mt-[-32px] mb-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/admin/agents"
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Agents
            </Link>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-4">
              <div 
                className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white overflow-hidden shadow-lg cursor-pointer group/avatar relative ${avatarUploading ? 'animate-pulse' : ''}`}
                onClick={() => !avatarUploading && avatarInputRef.current?.click()}
              >
                {agent.avatar_url ? (
                  <img src={agent.avatar_url} className="w-full h-full object-cover group-hover/avatar:opacity-50 transition-all" />
                ) : (
                  <User className="w-5 h-5 group-hover/avatar:opacity-50 transition-all" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all">
                  <Edit className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none flex items-center gap-3">
                  {agent.first_name} <span className="text-[#b50a0a]">{agent.last_name}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest ${
                    agent.is_subscribed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {agent.is_subscribed ? 'PRO' : 'NEW'}
                  </span>
                </h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  <FlagIcon country={agent.country || ''} className="w-3.5 h-2.5" />
                  ID: {agent.email || 'NO EMAIL'} • {agent.agency_name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href={`/agents/${agent.slug || agent.id}`} 
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
            >
              View Public <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full flex gap-8 px-8 pb-12 flex-1 items-start">
        {/* Left Sidebar - Profile Summary - Sticky */}
        <div className="w-72 bg-white border border-slate-100 p-6 rounded-[2.5rem] flex flex-col gap-8 sticky top-[72px] shadow-sm shadow-slate-200/50">
          <div 
            className={`relative group cursor-pointer overflow-hidden rounded-[2rem] ${avatarUploading ? 'animate-pulse opacity-50' : ''}`}
            onClick={() => !avatarUploading && avatarInputRef.current?.click()}
          >
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 transform scale-90 group-hover:scale-100 transition-all">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            {agent.avatar_url ? (
              <img src={agent.avatar_url} alt="" className="w-full aspect-square object-cover border-2 border-slate-50 shadow-inner transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="w-full aspect-square bg-slate-100 flex items-center justify-center text-slate-300 text-4xl font-black">
                {agent.first_name[0]}{agent.last_name[0]}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: 'profile', label: 'Agency Identity', icon: LayoutDashboard },
              { id: 'bio', label: 'Company Profile', icon: FileText },
              { id: 'clients', label: 'Talent Roster', icon: Users },
              { id: 'billing', label: 'Billing & Subs', icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setEditingSection(null); }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group ${
                  activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-300 group-hover:text-slate-900'} transition-colors`} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-50">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Network</p>
              <div className="flex items-center gap-2">
                 <Users className="w-4 h-4 text-slate-900" />
                 <p className="text-xl font-black italic tracking-tighter text-slate-900">0 Clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                {/* Identity Card */}
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -z-0 transition-all group-hover:bg-slate-100"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                          <UserCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Identity Details</h3>
                      </div>
                      <button 
                        onClick={() => setEditingSection(editingSection === 'identity' ? null : 'identity')}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      {[
                        { label: 'First Name', value: agent.first_name, field: 'first_name', type: 'text' },
                        { label: 'Last Name', value: agent.last_name, field: 'last_name', type: 'text' },
                        { label: 'Email Address', value: agent.email || 'N/A', field: 'email', type: 'text' },
                        { label: 'Citizenship', value: agent.country, field: 'country', type: 'select', options: COUNTRIES },
                        { label: 'Age', value: agent.age || 'N/A', field: 'age', type: 'number' },
                        { label: 'Gender', value: agent.gender, field: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                        { label: 'Slug', value: agent.slug || 'N/A', field: 'slug', type: 'text' },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                          {editingSection === 'identity' ? (
                            item.type === 'select' ? (
                              <select 
                                value={displayValue(item.field as any, item.value || '')}
                                onChange={(e) => updateField(item.field as any, e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-lg p-2 text-[12px] font-bold text-slate-900 focus:ring-1 focus:ring-[#b50a0a]"
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
                                className="w-full bg-slate-50 border-none rounded-lg p-2 text-[12px] font-bold text-slate-900 focus:ring-1 focus:ring-[#b50a0a]"
                              />
                            )
                          ) : (
                            <div className="text-[13px] font-bold text-slate-800">
                              {item.value || 'N/A'}
                            </div>
                          )}
                          <PendingEditBadge field={item.field} />
                        </div>
                      ))}
                    </div>

                    {editingSection === 'identity' && (
                      <div className="mt-8 flex gap-3 animate-in fade-in slide-in-from-top-2">
                        <button onClick={handleSaveChanges} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a] transition-all">Save Changes</button>
                        <button onClick={() => { setEditingSection(null); setEditedFields({}); }} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agency Details Card */}
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -z-0 transition-all group-hover:bg-slate-100"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Agency Operations</h3>
                      </div>
                      <button 
                         onClick={() => setEditingSection(editingSection === 'agency' ? null : 'agency')}
                         className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      {[
                        { label: 'Agency Name', value: agent.agency_name, field: 'agency_name', type: 'text' },
                        { label: 'License Code', value: agent.license_code || 'UNLICENSED', field: 'license_code', type: 'text' },
                        { label: 'Status', value: agent.status, field: 'status', type: 'select', options: ['active', 'pending', 'suspended'] },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                          {editingSection === 'agency' ? (
                            item.type === 'select' ? (
                              <select 
                                value={displayValue(item.field as any, item.value || '')}
                                onChange={(e) => updateField(item.field as any, e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-lg p-2 text-[12px] font-bold text-slate-900 focus:ring-1 focus:ring-[#b50a0a]"
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
                                className="w-full bg-slate-50 border-none rounded-lg p-2 text-[12px] font-bold text-slate-900 focus:ring-1 focus:ring-[#b50a0a]"
                              />
                            )
                          ) : (
                            <div className="text-[13px] font-bold text-slate-800">
                              {item.value || 'N/A'}
                            </div>
                          )}
                          <PendingEditBadge field={item.field} />
                        </div>
                      ))}
                    </div>

                    {editingSection === 'agency' && (
                      <div className="mt-8 flex gap-3 animate-in fade-in slide-in-from-top-2">
                        <button onClick={handleSaveChanges} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a] transition-all">Save Changes</button>
                        <button onClick={() => { setEditingSection(null); setEditedFields({}); }} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bio' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-indigo-50/50"></div>
                
                <div className="flex items-center justify-between mb-6 relative">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Company Profile</h3>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Agency Brand & History</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditingSection(editingSection === 'bio' ? null : 'bio')}
                    className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                
                {editingSection === 'bio' ? (
                  <div className="space-y-6 relative">
                    <textarea 
                      rows={8}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-[13px] font-medium text-slate-600 leading-relaxed shadow-inner focus:ring-2 focus:ring-[#b50a0a] focus:border-transparent outline-none transition-all resize-none"
                      value={displayValue('bio', agent.bio || '')}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="Describe your agency's mission, key achievements, and roster focus..."
                    />
                    <div className="flex gap-4">
                      <button onClick={handleSaveChanges} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#b50a0a] transition-all shadow-lg shadow-slate-200">Save Biography</button>
                      <button onClick={() => { setEditingSection(null); setEditedFields({}); }} className="px-10 py-4 bg-white text-slate-400 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="p-8 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 relative group/bio shadow-inner">
                      <div className="text-[13px] font-medium text-slate-600 leading-[1.8] whitespace-pre-wrap">
                        {agent.bio || "No company profile has been provided yet."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Talent Roster</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage athletes linked to your agency</p>
                  </div>
                  <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a] transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                     <Plus className="w-4 h-4" /> Add Talent
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[].map((client: any, i) => (
                     <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group">
                        {/* Client details here if we had them */}
                     </div>
                  ))}
               </div>
               
               <div className="bg-slate-50 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">No athletes linked</h4>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Add athletes to provide agency oversight</p>
               </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
               <div className="bg-slate-900 rounded-[3rem] p-16 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#b50a0a]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-12">
                       <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-500">Subscription Hub</h3>
                       <span className={`${agent.is_subscribed ? 'bg-emerald-500' : 'bg-slate-700'} px-8 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest`}>
                          {agent.is_subscribed ? 'Agency Premium' : 'Network Access'}
                       </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Expiration Date</p>
                          <p className="text-4xl font-black italic tracking-tighter">
                             {agent.users?.subscriptions?.[0]?.current_period_end ? (
                                <DateDisplay date={agent.users.subscriptions[0].current_period_end} />
                             ) : 'UNSET'}
                          </p>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
