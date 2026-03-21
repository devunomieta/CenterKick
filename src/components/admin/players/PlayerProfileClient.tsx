'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Shield, UserPlus, 
  MoreHorizontal, Edit, Trash2, ExternalLink, 
  ChevronLeft, ChevronRight, X, User, ChevronDown,
  Globe, Calendar, MapPin, Target, CheckCircle, Clock, CreditCard, Lock, Eye, Mail, Trophy, Activity, MessageSquare,
  Facebook, Instagram, Twitter, AlertCircle, Save, Undo, Plus,
  LayoutDashboard, UserCircle, Briefcase, FileText, Image as ImageIcon, Newspaper, ShoppingBag, DollarSign, Settings,
  Star, Award
} from 'lucide-react';
import { RestrictedAccessInline, RestrictedAccess } from '@/components/admin/RestrictedAccess';
import { DateDisplay } from '@/components/common/DateDisplay';
import { 
  getPlayerTransactions, getPendingEdits, processProfileEdit, updatePlayer,
  getPlayerStats, addPlayerStat, updatePlayerStat, deletePlayerStat,
  getPlayerTransfers, addPlayerTransfer, updatePlayerTransfer, deletePlayerTransfer
} from '@/app/admin/players/actions';
import Link from 'next/link';
import { COUNTRIES } from '@/lib/constants/countries';
import { FOOTBALL_DATA } from '@/lib/constants/football_data';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { FlagIcon } from '@/components/common/FlagIcon';

