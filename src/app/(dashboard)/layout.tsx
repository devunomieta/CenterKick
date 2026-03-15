import Link from 'next/link';
import { Home, Users, BarChart2, Settings, Shield, Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar sidebar bg-white border-r border-gray-200 */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-bold italic text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">CenterKick</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* We will conditionally render these based on the User Role later. For now, show all standard links */}
          <Link href="/dashboard/player" className="flex items-center gap-3 px-3 py-2 text-primary bg-red-50 rounded-lg font-medium transition-colors">
            <Home className="w-5 h-5" />
            <span>Overview</span>
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-primary hover:bg-red-50 rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5" />
            <span>My Profile</span>
          </Link>
          <Link href="/dashboard/stats" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-primary hover:bg-red-50 rounded-lg font-medium transition-colors">
            <BarChart2 className="w-5 h-5" />
            <span>Stats & Media</span>
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-100">
            <span className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</span>
            <Link href="/dashboard/admin" className="flex items-center gap-3 px-3 py-2 mt-2 text-gray-600 hover:text-primary hover:bg-red-50 rounded-lg font-medium transition-colors">
              <Shield className="w-5 h-5" />
              <span>Approval Queue</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-primary hover:bg-red-50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center ml-auto gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
              JD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
