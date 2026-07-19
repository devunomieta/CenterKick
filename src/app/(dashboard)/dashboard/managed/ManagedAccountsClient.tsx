'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Users, Search, Plus, CreditCard, Trash2, Edit, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { linkManagedAccount, unlinkManagedAccount } from './actions';

export default function ManagedAccountsClient({ userProfile }: { userProfile: any }) {
  const [managedUsers, setManagedUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  
  // Table states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'created_at', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { showToast } = useToast();
  const supabase = createClient();
  const isAdminOrOps = ['superadmin', 'admin', 'operations'].includes(userProfile.role);

  const processedUsers = useMemo(() => {
    let result = [...managedUsers];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.first_name?.toLowerCase().includes(lowerSearch) ||
        user.last_name?.toLowerCase().includes(lowerSearch) ||
        user.email?.toLowerCase().includes(lowerSearch) ||
        user.role?.toLowerCase().includes(lowerSearch) ||
        user.position?.toLowerCase().includes(lowerSearch)
      );
    }

    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (!aVal) aVal = '';
      if (!bVal) bVal = '';

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [managedUsers, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedUsers.length / itemsPerPage) || 1;
  const paginatedUsers = processedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


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

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or role..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#b50a0a] outline-none transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 flex items-center justify-center min-h-[400px]">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b50a0a]"></div>
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
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 w-12">
                       <input 
                         type="checkbox" 
                         className="w-4 h-4 rounded text-[#b50a0a] focus:ring-[#b50a0a]" 
                         checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                         onChange={(e) => {
                            if (e.target.checked) setSelectedUsers(paginatedUsers.map(u => u.id));
                            else setSelectedUsers([]);
                         }}
                       />
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('first_name')}>
                      <div className="flex items-center gap-2">Profile {sortConfig.key === 'first_name' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('role')}>
                      <div className="flex items-center gap-2">Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('position')}>
                      <div className="flex items-center gap-2">Position {sortConfig.key === 'position' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('market_value')}>
                      <div className="flex items-center gap-2">Market Value {sortConfig.key === 'market_value' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}</div>
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.map(member => (
                    <tr key={member.id} className={`transition-colors hover:bg-gray-50/50 ${selectedUsers.includes(member.id) ? 'bg-red-50/30' : ''}`}>
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded text-[#b50a0a] focus:ring-[#b50a0a]"
                          checked={selectedUsers.includes(member.id)}
                          onChange={() => toggleUserSelection(member.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                            <img src={member.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + member.id} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{member.first_name} {member.last_name}</p>
                            <p className="text-xs font-medium text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 capitalize">
                          {member.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-bold text-gray-900">{member.position || '-'}</td>
                      <td className="p-4 text-sm font-bold text-gray-900">{member.market_value ? `$${Number(member.market_value).toLocaleString()}` : '-'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs font-bold text-green-700">Active</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => router.push(`/dashboard/managed/${member.id}/edit`)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Edit Account Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Unlink Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-sm font-bold text-gray-500">
                        No accounts match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
                <span className="text-xs font-bold text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedUsers.length)} of {processedUsers.length} entries
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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
