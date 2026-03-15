'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Facebook, Instagram, Twitter, Settings2 } from "lucide-react";
import { useState } from "react";

export default function PlayerProfilePage({ params }: { params: { id: string } }) {
   const [activeTab, setActiveTab] = useState("Profile");

   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20">
            {/* Premium Custom Player Header */}
            <div className="relative w-full h-[350px] md:h-[450px] bg-[#0a0a0b] flex overflow-hidden group">
               {/* Immersive Stadium Background with Gradients */}
               <div className="absolute inset-0 z-0">
                  <img
                     src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop"
                     className="w-full h-full object-cover object-center opacity-30 scale-105 group-hover:scale-100 transition-transform duration-1000"
                     alt="stadium background"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#b50a0a]/40 via-transparent to-[#0a0a0b] lg:to-transparent lg:bg-gradient-to-r lg:from-[#b50a0a]/30 lg:via-background/5 lg:to-[#0a0a0b]/90"></div>
                  <div className="absolute inset-0 bg-[#0a0a0b]/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent"></div>
               </div>

               <div className="max-w-[1200px] mx-auto w-full h-full relative flex px-4 lg:px-0">
                  {/* Player Hero Image with Glow */}
                  <div className="w-[40%] h-full relative flex items-end justify-center">
                     <div className="absolute bottom-0 w-[120%] h-[80%] bg-[#b50a0a]/20 blur-[100px] rounded-full"></div>
                     <img
                        src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=600&auto=format&fit=crop"
                        alt="Samuel Ejoor"
                        className="h-[105%] w-auto object-cover object-top drop-shadow-[0_20px_50px_rgba(181,10,10,0.3)] relative z-10 transition-transform duration-500 hover:scale-105"
                     />
                  </div>

                  {/* Player Name and Floating Stats */}
                  <div className="w-[60%] flex flex-col justify-center items-start pl-8 md:pl-16 text-white z-20">
                     <div className="flex flex-col mb-8">
                        <span className="text-[#ff4d4d] font-bold tracking-[0.4em] uppercase mb-3 text-xs md:text-sm drop-shadow-sm">Elite Forward</span>
                        <h1 className="flex flex-col leading-none drop-shadow-2xl">
                           <span className="text-4xl md:text-7xl font-black uppercase tracking-tight">Samuel</span>
                           <span className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white">Ejoor</span>
                        </h1>
                     </div>

                     <div className="flex gap-4 mb-10 flex-wrap">
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl flex flex-col hover:bg-white/10 transition-colors shadow-2xl">
                           <span className="text-[9px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-1">Jersey</span>
                           <span className="text-xl font-black text-white">#10</span>
                        </div>
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl flex flex-col hover:bg-white/10 transition-colors shadow-2xl">
                           <span className="text-[9px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-1">Market Value</span>
                           <span className="text-xl font-black text-[#ff4d4d]">$12M</span>
                        </div>
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 px-6 py-3.5 rounded-2xl flex flex-col hover:bg-white/10 transition-colors shadow-2xl">
                           <span className="text-[9px] uppercase font-bold text-gray-400 tracking-[0.2em] mb-1">Main Foot</span>
                           <span className="text-xl font-black text-white">Right</span>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full border border-white/30 p-2 overflow-hidden bg-white/5 backdrop-blur-sm">
                              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kano_Pillars_FC_logo.svg/1200px-Kano_Pillars_FC_logo.svg.png" className="w-full h-full object-contain" alt="Club" />
                           </div>
                           <span className="font-bold tracking-widest text-sm uppercase">SV Seekirchen</span>
                        </div>
                        <div className="h-6 w-[1px] bg-white/20"></div>
                        <div className="flex items-center gap-4">
                           <Facebook className="w-4 h-4 cursor-pointer hover:text-[#b50a0a] transition-colors" />
                           <Instagram className="w-4 h-4 cursor-pointer hover:text-[#b50a0a] transition-colors" />
                           <Twitter className="w-4 h-4 cursor-pointer hover:text-[#b50a0a] transition-colors" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Light Integrated Navigation */}
            <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
               <div className="max-w-[700px] mx-auto px-4 lg:px-0">
                  <div className="flex items-center justify-between overflow-x-auto [&::-webkit-scrollbar]:hidden pt-5 pb-0">
                     {[
                        "Profile",
                        "Career Stat.",
                        "Gallery",
                        "News",
                        "Shop"
                     ].map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={`relative text-[12px] font-bold uppercase tracking-widest whitespace-nowrap pb-4 px-2 hover:text-[#b50a0a] transition-colors ${activeTab === tab ? 'text-[#b50a0a] font-black' : 'text-gray-500'}`}
                        >
                           {tab}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-4 lg:px-0 py-16">
               {/* =========================================
                   TAB CONTENT: Profile
                   ========================================= */}
               {activeTab === "Profile" && (
                  <div className="flex flex-col">
                     {/* =========================================
                         BIO & HONOURS SECTION
                         ========================================= */}
                     <div className="mb-16 pb-16 border-b border-gray-100 flex flex-col lg:flex-row gap-16 lg:gap-24">
                        {/* Bio Content - Left Side */}
                        <div className="w-full lg:w-[60%]">
                           <div className="mb-8">
                              <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                                 Bio
                                 <span className="absolute -bottom-3 left-0 w-8 border-b-2 border-gray-300"></span>
                              </h2>
                           </div>
                           
                           <div className="space-y-4 text-[13px] leading-relaxed text-gray-600 font-medium mb-8">
                              <p>Meet Anthony Victor, One Of The Most Talented And Accomplished Footballers Of Our Time. Born And Raised In Lagos State, Nigeria, Anthony Victor Developed A Love For The Beautiful Game At An Early Age And Quickly Became Known For His Exceptional Skills On The Field.</p>
                              <p>After Joining The Local Youth Team, Anthony Victor Quickly Rose Through The Ranks And Caught The Attention Of Scouts From Several Professional Clubs. In 2020, Anthony Victor Signed His First Professional Contract With Vandrezzer FC, Beginning What Would Become A Truly Remarkable Career.</p>
                           </div>
                           
                           <button className="bg-[#a20000] hover:bg-[#8a0000] text-white text-[11px] font-bold uppercase tracking-widest px-8 py-3.5 rounded transition-colors shadow-md">
                              Read More
                           </button>
                        </div>

                        {/* Honours - Right Side */}
                        <div className="w-full lg:w-[40%]">
                           <div className="mb-8 lg:pl-4">
                              <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                                 Honours
                                 <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                              </h2>
                           </div>

                           <div className="flex flex-col gap-4 lg:pl-4">
                              <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow group">
                                 <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png" alt="Trophy 20/21" className="w-10 h-10 object-contain drop-shadow-sm" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[14px] font-black text-gray-900">League Champion</span>
                                    <span className="text-[11px] font-bold text-gray-500 tracking-wider">SEASON 20/21</span>
                                 </div>
                              </div>

                              <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow group">
                                 <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png" alt="Trophy 21/22" className="w-10 h-10 object-contain drop-shadow-sm" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[14px] font-black text-gray-900">Cup Winner</span>
                                    <span className="text-[11px] font-bold text-gray-500 tracking-wider">SEASON 21/22</span>
                                 </div>
                              </div>

                              <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow group">
                                 <div className="w-16 h-16 bg-[#b50a0a]/5 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-[#b50a0a]/20 shrink-0">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png" alt="Trophy 22/23" className="w-10 h-10 object-contain drop-shadow-sm" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[14px] font-black text-[#a20000]">Player of the Year</span>
                                    <span className="text-[11px] font-bold text-[#b50a0a]/70 tracking-wider">SEASON 22/23</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                        {/* Left Column: Player Data */}
                        <div className="w-full lg:w-[45%]">
                           <div className="mb-10">
                              <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                                 Player Data
                                 <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                              </h2>
                           </div>

                           <div className="space-y-6">
                              <div className="flex">
                                 <span className="w-1/3 text-[13px] font-bold text-gray-500">Date Of Birth</span>
                                 <span className="w-2/3 text-[14px] font-black text-gray-900">Oct 20, 2001</span>
                              </div>
                              <div className="flex">
                                 <span className="w-1/3 text-[13px] font-bold text-gray-500">Place Of Birth</span>
                                 <span className="w-2/3 text-[14px] font-black text-gray-900">Lagos</span>
                              </div>
                              <div className="flex">
                                 <span className="w-1/3 text-[13px] font-bold text-gray-500">Age</span>
                                 <span className="w-2/3 text-[14px] font-black text-gray-900">21</span>
                              </div>
                              <div className="flex">
                                 <span className="w-1/3 text-[13px] font-bold text-gray-500">Height</span>
                                 <span className="w-2/3 text-[14px] font-black text-gray-900">6.13m</span>
                              </div>
                              <div className="flex">
                                 <span className="w-1/3 text-[13px] font-bold text-gray-500">Weight</span>
                                 <span className="w-2/3 text-[14px] font-black text-gray-900">70kg</span>
                              </div>
                              <div className="flex">
                                 <span className="w-1/3 text-[13px] font-bold text-gray-500">Citizenship</span>
                                 <span className="w-2/3 text-[14px] font-black text-gray-900">Nigeria</span>
                              </div>
                              <div className="flex">
                                 <span className="w-1/3 text-[13px] font-bold text-gray-500">Position</span>
                                 <span className="w-2/3 text-[14px] font-black text-gray-900">Attack</span>
                              </div>
                           </div>
                        </div>

                        {/* Right Column: Position & Maps */}
                        <div className="w-full lg:w-[55%]">
                           <div className="mb-10 lg:pl-4">
                              <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                                 Position
                                 <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                              </h2>
                           </div>

                           <div className="w-full max-w-[400px] mb-8 relative bg-white border border-[#b50a0a]/30 p-2 rounded rounded-xl shadow-sm">
                              <svg viewBox="0 0 400 250" className="w-full h-auto text-[#b50a0a]/40" fill="none" stroke="currentColor" strokeWidth="2">
                                 <rect x="10" y="10" width="380" height="230"></rect>
                                 <line x1="200" y1="10" x2="200" y2="240"></line>
                                 <circle cx="200" cy="125" r="30"></circle>
                                 <rect x="10" y="55" width="60" height="140"></rect>
                                 <rect x="330" y="55" width="60" height="140"></rect>
                              </svg>
                              <div className="absolute top-[30%] left-[20%] w-4 h-4 bg-[#b50a0a]/60 rounded-full shadow-sm"></div>
                              <div className="absolute top-[50%] left-[8%] w-8 h-8 bg-[#b50a0a] rounded-full shadow-md border-2 border-white -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"></div>
                           </div>

                           <div className="mb-6">
                              <h3 className="text-[13px] font-bold text-gray-500 mb-2 border-b-2 border-gray-100 pb-1 inline-block">Position</h3>
                              <p className="text-[14px] font-black text-gray-900">Center Forward</p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* =========================================
                   TAB CONTENT: Career Stat.
                   ========================================= */}
               {activeTab === "Career Stat." && (
                  <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-500">

                     {/* STAT 2022/2023 */}
                     <div>
                        <div className="flex items-center justify-between mb-8">
                           <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                              Stat 2022/2023
                           </h2>
                           <button className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-900 uppercase tracking-widest bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors border border-gray-200">
                              <Settings2 className="w-4 h-4" /> Search By
                           </button>
                        </div>
                        <div className="w-full overflow-x-auto shadow-sm rounded-lg border border-gray-100">
                           <table className="w-full text-left border-collapse min-w-[800px] bg-white">
                              <thead>
                                 <tr className="bg-[#a20000] border-b border-[#a20000]">
                                    <th className="font-bold text-[10px] text-white uppercase px-6 py-4"></th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Appearances</th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Min. Played</th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Goals</th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Assists</th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">YC</th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">RC</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr className="border-b border-gray-100 group hover:bg-gray-50">
                                    <td className="px-6 py-5">
                                       <div className="flex items-center gap-4">
                                          <div className="w-6 h-6 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center p-0.5 border border-gray-100">
                                             <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kano_Pillars_FC_logo.svg/1200px-Kano_Pillars_FC_logo.svg.png" className="w-full h-full object-contain" alt="Club" />
                                          </div>
                                          <span className="font-bold text-[12px] text-gray-900">SV Seekirchen</span>
                                       </div>
                                    </td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">10</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">800</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">2</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                 </tr>
                                 <tr className="border-b border-gray-100 group hover:bg-gray-50">
                                    <td className="px-6 py-5">
                                       <div className="flex items-center gap-4">
                                          <div className="w-6 h-6 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center p-0.5 border border-gray-100">
                                             <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Enyimba_International_F.C._logo.png/1200px-Enyimba_International_F.C._logo.png" className="w-full h-full object-contain" alt="Club" />
                                          </div>
                                          <span className="font-bold text-[12px] text-gray-900">Regionalliga Salzburg</span>
                                       </div>
                                    </td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">8</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">450</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">0</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                 </tr>
                                 <tr className="group hover:bg-gray-50">
                                    <td className="px-6 py-5">
                                       <span className="font-bold text-[12px] text-gray-900 pl-10">Cup</span>
                                    </td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">2</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">150</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>
                     </div>

                     {/* STAT 2021/2022 */}
                     <div>
                        <div className="flex items-center justify-between mb-8">
                           <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                              Stat 2021/2022
                           </h2>
                           <button className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-900 uppercase tracking-widest bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors border border-gray-200">
                              <Settings2 className="w-4 h-4" /> Search By
                           </button>
                        </div>
                        <div className="w-full overflow-x-auto shadow-sm rounded-lg border border-gray-100">
                           <table className="w-full text-left border-collapse min-w-[800px] bg-white">
                              <thead>
                                 <tr className="bg-[#a20000] border-b border-[#a20000]">
                                    <th className="font-bold text-[10px] text-white uppercase px-6 py-4"></th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Appearances</th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Min. Played</th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Goals</th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Assists</th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">YC</th>
                                    <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">RC</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr className="border-b border-gray-100 group hover:bg-gray-50">
                                    <td className="px-6 py-5">
                                       <span className="font-bold text-[12px] text-gray-900 pl-10">FootyFanz United</span>
                                    </td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">20</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1200</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">7</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">5</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">3</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                 </tr>
                                 <tr className="border-b border-gray-100 group hover:bg-gray-50">
                                    <td className="px-6 py-5">
                                       <span className="font-bold text-[12px] text-gray-900 pl-10">Footy League</span>
                                    </td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">15</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">845</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">5</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">3</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">2</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                 </tr>
                                 <tr className="border-b border-gray-100 group hover:bg-gray-50">
                                    <td className="px-6 py-5">
                                       <span className="font-bold text-[12px] text-gray-900 pl-10">FA Cup</span>
                                    </td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">5</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">355</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">2</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">3</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                 </tr>
                                 <tr className="bg-[#a20000] border-b border-[#920000]">
                                    <td className="px-6 py-5">
                                       <span className="font-black text-[12px] text-white pl-10">Nigeria National U20</span>
                                    </td>
                                    <td className="font-bold text-[13px] text-white text-center px-4 py-5">4</td>
                                    <td className="font-bold text-[13px] text-white text-center px-4 py-5">235</td>
                                    <td className="font-bold text-[13px] text-white text-center px-4 py-5">1</td>
                                    <td className="font-bold text-[13px] text-white text-center px-4 py-5">2</td>
                                    <td className="font-bold text-[13px] text-[#ffbaba] text-center px-4 py-5">-</td>
                                    <td className="font-bold text-[13px] text-[#ffbaba] text-center px-4 py-5">-</td>
                                 </tr>
                                 <tr className="border-b border-gray-100 group hover:bg-gray-50">
                                    <td className="px-6 py-5">
                                       <span className="font-bold text-[12px] text-gray-900 pl-10">WafuB April 2022</span>
                                    </td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">3</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">105</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                 </tr>
                                 <tr className="group hover:bg-gray-50">
                                    <td className="px-6 py-5">
                                       <span className="font-bold text-[12px] text-gray-900 pl-10">International Friendly</span>
                                    </td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">100</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                                    <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                    <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                  </tr>
                               </tbody>
                            </table>
                         </div>
                      </div>

                      {/* STAT 2020/2021 */}
                      <div>
                         <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                               Stat 2020/2021
                            </h2>
                            <button className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-900 uppercase tracking-widest bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors border border-gray-200">
                               <Settings2 className="w-4 h-4" /> Search By
                            </button>
                         </div>
                         <div className="w-full overflow-x-auto shadow-sm rounded-lg border border-gray-100">
                            <table className="w-full text-left border-collapse min-w-[800px] bg-white">
                               <thead>
                                  <tr className="bg-[#a20000] border-b border-[#a20000]">
                                     <th className="font-bold text-[10px] text-white uppercase px-6 py-4"></th>
                                     <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Appearances</th>
                                     <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Min. Played</th>
                                     <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Goals</th>
                                     <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">Assists</th>
                                     <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">YC</th>
                                     <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center basis-[12%]">RC</th>
                                  </tr>
                               </thead>
                               <tbody>
                                  <tr className="border-b border-gray-100 group hover:bg-gray-50">
                                     <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                           <div className="w-6 h-6 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center p-0.5 border border-gray-100">
                                              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kano_Pillars_FC_logo.svg/1200px-Kano_Pillars_FC_logo.svg.png" className="w-full h-full object-contain" alt="Club" />
                                           </div>
                                           <span className="font-bold text-[12px] text-gray-900">SV Seekirchen</span>
                                        </div>
                                     </td>
                                     <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">15</td>
                                     <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1200</td>
                                     <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">8</td>
                                     <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">4</td>
                                     <td className="font-medium text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                                     <td className="font-medium text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                                  </tr>
                               </tbody>
                            </table>
                         </div>
                      </div>
                      
                      {/* TRANSFER HISTORY */}
                      <div>
                         <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                               Transfer History
                            </h2>
                         </div>
                         <div className="w-full overflow-x-auto shadow-sm rounded-lg border border-gray-100">
                            <table className="w-full text-left border-collapse min-w-[800px] bg-white">
                               <thead>
                                  <tr className="bg-[#a20000] border-b border-[#a20000]">
                                     <th className="font-bold text-[10px] text-white uppercase px-6 py-4">Season</th>
                                     <th className="font-bold text-[10px] text-white uppercase px-4 py-4">Date</th>
                                     <th className="font-bold text-[10px] text-white uppercase px-4 py-4">Left</th>
                                     <th className="font-bold text-[10px] text-white uppercase px-4 py-4">Joined</th>
                                     <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-right">Fee</th>
                                  </tr>
                               </thead>
                               <tbody>
                                  <tr className="border-b border-gray-100 group hover:bg-gray-50">
                                     <td className="px-6 py-5 font-bold text-[12px] text-gray-900">22/23</td>
                                     <td className="px-4 py-5 text-[13px] text-gray-500">Jul 1, 2022</td>
                                     <td className="px-4 py-5">
                                        <div className="flex items-center gap-3">
                                           <div className="flex -space-x-2">
                                              <div className="w-6 h-6 rounded-full border border-white bg-white shadow-sm p-0.5 z-10">
                                                 <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kano_Pillars_FC_logo.svg/1200px-Kano_Pillars_FC_logo.svg.png" className="w-full h-full object-contain" alt="Club" />
                                              </div>
                                           </div>
                                           <span className="font-bold text-[12px] text-gray-900">SV Seekirchen</span>
                                        </div>
                                     </td>
                                     <td className="px-4 py-5">
                                        <div className="flex items-center gap-3">
                                           <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400">
                                              N/A
                                           </div>
                                           <span className="font-bold text-[12px] text-gray-900">Unknown</span>
                                        </div>
                                     </td>
                                     <td className="px-4 py-5 text-[13px] font-medium text-gray-500 text-right">-</td>
                                  </tr>
                                  <tr className="border-b border-gray-100 group hover:bg-gray-50">
                                     <td className="px-6 py-5 font-bold text-[12px] text-gray-900">21/22</td>
                                     <td className="px-4 py-5 text-[13px] text-gray-500">Jan 1, 2022</td>
                                     <td className="px-4 py-5">
                                        <div className="flex items-center gap-3">
                                           <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-400">
                                              N/A
                                           </div>
                                           <span className="font-bold text-[12px] text-gray-900">Unknown</span>
                                        </div>
                                     </td>
                                     <td className="px-4 py-5">
                                        <div className="flex items-center gap-3">
                                           <div className="flex -space-x-2">
                                              <div className="w-6 h-6 rounded-full border border-white bg-white shadow-sm p-0.5 z-10">
                                                 <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kano_Pillars_FC_logo.svg/1200px-Kano_Pillars_FC_logo.svg.png" className="w-full h-full object-contain" alt="Club" />
                                              </div>
                                           </div>
                                           <span className="font-bold text-[12px] text-gray-900">SV Seekirchen</span>
                                        </div>
                                     </td>
                                     <td className="px-4 py-5 text-[13px] font-medium text-gray-500 text-right">Free Transfer</td>
                                  </tr>
                               </tbody>
                            </table>
                         </div>
                      </div>

                   </div>
                )}

                {/* =========================================
                    TAB CONTENT: Gallery
                    ========================================= */}
                {activeTab === "Gallery" && (
                   <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* Video Highlight */}
                      <div>
                         <div className="mb-8">
                            <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                               Highlight Reel
                               <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                            </h2>
                         </div>
                         <div className="relative w-full aspect-video bg-gray-900 rounded-3xl overflow-hidden group cursor-pointer shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" alt="Video Thumbnail" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-20 h-20 bg-[#b50a0a] rounded-full flex items-center justify-center pl-2 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(181,10,10,0.5)]">
                                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                               </div>
                            </div>
                            <div className="absolute bottom-6 left-8 text-white">
                               <span className="bg-[#b50a0a] text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-2 inline-block">2023 Season</span>
                               <h3 className="text-2xl font-black tracking-tight">Best Goals & Assists</h3>
                            </div>
                         </div>
                      </div>

                      {/* Action Images (Max 5) */}
                      <div>
                         <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                               Action Shots
                               <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                            </h2>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-[11px] font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors border border-gray-200 inline-flex items-center gap-2">
                               View Full Gallery <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Large Image */}
                            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl aspect-square md:aspect-auto">
                               <img src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Action 1" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            {/* 4 smaller images */}
                            <div className="relative group overflow-hidden rounded-2xl aspect-square">
                               <img src="https://images.unsplash.com/photo-1518605368461-1e1e38ce8041?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Action 2" />
                            </div>
                            <div className="relative group overflow-hidden rounded-2xl aspect-square">
                               <img src="https://images.unsplash.com/photo-1600250395378-9ebbf249ced7?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Action 3" />
                            </div>
                            <div className="relative group overflow-hidden rounded-2xl aspect-square">
                               <img src="https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Action 4" />
                            </div>
                            <div className="relative group overflow-hidden rounded-2xl aspect-square">
                               <img src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Action 5" />
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* =========================================
                    TAB CONTENT: News
                    ========================================= */}
                {activeTab === "News" && (
                   <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="mb-8">
                         <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                            Latest News
                            <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                         </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {[1, 2, 3].map((item) => (
                            <article key={item} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col">
                               <div className="relative h-48 overflow-hidden">
                                  <img src={`https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=600&auto=format&fit=crop&sig=${item}`} alt="News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute top-4 left-4 bg-[#b50a0a] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                                     Transfer Rumours
                                  </div>
                               </div>
                               <div className="p-6 flex-1 flex flex-col">
                                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Jan 12, 2024</span>
                                  <h3 className="text-xl font-black text-gray-900 leading-tight mb-3 group-hover:text-[#b50a0a] transition-colors">
                                     Samuel Ejoor Linked With Surprise Move to Premier League
                                  </h3>
                                  <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                                     Top clubs are reportedly monitoring the situation as the star forward's contract enters its final 18 months...
                                  </p>
                                  <div className="mt-auto flex items-center font-bold text-[11px] text-[#b50a0a] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                     Read Article &rarr;
                                  </div>
                               </div>
                            </article>
                         ))}
                      </div>
                   </div>
                )}

                {/* =========================================
                    TAB CONTENT: Shop
                    ========================================= */}
                {activeTab === "Shop" && (
                   <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="mb-8">
                         <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                            Official Merchandise
                            <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                         </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         {[
                            { name: "Official Home Jersey 23/24", price: "$89.99", img: "https://images.unsplash.com/photo-1580087433276-88062829ecde?q=80&w=600&auto=format&fit=crop", tag: "Best Seller" },
                            { name: "Away Kit Custom Edition", price: "$95.00", img: "https://images.unsplash.com/photo-1577223625816-f3655b38af16?q=80&w=600&auto=format&fit=crop", tag: "New" },
                            { name: "Signature Training Top", price: "$45.00", img: "https://images.unsplash.com/photo-1618331835717-811ebedfe077?q=80&w=600&auto=format&fit=crop" },
                            { name: "Signed Match Ball", price: "$299.00", img: "https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=600&auto=format&fit=crop", tag: "Limited" }
                         ].map((product, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col">
                               <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                                  <img src={product.img} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                  {product.tag && (
                                     <div className="absolute top-4 left-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                                        {product.tag}
                                     </div>
                                  )}
                               </div>
                               <div className="p-5 flex-1 flex flex-col text-center">
                                  <h3 className="text-sm font-black text-gray-900 leading-tight mb-2 group-hover:text-[#b50a0a] transition-colors">
                                     {product.name}
                                  </h3>
                                  <span className="text-[#b50a0a] font-bold text-lg mb-4">{product.price}</span>
                                  
                                  <button className="mt-auto w-full bg-gray-900 hover:bg-[#b50a0a] text-white text-[11px] font-bold uppercase tracking-widest py-3 rounded-xl transition-colors">
                                     Add to Cart
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}

             </div>
         </main>

         <Footer />
      </div>
   );
}
