import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Building2, Mail, Calendar, MapPin, CheckCircle, Clock, Link as LinkIcon, Image as ImageIcon, Video, Briefcase, Globe } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface OrganizationPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (isUUID) {
    return notFound();
  }

  const { data: org, error } = await supabase
    .from('profiles')
    .select('*, users!user_id(role, email)')
    .eq('slug', id)
    .single();

  if (error || !org) {
    return notFound();
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/organizations" className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 tracking-wide hover:bg-gray-50 transition-all">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tighter leading-none">
          Organization <span className="text-[#b50a0a]">Profile</span>
        </h1>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-3xl bg-gray-900 flex items-center justify-center text-white text-4xl font-bold shadow-xl shrink-0 overflow-hidden border-4 border-white">
            {org.avatar_url ? (
               <img src={org.avatar_url} alt={org.first_name} className="w-full h-full object-cover" />
            ) : (
               <Building2 className="w-12 h-12 text-gray-500" />
            )}
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tighter leading-none mb-2">
                {org.first_name} {org.last_name}
              </h2>
              <div className="flex items-center gap-4 flex-wrap mt-4">
                <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700 tracking-wide">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {org.email || org.users?.email || 'N/A'}
                </span>
                {(org.country || org.nationality) && (
                  <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700 tracking-wide">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {org.country || org.nationality}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm font-bold text-gray-700 tracking-wide">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Joined {format(new Date(org.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>

            {org.bio && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 tracking-wide mb-2">About Organization</h3>
                <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
                  {org.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:p-4">
        {/* Basic Info Section */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 md:p-8 space-y-6">
          <h2 className="text-sm font-bold text-gray-900 tracking-wide flex items-center gap-2 border-b border-gray-50 pb-4">
            <Building2 className="w-4 h-4 text-[#b50a0a]" /> Organization Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Organization Name', value: org.first_name || 'N/A' },
              { label: 'Type / Category', value: org.last_name || 'N/A' },
              { label: 'Registration / Agency Name', value: org.agency_name || 'N/A' },
              { label: 'Country / Base', value: org.country || org.nationality || 'N/A' },
              { label: 'Public Phone', value: org.phone_number || 'N/A' },
              { label: 'Public Email', value: org.contact_email || org.users?.email || 'N/A' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <p className="text-xs font-bold text-gray-400 tracking-wide">{item.label}</p>
                <p className="text-base font-bold text-gray-900 capitalize">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Media & Official Links Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Media & Galleries */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 md:p-8 space-y-6">
            <h2 className="text-sm font-bold text-gray-900 tracking-wide flex items-center gap-2 border-b border-gray-50 pb-4">
              <ImageIcon className="w-4 h-4 text-[#b50a0a]" /> Media & Galleries
            </h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Image Gallery
                </p>
                {org.gallery_urls && org.gallery_urls.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {org.gallery_urls.map((url: string, idx: number) => (
                      <div key={idx} className="aspect-square rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                        <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-500">No images available.</p>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 tracking-wide mb-3 flex items-center gap-2">
                  <Video className="w-3.5 h-3.5" /> Video Links
                </p>
                {org.video_links && org.video_links.length > 0 ? (
                  <div className="space-y-2">
                    {org.video_links.map((link: string, idx: number) => (
                      <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-50 rounded-xl text-sm font-bold text-[#b50a0a] hover:underline truncate border border-gray-100">
                        {link}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-500">No video links available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Official Links */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 md:p-8 space-y-6">
            <h2 className="text-sm font-bold text-gray-900 tracking-wide flex items-center gap-2 border-b border-gray-50 pb-4">
              <LinkIcon className="w-4 h-4 text-[#b50a0a]" /> Official Links
            </h2>
            
            <div className="space-y-4">
              {org.social_links && Object.keys(org.social_links).length > 0 ? (
                Object.entries(org.social_links).map(([platform, url]) => (
                  <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors group">
                    <span className="text-sm font-bold text-gray-900 capitalize flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400 group-hover:text-[#b50a0a] transition-colors" />
                      {platform}
                    </span>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 truncate max-w-[200px]">{url as string}</span>
                  </a>
                ))
              ) : (
                <p className="text-sm font-medium text-gray-500">No official links provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
