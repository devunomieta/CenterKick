"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
   Briefcase, 
   Users, 
   Globe, 
   TrendingUp, 
   ArrowRight,
   Mail,
   Share2,
   Download,
   CheckCircle2,
   DollarSign,
   Award,
   ExternalLink,
   ChevronRight
} from "lucide-react";
import Link from 'next/link';

export default function AgentProfilePage() {
   const [activeTab, setActiveTab] = useState("Portfolio");

   // Sample Managed Talent
   const MANAGED_TALENT = [
      { id: 1, name: "Samuel Ejoor", type: "Player", position: "Forward", marketValue: "€12.5M", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=200&auto=format&fit=crop" },
      { id: 2, name: "Wade Warren", type: "Coach", position: "Manager", marketValue: "N/A", image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=200&auto=format&fit=crop" },
      { id: 3, name: "Bamidele Adeniyi", type: "Player", position: "Midfielder", marketValue: "€8.2M", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200&auto=format&fit=crop" },
      { id: 4, name: "Yemi Daniel", type: "Player", position: "Defender", marketValue: "€4.1M", image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=200&auto=format&fit=crop" }
   ];

   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20">
            {/* Header / Hero Section */}
            <div className="relative h-[500px] w-full bg-[#0a0a0a] overflow-hidden">
               <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,#a20000,transparent)]"></div>
               </div>

               <div className="max-w-[1200px] mx-auto px-4 lg:px-0 h-full flex items-center gap-12 relative z-10">
                  {/* Portrait */}
                  <div className="relative group shrink-0">
                     <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-[48px] overflow-hidden border-4 border-white/5 shadow-2xl transition-all duration-700 group-hover:rounded-[24px]">
                        <img 
                           src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" 
                           className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                           alt="Alexander Sterling" 
                        />
                     </div>
                     <div className="absolute -bottom-4 -right-4 bg-[#a20000] p-4 rounded-2xl shadow-xl">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                     </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-6">
                     <span className="text-[#a20000] font-black text-xs uppercase tracking-[0.4em] block">Certified Lead Agent</span>
                     <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                        Alexander <br />
                        <span className="text-[#a20000]">Sterling</span>
                     </h1>
                     <div className="flex flex-wrap items-center gap-8 text-white/60 pt-4">
                        <div className="flex items-center gap-2">
                           <Briefcase className="w-4 h-4 text-[#a20000]" />
                           <span className="text-xs font-bold uppercase tracking-widest">Apex Sports Management</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Globe className="w-4 h-4 text-[#a20000]" />
                           <span className="text-xs font-bold uppercase tracking-widest">Global Operations</span>
                        </div>
                     </div>
                  </div>

                  {/* CTA */}
                  <div className="hidden lg:flex flex-col gap-4 shrink-0">
                     <button className="bg-white text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#a20000] hover:text-white transition-all shadow-xl">
                        Schedule Consultation
                     </button>
                     <div className="flex gap-4">
                        <button className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all">
                           <Share2 className="w-4 h-4 text-white mx-auto" />
                        </button>
                        <button className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all">
                           <Mail className="w-4 h-4 text-white mx-auto" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="bg-gray-50 border-y border-gray-100 py-12">
               <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                     <div className="text-center md:text-left">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Total Transfers</span>
                        <span className="text-4xl font-black text-gray-900 leading-none">128+</span>
                     </div>
                     <div className="text-center md:text-left border-l border-gray-200 md:pl-12">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Managed Talent</span>
                        <span className="text-4xl font-black text-gray-900 leading-none">42</span>
                     </div>
                     <div className="text-center md:text-left border-l border-gray-200 md:pl-12">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Portfolio Value</span>
                        <span className="text-4xl font-black text-[#a20000] leading-none">€145M</span>
                     </div>
                     <div className="text-center md:text-left border-l border-gray-200 md:pl-12">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Success Rate</span>
                        <span className="text-4xl font-black text-gray-900 leading-none">94%</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white border-b border-gray-100 sticky top-20 z-40 shadow-sm overflow-x-auto no-scrollbar">
               <div className="max-w-[1200px] mx-auto flex items-center gap-12 h-20 px-4 lg:px-0">
                  {["Portfolio", "Bio", "History", "News"].map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[10px] font-black uppercase tracking-[0.25em] h-full relative transition-all ${
                           activeTab === tab ? "text-[#a20000]" : "text-gray-400 hover:text-gray-900"
                        }`}
                     >
                        {tab}
                        {activeTab === tab && (
                           <span className="absolute bottom-0 left-0 w-full h-1 bg-[#a20000] rounded-t-full shadow-[0_-4px_10px_rgba(162,0,0,0.3)]"></span>
                        )}
                     </button>
                  ))}
               </div>
            </div>

            {/* Content Area */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 py-20">
               
               {activeTab === "Portfolio" && (
                  <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Managed Talent Portfolio</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                           <Users className="w-4 h-4" /> 42 Total Profiles
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {MANAGED_TALENT.map((talent) => (
                           <div key={talent.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                              <div className="relative aspect-[3/4] overflow-hidden">
                                 <img src={talent.image} alt={talent.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                 <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl">
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">{talent.type}</span>
                                 </div>
                              </div>
                              <div className="p-6">
                                 <h3 className="text-lg font-black text-gray-900 group-hover:text-[#a20000] transition-colors mb-1">{talent.name}</h3>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{talent.position}</p>
                                 <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-sm font-black text-gray-900">{talent.marketValue}</span>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#a20000] group-hover:translate-x-1 transition-all" />
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>

                     <button className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold uppercase tracking-widest text-xs hover:border-[#a20000] hover:text-[#a20000] transition-all">
                        View Full Portfolio (42)
                     </button>
                  </div>
               )}

               {activeTab === "Bio" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="lg:col-span-2 space-y-12">
                        <div>
                           <h2 className="text-3xl font-black text-gray-700 uppercase tracking-tighter inline-block relative border-b-4 border-[#a20000] pb-2">
                              Agent's Philosophy
                           </h2>
                        </div>
                        <div className="prose prose-xl text-gray-500 font-medium leading-[1.8]">
                           <p>Alexander Sterling is a visionary in the sports management landscape, known for his relentless pursuit of excellence and his deep-rooted connections across European and African football. With over a decade of experience, Alexander has successfully navigated some of the most complex transfer negotiations in recent history.</p>
                           <p>His approach is centered on holistic development, ensuring that every athlete and coach under his wing is not only achieving peak performance on the pitch but is also building a sustainable professional brand for the long term.</p>
                           <p>As the founder of Apex Sports Management, Alexander has built a team of specialized scouts and legal experts dedicated to protecting the interests of the next generation of football stars.</p>
                        </div>
                     </div>
                     <div className="space-y-8">
                        <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100 shadow-sm">
                           <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Affiliations</h3>
                           <div className="space-y-6">
                              {[
                                 { label: "License", value: "FIFA Licensed Agent" },
                                 { label: "Agency", value: "Apex Sports Mgmt" },
                                 { label: "Regions", value: "EU, UK, Africa" },
                                 { label: "Languages", value: "Eng, Fra, Spa" }
                              ].map((item, i) => (
                                 <div key={i}>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{item.label}</span>
                                    <span className="text-sm font-black text-gray-900">{item.value}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="bg-[#a20000] rounded-[40px] p-10 text-white shadow-xl">
                           <Award className="w-8 h-8 mb-6 opacity-50" />
                           <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Accredited Member</h3>
                           <p className="text-white/70 text-sm font-medium leading-relaxed mb-6">Verified by international football governing bodies and the CenterKick network.</p>
                           <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === "History" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="mb-12">
                        <h2 className="text-3xl font-black text-gray-700 uppercase tracking-tighter">Deal History</h2>
                     </div>
                     
                     <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="bg-gray-50 border-b border-gray-100">
                                 <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                                 <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Talent</th>
                                 <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction</th>
                                 <th className="px-6 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Value</th>
                                 <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {[
                                 { date: "Jan 12, 2024", talent: "Samuel Ejoor", deal: "Transfer to United Combo", value: "€3.5M", status: "Completed" },
                                 { date: "Aug 28, 2023", talent: "Wade Warren", deal: "Contract Appt. at Lagos FC", value: "Private", status: "Completed" },
                                 { date: "Jul 15, 2023", talent: "Bamidele Adeniyi", deal: "Pre-Season Placement", value: "N/A", status: "Verified" }
                              ].map((row, i) => (
                                 <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{row.date}</td>
                                    <td className="px-6 py-8 text-sm font-black text-gray-900 group-hover:text-[#a20000]">{row.talent}</td>
                                    <td className="px-6 py-8 text-sm font-bold text-gray-500">{row.deal}</td>
                                    <td className="px-6 py-8 text-sm font-black text-gray-900 text-center">{row.value}</td>
                                    <td className="px-10 py-8 text-right">
                                       <span className="px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">
                                          {row.status}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {activeTab === "News" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="group cursor-pointer">
                           <div className="relative aspect-video rounded-[32px] overflow-hidden mb-6 block border border-gray-100 shadow-sm">
                              <img src={`https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop&sig=${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="News" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                           </div>
                           <span className="text-[#a20000] text-[9px] font-black uppercase tracking-[0.25em] mb-4 block">International News</span>
                           <h3 className="text-2xl font-black text-gray-900 leading-tight mb-4 group-hover:text-[#a20000] transition-colors line-clamp-2">
                              Sterling Negotiates Record-Breaking Deal for Emerging Talent
                           </h3>
                           <div className="flex items-center gap-4 text-gray-400">
                              <span className="text-[10px] font-bold uppercase tracking-widest">January 15, 2024</span>
                              <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                              <span className="text-[10px] font-bold uppercase tracking-widest italic">3 min read</span>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

            </div>

            {/* Bottom CTA Overlay Banner */}
            <div className="bg-[#a20000] py-24 mb-10 mx-4 lg:mx-0 rounded-none lg:rounded-[100px] shadow-[0_40px_80px_rgba(162,0,0,0.3)] relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="grid grid-cols-12 h-full">
                     {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="border-r border-white/40 h-full"></div>
                     ))}
                  </div>
               </div>
               
               <div className="max-w-[1000px] mx-auto px-4 text-center relative z-10">
                  <h2 className="text-4xl lg:text-5xl font-black text-white mb-10 tracking-tighter uppercase leading-tight">
                     Professional representation <br />
                     <span className="opacity-60">Is just a few clicks away.</span>
                  </h2>
                  <div className="flex flex-wrap justify-center gap-6">
                     <button className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-2xl">
                        Contact Agency
                     </button>
                     <Link href="/login">
                        <button className="bg-black/20 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                           Create Member Bio
                        </button>
                     </Link>
                  </div>
               </div>
            </div>

         </main>

         <Footer />
      </div>
   );
}
