'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Edit, User, ExternalLink, LucideIcon } from 'lucide-react';

export interface ProfileHeaderProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  avatarUrl: string | null;
  statusBadge?: React.ReactNode;
  backHref: string;
  backLabel?: string;
  publicHref?: string;
  avatarUploading?: boolean;
  onAvatarUpload?: (file: File) => void;
  avatarPlaceholderInitial?: string;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface UnifiedProfileLayoutProps {
  header: ProfileHeaderProps;
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export default function UnifiedProfileLayout({
  header,
  tabs,
  activeTab,
  onTabChange,
  children
}: UnifiedProfileLayoutProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] animate-in fade-in duration-500">
      {header.onAvatarUpload && (
        <input 
          type="file" 
          ref={avatarInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              header.onAvatarUpload!(e.target.files[0]);
            }
          }}
        />
      )}
      
      {/* Dashboard Top Bar - Sticky */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 sticky top-[-32px] z-[100] shadow-sm mx-[-32px] mt-[-32px] mb-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link 
              href={header.backHref}
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-sm tracking-wide"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              {header.backLabel || 'Back'}
            </Link>
            <div className="h-4 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-4">
              <div 
                className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white overflow-hidden shadow-lg relative ${header.onAvatarUpload ? 'cursor-pointer group/avatar' : ''} ${header.avatarUploading ? 'animate-pulse' : ''}`}
                onClick={() => {
                  if (header.onAvatarUpload && !header.avatarUploading) {
                    avatarInputRef.current?.click();
                  }
                }}
              >
                {header.avatarUrl ? (
                  <Image 
                    src={header.avatarUrl} 
                    className="w-full h-full object-cover group-hover/avatar:opacity-50 transition-all" 
                    alt="Avatar"
                    fill
                  />
                ) : (
                  <User className="w-5 h-5 group-hover/avatar:opacity-50 transition-all" />
                )}
                {header.onAvatarUpload && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all">
                    <Edit className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  {header.title}
                  {header.statusBadge}
                </div>
                <div className="mt-1">
                  {header.subtitle}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {header.publicHref && (
              <Link 
                href={header.publicHref} 
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold tracking-wide hover:bg-slate-100 transition-all border border-slate-100"
              >
                View Public <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row gap-4 px-4 pb-12 flex-1 items-start">
        {/* Left Sidebar - Profile Summary - Sticky */}
        <div className="w-full md:w-72 bg-white border border-slate-100 p-6 rounded-[2.5rem] flex flex-col gap-4 md:p-8 md:sticky md:top-[72px] shadow-sm shadow-slate-200/50 shrink-0">
          <div 
            className={`relative overflow-hidden rounded-[2rem] aspect-square bg-slate-100 ${header.onAvatarUpload ? 'cursor-pointer group' : ''} ${header.avatarUploading ? 'animate-pulse opacity-50' : ''}`}
            onClick={() => {
              if (header.onAvatarUpload && !header.avatarUploading) {
                avatarInputRef.current?.click();
              }
            }}
          >
            {header.onAvatarUpload && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 transform scale-90 group-hover:scale-100 transition-all">
                  <Edit className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
            
            {header.avatarUrl ? (
              <Image 
                src={header.avatarUrl} 
                alt="Profile" 
                className={`w-full h-full object-cover border-2 border-slate-50 shadow-inner transition-transform duration-700 ${header.onAvatarUpload ? 'group-hover:scale-110' : ''}`} 
                fill
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl font-bold">
                {header.avatarPlaceholderInitial || <User className="w-12 h-12" />}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold tracking-wide transition-all group ${
                    activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-1' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-slate-300 group-hover:text-slate-900'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
