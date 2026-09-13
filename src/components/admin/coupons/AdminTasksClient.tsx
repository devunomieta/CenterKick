'use client';

import React, { useState } from 'react';
import {
  createEarningTask,
  toggleEarningTaskStatus,
  approveTaskSubmission,
  rejectTaskSubmission
} from '@/app/admin/coupons/tasks/actions';
import {
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Link as LinkIcon,
  FileText,
  ExternalLink,
  Shield,
  Zap,
  Eye,
  X,
  Filter,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

export default function AdminTasksClient({
  tasks,
  submissions,
  systemPlans = {},
  globalDuration
}: {
  tasks: any[];
  submissions: any[];
  systemPlans?: Record<string, any>;
  globalDuration?: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'SUBMISSIONS' | 'TASKS'>('SUBMISSIONS');
  const [submissionFilter, setSubmissionFilter] = useState('PENDING');

  // Determine max allowed sub page plan duration in months based on configured payment settings
  const getMaxPlanDurationMonths = (roleFilter: string): number => {
    const parseFreqToMonths = (freq?: string, rawDuration?: number): number => {
      if (typeof rawDuration === 'number' && rawDuration > 0) return rawDuration;
      if (!freq) return 6; // CenterKick standard default (6 months / Biannually)
      if (freq === 'Monthly') return 1;
      if (freq === 'Quarterly') return 3;
      if (freq === 'Biannually' || freq === 'Biannual' || freq === 'Half-Year' || freq === 'Half-Yearly') return 6;
      if (freq === 'Yearly' || freq === 'Annually' || freq === 'Annual') return 12;
      return 6;
    };

    // 1. If a globalDuration setting is explicitly configured in subscription settings, use it as master cap
    if (globalDuration) {
      return parseFreqToMonths(globalDuration);
    }

    // 2. Otherwise check role-specific plan settings
    if (roleFilter !== 'ALL' && systemPlans?.[roleFilter.toLowerCase()]) {
      const planConfig = systemPlans[roleFilter.toLowerCase()];
      return parseFreqToMonths(planConfig?.frequency, planConfig?.durationMonths);
    }

    // 3. Fallback: check maximum duration across all active system plans
    if (systemPlans && Object.keys(systemPlans).length > 0) {
      let maxM = 1;
      Object.values(systemPlans).forEach((p: any) => {
        const m = parseFreqToMonths(p?.frequency, p?.durationMonths);
        if (m > maxM) maxM = m;
      });
      return maxM;
    }

    return 6; // Standard CenterKick universal default
  };

  // Create Task Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskInstructions, setTaskInstructions] = useState('');
  const [targetRole, setTargetRole] = useState('ALL');
  const maxDurationCap = getMaxPlanDurationMonths(targetRole);
  const [rewardMonths, setRewardMonths] = useState(1);
  const [platformLink, setPlatformLink] = useState('');
  const [requireProofUrl, setRequireProofUrl] = useState(true);
  const [requireProofFile, setRequireProofFile] = useState(true);
  const [maxRewardClaims, setMaxRewardClaims] = useState<string>('');

  // Action / Approval Modal State
  const [inspectSubmission, setInspectSubmission] = useState<any | null>(null);
  const [rejectModalSubmission, setRejectModalSubmission] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDescription || !taskInstructions) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    if (rewardMonths > maxDurationCap) {
      showToast(`Reward duration cannot exceed current subscription plan duration cap of ${maxDurationCap} month(s).`, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createEarningTask({
        title: taskTitle,
        description: taskDescription,
        instructions: taskInstructions,
        rewardDurationMonths: Math.min(rewardMonths, maxDurationCap),
        targetRole,
        platformLink: platformLink.trim() ? platformLink.trim() : undefined,
        requireProofUrl,
        requireProofFile,
        maxRewardClaims: maxRewardClaims ? Number(maxRewardClaims) : undefined,
      });

      if (res.success) {
        showToast('Earning task created and posted successfully.', 'success');
        setShowCreateModal(false);
        setTaskTitle('');
        setTaskDescription('');
        setTaskInstructions('');
        setPlatformLink('');
        setMaxRewardClaims('');
        router.refresh();
      } else {
        showToast(res.error || 'Failed to create task.', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    try {
      const res = await toggleEarningTaskStatus(taskId, currentStatus);
      if (res.success) {
        showToast(`Task status updated to ${res.nextStatus}`, 'success');
        router.refresh();
      } else {
        showToast(res.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Status update error', 'error');
    }
  };

  const handleApproveSubmission = async (submissionId: string) => {
    setActionLoadingId(submissionId);
    try {
      const res = await approveTaskSubmission(submissionId);
      if (res.success) {
        showToast(`Submission approved! Activation voucher sent to user.`, 'success');
        setInspectSubmission(null);
        router.refresh();
      } else {
        showToast(res.error || 'Approval failed.', 'error');
      }
    } catch (err) {
      showToast('Approval error occurred.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalSubmission) return;
    if (!rejectionReason.trim()) {
      showToast('Please provide a reason for rejection.', 'error');
      return;
    }

    setActionLoadingId(rejectModalSubmission.id);
    try {
      const res = await rejectTaskSubmission(rejectModalSubmission.id, rejectionReason);
      if (res.success) {
        showToast('Submission rejected.', 'info');
        setRejectModalSubmission(null);
        setRejectionReason('');
        setInspectSubmission(null);
        router.refresh();
      } else {
        showToast(res.error || 'Rejection failed.', 'error');
      }
    } catch (err) {
      showToast('Rejection error occurred.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter === 'ALL') return true;
    return s.status === submissionFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-8 rounded-3xl text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#b50a0a] text-white flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Earn Membership Task Verification</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Review user proof submissions, verify social posts, and launch promotional tasks.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/coupons"
            className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-700 shadow-md"
          >
            <Ticket className="w-4 h-4 text-emerald-400" /> Back to Coupons
          </Link>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3.5 rounded-2xl bg-[#b50a0a] hover:bg-black text-white text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Post Task
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('SUBMISSIONS')}
          className={`px-6 py-3 font-bold text-xs tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'SUBMISSIONS'
              ? 'border-[#b50a0a] text-[#b50a0a]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Shield className="w-4 h-4" /> Submissions Desk ({submissions.filter((s) => s.status === 'PENDING').length} Pending)
        </button>

        <button
          onClick={() => setActiveTab('TASKS')}
          className={`px-6 py-3 font-bold text-xs tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'TASKS'
              ? 'border-[#b50a0a] text-[#b50a0a]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" /> Active Tasks ({tasks.length})
        </button>
      </div>

      {/* SUBMISSIONS TAB CONTENT */}
      {activeTab === 'SUBMISSIONS' && (
        <div className="space-y-6">
          {/* Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((st) => (
              <button
                key={st}
                onClick={() => setSubmissionFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  submissionFilter === st
                    ? 'bg-[#b50a0a] text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center shadow-sm">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">No Submissions Found</h3>
              <p className="text-xs text-gray-500 mt-1">No user proof submissions match the current status filter "{submissionFilter}".</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-100 uppercase tracking-widest text-[10px] text-gray-400">
                    <tr>
                      <th className="px-6 py-4">User / Email</th>
                      <th className="px-6 py-4">Task Campaign</th>
                      <th className="px-6 py-4">Submitted Proof</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {sub.user_email}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800 max-w-xs truncate">
                          {sub.earning_tasks?.title || 'Task Campaign'}
                          <span className="block text-[10px] text-gray-400 font-normal">
                            Reward: {sub.earning_tasks?.reward_duration_months} Months Free
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {sub.proof_url && (
                              <a
                                href={sub.proof_url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold inline-flex items-center gap-1"
                              >
                                <LinkIcon className="w-3 h-3" /> Link
                              </a>
                            )}
                            {sub.proof_file_url && (
                              <a
                                href={sub.proof_file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[11px] font-bold inline-flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> Screenshot
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-[11px]">
                          {new Date(sub.created_at).toLocaleDateString()} {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              sub.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : sub.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {sub.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleApproveSubmission(sub.id)}
                                  disabled={actionLoadingId === sub.id}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all disabled:opacity-50"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                                </button>

                                <button
                                  onClick={() => setRejectModalSubmission(sub)}
                                  disabled={actionLoadingId === sub.id}
                                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all disabled:opacity-50"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => setInspectSubmission(sub)}
                              className="p-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                              title="Inspect Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TASKS TAB CONTENT */}
      {activeTab === 'TASKS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((t) => (
            <div
              key={t.id}
              className={`bg-white border p-6 rounded-3xl shadow-sm flex flex-col justify-between transition-all ${
                t.status === 'ACTIVE' ? 'border-gray-200 hover:border-gray-300' : 'border-rose-200 bg-rose-50/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      t.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {t.status}
                  </span>

                  <span className="text-[11px] font-bold text-[#b50a0a] bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                    {t.reward_duration_months} Month{t.reward_duration_months > 1 ? 's' : ''} Free Code
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">{t.title}</h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 font-medium">{t.description}</p>

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Target Role:</span>
                    <span className="font-bold text-gray-800 uppercase">{t.target_role}</span>
                  </div>
                  {t.platform_link && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Platform Link:</span>
                      <a
                        href={t.platform_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                      >
                        Visit Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-semibold">
                  Posted {new Date(t.created_at).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleToggleStatus(t.id, t.status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    t.status === 'ACTIVE'
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {t.status === 'ACTIVE' ? 'Pause Task' : 'Activate Task'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INSPECT SUBMISSION MODAL */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-6 sm:p-8 relative animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectSubmission(null)}
              className="absolute top-6 right-6 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Submission Details</h3>
            <p className="text-xs text-gray-500 mb-6">User: {inspectSubmission.user_email}</p>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Task Campaign</p>
                <p className="font-bold text-gray-900 text-sm mt-1">{inspectSubmission.earning_tasks?.title}</p>
                <p className="text-gray-500 mt-1">{inspectSubmission.earning_tasks?.reward_duration_months} Months Membership Code</p>
              </div>

              {inspectSubmission.proof_url && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Submitted Link</p>
                  <a
                    href={inspectSubmission.proof_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 font-semibold block truncate hover:underline"
                  >
                    {inspectSubmission.proof_url}
                  </a>
                </div>
              )}

              {inspectSubmission.proof_file_url && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Uploaded Proof Image</p>
                  <a href={inspectSubmission.proof_file_url} target="_blank" rel="noreferrer" className="block">
                    <img
                      src={inspectSubmission.proof_file_url}
                      alt="Proof Attachment"
                      className="w-full h-48 object-cover rounded-2xl border border-gray-200 hover:opacity-95 transition-opacity"
                    />
                  </a>
                </div>
              )}

              {inspectSubmission.rejection_reason && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Admin Rejection Note</p>
                  <p className="mt-1 font-medium">{inspectSubmission.rejection_reason}</p>
                </div>
              )}

              {inspectSubmission.earned_coupon_code && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-900">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Generated Activation Code</p>
                  <p className="text-lg font-black tracking-widest mt-1 text-emerald-700">{inspectSubmission.earned_coupon_code}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              {inspectSubmission.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleApproveSubmission(inspectSubmission.id)}
                    disabled={actionLoadingId === inspectSubmission.id}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    Approve & Issue Code
                  </button>

                  <button
                    onClick={() => setRejectModalSubmission(inspectSubmission)}
                    disabled={actionLoadingId === inspectSubmission.id}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    Reject Submission
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 sm:p-8 relative animate-in zoom-in duration-300">
            <button
              onClick={() => setRejectModalSubmission(null)}
              className="absolute top-6 right-6 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Submission</h3>
            <p className="text-xs text-gray-500 mb-4">Provide feedback to {rejectModalSubmission.user_email} explaining why their proof submission was rejected.</p>

            <form onSubmit={handleRejectSubmission} className="space-y-4">
              <textarea
                required
                rows={4}
                placeholder="e.g. The submitted screenshot does not show CenterKick tagged in the post."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#b50a0a] text-xs placeholder:text-gray-500 font-medium text-gray-900"
              />

              <button
                type="submit"
                disabled={actionLoadingId === rejectModalSubmission.id}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-xs"
              >
                {actionLoadingId === rejectModalSubmission.id ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl p-6 sm:p-8 relative animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#b50a0a]" /> Post Earning Task
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-semibold overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-gray-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Share CenterKick Launch Post on LinkedIn"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Help spread the word to earn a 100% free athlete membership code."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Step-by-Step Instructions for Users</label>
                <textarea
                  required
                  rows={3}
                  placeholder="1. Click the link to visit the official post. 2. Repost & tag @CenterKick. 3. Copy post URL & take a screenshot."
                  value={taskInstructions}
                  onChange={(e) => setTaskInstructions(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-gray-700">Reward Duration (Months)</label>
                    <span className="text-[10px] text-gray-500 font-bold">Cap: {maxDurationCap} Mo</span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={maxDurationCap}
                    step={1}
                    required
                    value={rewardMonths}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > maxDurationCap) {
                        setRewardMonths(maxDurationCap);
                        showToast(`Duration capped at max subscription plan duration (${maxDurationCap} months)`, 'info');
                      } else {
                        setRewardMonths(val);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-bold placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                  />
                  <p className="text-[10px] text-gray-400 font-normal mt-1">1-month steps up to sub plan max ({maxDurationCap} mo)</p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Target Account Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setTargetRole(newRole);
                      const newCap = getMaxPlanDurationMonths(newRole);
                      if (rewardMonths > newCap) {
                        setRewardMonths(newCap);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="PLAYER">Player Only</option>
                    <option value="COACH">Coach Only</option>
                    <option value="AGENT">Agent Only</option>
                    <option value="SCOUT">Scout Only</option>
                    <option value="ORGANIZATION">Organization Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Target Platform Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/p/..."
                  value={platformLink}
                  onChange={(e) => setPlatformLink(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Posting Task...' : 'Post Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
