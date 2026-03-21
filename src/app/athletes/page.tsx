import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronLeft, ChevronRight, ArrowRight, ChevronDown, User } from "lucide-react";
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AthletesPage() {
   const supabase = await createClient();

   // Fetch active profiles
   const { data: athletes, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20">
            {/* Header Section */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 py-12 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#b50a0a] flex items-center justify-center shrink-0 shadow-md">
                     <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-4.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm5 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-2.5-4c.83 0 1.5-.67 1.5-1.5S12.83 8.5 12 8.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
                     </svg>
                  </div>
                  <div>
                     <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest block mb-1">PROFILING</span>
                     <h1 className="text-2xl font-black text-gray-800 tracking-wide">Players Profile</h1>
                  </div>
               </div>
            </div>

            {/* Filters Bar (Placeholders for now) */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-12">
               <div className="flex flex-wrap items-center border border-gray-200 py-3 px-6 shadow-sm rounded-sm bg-white">
                  {['Gender', 'Country', 'Club', 'Position'].map((label) => (
                     <div key={label} className="flex flex-col border-r last:border-r-0 border-gray-200 px-8 first:pl-0">
                        <span className="text-[8px] font-bold text-[#b50a0a] uppercase tracking-wider">{label}:</span>
                        <button className="flex items-center gap-1 text-[13px] font-black text-gray-900 mt-1">
                           All <ChevronDown className="w-3 h-3" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>

            {/* Players Grid */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-16">
               {!athletes || athletes.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                     <p className="text-gray-900 font-bold uppercase tracking-widest">No active profiles found.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                     {athletes.map((athlete) => (
                        <Link href={`/athletes/${athlete.id}`} key={athlete.id} className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow bg-black block">
                           <img
                              src={athlete.avatar_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop"}
                              alt={athlete.full_name}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                           <div className="absolute bottom-6 left-6 right-6">
                              <div className="relative z-10">
                                 <span className="text-2xl font-black text-white block drop-shadow-md uppercase tracking-tighter leading-tight">
                                    {athlete.full_name}
                                 </span>
                                 <span className="text-[10px] font-bold text-[#ff4d4d] uppercase tracking-[0.2em] mt-2 block">
                                    {athlete.position || 'Player'}
                                 </span>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               )}
            </div>

            {/* Create Profile CTA Banner */}
            <div className="bg-[#fcf5f5] py-20 w-full">
               <div className="max-w-[1000px] mx-auto px-4 lg:px-0">
                  <div className="bg-[#a20000] rounded-xl shadow-xl relative text-center py-16 px-4">
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
                        {[1, 2, 3].map(i => (
                           <div key={i} className="w-14 h-14 rounded-full border-4 border-[#fcf5f5] overflow-hidden -mx-2 z-10 shadow-sm first:z-0 last:z-0">
                              <img src={`https://images.unsplash.com/photo-${i === 1 ? '1544005313-94ddf0286df2' : i === 2 ? '1506794778202-cad84cf45f1d' : '1534528741775-53994a69daeb'}?q=80&w=200&auto=format&fit=crop`} className="w-full h-full object-cover" alt="" />
                           </div>
                        ))}
                     </div>
                     <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-6 block mb-3">Create Profile</span>
                     <h2 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-wide">
                        Create a profile to get noticed by sport agencies.
                     </h2>
                     <Link href="/register">
                        <button className="bg-white text-gray-900 hover:text-[#b50a0a] font-black text-[11px] uppercase tracking-widest px-10 py-4 rounded-xl shadow-lg transition-all inline-flex items-center gap-2 hover:-translate-y-1">
                           Get Started <ArrowRight className="w-4 h-4" />
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
