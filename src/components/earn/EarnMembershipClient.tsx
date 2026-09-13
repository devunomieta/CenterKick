'use client';

import React, { useState } from 'react';
import { submitEarnTaskProof } from '@/app/earn-membership/actions';
import {
  Sparkles,
  Gift,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  ArrowRight,
  ShieldCheck,
  Lock,
  X,
  FileText,
  Copy,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

export default function EarnMembershipClient({
  tasks,
  userProfile,
  userSubmissions,
  isLoggedIn
}: {
  tasks: any[];
  userProfile: any;
  userSubmissions: any[];
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'TASKS' | 'SUBMISSIONS'>('TASKS');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Form submission state
  const [proofUrl, setProofUrl] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleOpenSubmitModal = (task: any) => {
    if (!isLoggedIn) {
      setSelectedTask(task);
      setShowAuthModal(true);
      return;
    }

    // Check if user already completed or pending
    const existing = userSubmissions.find((s) => s.task_id === task.id);
    if (existing && existing.status === 'PENDING') {
      showToast('You already have a pending submission for this task. Please wait for admin review.', 'info');
      return;
    }
    if (existing && existing.status === 'APPROVED') {
      showToast('You have already completed and earned your voucher for this task!', 'success');
      return;
    }

    setSelectedTask(task);
    setProofUrl('');
    setUserNotes('');
    setProofFile(null);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    if (selectedTask.require_proof_url && !proofUrl) {
      showToast('Proof URL is required for this task.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('task_id', selectedTask.id);
      if (proofUrl) formData.append('proof_url', proofUrl);
      if (userNotes) formData.append('user_notes', userNotes);
      if (proofFile) formData.append('proof_file', proofFile);

      const res = await submitEarnTaskProof(formData);

      if (res.error) {
        showToast(res.error, 'error');
      } else {
        showToast('Proof submitted successfully! Admin will verify your task and email your voucher code.', 'success');
        setSelectedTask(null);
        setActiveTab('SUBMISSIONS');
        router.refresh();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit proof.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('Activation code copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Header Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#b50a0a] text-xs font-bold uppercase tracking-wide">
          <Sparkles className="w-3.5 h-3.5" /> CenterKick Earn & Sponsor Portal
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight">
          Earn Free Subscription Activation Codes
        </h1>

        <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto">
          Complete promotional tasks, share CenterKick with your network, and receive 100% free activation vouchers directly in your email.
        </p>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('TASKS')}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'TASKS'
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Available Tasks ({tasks.length})
          </button>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                setShowAuthModal(true);
              } else {
                setActiveTab('SUBMISSIONS');
              }
            }}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'SUBMISSIONS'
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Gift className="w-4 h-4 text-emerald-400" /> My Submissions & Rewards
            {userSubmissions.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#b50a0a] text-white text-[10px] font-extrabold">
                {userSubmissions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* AVAILABLE TASKS TAB */}
      {activeTab === 'TASKS' && (
        <div className="max-w-7xl mx-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No Active Tasks Available</h3>
              <p className="text-xs text-gray-500 mt-1">Check back soon! New earning campaigns are launched regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tasks.map((task) => {
                const userSub = userSubmissions.find((s) => s.task_id === task.id);
                const isCompleted = userSub?.status === 'APPROVED';
                const isPending = userSub?.status === 'PENDING';

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-[#b50a0a] border border-red-100 text-xs font-bold uppercase tracking-wider">
                          100% FREE {task.reward_duration_months}-MONTH VOUCHER
                        </span>
                        {isCompleted && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold flex items-center gap-1 border border-amber-200">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-[#b50a0a] transition-colors">
                        {task.title}
                      </h3>

                      <p className="text-xs text-gray-600 font-normal leading-relaxed">{task.description}</p>

                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-xs">
                        <p className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Instructions:</p>
                        <p className="text-gray-700 leading-normal whitespace-pre-line">{task.instructions}</p>
                      </div>

                      {task.platform_link && (
                        <a
                          href={task.platform_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b50a0a] hover:underline"
                        >
                          Visit Platform Link <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100">
                      {isCompleted ? (
                        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                          <p className="text-xs font-bold text-emerald-800">Reward Claimed!</p>
                        </div>
                      ) : isPending ? (
                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                          <p className="text-xs font-bold text-amber-900">Proof Submitted - Under Admin Review</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenSubmitModal(task)}
                          className="w-full py-3.5 bg-gray-900 hover:bg-[#b50a0a] text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg"
                        >
                          Submit Task Proof <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MY SUBMISSIONS & REWARDS TAB */}
      {activeTab === 'SUBMISSIONS' && isLoggedIn && (
        <div className="max-w-7xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Submitted Task Proofs & Activation Codes</h2>

          {userSubmissions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No Submissions Yet</h3>
              <p className="text-xs text-gray-500 mt-1">Select an available task and submit proof to earn your free activation code.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userSubmissions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{sub.earning_tasks?.title || 'Promotional Task'}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          sub.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : sub.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Submitted on {new Date(sub.created_at).toLocaleDateString()} • Reward: <span className="font-bold text-gray-900">{sub.earning_tasks?.reward_duration_months} Months Membership</span>
                    </p>

                    {sub.admin_notes && (
                      <p className={`text-xs font-medium p-3 rounded-xl border ${sub.status === 'REJECTED' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                        <span className="font-bold">Admin Feedback:</span> {sub.admin_notes}
                      </p>
                    )}
                  </div>

                  {/* Issued Activation Code */}
                  {sub.status === 'APPROVED' && sub.issued_coupon?.code && (
                    <div className="bg-gray-900 text-white p-4 rounded-2xl border border-gray-800 flex flex-col items-center gap-2 shrink-0">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Your Free Activation Code</span>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-mono font-bold tracking-widest text-white">{sub.issued_coupon.code}</span>
                        <button
                          onClick={() => copyToClipboard(sub.issued_coupon.code)}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                          title="Copy Code"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <Link
                        href="/dashboard/subscription"
                        className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 mt-1"
                      >
                        Redeem Now <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROOF SUBMISSION FORM MODAL */}
      {selectedTask && isLoggedIn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl p-6 sm:p-8 relative animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-6 right-6 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#b50a0a]" /> Submit Task Proof
            </h3>
            <p className="text-xs font-medium text-gray-500 mb-6">Task: <span className="font-bold text-gray-900">{selectedTask.title}</span></p>

            <form onSubmit={handleSubmitProof} className="space-y-4 text-xs font-semibold overflow-y-auto pr-1 flex-1">
              {selectedTask.require_proof_url && (
                <div>
                  <label className="block text-gray-700 mb-1">
                    Proof Link / URL <span className="text-[#b50a0a]">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://linkedin.com/posts/..."
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b50a0a] font-medium"
                  />
                </div>
              )}

              {selectedTask.require_proof_file && (
                <div>
                  <label className="block text-gray-700 mb-1">Upload Proof Screenshot (PNG/JPG)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-1">Additional Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Posted from my official Instagram account @athlete_name"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gray-900 hover:bg-[#b50a0a] text-white font-bold rounded-2xl shadow-xl transition-all disabled:opacity-50 text-xs tracking-wider"
              >
                {isSubmitting ? 'Submitting Proof...' : 'Submit Proof for Verification'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GUEST AUTH MODAL PROMPT */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 sm:p-8 relative text-center animate-in zoom-in duration-300 space-y-6">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#b50a0a] border border-red-100 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Account Required</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                Please log in or create your free account to submit task proofs and receive your activation code.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href={`/login?next=/earn-membership${selectedTask ? `?task=${selectedTask.id}` : ''}`}
                className="w-full py-3.5 bg-[#b50a0a] hover:bg-red-800 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-xs"
              >
                Log In to Submit & Earn <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`/register?next=/earn-membership${selectedTask ? `?task=${selectedTask.id}` : ''}`}
                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-xs"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
