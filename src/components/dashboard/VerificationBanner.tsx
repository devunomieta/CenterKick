'use client';

import { useState } from 'react';
import { ShieldAlert, CheckCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { requestVerification } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export function VerificationBanner({ 
  isRequested,
  roleName
}: { 
  isRequested: boolean;
  roleName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(isRequested);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestVerification();
      if (res.success) {
        setRequested(true);
        router.refresh();
      } else {
        setError(res.error || 'Failed to request verification');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${
      requested 
        ? 'bg-green-50/50 border-green-100 shadow-xl shadow-green-900/5' 
        : 'bg-gray-900 border-gray-800 shadow-2xl shadow-gray-900/20'
    }`}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#b50a0a] blur-[100px] opacity-10 -z-10 transition-opacity duration-500"></div>
      
      <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex items-start gap-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all duration-500 ${
            requested ? 'bg-green-100 text-green-600 rotate-0' : 'bg-[#b50a0a] text-white rotate-3'
          }`}>
            {requested ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8 -rotate-3" />}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <h2 className={`text-xl font-black uppercase tracking-tighter italic transition-colors duration-500 ${
                 requested ? 'text-green-900' : 'text-white'
               }`}>
                 {requested ? 'Verification Pending Review' : 'Account Verification Required'}
               </h2>
               <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                 requested ? 'bg-green-100/50 text-green-700' : 'bg-white/10 text-gray-400'
               }`}>
                 Role: {roleName}
               </span>
            </div>
            
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] max-w-lg leading-relaxed transition-colors duration-500 ${
              requested ? 'text-green-700/80' : 'text-gray-400'
            }`}>
              {requested 
                ? "Your request has been submitted to the administrative team. You will be notified once your specialized access is approved."
                : "You currently have limited 'Unassigned' access. To unlock your full administrative tools and responsibilities, please complete your profile and request verification."}
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          {requested ? (
            <div className="flex items-center gap-2 px-6 py-4 bg-white/50 rounded-2xl border border-green-100/50 text-green-700 text-[10px] font-black uppercase tracking-widest italic">
              <CheckCircle className="w-4 h-4" />
              Request Active
            </div>
          ) : (
            <button
              onClick={handleRequest}
              disabled={loading}
              className="w-full md:w-auto px-8 py-4 bg-[#b50a0a] hover:bg-white hover:text-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Request Verification <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}
          {error && (
            <p className="mt-3 text-[8px] font-black text-red-500 uppercase tracking-widest text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
