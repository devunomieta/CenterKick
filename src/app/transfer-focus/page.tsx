'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for the transfer table
const transferData = [
   { id: 1, name: "Peter Odu", position: "Center - Forward", country: "ng", age: 19, outOfContract: "August 7th, 2022", avatar: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=150&auto=format&fit=crop" },
   { id: 2, name: "Aashish Yunik", position: "Center - Back", country: "ng,tz", age: 28, outOfContract: "May 27th, 2022", avatar: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=150&auto=format&fit=crop" },
   { id: 3, name: "Beau Beere", position: "Goalkeeper", country: "ng", age: 24, outOfContract: "March 7th, 2022", avatar: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=150&auto=format&fit=crop" },
   { id: 4, name: "Soren Holli", position: "Winger", country: "ng,es", age: 23, outOfContract: "Jan 31st, 2022", avatar: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=150&auto=format&fit=crop" },
   { id: 5, name: "Iman Jan", position: "Midfielder", country: "ng", age: 20, outOfContract: "Dec 10th, 2021", avatar: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=150&auto=format&fit=crop" },
   { id: 6, name: "Zarah Rambo", position: "Right - Winger", country: "ng,it", age: 30, outOfContract: "Oct 12th, 2021", avatar: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=150&auto=format&fit=crop" }
];

// Mock data for news cards
const newsData = [
   { id: 1, title: "Esperance Reach Total Energies CL Semi-Finals Despite Kabylie Draw", date: "29 APRIL, 2023", image: "https://images.unsplash.com/photo-1518605368461-1ee7c6802a11?q=80&w=600&auto=format&fit=crop" },
   { id: 2, title: "Ahly Hold On For Draw In Casablanca To Make Total Energies CL Semis", date: "29 APRIL, 2023", image: "https://images.unsplash.com/photo-1551280857-2b9ebf262c1c?q=80&w=600&auto=format&fit=crop" },
   { id: 3, title: "TotalEnergies Anatouf Dreaming Of Winning U17", date: "29 APRIL, 2023", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop" }
];

// Helper to render flags based on string code
const renderFlags = (countryString: string) => {
   const codes = countryString.split(',');
   const flagUrls: Record<string, string> = {
      'ng': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/1200px-Flag_of_Nigeria.svg.png',
      'tz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tanzania.svg/1200px-Flag_of_Tanzania.svg.png',
      'es': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Spain.svg/1200px-Flag_of_Spain.svg.png',
      'it': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1200px-Flag_of_Italy.svg.png'
   };

   return (
      <div className="flex -space-x-1">
         {codes.map((code, index) => (
            <div key={index} className="w-5 h-5 rounded-full border-[1.5px] border-white overflow-hidden shadow-sm relative z-[1]">
               <img src={flagUrls[code]} alt={code} className="w-full h-full object-cover" />
            </div>
         ))}
      </div>
   );
};

export default function TransferFocusPage() {
   const [activeTab, setActiveTab] = useState('FREE AGENT');

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
         <Navbar />

         <main className="flex-grow pt-20">
            {/* Dark Hero Header */}
            <div className="bg-[#2d2d2d] py-14 px-4 border-b-4 border-gray-400">
               <div className="max-w-[1200px] mx-auto text-white flex flex-col items-center md:items-start text-center md:text-left">
                  <h1 className="text-4xl md:text-[44px] font-black uppercase tracking-widest leading-none drop-shadow-md">
                     TRANSFER FOCUS
                  </h1>
                  <p className="text-[12px] md:text-[13px] text-gray-300 mt-2 font-medium tracking-wide">
                     Check athletes profiles availability status
                  </p>
               </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="bg-[#3a3a3a] border-b border-gray-700">
               <div className="max-w-[1200px] mx-auto px-4 flex items-center overflow-x-auto no-scrollbar">
                  {['FREE AGENT', 'CONTRACT ENDING', 'AVAILABLE COACHES', 'AVAILABLE MANAGERS'].map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-6 md:px-8 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors relative
                           ${activeTab === tab ? 'text-[#ff3b3b]' : 'text-gray-300 hover:text-white'}`}
                     >
                        {tab}
                        {activeTab === tab && (
                           <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ff3b3b]"></span>
                        )}
                     </button>
                  ))}
               </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 py-12 flex flex-col gap-12">

               {/* Search Bar */}
               <div className="w-full flex items-center mb-4">
                  <div className="relative flex-grow flex items-center">
                     <div className="absolute left-6 z-10 text-[#b50a0a]">
                        <Search className="w-4 h-4" strokeWidth={3} />
                     </div>
                     <input
                        type="text"
                        placeholder="Search....."
                        className="w-full pl-14 pr-6 py-3.5 border border-gray-900 outline-none text-gray-900 font-medium placeholder-gray-900 text-sm shadow-sm"
                     />
                  </div>
                  <button className="bg-white border-y border-r border-gray-900 py-3.5 px-8 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors shadow-sm h-full group">
                     <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
                     <span className="ml-2 font-bold text-[10px] uppercase tracking-widest">Filters</span>
                  </button>
               </div>

               {/* Transfer Listing Table */}
               <div className="w-full bg-white overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                           <tr className="bg-[#a20000] text-white">
                              <th className="font-bold text-[10px] uppercase tracking-wider px-8 py-3 w-[25%] border-r border-white/20">Player</th>
                              <th className="font-bold text-[10px] uppercase tracking-wider px-6 py-3 w-[20%] border-r border-white/20">Position</th>
                              <th className="font-bold text-[10px] uppercase tracking-wider px-6 py-3 w-[15%] text-center border-r border-white/20">Country</th>
                              <th className="font-bold text-[10px] uppercase tracking-wider px-6 py-3 w-[10%] text-center border-r border-white/20">Age</th>
                              <th className="font-bold text-[10px] uppercase tracking-wider px-8 py-3 w-[30%] text-right">Out of contract since</th>
                           </tr>
                        </thead>
                        <tbody>
                           {transferData.map((player, idx) => (
                              <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                 <td className="px-8 py-4 border-r border-gray-100">
                                    <div className="flex items-center gap-4">
                                       <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#16a34a] shadow-sm shrink-0">
                                          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                                       </div>
                                       <Link href={`/athletes/${player.id}`} className="font-black text-[12px] text-gray-900 hover:text-[#b50a0a] transition-colors cursor-pointer">
                                          {player.name}
                                       </Link>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 border-r border-gray-100">
                                    <span className="font-bold text-[11px] text-[#b50a0a]">{player.position}</span>
                                 </td>
                                 <td className="px-6 py-4 border-r border-gray-100">
                                    <div className="flex justify-center">
                                       {renderFlags(player.country)}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-center border-r border-gray-100">
                                    <span className="font-bold text-[12px] text-gray-900">{player.age}</span>
                                 </td>
                                 <td className="px-8 py-4 text-right">
                                    <span className="font-bold text-[11px] text-gray-800">{player.outOfContract}</span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-6 py-8 border-t border-gray-100">
                     <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                     </button>
                     <div className="flex items-center gap-3">
                        <button className="w-8 h-8 rounded-full bg-[#b50a0a] text-white font-bold text-xs flex items-center justify-center shadow-sm">1</button>
                        <button className="w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 font-bold text-xs flex items-center justify-center transition-colors">2</button>
                        <button className="w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 font-bold text-xs flex items-center justify-center transition-colors">3</button>
                     </div>
                     <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               {/* Latest Transfer Rumors News Section */}
               <div className="mt-8">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl md:text-[28px] font-black tracking-tight text-gray-800">Latest transfer rumors news</h2>
                     <Link href="/news" className="text-[11px] font-bold text-gray-600 hover:text-[#b50a0a] tracking-widest uppercase flex items-center gap-1 transition-colors">
                        SEE ALL <ChevronRight className="w-4 h-4" />
                     </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {newsData.map((news) => (
                        <div key={`rumor-${news.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-shadow">
                           <div className="h-[200px] overflow-hidden">
                              <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           </div>
                           <div className="p-6 relative">
                              <div className="absolute top-0 left-6 w-[30px] h-[3px] bg-[#b50a0a]"></div>
                              <h3 className="font-bold text-[15px] text-gray-900 leading-snug mb-4 group-hover:text-[#b50a0a] transition-colors line-clamp-2">
                                 {news.title}
                              </h3>
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{news.date}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Top Football Transfer News Section */}
               <div className="mt-8 mb-16">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl md:text-[28px] font-black tracking-tight text-gray-800">Top football transfer news</h2>
                     <Link href="/news" className="text-[11px] font-bold text-gray-600 hover:text-[#b50a0a] tracking-widest uppercase flex items-center gap-1 transition-colors">
                        SEE ALL <ChevronRight className="w-4 h-4" />
                     </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {newsData.map((news) => (
                        <div key={`top-${news.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-shadow">
                           <div className="h-[200px] overflow-hidden">
                              <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           </div>
                           <div className="p-6 relative">
                              <div className="absolute top-0 left-6 w-[30px] h-[3px] bg-[#b50a0a]"></div>
                              <h3 className="font-bold text-[15px] text-gray-900 leading-snug mb-4 group-hover:text-[#b50a0a] transition-colors line-clamp-2">
                                 {news.title}
                              </h3>
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{news.date}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>

         </main>
         <Footer />
      </div>
   );
}
