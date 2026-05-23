import Link from 'next/link';
import { Home, Users, BarChart2, Settings, Menu, Bell, X, Shield, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/dashboard/SignOutButton';
import { BannerManager } from '@/components/dashboard/BannerManager';
import { DashboardSidebarNav } from '@/components/dashboard/DashboardSidebarNav';

import { ToastProvider } from '@/context/ToastContext';

import { getCachedSettings } from '@/lib/cms';
import { getCachedData } from '@/lib/redis';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Cache user basic record
  const userRecord = await getCachedData(`user:record:${user.id}`, async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    return data;
  }, 1800); // 30 minutes

  // Cache profile basic record
  const profile = await getCachedData(`user:profile:${user.id}`, async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    return data;
  }, 1800);

  // 1. Enforce Profile Onboarding
  if (!userRecord || !profile) {
    redirect('/onboarding');
  }

  const role = userRecord?.role || 'player';
  const status = profile?.status || 'pending';

  // Forced Redirect for Administrative roles to the unified Admin Portal
  const adminRoles = ['superadmin', 'admin', 'blogger', 'operations', 'finance'];
  if (adminRoles.includes(role)) {
    redirect('/admin');
  }

  // Fetch Site Settings from Cache
  const siteSettings = await getCachedSettings() || {};
  const resolveUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${baseUrl}/storage/v1/object/public${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const sidebarLogoUrl = resolveUrl(siteSettings.sidebarLogoUrl || siteSettings.logoUrl);
  const brandName = siteSettings.siteTitle || "CenterKick";

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-900 hidden md:flex flex-col text-gray-300">
          <div className="h-20 flex items-center px-8 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-3 w-full">
              {sidebarLogoUrl ? (
                 <div className="relative h-7 w-auto max-w-full flex items-center justify-start overflow-hidden">
                    <img src={sidebarLogoUrl} alt={brandName} className="h-full w-auto object-contain" />
                 </div>
              ) : (
                 <>
                    <div className="w-10 h-10 rounded-xl bg-[#b50a0a] flex items-center justify-center shadow-lg shadow-red-900/40">
                      <span className="text-white font-black italic text-xl">C</span>
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter uppercase underline underline-offset-4 decoration-[#b50a0a]">{brandName}</span>
                 </>
              )}
            </Link>
          </div>

          <DashboardSidebarNav role={role} />

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
                  <span className="text-gray-900 font-bold text-xs truncate max-w-[150px]">{user?.email}</span>
                  <p className="text-[10px] font-bold text-[#b50a0a] uppercase tracking-widest">{role}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center font-bold text-white shadow-lg text-xs">
                  {user?.email?.[0].toUpperCase()}
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
    </ToastProvider>
  );
}
