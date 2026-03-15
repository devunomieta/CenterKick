import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, ChevronDown, ArrowRight, ChevronLeft, ChevronRight, Briefcase, Globe, Users } from "lucide-react";
import Link from 'next/link';

// Sample Agent Data
const AGENTS = [
   { id: 1, name: "Alexander Sterling", agency: "Apex Sports Management", region: "Europe / UK", managedCount: 42, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" },
   { id: 2, name: "Marcus Thorne", agency: "Global Talent Group", region: "West Africa", managedCount: 28, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" },
   { id: 3, name: "Sarah Jenkins", agency: "Visionary Athletics", region: "USA / MLS", managedCount: 15, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" },
   { id: 4, name: "Kofi Boateng", agency: "Rising Stars Agency", region: "Ghana / Europe", managedCount: 34, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop" },
   { id: 5, name: "Luca Moretti", agency: "Calcio Connect", region: "Italy / Serie A", managedCount: 56, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop" },
   { id: 6, name: "Elena Rodriguez", agency: "Iberia Football", region: "Spain / Portugal", managedCount: 22, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop" }
];

export default function AgentsPage() {
   return (
      <div className="min-h-screen bg-white text-gray-900">
         <Navbar />

         <main className="pt-20">
            {/* Business Hero Section */}
            <div className="relative bg-[#0a0a0a] py-32 overflow-hidden border-b border-white/5">
                {/* Abstract corporate/networking background */}
               <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#4a0000,transparent)]"></div>
                  <div className="grid grid-cols-12 h-full opacity-10">
                     {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="border-r border-white/20 h-full"></div>
                     ))}
                  </div>
               </div>

               <div className="max-w-[1200px] mx-auto px-4 lg:px-0 relative z-10">
                  <div className="max-w-3xl">
                     <span className="text-[#a20000] font-black text-xs uppercase tracking-[0.4em] mb-6 block drop-shadow-[0_0_15px_rgba(162,0,0,0.5)]">Certified Network</span>
                     <h1 className="text-6xl lg:text-8xl font-black text-white leading-none mb-8 tracking-tighter">
                        PRO <br />
                        <span className="text-[#a20000]">AGENTS</span>
                     </h1>
                     <p className="text-gray-400 text-xl font-medium leading-relaxed mb-12">
                        Connect with the world's most influential football agents and agencies. Professional representation for players and coaches seeking global opportunities.
                     </p>
                     
                     <div className="flex flex-wrap gap-6">
                        <button className="bg-[#a20000] text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#8a0000] transition-all shadow-[0_20px_40px_rgba(162,0,0,0.3)]">
                           Find Representation
                        </button>
                        <button className="bg-white/10 backdrop-blur-md text-white border border-white/10 px-10 py-5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all">
                           Partner With Us
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Premium Search Section */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 -mt-8 relative z-20">
               <div className="bg-white p-6 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col md:flex-row items-stretch gap-4">
                  <div className="flex-1 relative">
                     <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                     <input 
                        type="text" 
                        placeholder="Search by Agent Name or Agency..." 
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none"
                     />
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="hidden md:flex flex-col px-6 border-x border-gray-100 items-center justify-center min-w-[150px]">
                        <span className="text-[8px] font-black text-[#a20000] uppercase tracking-widest mb-1">Region</span>
                        <button className="flex items-center gap-2 text-xs font-black text-gray-900 group">
                           All <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                     </div>
                     <button className="bg-[#a20000] text-white px-8 py-5 rounded-2xl hover:bg-[#8a0000] transition-all font-black uppercase tracking-widest text-[10px] shadow-lg">
                        Apply Filters
                     </button>
                  </div>
               </div>
            </div>

            {/* Agents Grid */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 py-24">
               <div className="flex items-center justify-between mb-16 px-2">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-1 bg-[#a20000] rounded-full"></div>
                     <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Certified Agents</h2>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                     Sort By: <span className="text-gray-900">Managed Talent</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {AGENTS.map((agent) => (
                     <Link 
                        href={`/agents/${agent.id}`} 
                        key={agent.id} 
                        className="group bg-white border border-gray-100 rounded-[32px] overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700 block"
                     >
                        <div className="p-6 pb-0 overflow-hidden">
                           <div className="relative aspect-square rounded-[24px] overflow-hidden">
                              <img 
                                 src={agent.image} 
                                 alt={agent.name} 
                                 className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                              />
                              <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                                 <Users className="w-3 h-3 text-white" />
                                 <span className="text-[10px] font-black text-white">{agent.managedCount}</span>
                              </div>
                           </div>
                        </div>

                        <div className="p-8">
                           <span className="text-[#a20000] text-[9px] font-black uppercase tracking-widest block mb-3">{agent.agency}</span>
                           <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-[#a20000] transition-colors leading-tight">
                              {agent.name}
                           </h3>
                           
                           <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-gray-400">
                                 <Globe className="w-3 h-3" />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">{agent.region}</span>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#a20000] transition-colors">
                                 <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                              </div>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>

               {/* Standardized Pagination Section */}
               <div className="mt-24 flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                     <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:text-[#a20000] hover:border-[#a20000] transition-colors shadow-sm">
                        <ChevronLeft className="w-4 h-4" />
                     </button>
                     <button className="w-10 h-10 flex items-center justify-center rounded bg-[#a20000] text-white font-bold shadow-md">
                        1
                     </button>
                     <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-700 font-bold hover:text-[#a20000] transition-colors shadow-sm">
                        2
                     </button>
                     <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-700 font-bold hover:text-[#a20000] transition-colors shadow-sm">
                        3
                     </button>
                     <span className="text-gray-400 font-bold px-2">...</span>
                     <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-700 font-bold hover:text-[#a20000] transition-colors shadow-sm">
                        12
                     </button>
                     <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:text-[#a20000] hover:border-[#a20000] transition-colors shadow-sm">
                        <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>

            {/* Premium Corporate CTA Section */}
            <div className="bg-[#fcf5f5] py-24 mb-10 w-full overflow-hidden relative">
               <div className="max-w-[1000px] mx-auto px-4 lg:px-0">
                  <div className="bg-[#a20000] rounded-3xl shadow-2xl relative text-center py-24 px-8 border-[12px] border-white overflow-hidden group">
                     {/* Decorative background overlay */}
                     <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="grid grid-cols-6 h-full border-r border-white/20"></div>
                     </div>
                     
                     <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-md">
                           <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        
                        <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em] mb-4 drop-shadow-sm">
                           Join The Global Network
                        </span>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter uppercase leading-tight drop-shadow-2xl">
                           Are you an agent looking <br />
                           <span className="opacity-60">To scale your agency?</span>
                        </h2>

                        <Link href="/login" className="transform transition-transform active:scale-95">
                           <button className="bg-white text-gray-900 hover:text-[#a20000] font-black text-xs uppercase tracking-[0.2em] px-12 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-4 group/btn">
                              Partner With CenterKick <ArrowRight className="w-5 h-5 text-[#a20000] group-hover/btn:translate-x-2 transition-transform" />
                           </button>
                        </Link>
                     </div>
                  </div>
               </div>
            </div>

         </main>

         <Footer />
      </div>
   );
}
