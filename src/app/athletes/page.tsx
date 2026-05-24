'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AthletesPage() {
   const [athletes, setAthletes] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedCountry, setSelectedCountry] = useState('');

   const supabase = createClient();

   useEffect(() => {
      async function fetchAthletes() {
         try {
            const { data, error } = await supabase
               .from('profiles')
               .select('*')
               .eq('role', 'player')
               .eq('status', 'active')
               .not('role', 'in', '("admin","superadmin")')
               .order('created_at', { ascending: false });

            if (error) throw error;
            setAthletes(data || []);
         } catch (err) {
            console.error('Error fetching athletes:', err);
         } finally {
            setLoading(false);
         }
      }
      fetchAthletes();
   }, []);

   // Get unique list of countries for filter dropdown
   const availableCountries = useMemo(() => {
      const countriesSet = new Set<string>();
      athletes.forEach(a => {
         if (a.country) {
            countriesSet.add(a.country.trim());
         }
      });
      return Array.from(countriesSet).sort();
   }, [athletes]);

   // Filter athletes based on search and country
   const filteredAthletes = useMemo(() => {
      return athletes.filter(a => {
         if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const fullName = `${a.first_name || ''} ${a.last_name || ''} ${a.full_name || ''}`.toLowerCase();
            const position = (a.position || '').toLowerCase();
            const club = (a.current_club || '').toLowerCase();
            if (!fullName.includes(query) && !position.includes(query) && !club.includes(query)) {
               return false;
            }
         }
         if (selectedCountry && a.country !== selectedCountry) {
            return false;
         }
         return true;
      });
   }, [athletes, searchQuery, selectedCountry]);

   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20 sm:pt-32">
            {/* Split Hero Section */}
            <div className="bg-gray-50 py-10 sm:py-16">
               <div className="max-w-[1200px] mx-auto px-4 lg:px-0 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                  <div className="w-full lg:w-1/2">
                     <span className="text-[#a20000] font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Rising Stars</span>
                     <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 uppercase tracking-tight">
                        Discover <br />
                        <span className="text-[#a20000]">Talent</span>
                     </h1>
                     <p className="text-gray-900 text-lg leading-relaxed mb-8 max-w-lg">
                        Explore our database of verified rising stars. Connect with elite athletes, review certified match data, and unlock new opportunities for your team.
                     </p>
                     <Link href="/register">
                        <button className="bg-[#a20000] hover:bg-[#8a0000] text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs transition-all transform hover:scale-105 shadow-xl">
                           Register Your Profile
                        </button>
                     </Link>
                  </div>

                  <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 h-[280px] sm:h-[400px] lg:h-[500px]">
                     <div className="h-full overflow-hidden rounded-2xl relative group">
                        <img 
                           src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop" 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                           alt="Athlete training" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                     </div>
                     <div className="h-full grid grid-rows-2 gap-4">
                        <div className="overflow-hidden rounded-2xl relative group">
                           <img 
                              src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=600&auto=format&fit=crop" 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              alt="Football match" 
                           />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="overflow-hidden rounded-2xl relative group">
                           <img 
                              src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop" 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              alt="Player on field" 
                           />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Players Grid Section with py-24 to fix overlap */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 py-10 sm:py-24">
               {/* Dynamic Filter Controls */}
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
                  <div>
                     <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Verified Athletes</h2>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Discover rising football talent</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                     {/* Search Input */}
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                           type="text"
                           placeholder="Search athletes..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="pl-11 pr-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-900 focus:outline-none focus:border-[#a20000] focus:ring-1 focus:ring-[#a20000] w-full sm:w-64 transition-all"
                        />
                     </div>

                     {/* Country Selector */}
                     <div className="relative">
                        <select
                           value={selectedCountry}
                           onChange={(e) => setSelectedCountry(e.target.value)}
                           className="appearance-none pl-6 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-900 focus:outline-none focus:border-[#a20000] focus:ring-1 focus:ring-[#a20000] min-w-[200px] transition-all cursor-pointer"
                        >
                           <option value="">All Countries</option>
                           {availableCountries.map((c) => (
                              <option key={c} value={c}>{c}</option>
                           ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                     </div>
                  </div>
               </div>

               {loading ? (
                  <div className="text-center py-20">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a20000] mx-auto"></div>
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-4">Loading athletes...</p>
                  </div>
               ) : !filteredAthletes || filteredAthletes.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                     <p className="text-gray-900 font-bold uppercase tracking-widest">No matching athlete profiles found.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                     {filteredAthletes.map((athlete) => (
                        <Link href={`/athletes/${athlete.slug}`} key={athlete.id} className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow bg-black block">
                           <img
                              src={athlete.avatar_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop"}
                              alt={athlete.full_name || `${athlete.first_name || ''} ${athlete.last_name || ''}`.trim()}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                           <div className="absolute bottom-6 left-6 right-6">
                              <div className="relative z-10">
                                 <span className="text-2xl font-black text-white block drop-shadow-md uppercase tracking-tighter leading-tight">
                                    {athlete.full_name || `${athlete.first_name || ''} ${athlete.last_name || ''}`.trim() || 'Anonymous Player'}
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
         </main>

         <Footer />
      </div>
   );
}
