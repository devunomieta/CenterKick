"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
   Trophy, 
   Users, 
   Target, 
   TrendingUp, 
   ChevronDown, 
   Settings2, 
   ArrowRight,
   Mail,
   Share2,
   Download,
   Video,
   Newspaper,
   ShoppingBag
} from "lucide-react";

export default function CoachProfilePage() {
   const [activeTab, setActiveTab] = useState("Profile");

   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20">
            {/* Hero Section / Banner based on Image 2 */}
            <div className="relative h-[450px] w-full bg-gray-900 overflow-hidden">
               {/* Background Stadium Overlay */}
               <img 
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale" 
                  alt="Stadium" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent"></div>

               {/* Center Logo/Profile Circle */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pt-24">
                  <div className="w-56 h-56 rounded-full border-8 border-gray-100/10 overflow-hidden relative shadow-2xl z-10">
                     <img 
                        src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop" 
                        className="w-full h-full object-cover" 
                        alt="Coach Wade Warren" 
                     />
                  </div>
                  <div className="mt-8 text-center z-20">
                     <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                        Wade <br /> 
                        <span className="text-[#a20000]">Warren</span>
                     </h1>
                  </div>
               </div>
            </div>

            {/* Tab Navigation Section */}
            <div className="bg-white border-b border-gray-100 shadow-sm sticky top-20 z-40">
               <div className="max-w-[1000px] mx-auto flex items-center justify-between px-4 lg:px-0">
                  <div className="flex overflow-x-auto no-scrollbar py-1">
                     {["Profile", "Bio", "Statistics", "News"].map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={`px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative shrink-0 ${
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
                     <button className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-gray-700" />
                     </button>
                     <button className="bg-[#a20000] hover:bg-[#8a0000] text-white px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                        Hire Coach
                     </button>
                  </div>
               </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-4 lg:px-0 py-16">
               
               {activeTab === "Profile" && (
                  <div className="flex flex-col space-y-24">
                     
                     {/* General Info Section Section based on Image 2 */}
                     <section>
                        <div className="mb-12">
                           <h2 className="text-3xl font-black text-gray-700 uppercase tracking-tighter inline-block relative">
                              General Information About The Coach
                              <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                           </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                           {/* Left: Performance tiles */}
                           <div className="space-y-12">
                              <div className="relative group">
                                 <div className="mb-6">
                                    <h3 className="text-2xl font-black text-[#a20000] uppercase tracking-tight">Performance Status For 2023/2024</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 underline decoration-[#a20000]/20 underline-offset-4 decoration-2">Manager Performance Statistics</p>
                                 </div>
                                 <button className="bg-[#a20000] text-white px-8 py-3 rounded text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#8a0000] transition-all mb-10">
                                    Compare
                                 </button>
                              </div>

                              {/* Stats Indicators Grid based on Image 2 */}
                              <div className="grid grid-cols-2 gap-8">
                                 <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                       <Users className="w-6 h-6 text-[#a20000]" />
                                    </div>
                                    <div>
                                       <span className="text-3xl font-black text-gray-900 block leading-none">56</span>
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Match Managed</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                                       <Target className="w-6 h-6 text-[#a20000]" />
                                    </div>
                                    <div>
                                       <span className="text-3xl font-black text-gray-900 block leading-none">143:<span className="text-[#a20000]">51</span></span>
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Goals For/Against</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                                       <TrendingUp className="w-6 h-6 text-[#a20000]" />
                                    </div>
                                    <div>
                                       <span className="text-3xl font-black text-gray-900 block leading-none">41:<span className="text-[#a20000]">11</span>:4</span>
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">W/D/L Matches</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                                       <Trophy className="w-6 h-6 text-[#a20000]" />
                                    </div>
                                    <div>
                                       <span className="text-3xl font-black text-gray-900 block leading-none">86</span>
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points In League</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Right: Formation Image based on Image 2 */}
                           <div className="relative group">
                              <div className="mb-6 flex items-center justify-between">
                                 <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter underline underline-offset-8 decoration-[#a20000]/30">Formation</h3>
                              </div>
                              <div className="bg-[#1a472a] rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl relative border-4 border-gray-200">
                                 {/* Tactical Field Visualization using SVG/CSS based on Image 2 */}
                                 <div className="absolute inset-0 flex items-center justify-center p-8">
                                    <div className="w-full h-full border-2 border-white/20 rounded-md relative opacity-50">
                                       <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2"></div>
                                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/20 rounded-full w-24 h-24"></div>
                                    </div>
                                 </div>
                                 {/* Players Positioning Overlay */}
                                 <div className="absolute inset-0 grid grid-rows-4 items-center justify-center p-8">
                                    <div className="flex justify-center gap-12">
                                       <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                       <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                    </div>
                                    <div className="flex justify-around px-8">
                                       <div className="w-3 h-3 bg-white rounded-full"></div>
                                       <div className="w-3 h-3 bg-[#a20000] rounded-full ring-4 ring-white shadow-xl"></div>
                                       <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                    <div className="flex justify-around px-12">
                                       <div className="w-3 h-3 bg-white rounded-full"></div>
                                       <div className="w-3 h-3 bg-white rounded-full"></div>
                                       <div className="w-3 h-3 bg-white rounded-full"></div>
                                       <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                    <div className="flex justify-center">
                                       <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
                                    </div>
                                 </div>
                                 <div className="absolute bottom-6 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest block">Main Formation</span>
                                    <span className="text-2xl font-black text-white leading-none">3-4-2-1</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </section>

                     {/* Manager Data Section based on Image 2 */}
                     <section>
                        <div className="mb-12">
                           <h2 className="text-3xl font-black text-gray-700 uppercase tracking-tighter inline-block relative">
                              Manager Data
                              <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                           </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16 border border-gray-100 rounded-3xl p-10 bg-gray-50 shadow-sm">
                           {[
                              { label: "Date Of Birth", value: "Oct 20, 1983" },
                              { label: "Birth Location", value: "Lagos" },
                              { label: "Age", value: "39" },
                              { label: "Height", value: "6.13m" },
                              { label: "Weight", value: "75kg" },
                              { label: "Country Of Residence", value: "Nigeria" },
                              { label: "Title", value: "Manager" },
                              { label: "Club", value: "United Combo" },
                              { label: "Agent", value: "NEF Agency" },
                              { label: "Avg. Points As Mgr", value: "2.17 Points" },
                              { label: "Joined", value: "Sept 20th 2023" },
                              { label: "Contract Expires", value: "Sept 20th 2025" },
                              { label: "Manager License", value: "UEFA Pro License" },
                              { label: "Formation", value: "3-4-2-1" }
                           ].map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between border-b border-gray-200/50 pb-4">
                                 <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                                 <span className="text-[13px] font-black text-gray-900">{item.value}</span>
                              </div>
                           ))}
                        </div>
                     </section>

                     {/* Stat 2022/2023 Section based on Image 2 */}
                     <section>
                        <div className="flex items-center justify-between mb-12">
                           <h2 className="text-3xl font-black text-gray-700 uppercase tracking-tighter inline-block relative">
                              Stat 2022/2023
                              <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                           </h2>
                           <button className="flex items-center gap-2 text-[10px] font-bold text-gray-900 border border-gray-200 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-widest shadow-sm">
                              <Settings2 className="w-4 h-4" /> Search By
                           </button>
                        </div>

                        <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-xl overflow-hidden bg-white">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="bg-[#a20000] text-white">
                                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest">Competition</th>
                                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">Matches</th>
                                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">W</th>
                                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">D</th>
                                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">L</th>
                                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">Goals</th>
                                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-center">PPM</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                 {[
                                    { name: "Nigeria Professional Football League", m: "32", w: "22", d: "7", l: "3", g: "64", p: "2.19" },
                                    { name: "Nigeria National League", m: "12", w: "8", d: "0", l: "1", g: "31", p: "2.00" },
                                    { name: "CAF Champions League", m: "8", w: "6", d: "1", l: "1", g: "12", p: "2.38" }
                                 ].map((row, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                                       <td className="px-8 py-6">
                                          <div className="flex items-center gap-3">
                                             <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200"></div>
                                             <span className="text-[13px] font-black text-gray-800">{row.name}</span>
                                          </div>
                                       </td>
                                       <td className="px-6 py-8 text-[13px] font-bold text-gray-600 text-center">{row.m}</td>
                                       <td className="px-6 py-8 text-[13px] font-bold text-gray-600 text-center">{row.w}</td>
                                       <td className="px-6 py-8 text-[13px] font-bold text-gray-600 text-center">{row.d}</td>
                                       <td className="px-6 py-8 text-[13px] font-bold text-gray-600 text-center">{row.l}</td>
                                       <td className="px-6 py-8 text-[13px] font-black text-[#a20000] text-center">{row.g}</td>
                                       <td className="px-8 py-8 text-[13px] font-black text-gray-900 text-center">{row.p}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </section>

                     {/* Career History Section based on Image 2 */}
                     <section>
                        <div className="mb-12">
                           <h2 className="text-3xl font-black text-gray-700 uppercase tracking-tighter inline-block relative">
                              Career History
                              <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                           </h2>
                        </div>

                        <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-xl overflow-hidden bg-white">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="bg-gray-900 text-white">
                                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest">Club & Role</th>
                                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">Appointed</th>
                                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">Until</th>
                                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-widest text-center">Matches</th>
                                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-center">PPM</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                 {[
                                    { club: "United Combo", role: "Manager", from: "Sept 20, 2023", to: "Expected Jun 30, 2025", matches: "56", ppm: "2.19" },
                                    { club: "Lagos Rangers", role: "Head Coach", from: "Jan 1, 2022", to: "Sept 15, 2023", matches: "82", ppm: "1.98" },
                                    { club: "Vandrezzer FC", role: "Assistant Mgr", from: "Jun 1, 2020", to: "Dec 31, 2021", matches: "142", ppm: "2.38" }
                                 ].map((row, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50 cursor-pointer">
                                       <td className="px-8 py-6">
                                          <div className="flex flex-col">
                                             <span className="text-[13px] font-black text-gray-900">{row.club}</span>
                                             <span className="text-[10px] font-bold text-[#a20000] uppercase tracking-widest">{row.role}</span>
                                          </div>
                                       </td>
                                       <td className="px-6 py-8 text-[12px] font-medium text-gray-500 text-center">{row.from}</td>
                                       <td className="px-6 py-8 text-[12px] font-medium text-gray-500 text-center">{row.to}</td>
                                       <td className="px-6 py-8 text-[13px] font-bold text-gray-600 text-center">{row.matches}</td>
                                       <td className="px-8 py-8 text-[13px] font-black text-gray-900 text-center">{row.ppm}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </section>

                  </div>
               )}

               {activeTab === "Bio" && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="mb-12">
                        <h2 className="text-3xl font-black text-gray-700 uppercase tracking-tighter inline-block relative">
                           The Manager's Story
                           <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                        </h2>
                     </div>
                     <div className="prose prose-lg text-gray-600 max-w-none space-y-6 font-medium leading-[2]">
                        <p>Meet Wade Warren, a strategic visionary and one of the most respected managers in modern football. With a career spanning over 15 years, Wade has built a reputation for developing high-intensity tactical systems and nurturing world-class talent from the grassroots level.</p>
                        <p>His philosophy revolves around aggressive pressing and tactical flexibility, having successfully implemented diverse formations across different leagues. Wade's appointment at United Combo marked a turning point for the club, leading them to a record-breaking season with over 2.0 points per match.</p>
                        <p>Beyond the pitch, Wade is a licensed UEFA Pro professional who values discipline, psychological preparation, and data-driven decision making. He continues to inspire coaches across the continent with his modern approach to the beautiful game.</p>
                     </div>
                  </div>
               )}

               {activeTab === "Statistics" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="mb-12">
                        <h2 className="text-3xl font-black text-gray-700 uppercase tracking-tighter inline-block relative">
                           Detailed Match Records
                           <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                        </h2>
                     </div>
                     <div className="bg-gray-50 h-96 rounded-3xl border border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center space-y-4">
                           <TrendingUp className="w-12 h-12 text-gray-300 mx-auto" />
                           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Full Statistic Charts arriving soon...</p>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === "News" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                           <div className="relative h-48 overflow-hidden">
                              <img src={`https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop&sig=${item}`} alt="News" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute top-4 left-4 bg-[#a20000] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                                 Manager Insights
                              </div>
                           </div>
                           <div className="p-8">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Jan 12, 2024</span>
                              <h3 className="text-xl font-black text-gray-900 leading-[1.2] mb-4 group-hover:text-[#a20000] transition-colors">
                                 How Wade Warren Transformed United Combo's Defense
                              </h3>
                              <p className="text-sm text-gray-600 font-medium line-clamp-2 mb-6">
                                 A deep dive into the tactical shift that led to a 15-match unbeaten streak under the new management...
                              </p>
                              <div className="flex items-center text-[10px] font-black text-[#a20000] uppercase tracking-widest group-hover:gap-4 transition-all">
                                 Read More <ArrowRight className="w-4 h-4" />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

            </div>

            {/* Support Message / CTA Section */}
            <div className="bg-[#fcfafa] py-24 mb-10 w-full overflow-hidden relative">
               <div className="max-w-[1000px] mx-auto px-4 lg:px-0">
                  <div className="bg-gray-950 rounded-[40px] shadow-2xl relative text-center py-24 px-8 border-[12px] border-gray-900">
                     <span className="text-[#a20000] text-[10px] font-black uppercase tracking-[0.3em] mt-6 block mb-4">
                        Join CenterKick
                     </span>
                     <h2 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter uppercase leading-tight drop-shadow-2xl">
                        Design a profile to <br />
                        <span className="text-[#a20000]">Showcase Your Talent NOW</span>
                     </h2>

                     <button className="bg-white text-gray-900 hover:text-[#a20000] font-black text-xs uppercase tracking-[0.2em] px-12 py-5 rounded-2xl shadow-xl hover:shadow-[0_20px_40px_rgba(162,0,0,0.2)] transition-all inline-flex items-center gap-4 group">
                        Get Started <ArrowRight className="w-5 h-5 text-[#a20000] group-hover:translate-x-2 transition-transform" />
                     </button>
                  </div>
               </div>
            </div>

         </main>

         <Footer />
      </div>
   );
}
