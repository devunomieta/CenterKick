import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, ChevronDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from 'next/link';

// Sample Coach Data based on Image 3
const COACHES = [
   { id: 1, name: "Samuel Ejoor", image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop", tags: ["Tactics", "Youth"] },
   { id: 2, name: "Ogunsandala Olusegun", image: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=800&auto=format&fit=crop", tags: ["Pro License"] },
   { id: 3, name: "Boluwatife Olaolu", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop", tags: ["Experienced"] },
   { id: 4, name: "Desmond Tetu", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop", tags: ["Defense"] },
   { id: 5, name: "Bamitale Usman", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop", tags: ["Technical"] },
   { id: 6, name: "Itak Keonke", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", tags: ["Mental"] },
   { id: 7, name: "Ebube Osanyintuyi", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop", tags: ["Physical"] },
   { id: 8, name: "Yusuf Abiodun", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", tags: ["Scouting"] },
   { id: 9, name: "Ece Chimezie", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop", tags: ["Tactics"] },
   { id: 10, name: "Iruebor Ife", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop", tags: ["Modern"] },
   { id: 11, name: "Nati Oreoluwapu", image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=800&auto=format&fit=crop", tags: ["Aggressive"] },
   { id: 12, name: "Ashoggu Faryoou", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", tags: ["Analytics"] },
   { id: 13, name: "Toks Olunrakunni", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop", tags: ["Leadership"] },
   { id: 14, name: "Ahmad Muhammad", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop", tags: ["Discipline"] },
   { id: 15, name: "Ayodele Ojo", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop", tags: ["Creative"] }
];

export default function CoachesPage() {
   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20">
            {/* Split Hero Section based on Image 3 */}
            <div className="bg-gray-50 py-16">
               <div className="max-w-[1200px] mx-auto px-4 lg:px-0 flex flex-col lg:flex-row items-center gap-12">
                  {/* Left: Text Content */}
                  <div className="w-full lg:w-1/2">
                     <span className="text-[#a20000] font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Our Experts</span>
                     <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 uppercase tracking-tight">
                        Elevate <br />
                        <span className="text-[#a20000]">Your Career</span>
                     </h1>
                     <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
                        Connect with top-tier football coaches and technical directors. Our verified network of professionals is dedicated to scouting and developing the next generation of football stars.
                     </p>
                     <button className="bg-[#a20000] hover:bg-[#8a0000] text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-xs transition-all transform hover:scale-105 shadow-xl">
                        Join Our Program
                     </button>
                  </div>

                  {/* Right: Mosaic Grid based on Image 3 */}
                  <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 h-[500px]">
                     <div className="h-full overflow-hidden rounded-2xl relative group">
                        <img 
                           src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop" 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                           alt="Coaching session" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                     </div>
                     <div className="h-full grid grid-rows-2 gap-4">
                        <div className="overflow-hidden rounded-2xl relative group">
                           <img 
                              src="https://images.unsplash.com/photo-1431324155629-1a6eda1feded?q=80&w=600&auto=format&fit=crop" 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              alt="Coach planning" 
                           />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div className="overflow-hidden rounded-2xl relative group">
                           <img 
                              src="https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=600&auto=format&fit=crop" 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              alt="Training" 
                           />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Search Bar Section */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 -mt-8 relative z-10">
               <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-4">
                  <div className="relative flex-1">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                     <input 
                        type="text" 
                        placeholder="Search for coaches by name, specialization, or license..." 
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none"
                     />
                  </div>
                  <button className="bg-[#a20000] text-white p-4 rounded-xl hover:bg-[#8a0000] transition-colors">
                     <Search className="w-6 h-6" />
                  </button>
               </div>
            </div>

            {/* Coaches Grid Section */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 py-24">
               <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Verified Coaches</h2>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                     Filter By <ChevronDown className="w-4 h-4" />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {COACHES.map((coach) => (
                     <Link 
                        href={`/coaches/${coach.id}`} 
                        key={coach.id} 
                        className="group relative h-[400px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-200 block"
                     >
                        {/* Background Image */}
                        <img 
                           src={coach.image} 
                           alt={coach.name} 
                           className="absolute inset-0 w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-transform duration-700" 
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/10 to-transparent"></div>

                        {/* Badges/Tags */}
                        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                           {coach.tags.map(tag => (
                              <span key={tag} className="bg-[#a20000] text-white text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full shadow-lg">
                                 {tag}
                              </span>
                           ))}
                        </div>

                        {/* Coach Info Bottom */}
                        <div className="absolute bottom-8 left-8 right-8">
                           <h3 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-md">
                              {coach.name}
                           </h3>
                           <div className="h-0.5 bg-[#a20000] w-12 group-hover:w-full transition-all duration-500 mb-4 px-0"></div>
                           <div className="flex items-center justify-between">
                              <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">View Profile</span>
                              <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>

               {/* Pagination Section */}
               <div className="mt-16 flex items-center justify-center gap-3">
                  <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#a20000] hover:bg-white transition-all shadow-sm">
                     <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#a20000] border border-[#a20000] text-white font-bold text-sm shadow-xl">
                     1
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-600 hover:text-[#a20000] font-bold text-sm transition-all shadow-sm">
                     2
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-600 hover:text-[#a20000] font-bold text-sm transition-all shadow-sm">
                     3
                  </button>
                  <span className="text-gray-300 font-bold px-2">...</span>
                  <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#a20000] hover:bg-white transition-all shadow-sm">
                     <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="bg-[#a20000] py-24 mb-10 overflow-hidden relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white opacity-5 select-none uppercase tracking-tighter whitespace-nowrap">
                  Join CenterKick
               </div>
               <div className="max-w-[900px] mx-auto px-4 text-center relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase leading-tight">
                     Are you a professional coach looking for <span className="underline decoration-white/30 decoration-8 underline-offset-8">new opportunities?</span>
                  </h2>
                  <Link href="/login">
                     <button className="bg-white text-gray-900 px-12 py-5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all shadow-2xl inline-flex items-center gap-3">
                        Create Your Coach Profile <ArrowRight className="w-5 h-5 text-[#a20000]" />
                     </button>
                  </Link>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   );
}