interface Player {
  id: string;
  user_id: string | null;
  email: string | null;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  country: string | null;
  date_of_birth: string;
  gender: string;
  position: string;
  foot: string;
  is_subscribed: boolean;
  avatar_url?: string;
  agent_id?: string;
  agent_status?: 'pending' | 'accepted' | 'rejected';
  place_of_birth?: string;
  current_club?: string;
  joined_date?: string;
  contract_expiry?: string;
  current_salary?: string;
  bio?: string;
  phone_number?: string;
  jersey_number?: number;
  height_cm?: number;
  weight_kg?: number;
  market_value?: string;
  formation?: string;
  league?: string;
  social_links?: any;
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

interface CareerStat {
  id: string;
  player_id: string;
  season: string;
  league_name: string | null;
  league_flag: string | null;
  club_name: string;
  club_flag: string | null;
  appearances: number;
  minutes_played: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  created_at?: string;
}

interface PlayerTransfer {
  id: string;
  player_id: string;
  season: string;
  transfer_date: string | null;
  from_club_name: string;
  from_club_flag: string | null;
  to_club_name: string;
  to_club_flag: string | null;
  league_name: string | null;
  league_flag: string | null;
  transfer_fee: string | null;
  created_at?: string;
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

interface PlayerProfileClientProps {
  player: Player;
  agents: any[];
}

const SEASONS = (() => {
  const years = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  // Football season usually starts in July. If before July, previous year is the start.
  const endYear = now.getMonth() < 6 ? currentYear : currentYear + 1;
  
  for (let year = endYear - 1; year >= 2000; year--) {
    years.push(`${year}/${(year + 1).toString().slice(-2)}`);
  }
  return years;
})();

function StatFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  defaultSeason 
}: { 
  isOpen: boolean; onClose: () => void; onSave: (data: any) => void; initialData?: CareerStat | null; defaultSeason?: string | null 
}) {
  const [formData, setFormData] = useState<Partial<CareerStat>>(initialData || {
    season: defaultSeason || SEASONS[0],
    appearances: 0,
    goals: 0,
    assists: 0,
    minutes_played: 0,
    yellow_cards: 0,
    red_cards: 0,
    league_name: '',
    club_name: ''
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else if (defaultSeason) setFormData(prev => ({ ...prev, season: defaultSeason }));
    else setFormData(prev => ({ ...prev, season: SEASONS[0] }));
  }, [initialData, defaultSeason, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {initialData ? 'Edit Career Record' : 'Add Career Record'}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Detailed Performance Entry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Season & League */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Football Season</label>
              <select 
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              >
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">League / Tournament</label>
              <div className="relative group/select">
                <input 
                  type="text"
                  list="league-list"
                  placeholder="e.g. Premier League"
                  value={formData.league_name || ''}
                  onChange={(e) => {
                    const league = FOOTBALL_DATA.leagues.find(l => l.name === e.target.value);
                    setFormData({ 
                      ...formData, 
                      league_name: e.target.value,
                      league_flag: league ? league.flag : formData.league_flag
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
                />
                <datalist id="league-list">
                  {FOOTBALL_DATA.leagues.map(l => <option key={l.name} value={l.name} />)}
                </datalist>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {formData.league_flag && (
                    <img 
                      src={`https://flagcdn.com/w20/${formData.league_flag.toLowerCase()}.png`} 
                      alt="" 
                      className="w-4 h-3 object-cover rounded-sm"
                    />
                  )}
                  <Search className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Club / Team Name</label>
            <div className="relative">
              <input 
                type="text"
                list="club-list"
                placeholder="Search or enter club name..."
                value={formData.club_name || ''}
                onChange={(e) => setFormData({ ...formData, club_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              />
              <datalist id="club-list">
                {FOOTBALL_DATA.leagues
                  .find(l => l.name === formData.league_name)
                  ?.clubs.map(c => <option key={c} value={c} />)}
                {!formData.league_name && FOOTBALL_DATA.leagues.flatMap(l => l.clubs).map(c => <option key={c} value={c} />)}
              </datalist>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Activity className="w-3 h-3 text-slate-400" /> Appearances
              </label>
              <input 
                type="number"
                min="0"
                value={formData.appearances || 0}
                onChange={(e) => setFormData({ ...formData, appearances: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Clock className="w-3 h-3 text-slate-400" /> Minutes Played
              </label>
              <input 
                type="number"
                min="0"
                value={formData.minutes_played || 0}
                onChange={(e) => setFormData({ ...formData, minutes_played: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Target className="w-3 h-3 text-slate-400" /> Goals
              </label>
              <input 
                type="number"
                min="0"
                value={formData.goals || 0}
                onChange={(e) => setFormData({ ...formData, goals: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Award className="w-3 h-3 text-slate-400" /> Assists
              </label>
              <input 
                type="number"
                min="0"
                value={formData.assists || 0}
                onChange={(e) => setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-yellow-500" /> Yellow Cards
              </label>
              <input 
                type="number"
                min="0"
                value={formData.yellow_cards || 0}
                onChange={(e) => setFormData({ ...formData, yellow_cards: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-red-500" /> Red Cards
              </label>
              <input 
                type="number"
                min="0"
                value={formData.red_cards || 0}
                onChange={(e) => setFormData({ ...formData, red_cards: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button 
            onClick={() => onSave(formData)}
            className="flex-1 bg-slate-900 text-white rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#b50a0a] transition-all shadow-xl shadow-slate-200"
          >
            {initialData ? 'Save Changes' : 'Add Record'}
          </button>
          <button 
            onClick={onClose}
            className="px-10 bg-white text-slate-400 border border-slate-200 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function TransferFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}: { 
  isOpen: boolean; onClose: () => void; onSave: (data: any) => void; initialData?: PlayerTransfer | null 
}) {
  const [formData, setFormData] = useState<Partial<PlayerTransfer>>(initialData || {
    season: SEASONS[0],
    transfer_date: new Date().toISOString().split('T')[0],
    from_club_name: '',
    to_club_name: '',
    league_name: '',
    transfer_fee: ''
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({
        season: SEASONS[0],
        transfer_date: new Date().toISOString().split('T')[0],
        from_club_name: '',
        to_club_name: '',
        league_name: '',
        transfer_fee: ''
    });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
              {initialData ? 'Edit Transfer Record' : 'Add Transfer Record'}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Movement & Contract Details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Season</label>
              <select 
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              >
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transfer Date</label>
              <input 
                type="date"
                value={formData.transfer_date || ''}
                onChange={(e) => setFormData({ ...formData, transfer_date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">League</label>
            <div className="relative group/select">
              <input 
                type="text"
                list="transfer-league-list"
                placeholder="Select League"
                value={formData.league_name || ''}
                onChange={(e) => {
                    const league = FOOTBALL_DATA.leagues.find(l => l.name === e.target.value);
                    setFormData({ 
                      ...formData, 
                      league_name: e.target.value,
                      league_flag: league ? league.flag : formData.league_flag
                    });
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
              />
              <datalist id="transfer-league-list">
                {FOOTBALL_DATA.leagues.map(l => <option key={l.name} value={l.name} />)}
              </datalist>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {formData.league_flag && (
                  <img 
                    src={`https://flagcdn.com/w20/${formData.league_flag.toLowerCase()}.png`} 
                    alt="" 
                    className="w-4 h-3 object-cover rounded-sm"
                  />
                )}
                <Search className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Club (Joined)</label>
                <div className="relative">
                  <input 
                    type="text"
                    list="to-club-list"
                    placeholder="Joined..."
                    value={formData.to_club_name || ''}
                    onChange={(e) => setFormData({ ...formData, to_club_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
                  />
                  <datalist id="to-club-list">
                    {FOOTBALL_DATA.leagues
                      .find(l => l.name === formData.league_name)
                      ?.clubs.map(c => <option key={c} value={c} />)}
                    {!formData.league_name && FOOTBALL_DATA.leagues.flatMap(l => l.clubs).map(c => <option key={c} value={c} />)}
                  </datalist>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Search className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Old Club (Left)</label>
                <div className="relative">
                  <input 
                    type="text"
                    list="from-club-list"
                    placeholder="Left..."
                    value={formData.from_club_name || ''}
                    onChange={(e) => setFormData({ ...formData, from_club_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
                  />
                  <datalist id="from-club-list">
                    {FOOTBALL_DATA.leagues
                      .flatMap(l => l.clubs)
                      .map(c => <option key={c} value={c} />)}
                  </datalist>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Search className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transfer Fee / Status</label>
            <div className="flex gap-4">
              {['Free', 'Loan', 'Transferred'].map((type) => (
                <label key={type} className="flex-1 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="feeType" 
                    className="hidden" 
                    checked={(type === 'Transferred' && !['Free', 'Loan'].includes(formData.transfer_fee || '')) || formData.transfer_fee === type}
                    onChange={() => {
                      if (type === 'Transferred') {
                        setFormData({ ...formData, transfer_fee: '' });
                      } else {
                        setFormData({ ...formData, transfer_fee: type });
                      }
                    }}
                  />
                  <div className={`
                    py-4 rounded-2xl border-2 text-center transition-all
                    ${(type === 'Transferred' && !['Free', 'Loan'].includes(formData.transfer_fee || '')) || formData.transfer_fee === type
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'}
                  `}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                  </div>
                </label>
              ))}
            </div>

            {(!['Free', 'Loan'].includes(formData.transfer_fee || '')) && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input 
                  type="text"
                  placeholder="Enter Transfer Amount (e.g. $10,000,000)"
                  value={formData.transfer_fee || ''}
                  onChange={(e) => setFormData({ ...formData, transfer_fee: e.target.value })}
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#b50a0a] transition-all"
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button 
            onClick={() => onSave(formData)}
            className="flex-1 bg-slate-900 text-white rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#b50a0a] transition-all shadow-xl shadow-slate-200"
          >
            {initialData ? 'Save Changes' : 'Add Record'}
          </button>
          <button 
            onClick={onClose}
            className="px-10 bg-white text-slate-400 border border-slate-200 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlayerProfileClient({ player, agents }: PlayerProfileClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'bio' | 'gallery' | 'news' | 'shop' | 'billing'>('profile');
  const [playerTransactions, setPlayerTransactions] = useState<any[]>([]);
  const [pendingEdits, setPendingEdits] = useState<ProfileEdit[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingEdits, setIsLoadingEdits] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState<Partial<Player>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [playerStats, setPlayerStats] = useState<CareerStat[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);
  const [editingStat, setEditingStat] = useState<CareerStat | null>(null);
  const [selectedSeasonForAdd, setSelectedSeasonForAdd] = useState<string | null>(null);
  const [playerTransfers, setPlayerTransfers] = useState<PlayerTransfer[]>([]);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<PlayerTransfer | null>(null);

  useEffect(() => {
    // Fetch transactions when on billing tab
    if (activeTab === 'billing') {
      const fetchTransactions = async () => {
        setIsLoadingTransactions(true);
        const res = await getPlayerTransactions(player.id);
        if (res.success) setPlayerTransactions(res.data || []);
        setIsLoadingTransactions(false);
      };
      fetchTransactions();
    }
  }, [player.id, activeTab]);

  useEffect(() => {
    // Fetch pending edits on load
    const fetchEdits = async () => {
      setIsLoadingEdits(true);
      const res = await getPendingEdits(player.id);
      if (res.success) setPendingEdits(res.data || []);
      setIsLoadingEdits(false);
    };
    fetchEdits();
  }, [player.id]);

  useEffect(() => {
    // Fetch stats and transfers when on stats tab
    if (activeTab === 'stats') {
      const fetchData = async () => {
        setIsLoadingStats(true);
        setIsLoadingTransfers(true);
        const [statsRes, transfersRes] = await Promise.all([
          getPlayerStats(player.id),
          getPlayerTransfers(player.id)
        ]);
        if (statsRes.success) setPlayerStats(statsRes.data || []);
        if (transfersRes.success) setPlayerTransfers(transfersRes.data || []);
        setIsLoadingStats(false);
        setIsLoadingTransfers(false);
      };
      fetchData();
    }
  }, [player.id, activeTab]);

  const groupedStats = playerStats.reduce((acc: { [key: string]: CareerStat[] }, stat) => {
    if (!acc[stat.season]) acc[stat.season] = [];
    acc[stat.season].push(stat);
    return acc;
  }, {});

  const shortenLeagueName = (name: string) => {
    if (!name) return 'N/A';
    const common: { [key: string]: string } = {
      'Premier League': 'PL',
      'Nigeria Premier Football League': 'NPFL',
      'Champions League': 'UCL',
      'Europa League': 'UEL',
      'Ligue 1': 'L1',
      'Serie A': 'SA',
      'La Liga': 'LL',
      'Bundesliga': 'BL',
    };
    if (common[name]) return common[name];
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  };

  const sortedSeasons = Object.keys(groupedStats).sort((a, b) => b.localeCompare(a));

  const handleSaveStat = async (data: any) => {
    setIsSaving(true);
    const res = editingStat 
      ? await updatePlayerStat(editingStat.id, data)
      : await addPlayerStat({ ...data, player_id: player.id });

    if (res.success) {
      toast.showToast(editingStat ? 'Stat updated' : 'Stat added', 'success');
      setShowStatModal(false);
      setEditingStat(null);
      setSelectedSeasonForAdd(null);
      // Re-fetch stats
      const updated = await getPlayerStats(player.id);
      if (updated.success) setPlayerStats(updated.data || []);
    } else {
      toast.showToast(res.error || 'Operation failed', 'error');
    }
    setIsSaving(false);
  };

  const handleDeleteStat = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    const res = await deletePlayerStat(id);
    if (res.success) {
      toast.showToast('Stat deleted', 'success');
      setPlayerStats(prev => prev.filter(s => s.id !== id));
    } else {
      toast.showToast(res.error || 'Failed to delete', 'error');
    }
  };

  const handleSaveTransfer = async (data: any) => {
    setIsSaving(true);
    const res = editingTransfer 
      ? await updatePlayerTransfer(editingTransfer.id, data)
      : await addPlayerTransfer({ ...data, player_id: player.id });

    if (res.success) {
      toast.showToast(editingTransfer ? 'Transfer updated' : 'Transfer added', 'success');
      setShowTransferModal(false);
      setEditingTransfer(null);
      // Re-fetch transfers
      const updated = await getPlayerTransfers(player.id);
      if (updated.success) setPlayerTransfers(updated.data || []);
    } else {
      toast.showToast(res.error || 'Operation failed', 'error');
    }
    setIsSaving(false);
  };

  const handleDeleteTransfer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transfer record?')) return;
    const res = await deletePlayerTransfer(id);
    if (res.success) {
      toast.showToast('Transfer deleted', 'success');
      setPlayerTransfers(prev => prev.filter(t => t.id !== id));
    } else {
      toast.showToast(res.error || 'Failed to delete', 'error');
    }
  };

  const handleEditAction = async (editId: string, action: 'approve' | 'reject') => {
    const res = await processProfileEdit(editId, action);
    if (res.success) {
      toast.showToast(`Change ${action}d successfully`, 'success');
      const updatedEdits = await getPendingEdits(player.id);
      if (updatedEdits.success) setPendingEdits(updatedEdits.data || []);
      router.refresh();
    } else {
      toast.showToast(res.error || 'Failed to process edit', 'error');
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const res = await updatePlayer(player.id, editedFields);
    if (res.success) {
      toast.showToast('Profile updated successfully', 'success');
      setEditingSection(null);
      setEditedFields({});
      router.refresh();
    } else {
      toast.showToast(res.error || 'Failed to update profile', 'error');
    }
    setIsSaving(false);
  };

  const updateField = (field: keyof Player, value: any) => {
    setEditedFields(prev => ({ ...prev, [field]: value }));
  };

  const displayValue = (field: keyof Player, defaultValue: any) => {
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
    <div className="flex flex-col min-h-screen bg-[#f8fafc] animate-in fade-in duration-500">
      {/* Dashboard Top Bar - Sticky below Admin Nav */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-[-32px] z-[100] shadow-sm mx-[-32px] mt-[-32px] mb-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/admin/players"
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Players
            </Link>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white overflow-hidden shadow-lg">
                {player.avatar_url ? (
                  <img src={player.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none flex items-center gap-3">
                  {player.first_name} {player.last_name}
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest ${
                    player.is_subscribed ? 'bg-emerald-100 text-emerald-600' : 
                    player.users?.subscriptions?.[0]?.status === 'expired' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {player.is_subscribed ? 'PRO' : 
                     player.users?.subscriptions?.[0]?.status === 'expired' ? 'EXPIRED' : 'NEW'}
                  </span>
                </h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  <FlagIcon countryCode={player.country || ''} className="w-3.5 h-2.5" />
                  ID: {player.email || 'NO EMAIL'} • {player.position}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href={`/athletes/${player.id}`} 
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
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] z-10"></div>
            {player.avatar_url ? (
              <img src={player.avatar_url} alt="" className="w-full aspect-square rounded-[2rem] object-cover border-2 border-slate-50 shadow-inner" />
            ) : (
              <div className="w-full aspect-square bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 text-4xl font-black">
                {player.first_name[0]}{player.last_name[0]}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: 'profile', label: 'Overview & Details', icon: LayoutDashboard },
              { id: 'stats', label: 'Career & Stats', icon: Activity },
              { id: 'bio', label: 'Biography & Awards', icon: FileText },
              { id: 'gallery', label: 'Media Gallery', icon: ImageIcon },
              { id: 'news', label: 'Latest News', icon: Newspaper },
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
              {player.agent_id ? (
                <Link href={`/admin/agents/${player.agent_id}`} className="text-[10px] font-black text-slate-900 uppercase hover:text-[#b50a0a] transition-colors">
                  {agents.find(a => a.id === player.agent_id)?.first_name ? `${agents.find(a => a.id === player.agent_id)?.first_name} ${agents.find(a => a.id === player.agent_id)?.last_name}` : 'Linked Agent'}
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
                        { label: 'First Name', value: player.first_name, field: 'first_name', type: 'text' },
                        { label: 'Last Name', value: player.last_name, field: 'last_name', type: 'text' },
                        { label: 'Date Of Birth', value: player.date_of_birth, field: 'date_of_birth', type: 'date' },
                        { label: 'Place Of Birth', value: player.place_of_birth || 'N/A', field: 'place_of_birth', type: 'text' },
                        { label: 'Citizenship', value: player.country, field: 'country', type: 'select', options: COUNTRIES },
                        { label: 'Gender', value: player.gender, field: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                          {editingSection === 'identity' ? (
                            item.type === 'select' ? (
                              <select 
                                value={displayValue(item.field as any, item.value)}
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
                              {item.field === 'date_of_birth' ? <DateDisplay date={item.value as string} /> : item.value}
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
                      {[
                        { label: 'Current Club', value: player.current_club || 'Unattached', field: 'current_club', type: 'text' },
                        { label: 'Primary Role', value: player.position, field: 'position', type: 'select', options: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'] },
                        { label: 'Preferred Foot', value: player.foot || 'Right', field: 'foot', type: 'select', options: ['Right', 'Left', 'Both'] },
                        { label: 'Jersey Number', value: player.jersey_number || '--', field: 'jersey_number', type: 'number' },
                        { label: 'Market Value', value: player.market_value || 'N/A', field: 'market_value', type: 'text' },
                        { label: 'Contract Expiry', value: player.contract_expiry, field: 'contract_expiry', type: 'date' },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                          {editingSection === 'pro' ? (
                            item.type === 'select' ? (
                              <select 
                                value={displayValue(item.field as any, item.value)}
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
                              {item.field === 'contract_expiry' ? (item.value ? <DateDisplay date={item.value as string} /> : 'N/A') : item.value}
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

                {/* Agent Card */}
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                          <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Agent Relationship</h3>
                      </div>
                      <button 
                         onClick={() => setEditingSection(editingSection === 'agent' ? null : 'agent')}
                         className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl font-black text-slate-300">
                          {agents.find(a => a.id === player.agent_id)?.first_name?.[0] || '?'}
                       </div>
                       <div className="flex-1">
                          {editingSection === 'agent' ? (
                            <select 
                              value={displayValue('agent_id', player.agent_id || '')}
                              onChange={(e) => updateField('agent_id', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[12px] font-bold text-slate-900 focus:ring-1 focus:ring-[#b50a0a]"
                            >
                               <option value="">Independent</option>
                               {agents.map(a => (
                                  <option key={a.id} value={a.id}>{a.first_name} {a.last_name}</option>
                               ))}
                            </select>
                          ) : (
                            <>
                              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                {agents.find(a => a.id === player.agent_id)?.first_name ? `${agents.find(a => a.id === player.agent_id)?.first_name} ${agents.find(a => a.id === player.agent_id)?.last_name}` : 'Independent'}
                              </h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: {player.agent_status || 'N/A'}</p>
                            </>
                          )}
                       </div>
                    </div>

                    {editingSection === 'agent' && (
                      <div className="mt-8 flex gap-3 animate-in fade-in slide-in-from-top-2">
                        <button onClick={handleSaveChanges} className="px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a] transition-all">Save Changes</button>
                        <button onClick={() => { setEditingSection(null); setEditedFields({}); }} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Management Card */}
                <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -z-0 transition-all group-hover:bg-slate-100"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                        <Lock className="w-5 h-5 text-[#b50a0a]" /> Password Management
                      </h3>
                      <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            {player.email ? 'Account Active' : 'No Account'}
                         </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registered Email</p>
                          <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                             {player.email || 'No email linked'}
                             {player.user_id && <ExternalLink className="w-3.5 h-3.5 text-[#b50a0a]" />}
                          </p>
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-500 leading-relaxed max-w-md">
                            Administrators cannot view or change passwords directly. 
                            Use the buttons below to trigger an automated secure process via email.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 justify-center">
                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a] transition-all shadow-lg shadow-slate-200">
                          Send Password Reset Link
                        </button>
                        {!player.is_subscribed && (
                          <button className="w-full py-4 bg-slate-50 text-slate-500 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                            Resend Account Invitation
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Stats */}
          {activeTab === 'stats' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 pb-20">
              {sortedSeasons.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-20 border border-slate-100 shadow-sm text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Activity className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Career Data Yet</h3>
                  <p className="text-sm font-bold text-slate-400 mt-2 max-w-sm mx-auto">Start building this player's professional history by adding their first season data.</p>
                  <button 
                    onClick={() => { setEditingStat(null); setSelectedSeasonForAdd(null); setShowStatModal(true); }}
                    className="mt-8 px-8 py-4 bg-[#b50a0a] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-red-900/20"
                  >
                    + Create First Record
                  </button>
                </div>
              ) : (
                sortedSeasons.map((season) => (
                  <section key={season} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm overflow-hidden group/season">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl italic font-black text-xs tracking-tighter">
                          {season}
                        </div>
                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Season Overview</h3>
                      </div>
                      <button 
                         onClick={() => { setSelectedSeasonForAdd(season); setEditingStat(null); setShowStatModal(true); }}
                         className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-[#b50a0a] hover:text-white transition-all shadow-sm"
                      >
                         <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400">Club / Team</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">League</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">Apps</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">Mins</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">Goals</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">Ast</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">Cards</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-[11px] font-bold text-slate-700 divide-y divide-slate-100">
                          {groupedStats[season].map((stat) => (
                            <tr key={stat.id} className="hover:bg-slate-50/50 transition-colors group/row">
                              <td className="px-4 py-4 align-middle">
                                <div className="flex items-center gap-2">
                                  {stat.club_flag ? (
                                    <img src={stat.club_flag} alt="" className="w-6 h-6 rounded-md object-contain bg-white p-1 shadow-sm" />
                                  ) : (
                                    <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center text-[8px] text-slate-400 uppercase font-bold">{stat.club_name[0]}</div>
                                  )}
                                  <span className="font-bold text-slate-900 text-[10px] whitespace-nowrap">{toTitleCase(stat.club_name)}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center align-middle">
                                <div className="flex items-center justify-center gap-2">
                                  {stat.league_flag && (
                                    <img 
                                      src={`https://flagcdn.com/w20/${stat.league_flag.toLowerCase()}.png`} 
                                      alt="" 
                                      className="w-3.5 h-2.5 object-cover rounded-[1px] opacity-70"
                                    />
                                  )}
                                  <span 
                                    title={stat.league_name}
                                    className="px-2 py-0.5 bg-slate-100 rounded-full text-[9px] font-bold uppercase tracking-tight text-slate-500 cursor-help"
                                  >
                                    {shortenLeagueName(stat.league_name)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center align-middle font-bold text-slate-700">{stat.appearances}</td>
                              <td className="px-4 py-4 text-center align-middle text-slate-400 font-bold">{stat.minutes_played}'</td>
                              <td className="px-4 py-4 text-center align-middle text-[#ef4444] font-bold">{stat.goals.toString().padStart(2, '0')}</td>
                              <td className="px-4 py-4 text-center align-middle font-bold text-slate-700">{stat.assists.toString().padStart(2, '0')}</td>
                              <td className="px-4 py-4 text-center align-middle">
                                <div className="flex items-center justify-center gap-1.5">
                                  <div className="flex items-center gap-1 bg-yellow-400/10 px-1.5 py-0.5 rounded text-[9px] font-bold text-yellow-600">
                                    <div className="w-1.5 h-2 bg-yellow-400 rounded-[1px]"></div>
                                    {stat.yellow_cards}
                                  </div>
                                  <div className="flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 rounded text-[9px] font-bold text-red-600">
                                    <div className="w-1.5 h-2 bg-red-500 rounded-[1px]"></div>
                                    {stat.red_cards}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-right align-middle">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingStat(stat); setShowStatModal(true); }} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleDeleteStat(stat.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ))
              )}

              {/* Transfer History Section */}
              <section className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#b50a0a]/10 rounded-full blur-[120px] -mr-20 -mt-20"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-base font-black text-white uppercase tracking-tight">Transfer & Movement Logs</h3>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Verified Career Transitions</p>
                    </div>
                    <button 
                      onClick={() => { setEditingTransfer(null); setShowTransferModal(true); }}
                      className="w-10 h-10 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-md"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {playerTransfers.length === 0 ? (
                    <div className="py-16 text-center bg-white/5 rounded-[1.5rem] border border-white/5 backdrop-blur-sm">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">Awaiting movement records...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-[1.5rem] border border-white/5 bg-white/5 backdrop-blur-md">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-500">Season / Date</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-500">From Club</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-500">To Club</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-500">League</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-500 text-center">Fee</th>
                            <th className="px-4 py-4 text-[8px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-[11px] font-bold text-slate-300 divide-y divide-white/5">
                          {playerTransfers.map((transfer) => (
                            <tr key={transfer.id} className="hover:bg-white/5 transition-colors group/row border-b border-white/5 last:border-0 font-medium">
                              <td className="px-4 py-5 align-middle">
                                <div className="text-white font-bold italic tracking-tighter text-[11px]">{transfer.season}</div>
                                <div className="text-[8px] text-slate-500 font-bold mt-0.5">{transfer.transfer_date ? new Date(transfer.transfer_date).toLocaleDateString() : 'N/A'}</div>
                              </td>
                              <td className="px-4 py-5 align-middle text-slate-400 font-bold tracking-tight text-[10px]">{toTitleCase(transfer.from_club_name)}</td>
                              <td className="px-4 py-5 align-middle">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                  <span className="text-white font-bold tracking-tight text-[10px]">{toTitleCase(transfer.to_club_name)}</span>
                                </div>
                              </td>
                              <td className="px-4 py-5 align-middle">
                                <div className="flex items-center gap-2">
                                  {transfer.league_flag && (
                                    <img 
                                      src={`https://flagcdn.com/w20/${transfer.league_flag.toLowerCase()}.png`} 
                                      alt="" 
                                      className="w-3.5 h-2.5 object-cover rounded-[1px] opacity-80"
                                    />
                                  )}
                                  <span 
                                    title={transfer.league_name}
                                    className="px-2 py-0.5 bg-white/10 rounded-full text-[9px] font-bold uppercase text-slate-300 cursor-help"
                                  >
                                    {shortenLeagueName(transfer.league_name)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-5 text-center align-middle">
                                <span className="text-[#ef4444] font-bold tracking-widest text-[10px] uppercase">{transfer.transfer_fee || 'FREE'}</span>
                              </td>
                              <td className="px-4 py-5 text-right align-middle">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingTransfer(transfer); setShowTransferModal(true); }} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleDeleteTransfer(transfer.id)} className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-white/10 rounded-lg transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>

              {/* Stat Form Modal Rendering */}
              <StatFormModal 
                isOpen={showStatModal} 
                onClose={() => { setShowStatModal(false); setEditingStat(null); setSelectedSeasonForAdd(null); }}
                onSave={handleSaveStat}
                initialData={editingStat}
                defaultSeason={selectedSeasonForAdd}
              />

              {/* Transfer Form Modal Rendering */}
              <TransferFormModal 
                isOpen={showTransferModal} 
                onClose={() => { setShowTransferModal(false); setEditingTransfer(null); }}
                onSave={handleSaveTransfer}
                initialData={editingTransfer}
              />
            </div>
          )}

          {/* Tab 3: Bio & Honours */}
          {activeTab === 'bio' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Biography</h3>
                    </div>
                    <button 
                      onClick={() => setEditingSection(editingSection === 'bio' ? null : 'bio')}
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {editingSection === 'bio' ? (
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold text-slate-600 leading-relaxed shadow-inner h-[300px] focus:ring-1 focus:ring-[#b50a0a] outline-none"
                      value={displayValue('bio', player.bio || '')}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="Professional biography..."
                    />
                  ) : (
                    <div className="p-8 bg-slate-50/50 rounded-2xl border border-slate-100 italic">
                      <p className="text-sm font-bold text-slate-500 leading-relaxed">
                        {player.bio || "No professional biography has been provided for this athlete yet."}
                      </p>
                    </div>
                  )}
                  <PendingEditBadge field="bio" />
                  
                  {editingSection === 'bio' && (
                    <div className="mt-8 flex gap-3">
                      <button onClick={handleSaveChanges} className="px-8 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a] transition-all">Save Biography</button>
                      <button onClick={() => { setEditingSection(null); setEditedFields({}); }} className="px-8 py-2.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm flex flex-col">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8">Career Honours</h3>
                  <div className="flex-1 space-y-4">
                    {player.achievements && Array.isArray(player.achievements) && player.achievements.length > 0 ? (
                      player.achievements.map((h, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group transition-all hover:bg-slate-900 hover:text-white">
                           <div className="w-10 h-10 bg-white group-hover:bg-[#b50a0a] rounded-lg flex items-center justify-center transition-colors shadow-sm">
                              <Trophy className="w-5 h-5 text-[#b50a0a] group-hover:text-white" />
                           </div>
                           <span className="text-[11px] font-black uppercase tracking-widest">{h.title || h}</span>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 opacity-60">
                         <Trophy className="w-10 h-10 text-slate-200 mb-3" />
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No active awards</p>
                      </div>
                    )}
                  </div>
                  <button className="w-full mt-8 bg-slate-50 border border-slate-100 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                     <Plus className="w-3.5 h-3.5" /> Add Achievement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Gallery */}
          {activeTab === 'gallery' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Media Gallery</h3>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a] transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
                  <Plus className="w-3.5 h-3.5" /> Upload Media
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800",
                  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800",
                  "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800",
                  "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800",
                ].map((img, i) => (
                  <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                    <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: News */}
          {activeTab === 'news' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                  <Newspaper className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Press & Updates</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { title: `${player.first_name}'s clinical finish secures victory`, date: "2 days ago", category: "Match Report", img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800" },
                  { title: "Transfer rumors: European giants watching", date: "1 week ago", category: "Transfer News", img: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=800" },
                ].map((news, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col md:flex-row h-48 hover:border-[#b50a0a]/30 transition-all group">
                    <div className="md:w-64 relative overflow-hidden">
                      <img src={news.img} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase text-[#b50a0a] tracking-widest mb-2 block">{news.category}</span>
                        <h4 className="text-lg font-black uppercase leading-tight text-slate-900">{news.title}</h4>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{news.date}</span>
                        <button className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-400 hover:text-[#b50a0a] transition-all">Moderate Story <ExternalLink className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Billing */}
          {activeTab === 'billing' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#b50a0a]/10 rounded-full blur-[100px] group-hover:bg-[#b50a0a]/20 transition-all duration-1000"></div>
                  <div className="relative z-10 flex items-center justify-between mb-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Subscription Status</h3>
                    <span className={`${player.is_subscribed ? 'bg-emerald-500' : 'bg-blue-600'} px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg`}>
                      {player.is_subscribed ? 'Active Pro' : 'Free Prospect'}
                    </span>
                  </div>
                  <div className="relative z-10 space-y-10">
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cycle End Date</p>
                      <p className="text-4xl font-black italic tracking-tighter">
                        {player.users?.subscriptions?.[0]?.current_period_end ? (
                          <DateDisplay date={player.users.subscriptions[0].current_period_end} />
                        ) : 'NOT CONFIGURED'}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button className="flex-1 bg-white/5 border border-white/10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Invoices</button>
                      <button className="flex-1 bg-[#b50a0a] py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#b50a0a]/80 transition-all shadow-lg shadow-red-900/20">Upgrade Plan</button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[#b50a0a]" /> Ledger
                    </h3>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {playerTransactions.length > 0 ? (
                      playerTransactions.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#b50a0a]/10 transition-all group">
                          <div className="flex items-center gap-5">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black ${
                              tx.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {tx.currency === 'USD' ? '$' : tx.currency}
                            </div>
                            <div>
                              <p className="text-[11px] font-black text-slate-900 uppercase leading-none mb-1">{tx.reference.split('_')[0]}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest"><DateDisplay date={tx.created_at} /></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-slate-900">{(tx.amount / 100).toFixed(2)}</p>
                            <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                              tx.status === 'confirmed' ? 'text-emerald-500' : 'text-red-500'
                            }`}>{tx.status}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center text-slate-300">
                        <Clock className="w-10 h-10 mx-auto mb-4 opacity-20" />
                        <p className="text-[9px] font-black uppercase tracking-widest">No activity found</p>
                      </div>
                    )}
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
