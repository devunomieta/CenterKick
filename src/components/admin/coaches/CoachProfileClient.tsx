'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Users, Search, Filter, Shield, UserPlus, 
  MoreHorizontal, Edit, Trash2, ExternalLink, 
  ChevronLeft, ChevronRight, X, User, ChevronDown,
  Globe, Calendar, MapPin, Target, CheckCircle, Clock, CreditCard, Lock, Eye, Mail, Trophy, Activity, MessageSquare,
  Facebook, Instagram, Twitter, AlertCircle, Save, Undo, Plus, Briefcase,
  LayoutDashboard, UserCircle, FileText, Image as ImageIcon, Newspaper, ShoppingBag, DollarSign, Settings,
  Star, Award, Building2, CheckCircle2
} from 'lucide-react';
import { RestrictedAccessInline, RestrictedAccess } from '@/components/admin/RestrictedAccess';
import { DateDisplay } from '@/components/common/DateDisplay';
import { getPendingEdits, processProfileEdit, getPlayerTransactions } from '@/app/admin/players/actions';
import { updateCoach } from '@/app/admin/coaches/actions';
import Link from 'next/link';
import { COUNTRIES } from '@/lib/constants/countries';
import { FOOTBALL_DATA } from '@/lib/constants/football_data';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { FlagIcon } from '@/components/common/FlagIcon';

