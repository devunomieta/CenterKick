'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Search, Plus, CreditCard, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { linkManagedAccount, unlinkManagedAccount } from './actions';

export default function ManagedAccountsClient({ userProfile }: { userProfile: any }) {
  const [managedUsers, setManagedUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient();

  const fetchManagedUsers = async () => {
    setIsLoading(true);
    const idField = userProfile.role === 'organization' ? 'organization_id' : 'agent_id';
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq(idField, userProfile.user_id);

    if (!error && data) {
      setManagedUsers(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchManagedUsers();
  }, []);

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;
    setIsProcessing(true);

    const { data: targetProfile, error: searchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', newMemberEmail.trim())
      .single();

    if (searchError || !targetProfile) {
      showToast('Could not find a profile with that email.', 'error');
      setIsProcessing(false);
      return;
    }

    const result = await linkManagedAccount(targetProfile.id, userProfile.user_id, userProfile.role);

    if (result.error) {
      showToast(`Failed to link: ${result.error}`, 'error');
    } else {
      showToast('Member successfully linked to your portfolio!', 'success');
      setManagedUsers([...managedUsers, targetProfile]);
      setIsAddModalOpen(false);
      setNewMemberEmail('');
    }
    setIsProcessing(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to unlink this member from your portfolio?")) return;
    setIsProcessing(true);

    const result = await unlinkManagedAccount(memberId);

    if (result.error) {
      showToast(`Failed to unlink: ${result.error}`, 'error');
    } else {
      showToast('Member successfully unlinked.', 'success');
      setManagedUsers(managedUsers.filter(m => m.id !== memberId));
      setSelectedUsers(selectedUsers.filter(id => id !== memberId));
    }
    setIsProcessing(false);
  };

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleBatchPay = () => {
    if (selectedUsers.length === 0) {
      showToast('Please select at least one account to pay for.', 'error');
      return;
    }
    showToast(`Proceeding to payment for ${selectedUsers.length} accounts. Total: $${selectedUsers.length * 20}`, 'success');
    // Implement checkout integration logic here
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 text-[#b50a0a]" />
              Managed Accounts
            </h1>
            <p className="text-sm font-bold text-gray-500 mt-2">Manage the accounts, subscriptions, and profiles of your connected clients.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-2xl flex items-center gap-2 transition-all shadow-md hover:shadow-xl"
          >
            <Plus className="w-4 h-4" /> Link New Account
          </button>
        </div>

        {/* Action Bar (Appears when items are selected) */}
        {selectedUsers.length > 0 && (
          <div className="bg-[#b50a0a] text-white p-4 rounded-2xl flex items-center justify-between animate-in slide-in-from-bottom-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">{selectedUsers.length}</span>
              <span className="text-sm font-bold">Accounts Selected</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold hidden md:inline-block">Total Subscription: ${selectedUsers.length * 20}/mo</span>
              <button onClick={handleBatchPay} className="px-6 py-2.5 bg-white text-[#b50a0a] hover:bg-gray-100 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Pay Selected
              </button>
            </div>
          </div>
        )}

        {/* Users Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 h-40 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="space-y-3 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : managedUsers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No accounts linked</h3>
            <p className="text-sm font-medium text-gray-500 max-w-md mx-auto mb-8">You haven't linked any players, coaches, or scouts to your portfolio yet. Link them to manage their subscriptions and edit their profiles.</p>
            <button onClick={() => setIsAddModalOpen(true)} className="px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 text-sm font-bold rounded-2xl inline-flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Link Your First Account
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {managedUsers.map(member => (
              <div key={member.id} className={`bg-white rounded-3xl p-6 border transition-all hover:shadow-lg relative ${selectedUsers.includes(member.id) ? 'border-[#b50a0a] ring-1 ring-[#b50a0a]' : 'border-gray-100'}`}>
                
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <div 
                    onClick={() => toggleUserSelection(member.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${selectedUsers.includes(member.id) ? 'bg-[#b50a0a] border-[#b50a0a]' : 'border-gray-300 bg-white hover:border-[#b50a0a]'}`}
                  >
                    {selectedUsers.includes(member.id) && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                </div>

                {/* Unlink Action */}
                <button 
                  onClick={() => handleRemoveMember(member.id)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                  title="Unlink Account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 mb-4 ring-2 ring-red-100">
                    <img src={member.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + member.id} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">{member.first_name} {member.last_name}</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{member.role}</p>
                  
                  <div className="w-full h-px bg-gray-100 my-4"></div>
                  
                  <div className="flex justify-between w-full text-xs font-bold text-gray-500">
                    <div className="flex flex-col">
                      <span className="uppercase text-[10px] text-gray-400">Position</span>
                      <span className="text-gray-900">{member.position || '-'}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="uppercase text-[10px] text-gray-400">Status</span>
                      <span className="text-green-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-black text-gray-900 mb-2">Link New Account</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">Enter the exact email address of the player, coach, or scout to link them to your management portfolio.</p>
            <input 
              type="email" 
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#b50a0a] outline-none transition-all mb-6 text-black"
            />
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">Cancel</button>
              <button 
                type="button" 
                disabled={isProcessing || !newMemberEmail.trim()}
                onClick={handleAddMember} 
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#b50a0a] hover:bg-red-800 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Linking...' : 'Link Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
