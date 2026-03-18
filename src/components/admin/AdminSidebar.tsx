'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users, UserCheck, Briefcase, FileText, PenTool,
  ShieldCheck, CreditCard, Settings, LayoutDashboard
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      group: 'Core',
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard }
      ]
    },
    {
      group: 'Directories',
      items: [
        { label: 'Players', href: '/admin/players', icon: Users },
        { label: 'Coaches', href: '/admin/coaches', icon: UserCheck },
        { label: 'Agents', href: '/admin/agents', icon: Briefcase }
      ]
    },
    {
      group: 'Content',
      items: [
        { label: 'Blog / CMS', href: '/admin/blog', icon: FileText },
        { label: 'Manage UI', href: '/admin/manage-ui', icon: PenTool }
      ]
    },
    {
      group: 'Infrastructure',
      items: [
        { label: 'Manage Roles', href: '/admin/roles', icon: ShieldCheck },
        { label: 'Payments', href: '/admin/payments', icon: CreditCard },
        { label: 'System Settings', href: '/admin/settings', icon: Settings }
      ]
    }
  ];

  return (
    <nav className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
      {menuItems.map((section, idx) => (
        <div key={idx} className="space-y-1">
          <span className="px-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">{section.group}</span>
          {section.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all group ${isActive
                    ? 'text-white bg-[#b50a0a] shadow-lg shadow-red-900/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'group-hover:text-[#b50a0a]'
                  }`} />
                <span className={`text-[11px] uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-400'
                  }`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
