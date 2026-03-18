import Link from 'next/link';
import { Home, Users, BarChart2, Settings, Menu, Bell, X, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/dashboard/SignOutButton';
import { BannerManager } from '@/components/dashboard/BannerManager';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: userRecord } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  const role = userRecord?.role || 'player';
  const status = profile?.status || 'pending';

  // Forced Redirect for Superadmins to the unified Admin Portal
  if (role === 'superadmin') {
    redirect('/admin');
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 hidden md:flex flex-col text-gray-300">
        <div className="h-20 flex items-center px-8 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b50a0a] flex items-center justify-center shadow-lg shadow-red-900/40">
              <span className="text-white font-black italic text-xl">C</span>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase underline underline-offset-4 decoration-[#b50a0a]">CenterKick</span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-white bg-white/10 rounded-xl font-bold transition-all border border-white/5">
            <Home className="w-5 h-5 text-[#b50a0a]" />
            <span className="text-sm uppercase tracking-widest">Overview</span>
          </Link>
          
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all">
            <Users className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">My Profile</span>
          </Link>

          {(role === 'player' || role === 'athlete') && (
            <Link href="/dashboard/stats" className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all">
              <BarChart2 className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">Stats & Media</span>
            </Link>
          )}

          {role === 'agent' && (
            <Link href="/dashboard/portfolio" className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all">
              <Users className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">Portfolio</span>
            </Link>
          )}


          <div className="pt-8 mt-8 border-t border-gray-800">
            <span className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Management</span>
            <Link href="/dashboard/subscription" className="flex items-center gap-3 px-4 py-3 mt-4 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all">
              <Shield className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">Subscription</span>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all">
              <Settings className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">Settings</span>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-800">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Banner Bar (Notices) */}
        <BannerManager status={status} />

        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm relative z-10">
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-6 ml-auto">
            <button className="p-2 text-gray-400 hover:text-primary transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#b50a0a] rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black uppercase text-gray-900">{session.user.email?.split('@')[0]}</p>
                <p className="text-[10px] font-bold text-[#b50a0a] uppercase tracking-widest">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black shadow-lg">
                {session.user.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
