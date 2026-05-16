import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Calendar, MapPin, Phone, Shield,
  ShieldCheck, CheckCircle, Clock, XCircle, User,
  CreditCard, Briefcase, Trophy, UserCheck, Search, Users,
  ToggleLeft, ToggleRight, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { UserDetailActions } from '@/components/admin/users/UserDetailActions';

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();

  // Fetch user, profile, and subscription in parallel
  const [
    { data: user },
    { data: profile },
    { data: subscription },
  ] = await Promise.all([
    admin.from('users').select('*').eq('id', id).single(),
    admin.from('profiles').select('*').eq('user_id', id).single(),
    admin.from('subscriptions').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(1).single(),
  ]);

  if (!user) notFound();

  const isActive = user.is_active !== false;
  const profileStatus = profile?.status;

  const roleIcons: Record<string, React.ReactNode> = {
    player: <Trophy className="w-5 h-5" />,
    coach: <UserCheck className="w-5 h-5" />,
    agent: <Briefcase className="w-5 h-5" />,
    scout: <Search className="w-5 h-5" />,
    organization: <Users className="w-5 h-5" />,
    superadmin: <ShieldCheck className="w-5 h-5" />,
    admin: <Shield className="w-5 h-5" />,
  };

  const StatusBadge = () => {
    if (!isActive) return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-[9px] font-black uppercase rounded-xl border border-red-100">
        <XCircle className="w-3 h-3" /> Deactivated
      </span>
    );
    switch (profileStatus) {
      case 'active': return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-[9px] font-black uppercase rounded-xl border border-green-100">
          <CheckCircle className="w-3 h-3" /> Active
        </span>
      );
      case 'pending': return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-[9px] font-black uppercase rounded-xl border border-amber-100">
          <Clock className="w-3 h-3" /> Pending Approval
        </span>
      );
      case 'rejected': return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-[9px] font-black uppercase rounded-xl border border-red-100">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
      default: return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-400 text-[9px] font-black uppercase rounded-xl border border-gray-100">
          <AlertTriangle className="w-3 h-3" /> Incomplete
        </span>
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      {/* Back */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to All Accounts
      </Link>

      {/* Header Card */}
      <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#b50a0a] rounded-full blur-[100px] opacity-10 -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-2xl text-white shrink-0">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                : user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
                {profile?.first_name
                  ? `${profile.first_name} ${profile.last_name || ''}`.trim()
                  : user.email?.split('@')[0]}
              </h1>
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mt-1">{user.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <StatusBadge />
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/70 text-[9px] font-black uppercase rounded-xl">
                  {roleIcons[user.role] || <Shield className="w-3 h-3" />}
                  {user.role || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-8 shrink-0">
            <div className="text-center">
              <p className="text-2xl font-black">{profile ? '1' : '0'}</p>
              <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mt-1">Profile</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black">{subscription ? '1' : '0'}</p>
              <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mt-1">Subscription</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black">{format(new Date(user.created_at), 'MMM yy')}</p>
              <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mt-1">Joined</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profile Info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Account Details */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-[#b50a0a]" /> Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Email', value: user.email, icon: <Mail className="w-3.5 h-3.5" /> },
                { label: 'Platform Role', value: user.role || 'Unassigned', icon: <Shield className="w-3.5 h-3.5" /> },
                { label: 'Account Created', value: format(new Date(user.created_at), 'MMMM dd, yyyy'), icon: <Calendar className="w-3.5 h-3.5" /> },
                { label: 'Account Active', value: isActive ? 'Yes' : 'No', icon: isActive ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-red-500" /> },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">{item.icon}{item.label}</p>
                  <p className="text-sm font-bold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Info */}
          {profile ? (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
              <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <User className="w-4 h-4 text-[#b50a0a]" /> Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: `${profile.first_name} ${profile.last_name || ''}`.trim() },
                  { label: 'Position', value: profile.position || 'N/A' },
                  { label: 'Date of Birth', value: profile.date_of_birth ? format(new Date(profile.date_of_birth), 'MMMM dd, yyyy') : 'N/A' },
                  { label: 'Nationality', value: profile.nationality || 'N/A' },
                  { label: 'Phone', value: profile.phone_number || 'N/A' },
                  { label: 'Profile Status', value: profile.status },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
              {profile.bio && (
                <div className="mt-6 pt-6 border-t border-gray-50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Bio</p>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Profile Submitted Yet</p>
              <p className="text-[10px] text-gray-400 max-w-xs">This user has not completed their onboarding profile.</p>
            </div>
          )}

          {/* Subscription */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#b50a0a]" /> Subscription
            </h2>
            {subscription ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Plan', value: subscription.plan_name },
                  { label: 'Status', value: subscription.status },
                  { label: 'Gateway', value: subscription.gateway || 'N/A' },
                  { label: 'Transaction ID', value: subscription.external_id || 'N/A' },
                  { label: 'Period End', value: subscription.current_period_end ? format(new Date(subscription.current_period_end), 'MMM dd, yyyy') : 'N/A' },
                  { label: 'Created', value: format(new Date(subscription.created_at), 'MMM dd, yyyy') },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-400">No subscription found for this account.</p>
            )}
          </div>
        </div>

        {/* Right: Actions Panel */}
        <div className="space-y-6">
          <UserDetailActions
            userId={id}
            currentRole={user.role}
            isActive={isActive}
            profileStatus={profileStatus}
          />
        </div>
      </div>
    </div>
  );
}
