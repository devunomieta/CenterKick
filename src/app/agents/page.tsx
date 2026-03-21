import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, ChevronDown, ArrowRight, ChevronLeft, ChevronRight, Briefcase, Globe, Users } from "lucide-react";
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AgentsPage() {
   const supabase = await createClient();

   // Fetch active agent profiles
   const { data: agents, error } = await supabase
      .from('profiles')
      .select('*, users!inner(role)')
      .eq('users.role', 'agent')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

   return (
      <div className="min-h-screen bg-white text-gray-900">
         <Navbar />

         <main className="pt-20">
            {/* Business Hero Section */}
            <div className="relative bg-[#0a0a0a] py-32 overflow-hidden border-b border-white/5">
               <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#4a0000,transparent)]"></div>
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

            {/* Agents Grid */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 py-24">
               <div className="flex items-center justify-between mb-16 px-2">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-1 bg-[#a20000] rounded-full"></div>
                     <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Certified Agents</h2>
                  </div>
               </div>

               {!agents || agents.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                     <p className="text-gray-900 font-bold uppercase tracking-widest">No active agents found.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                     {agents.map((agent) => (
                        <Link 
                           href={`/agents/${agent.id}`} 
                           key={agent.id} 
                           className="group bg-white border border-gray-100 rounded-[32px] overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700 block"
                        >
                           <div className="p-6 pb-0 overflow-hidden">
                              <div className="relative aspect-square rounded-[24px] overflow-hidden">
                                 <img 
                                    src={agent.avatar_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"} 
                                    alt={agent.full_name} 
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                                 />
                              </div>
                           </div>

                           <div className="p-8">
                              <span className="text-[#a20000] text-[9px] font-black uppercase tracking-widest block mb-3">{agent.country || 'Global Agent'}</span>
                              <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-[#a20000] transition-colors leading-tight">
                                 {agent.full_name}
                              </h3>
                              
                              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                 <div className="flex items-center gap-2 text-gray-900">
                                    <Globe className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{agent.bio?.substring(0, 20) || 'Verified Agent'}...</span>
                                 </div>
                                 <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#a20000] transition-colors">
                                    <ArrowRight className="w-4 h-4 text-black group-hover:text-white transition-colors" />
                                 </div>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               )}
            </div>

            {/* Premium Corporate CTA Section */}
            <div className="bg-[#fcf5f5] py-24 mb-10 w-full overflow-hidden relative">
               <div className="max-w-[1000px] mx-auto px-4 lg:px-0">
                  <div className="bg-[#a20000] rounded-3xl shadow-2xl relative text-center py-24 px-8 border-[12px] border-white overflow-hidden group">
                     <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-md">
                           <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em] mb-4 drop-shadow-sm">Join The Global Network</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter uppercase leading-tight drop-shadow-2xl">
                           Are you an agent looking <br />
                           <span className="opacity-60">To scale your agency?</span>
                        </h2>
                        <Link href="/register" className="transform transition-transform active:scale-95">
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
