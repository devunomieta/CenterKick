'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { updateProfileStatus } from './actions';

interface ModerationActionsProps {
  profile: any;
}

export function ModerationActions({ profile }: ModerationActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (status: 'active' | 'rejected' | 'pending' | 'suspended') => {
    if (!confirm(`Are you sure you want to set this profile to ${status}?`)) return;
    
    setLoading(true);
    try {
      const result = await updateProfileStatus(profile.id, status);
      if (!result.success) {
        alert('Error: ' + result.error);
      }
    } catch (err: any) {
      alert('Unexpected error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {profile.status !== 'active' && (
        <button 
          onClick={() => handleStatusUpdate('active')}
          disabled={loading}
          className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all disabled:opacity-50"
          title="Approve Profile"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        </button>
      )}
      
      {profile.status !== 'rejected' && (
        <button 
          onClick={() => handleStatusUpdate('rejected')}
          disabled={loading}
          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
          title="Reject Profile"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
        </button>
      )}

      {profile.status !== 'suspended' && (
        <button 
          onClick={() => handleStatusUpdate('suspended')}
          disabled={loading}
          className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-all disabled:opacity-50"
          title="Suspend Profile"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