interface Coach {
  id: string;
  user_id: string | null;
  email: string | null;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  country: string | null;
  date_of_birth?: string;
  age?: number;
  gender: string;
  position: string;
  is_subscribed: boolean;
  avatar_url?: string;
  agent_id?: string;
  bio?: string;
  current_club?: string;
  league?: string;
  achievements?: any[];
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

import { uploadPlayerImage } from '@/app/admin/players/actions';

interface CoachProfileClientProps {
  coach: Coach;
  agents: any[];
}

export default function CoachProfileClient({ coach, agents }: CoachProfileClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'bio' | 'gallery' | 'news' | 'billing'>('profile');
  const [playerTransactions, setPlayerTransactions] = useState<any[]>([]);
  const [pendingEdits, setPendingEdits] = useState<ProfileEdit[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingEdits, setIsLoadingEdits] = useState(false);
  const [editingSection, setEditingSection] = useState<'identity' | 'pro' | null>(null);
  const [editedFields, setEditedFields] = useState<Partial<Coach>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'billing') {
      const fetchTransactions = async () => {
        setIsLoadingTransactions(true);
        const res = await getPlayerTransactions(coach.id);
        if (res.success) setPlayerTransactions(res.data || []);
        setIsLoadingTransactions(false);
      };
      fetchTransactions();
    }
  }, [coach.id, activeTab]);

  useEffect(() => {
    const fetchEdits = async () => {
      setIsLoadingEdits(true);
      const res = await getPendingEdits(coach.id);
      if (res.success) setPendingEdits(res.data || []);
      setIsLoadingEdits(false);
    };
    fetchEdits();
  }, [coach.id]);

  const handleEditAction = async (editId: string, action: 'approve' | 'reject') => {
    const res = await processProfileEdit(editId, action);
    if (res.success) {
      toast.showToast(`Change ${action}d successfully`, 'success');
      const updatedEdits = await getPendingEdits(coach.id);
      if (updatedEdits.success) setPendingEdits(updatedEdits.data || []);
      router.refresh();
    } else {
      toast.showToast(res.error || 'Failed to process edit', 'error');
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const res = await updateCoach(coach.id, editedFields);
    if (res.success) {
      toast.showToast('Coach profile updated successfully', 'success');
      setEditingSection(null);
      setEditedFields({});
      router.refresh();
    } else {
      toast.showToast(res.error || 'Failed to update coach profile', 'error');
    }
    setIsSaving(false);
  };

  const updateField = (field: keyof Coach, value: any) => {
    setEditedFields(prev => ({ ...prev, [field]: value }));
  };

  const displayValue = (field: keyof Coach, defaultValue: any) => {
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
        const updateRes = await updateCoach(coach.id, { avatar_url: res.url });
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

  const sortedSeasons = []; // Coaches don't have seasons yet, but we'll keep the structure for future parity
  const groupedStats = {};

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
              href="/admin/coaches"
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Coaches
            </Link>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-4">
              <div 
                className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white overflow-hidden shadow-lg cursor-pointer group/avatar relative ${avatarUploading ? 'animate-pulse' : ''}`}
                onClick={() => !avatarUploading && avatarInputRef.current?.click()}
              >
                {coach.avatar_url ? (
                  <img src={coach.avatar_url} className="w-full h-full object-cover group-hover/avatar:opacity-50 transition-all" />
                ) : (
                  <User className="w-5 h-5 group-hover/avatar:opacity-50 transition-all" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all">
                  <Edit className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none flex items-center gap-3">
                  {coach.first_name} <span className="text-[#b50a0a]">{coach.last_name}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest ${
                    coach.is_subscribed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {coach.is_subscribed ? 'PRO' : 'NEW'}
                  </span>
                </h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  <FlagIcon country={coach.country || ''} className="w-3.5 h-2.5" />
                  ID: {coach.email || 'NO EMAIL'} • {coach.position}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href={`/coaches/${coach.id}`} 
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
            {coach.avatar_url ? (
              <img src={coach.avatar_url} alt="" className="w-full aspect-square object-cover border-2 border-slate-50 shadow-inner transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="w-full aspect-square bg-slate-100 flex items-center justify-center text-slate-300 text-4xl font-black">
                {coach.first_name[0]}{coach.last_name[0]}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: 'profile', label: 'Overview & Details', icon: LayoutDashboard },
              { id: 'bio', label: 'Coaching Bio', icon: FileText },
              { id: 'gallery', label: 'Tactics & Media', icon: ImageIcon },
              { id: 'news', label: 'Latest Mentions', icon: Newspaper },
              { id: 'billing', label: 'Billing & History', icon: DollarSign },
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
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Agent</p>
              {coach.agent_id ? (
                <Link href={`/admin/agents/${coach.agent_id}`} className="text-[10px] font-black text-slate-900 uppercase hover:text-[#b50a0a] transition-colors">
                  {agents.find(a => a.user_id === coach.agent_id)?.first_name ? `${agents.find(a => a.user_id === coach.agent_id)?.first_name} ${agents.find(a => a.user_id === coach.agent_id)?.last_name}` : 'Linked Agent'}
                </Link>
              ) : (
                <p className="text-[10px] font-bold text-slate-400 italic">Independent</p>
              )}
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
                        { label: 'First Name', value: coach.first_name, field: 'first_name', type: 'text' },
                        { label: 'Last Name', value: coach.last_name, field: 'last_name', type: 'text' },
                        { label: 'Email Address', value: coach.email || 'N/A', field: 'email', type: 'text' },
                        { label: 'Date Of Birth', value: coach.date_of_birth, field: 'date_of_birth', type: 'date' },
                        { label: 'Citizenship', value: coach.country, field: 'country', type: 'select', options: COUNTRIES },
                        { label: 'Gender', value: coach.gender, field: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
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
                              {item.field === 'date_of_birth' ? (item.value ? <DateDisplay date={item.value as string} /> : 'N/A') : item.value}
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

                {/* Professional Details Card */}
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -z-0 transition-all group-hover:bg-slate-100"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Pro Career</h3>
                      </div>
                      <button 
                         onClick={() => setEditingSection(editingSection === 'pro' ? null : 'pro')}
                         className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      {(() => {
                        const currentLeague = displayValue('league' as any, coach.league);
                        const availableClubs = FOOTBALL_DATA.leagues.find(l => l.name === currentLeague)?.clubs || [];
                        
                        return [
                          { label: 'Primary Role', value: coach.position, field: 'position', type: 'select', options: ['Head Coach', 'Assistant Coach', 'Goalkeeping Coach', 'Fitness Coach'] },
                          { label: 'League', value: coach.league || 'Not Set', field: 'league', type: 'select', options: ['None', ...FOOTBALL_DATA.leagues.map(l => l.name)] },
                          { label: 'Current Club', value: coach.current_club || 'Unattached', field: 'current_club', type: availableClubs.length > 0 ? 'select' : 'text', options: availableClubs },
                          { label: 'Managing Agent', value: coach.agent_id, field: 'agent_id', type: 'select', options: agents.map(a => ({ id: a.user_id, name: `${a.first_name} ${a.last_name}` })) },
                        ];
                      })().map((item, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                          {editingSection === 'pro' ? (
                            item.type === 'select' ? (
                              <select 
                                value={displayValue(item.field as any, item.value || '')}
                                onChange={(e) => {
                                  updateField(item.field as any, e.target.value);
                                  if (item.field === 'league') updateField('current_club' as any, '');
                                }}
                                className="w-full bg-slate-50 border-none rounded-lg p-2 text-[12px] font-bold text-slate-900 focus:ring-1 focus:ring-[#b50a0a]"
                              >
                                {item.field === 'current_club' && <option value="">Select Club</option>}
                                {item.field === 'agent_id' && <option value="">Independent</option>}
                                {(item.options || []).map((opt: any) => (
                                  <option key={typeof opt === 'string' ? opt : opt.id} value={typeof opt === 'string' ? opt : opt.id}>
                                    {typeof opt === 'string' ? opt : opt.name}
                                  </option>
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
                              {item.field === 'agent_id' 
                                ? (agents.find(a => a.user_id === item.value)?.first_name 
                                   ? `${agents.find(a => a.user_id === item.value)?.first_name} ${agents.find(a => a.user_id === item.value)?.last_name}` 
                                   : 'Independent')
                                : item.value}
                            </div>
                          )}
                          <PendingEditBadge field={item.field} />
                        </div>
                      ))}
                    </div>

                    {editingSection === 'pro' && (
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
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Coaching Biography</h3>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Experience & Philosophy</p>
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
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-[13px] font-medium text-slate-600 leading-relaxed shadow-inner focus:ring-2 focus:ring-[#b50a0a] focus:border-transparent outline-none transition-all resize-none"
                      value={displayValue('bio', coach.bio || '')}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="Share your coaching philosophy, career highlights, and methodology..."
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
                        {coach.bio || "No professional biography has been provided yet."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Tactics & Media</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Review coaching assets and tactical boards</p>
                  </div>
                  <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a] transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                     <Plus className="w-4 h-4" /> Add Asset
                  </button>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                     'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
                     'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop',
                     'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800&auto=format&fit=crop',
                     'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop'
                  ].map((url, i) => (
                     <div key={i} className="aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group cursor-pointer hover:border-[#b50a0a] transition-all relative">
                        <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Eye className="w-6 h-6 text-white" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-12">Latest Mentions</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                     { title: `Tactical Masterclass: How ${coach.last_name} Secured the Win`, date: "2 Days Ago", source: "SoccerDaily" },
                     { title: "Exclusive Interview: Building a Legacy at the Top Level", date: "1 Week Ago", source: "ProCoach Mag" }
                  ].map((news, i) => (
                     <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-2 h-2 rounded-full bg-[#b50a0a]"></div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{news.source}</span>
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-tight group-hover:text-[#b50a0a] transition-colors mb-6 leading-tight">{news.title}</h4>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{news.date}</span>
                           <button className="text-[10px] font-black uppercase tracking-widest text-[#b50a0a] flex items-center gap-2 group/btn">
                                Read Article <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                           </button>
                        </div>
                     </div>
                  ))}
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
                       <span className={`${coach.is_subscribed ? 'bg-emerald-500' : 'bg-slate-700'} px-8 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest`}>
                          {coach.is_subscribed ? 'Coach Premium' : 'Standard Access'}
                       </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Expiration Date</p>
                          <p className="text-4xl font-black italic tracking-tighter">
                             {coach.users?.subscriptions?.[0]?.current_period_end ? (
                                <DateDisplay date={coach.users.subscriptions[0].current_period_end} />
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
