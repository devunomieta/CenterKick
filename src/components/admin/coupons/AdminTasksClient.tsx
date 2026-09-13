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
  submissions
}: {
  tasks: any[];
  submissions: any[];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'SUBMISSIONS' | 'TASKS'>('SUBMISSIONS');
  const [submissionFilter, setSubmissionFilter] = useState('PENDING');

  // Create Task Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskInstructions, setTaskInstructions] = useState('');
  const [rewardMonths, setRewardMonths] = useState(6);
  const [targetRole, setTargetRole] = useState('ALL');
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

    setIsSubmitting(true);
    try {
      const res = await createEarningTask({
        title: taskTitle,
        description: taskDescription,
        instructions: taskInstructions,
        rewardDurationMonths: rewardMonths,
        targetRole,
        platformLink: platformLink || undefined,
        requireProofUrl,
        requireProofFile,
        maxRewardClaims: maxRewardClaims ? Number(maxRewardClaims) : undefined
      });

      if (res.success) {
        showToast('Earning task deployed successfully!', 'success');
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
    } catch (err: any) {
      showToast(err.message || 'Error creating task.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    setActionLoadingId(taskId);
    try {
      const res = await toggleEarningTaskStatus(taskId, currentStatus);
      if (res.success) {
        showToast(`Task status updated to ${res.nextStatus}`, 'success');
        router.refresh();
      } else {
        showToast(res.error || 'Failed to toggle task status', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error toggling task', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApprove = async (subId: string) => {
    setActionLoadingId(subId);
    try {
      const res = await approveTaskSubmission(subId);
      if (res.success) {
        showToast(`Submission approved! Activation voucher code generated: ${res.couponCode}`, 'success');
        setInspectSubmission(null);
        router.refresh();
      } else {
        showToast(res.error || 'Failed to approve submission.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error approving submission', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalSubmission) return;

    setActionLoadingId(rejectModalSubmission.id);
    try {
      const res = await rejectTaskSubmission(rejectModalSubmission.id, rejectionReason);
      if (res.success) {
        showToast('Submission rejected and feedback sent to user.', 'info');
        setRejectModalSubmission(null);
        setInspectSubmission(null);
        setRejectionReason('');
        router.refresh();
      } else {
        showToast(res.error || 'Failed to reject submission.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error rejecting submission.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter === 'ALL') return true;
    return s.status === submissionFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Sub-navigation Header Bar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-3 py-1 bg-red-50 text-[#b50a0a] text-xs font-bold rounded-full border border-red-100 uppercase tracking-wide">
              Task Verification Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Earn Membership Tasks</h1>
          <p className="text-xs font-medium text-gray-500 mt-0.5">
            Manage task campaigns, inspect user proof submissions, and auto-issue 1-time activation codes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/coupons"
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Ticket className="w-4 h-4 text-[#b50a0a]" /> Coupon Codes
          </Link>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New Task
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab('SUBMISSIONS')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'SUBMISSIONS'
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Shield className="w-4 h-4 text-amber-400" /> Submissions Desk
          {submissions.filter((s) => s.status === 'PENDING').length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#b50a0a] text-white text-[10px] font-extrabold animate-pulse">
              {submissions.filter((s) => s.status === 'PENDING').length} PENDING
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('TASKS')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'TASKS'
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" /> Active Tasks ({tasks.length})
        </button>
      </div>

      {/* SUBMISSIONS DESK TAB */}
      {activeTab === 'SUBMISSIONS' && (
        <div className="space-y-6">
          {/* Status Filter Sub-bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((st) => (
              <button
                key={st}
                onClick={() => setSubmissionFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  submissionFilter === st
                    ? 'bg-[#b50a0a] text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <th className="px-6 py-4">User / Email</th>
                    <th className="px-6 py-4">Task Campaign</th>
                    <th className="px-6 py-4">Proof Link & Upload</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Submitted Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-medium">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold">
                        No {submissionFilter !== 'ALL' ? submissionFilter.toLowerCase() : ''} task proof submissions found.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{sub.user_email}</p>
                          <span className="text-[11px] text-gray-400 font-mono">{sub.user_id?.slice(0, 8)}...</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{sub.earning_tasks?.title || 'Promotional Task'}</p>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold">
                            {sub.earning_tasks?.reward_duration_months || 6} Months Free
                          </span>
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          {sub.proof_url ? (
                            <a
                              href={sub.proof_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#b50a0a] hover:underline font-bold flex items-center gap-1"
                            >
                              <LinkIcon className="w-3 h-3" /> View URL Proof <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">No URL</span>
                          )}
                          {sub.proof_file_url && (
                            <a
                              href={sub.proof_file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" /> View Screenshot File
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                              sub.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : sub.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setInspectSubmission(sub)}
                              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-800 font-bold transition-all flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Inspect
                            </button>

                            {sub.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleApprove(sub.id)}
                                  disabled={actionLoadingId === sub.id}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm disabled:opacity-50"
                                >
                                  {actionLoadingId === sub.id ? 'Approving...' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => setRejectModalSubmission(sub)}
                                  disabled={actionLoadingId === sub.id}
                                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 font-bold transition-all disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TASKS MANAGEMENT TAB */}
      {activeTab === 'TASKS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((t) => (
            <div key={t.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    t.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {t.status}
                  </span>
                  <span className="text-xs font-bold text-[#b50a0a]">
                    {t.reward_duration_months} Months Reward
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1">{t.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{t.description}</p>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1.5 font-medium">
                  <p><span className="font-bold text-gray-900">Target Role:</span> {t.target_role}</p>
                  <p><span className="font-bold text-gray-900">Total Approved Claims:</span> {t.total_claims_count || 0}</p>
                  {t.platform_link && (
                    <a href={t.platform_link} target="_blank" rel="noreferrer" className="text-[#b50a0a] hover:underline font-bold flex items-center gap-1">
                      Platform Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleTaskStatus(t.id, t.status)}
                  disabled={actionLoadingId === t.id}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    t.status === 'ACTIVE'
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                  }`}
                >
                  {actionLoadingId === t.id ? 'Updating...' : t.status === 'ACTIVE' ? 'Pause Campaign' : 'Activate Campaign'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INSPECT SUBMISSION MODAL */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl p-6 sm:p-8 relative animate-in zoom-in duration-300">
            <button
              onClick={() => setInspectSubmission(null)}
              className="absolute top-6 right-6 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#b50a0a]" /> Submission Inspection
            </h3>

            <div className="space-y-4 text-xs font-medium">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <p><span className="font-bold text-gray-900">User Email:</span> {inspectSubmission.user_email}</p>
                <p><span className="font-bold text-gray-900">Campaign Task:</span> {inspectSubmission.earning_tasks?.title}</p>
                <p><span className="font-bold text-gray-900">Reward:</span> {inspectSubmission.earning_tasks?.reward_duration_months} Months Membership</p>
              </div>

              {inspectSubmission.proof_url && (
                <div>
                  <label className="font-bold text-gray-900 block mb-1">Submitted Proof Link</label>
                  <a href={inspectSubmission.proof_url} target="_blank" rel="noreferrer" className="text-[#b50a0a] hover:underline font-bold break-all bg-red-50 p-3 rounded-xl border border-red-100 block">
                    {inspectSubmission.proof_url} ↗
                  </a>
                </div>
              )}

              {inspectSubmission.proof_file_url && (
                <div>
                  <label className="font-bold text-gray-900 block mb-1">Submitted Screenshot File</label>
                  <a href={inspectSubmission.proof_file_url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-bold break-all bg-emerald-50 p-3 rounded-xl border border-emerald-100 block">
                    View Screenshot Attachment ↗
                  </a>
                </div>
              )}

              {inspectSubmission.user_notes && (
                <div>
                  <label className="font-bold text-gray-900 block mb-1">User Notes</label>
                  <p className="p-3 bg-gray-50 rounded-xl text-gray-700 italic">{inspectSubmission.user_notes}</p>
                </div>
              )}

              {inspectSubmission.status === 'PENDING' && (
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleApprove(inspectSubmission.id)}
                    disabled={actionLoadingId === inspectSubmission.id}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all"
                  >
                    Approve & Issue Voucher Code
                  </button>
                  <button
                    onClick={() => setRejectModalSubmission(inspectSubmission)}
                    className="px-6 py-3 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl font-bold border border-rose-200 transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT SUBMISSION MODAL */}
      {rejectModalSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-6 sm:p-8 relative animate-in zoom-in duration-300">
            <button
              onClick={() => setRejectModalSubmission(null)}
              className="absolute top-6 right-6 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Task Submission</h3>
            <p className="text-xs text-gray-500 mb-4">Provide feedback to the user explaining why the submission was rejected so they can correct it.</p>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs font-semibold">
              <textarea
                required
                rows={3}
                placeholder="e.g. The submitted screenshot does not show CenterKick tagged in the post."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#b50a0a]"
              />

              <button
                type="submit"
                disabled={actionLoadingId === rejectModalSubmission.id}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
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
              <Sparkles className="w-5 h-5 text-[#b50a0a]" /> Deploy Earning Task Campaign
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Help spread the word to earn a 100% free 6-month athlete membership."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
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
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Reward Duration (Months)</label>
                  <select
                    value={rewardMonths}
                    onChange={(e) => setRewardMonths(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                  >
                    <option value={1}>1 Month Free</option>
                    <option value={3}>3 Months Free</option>
                    <option value={6}>6 Months Free</option>
                    <option value={12}>12 Months Free</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Target Account Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b50a0a]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Deploying...' : 'Deploy Earning Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
