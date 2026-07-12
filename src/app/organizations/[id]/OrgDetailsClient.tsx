'use client';

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
   Building2, 
   MapPin, 
   Award, 
   Globe, 
   Mail, 
   Phone, 
   ShieldCheck, 
   Users2, 
   ArrowRight,
   ChevronLeft,
   Facebook,
   Instagram
} from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrgDetailsClientProps {
  profile: any;
  members?: any[];
}

export default function OrgDetailsClient({ profile, members = [] }: OrgDetailsClientProps) {
   const [activeTab, setActiveTab] = useState("Profile");
   const router = useRouter();

   const displayName = profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous Organization';
   const profileEst = profile.established_year || profile.established || 'NIL';

   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-[72px] lg:pt-[76px]">
            {/* Back Button Bar */}
            <div className="bg-white border-b border-gray-100 py-4">
               <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
                  <button 
                     onClick={() => router.back()}
                     className="group inline-flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm tracking-wide transition-colors"
                  >
                     <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
                     Back
                  </button>
               </div>
            </div>
            {/* Hero — mobile stacked, desktop split */}
            <div className="relative w-full bg-[#0a0a0b] overflow-hidden">
               {/* Background stadium image */}
               <div className="absolute inset-0 z-0">
                  <img
                     src={profile.cover_url || profile.cover_image_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=60&w=1200&auto=format&fit=crop"}
                     className="w-full h-full object-cover object-center opacity-20"
                     alt=""
                     loading="lazy"
                     decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />
               </div>

               {/* Mobile: stacked layout */}
               <div className="relative z-10 flex flex-col md:hidden items-center pt-10 pb-8 px-6 text-white text-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#b50a0a] shadow-2xl mb-6 shrink-0 bg-white/5 flex items-center justify-center">
                     {profile.avatar_url ? (
                        <img 
                           src={profile.avatar_url} 
                           className="w-full h-full object-cover object-top" 
                           alt={displayName} 
                           loading="lazy"
                        />
                     ) : (
                        <Building2 className="w-20 h-20 text-white/50" />
                     )}
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight leading-none mb-6 drop-shadow-2xl mt-4">
                     {displayName}
                  </h1>
                  <div className="flex flex-wrap gap-3 justify-center mb-6">
                     <div className="bg-white/10 border border-white/15 px-6 py-2.5 rounded-xl flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-300 tracking-wide">Established:</span>
                        <span className="text-base font-bold text-white">{profileEst}</span>
                     </div>
                  </div>
               </div>

               {/* Desktop: side-by-side layout */}
               <div className="hidden md:flex max-w-[1200px] mx-auto w-full h-[450px] relative px-4 lg:px-0">
                  <div className="w-[40%] h-full relative flex items-center justify-center">
                     <div className="absolute w-[300px] h-[300px] lg:w-[360px] lg:h-[360px] bg-[#b50a0a]/20 blur-[100px] rounded-full" />
                     <div className="w-[300px] h-[300px] lg:w-[360px] lg:h-[360px] rounded-full border-[6px] border-[#b50a0a] shadow-2xl overflow-hidden relative z-10 shrink-0 aspect-square bg-white/5 flex items-center justify-center">
                        {profile.avatar_url ? (
                           <img 
                              src={profile.avatar_url} 
                              className="w-full h-full object-cover object-top" 
                              alt={displayName} 
                              loading="eager"
                           />
                        ) : (
                           <Building2 className="w-24 h-24 text-white/50" />
                        )}
                     </div>
                  </div>
                  <div className="w-[60%] flex flex-col justify-center items-start pl-16 text-white z-20">
                     <h1 className="flex flex-col leading-none drop-shadow-2xl mb-10 mt-4">
                        <span className="text-7xl font-black tracking-tight">{displayName}</span>
                     </h1>
                     <div className="flex gap-4 mb-12 flex-wrap">
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl flex items-center gap-3">
                           <span className="text-xs font-bold text-gray-200 tracking-[0.2em] uppercase">Established:</span>
                           <span className="text-xl font-bold text-white capitalize">{profileEst}</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                           {profile.social_links?.facebook && (
                              <a href={profile.social_links.facebook} target="_blank" rel="noopener noreferrer">
                                 <Facebook className="w-4 h-4 hover:text-[#b50a0a] transition-colors" />
                              </a>
                           )}
                           {profile.social_links?.instagram && (
                              <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer">
                                 <Instagram className="w-4 h-4 hover:text-[#b50a0a] transition-colors" />
                              </a>
                           )}
                           {profile.social_links?.twitter && (
                              <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" title="X (formerly Twitter)">
                                 <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current hover:text-[#b50a0a] transition-colors"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                              </a>
                           )}
                           {!profile.social_links && (
                              <>
                                 <Facebook className="w-4 h-4 text-white/20" />
                                 <Instagram className="w-4 h-4 text-white/20" />
                                 <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current text-white/20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                              </>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-100 shadow-sm sticky top-32 z-40">
               <div className="max-w-[1000px] mx-auto flex items-center justify-between px-4 lg:px-0">
                  <div className="flex overflow-x-auto no-scrollbar py-1">
                     {["Profile", "Members", "Bio", "Achievements"].map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={`px-8 py-6 text-xs font-bold tracking-[0.2em] transition-all relative shrink-0 ${
 activeTab === tab ? "text-[#a20000]" : "text-gray-400 hover:text-gray-600"
 }`}
                        >
                           {tab}
                           {activeTab === tab && (
                              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#a20000]"></span>
                           )}
                        </button>
                     ))}
                  </div>
                  <div className="hidden lg:flex items-center gap-4">
                     <Link href="/register">
                        <button className="bg-[#a20000] hover:bg-[#8a0000] text-white px-6 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all">
                           Connect Partner
                        </button>
                     </Link>
                  </div>
               </div>
            </div>

            {/* Content Body */}
            <div className="max-w-[1000px] mx-auto px-4 lg:px-0 py-8 sm:py-16">
               {activeTab === "Profile" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                     <div className="md:col-span-2 space-y-12">
                        {/* Summary Details */}
                        <section>
                           <h2 className="text-sm font-bold text-gray-900 tracking-wide mb-6 pb-2 border-b border-gray-100">
                              Overview Info
                           </h2>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                              <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <MapPin className="w-5 h-5 text-gray-500" />
                                 </div>
                                 <div>
                                    <span className="text-xs font-bold text-gray-400 tracking-wide block">Country / Region</span>
                                    <span className="text-base font-bold text-gray-800 mt-0.5 block">{profile.country || 'Global'}</span>
                                 </div>
                              </div>

                              <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <ShieldCheck className="w-5 h-5 text-gray-500" />
                                 </div>
                                 <div>
                                    <span className="text-xs font-bold text-gray-400 tracking-wide block">Registration / License</span>
                                    <span className="text-base font-bold text-gray-800 mt-0.5 block">{profile.license || 'Verified Organization'}</span>
                                 </div>
                              </div>

                              <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <Award className="w-5 h-5 text-gray-500" />
                                 </div>
                                 <div>
                                    <span className="text-xs font-bold text-gray-400 tracking-wide block">League / Association</span>
                                    <span className="text-base font-bold text-gray-800 mt-0.5 block">{profile.league || 'Development League'}</span>
                                 </div>
                              </div>

                              <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <Users2 className="w-5 h-5 text-gray-500" />
                                 </div>
                                 <div>
                                    <span className="text-xs font-bold text-gray-400 tracking-wide block">Preferred Formation</span>
                                    <span className="text-base font-bold text-gray-800 mt-0.5 block">{profile.formation || '4-3-3 / Development'}</span>
                                 </div>
                              </div>
                           </div>
                        </section>

                        {/* Description */}
                        <section>
                           <h2 className="text-sm font-bold text-gray-900 tracking-wide mb-6 pb-2 border-b border-gray-100">
                              About Our Academy
                           </h2>
                           <p className="text-gray-600 text-base leading-relaxed font-medium">
                              {profile.bio || 'Premium sports organization committed to developing academy prospects and providing professional infrastructure.'}
                           </p>
                        </section>
                     </div>

                     {/* Sidebar Contact Info */}
                     <div className="space-y-8 bg-gray-50 p-8 rounded-3xl border border-gray-100 h-fit">
                        <h3 className="text-sm font-bold text-gray-900 tracking-wide">
                           Contact Office
                        </h3>

                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-sm text-gray-600">
                              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="truncate">{profile.contact_email || 'office@centerkick.com'}</span>
                           </div>
                           <div className="flex items-center gap-3 text-sm text-gray-600">
                              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                              <span>{profile.phone_number || '+234 Verified Phone'}</span>
                           </div>
                           <div className="flex items-center gap-3 text-sm text-gray-600">
                              <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                              <span>www.centerkick.com</span>
                           </div>
                        </div>

                        <Link href="/register" className="block w-full">
                           <button className="w-full bg-[#a20000] hover:bg-black text-white py-3.5 rounded-xl font-bold tracking-wide text-xs transition-all flex items-center justify-center gap-2">
                              Send Message <ArrowRight className="w-3.5 h-3.5" />
                           </button>
                        </Link>
                     </div>
                  </div>
               )}

                {activeTab === "Members" && (
                   <div className="max-w-[1000px]">
                      <h2 className="text-sm font-bold text-gray-900 tracking-wide mb-6 pb-2 border-b border-gray-100">
                         Registered Members & Staff
                      </h2>
                      {members.length > 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {members.map((member: any) => (
                               <Link href={`/${member.role === 'player' ? 'players' : member.role === 'coach' ? 'coaches' : 'agents'}/${member.slug}`} key={member.id}>
                                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:border-[#a20000] hover:shadow-xl transition-all group cursor-pointer">
                                     <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200">
                                           {member.avatar_url ? (
                                              <img src={member.avatar_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                           ) : (
                                              <div className="w-full h-full bg-white flex items-center justify-center">
                                                 <Users2 className="w-6 h-6 text-gray-300" />
                                              </div>
                                           )}
                                        </div>
                                        <div>
                                           <h3 className="text-base font-bold text-gray-900 tracking-tight line-clamp-1 group-hover:text-[#a20000] transition-colors">
                                              {member.first_name} {member.last_name}
                                           </h3>
                                           <p className="text-xs font-bold text-gray-500 tracking-wide mt-1">
                                              {member.role} • {member.position || member.country || 'Global'}
                                           </p>
                                        </div>
                                     </div>
                                  </div>
                               </Link>
                            ))}
                         </div>
                      ) : (
                         <div className="py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <Users2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm font-bold tracking-wide">No members linked to this organization yet.</p>
                         </div>
                      )}
                   </div>
                )}

               {activeTab === "Bio" && (
                  <div className="max-w-[700px]">
                     <h2 className="text-sm font-bold text-gray-900 tracking-wide mb-6 pb-2 border-b border-gray-100">
                        Academy Bio / History
                     </h2>
                     <p className="text-gray-600 text-base leading-relaxed font-medium">
                        {profile.bio || 'This organization has not completed its full historical biography. Sign up to manage this profile and update details.'}
                     </p>
                  </div>
               )}

               {activeTab === "Achievements" && (
                  <div className="max-w-[700px]">
                     <h2 className="text-sm font-bold text-gray-900 tracking-wide mb-6 pb-2 border-b border-gray-100">
                        Registered Achievements
                     </h2>
                     {profile.achievements && profile.achievements.length > 0 ? (
                        <ul className="space-y-4">
                           {profile.achievements.map((ach: string, i: number) => (
                              <li key={i} className="flex gap-3 text-base text-gray-600">
                                 <Award className="w-5 h-5 text-amber-500 shrink-0" />
                                 <span>{ach}</span>
                              </li>
                           ))}
                        </ul>
                     ) : (
                        <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                           <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                           <p className="text-gray-500 text-sm font-bold tracking-wide">No achievements registered yet.</p>
                        </div>
                     )}
                  </div>
               )}
            </div>
         </main>
         <Footer />
      </div>
   );
}
