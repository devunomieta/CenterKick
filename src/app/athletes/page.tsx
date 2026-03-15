import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronLeft, ChevronRight, ArrowRight, ChevronDown } from "lucide-react";
import Link from 'next/link';

// Sample flag SVGs (using unDraw/freepik standard replacements or simple CSS shapes for now, replaced with an actual image url in the real app)
const NIGERIA_FLAG = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/1200px-Flag_of_Nigeria.svg.png";

// Sample Data for Athletes
const baseAthletes = [
   {
      id: 1,
      number: "17",
      firstName: "Samuel",
      lastName: "Ejoor",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop", // placeholder
      flag: NIGERIA_FLAG,
      accentColor: "text-[#b50a0a]" // For the red numbers
   },
   {
      id: 2,
      number: "16",
      firstName: "Yemi Daniel",
      lastName: "Olanrewaju",
      image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop",
      flag: NIGERIA_FLAG,
      accentColor: "text-white"
   },
   {
      id: 3,
      number: "9",
      firstName: "Akere",
      lastName: "Samuel",
      image: "https://images.unsplash.com/photo-1518605368461-1ee7c6802a11?q=80&w=800&auto=format&fit=crop",
      flag: NIGERIA_FLAG,
      accentColor: "text-[#b50a0a]"
   },
   {
      id: 4,
      number: "16",
      firstName: "Bamidele",
      lastName: "Adeniyi",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
      flag: NIGERIA_FLAG,
      accentColor: "text-[#b50a0a]"
   },
   {
      id: 5,
      number: "24",
      firstName: "Yemi Daniel",
      lastName: "Olanrewaju",
      image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop",
      flag: NIGERIA_FLAG,
      accentColor: "text-white"
   },
   {
      id: 6,
      number: "16",
      firstName: "Akere",
      lastName: "Samuel",
      image: "https://images.unsplash.com/photo-1518605368461-1ee7c6802a11?q=80&w=800&auto=format&fit=crop",
      flag: NIGERIA_FLAG,
      accentColor: "text-[#b50a0a]"
   },
   {
      id: 7,
      number: "16",
      firstName: "Bamidele",
      lastName: "Adeniyi",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
      flag: NIGERIA_FLAG,
      accentColor: "text-[#b50a0a]"
   },
   {
      id: 8,
      number: "24",
      firstName: "Yemi Daniel",
      lastName: "Olanrewaju",
      image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop",
      flag: NIGERIA_FLAG,
      accentColor: "text-white"
   },
   {
      id: 9,
      number: "16",
      firstName: "Akere",
      lastName: "Samuel",
      image: "https://images.unsplash.com/photo-1518605368461-1ee7c6802a11?q=80&w=800&auto=format&fit=crop",
      flag: NIGERIA_FLAG,
      accentColor: "text-[#b50a0a]"
   }
];

const ATHLETES = Array.from({ length: 40 }).map((_, i) => ({
   ...baseAthletes[i % baseAthletes.length],
   id: i + 1,
   number: Math.floor(Math.random() * 99) + 1 // Optional: Randomized numbers to make it look diverse
}));


export default function AthletesPage() {
   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20">
            {/* Header Section */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 py-12 flex items-center justify-between">

               {/* Left Title Area */}
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#b50a0a] flex items-center justify-center shrink-0 shadow-md">
                     {/* Soccer ball icon representing profiles */}
                     <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-4.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm5 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-2.5-4c.83 0 1.5-.67 1.5-1.5S12.83 8.5 12 8.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
                     </svg>
                  </div>
                  <div>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">PROFILING</span>
                     <h1 className="text-2xl font-black text-gray-800 tracking-wide">Players Profile</h1>
                  </div>
               </div>

            </div>

            {/* Filters Bar */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-12">
               <div className="flex flex-wrap items-center border border-gray-200 py-3 px-6 shadow-sm rounded-sm bg-white">
                  <div className="flex flex-col border-r border-gray-200 pr-8">
                     <span className="text-[8px] font-bold text-[#b50a0a] uppercase tracking-wider">Gender:</span>
                     <button className="flex items-center gap-1 text-[13px] font-black text-gray-900 mt-1">
                        All <ChevronDown className="w-3 h-3" />
                     </button>
                  </div>

                  <div className="flex flex-col border-r border-gray-200 px-8">
                     <span className="text-[8px] font-bold text-[#b50a0a] uppercase tracking-wider">Country:</span>
                     <button className="flex items-center gap-1 text-[13px] font-black text-gray-900 mt-1">
                        All <ChevronDown className="w-3 h-3" />
                     </button>
                  </div>

                  <div className="flex flex-col border-r border-gray-200 px-8">
                     <span className="text-[8px] font-bold text-[#b50a0a] uppercase tracking-wider">Club:</span>
                     <button className="flex items-center gap-1 text-[13px] font-black text-gray-900 mt-1">
                        All Clubs <ChevronDown className="w-3 h-3" />
                     </button>
                  </div>

                  <div className="flex flex-col px-8">
                     <span className="text-[8px] font-bold text-[#b50a0a] uppercase tracking-wider">Playing Position:</span>
                     <button className="flex items-center gap-1 text-[13px] font-black text-gray-900 mt-1">
                        All Positions <ChevronDown className="w-3 h-3" />
                     </button>
                  </div>
               </div>
            </div>

            {/* Players Grid */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-16">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {ATHLETES.map((athlete) => (
                     <Link href={`/athletes/${athlete.id}`} key={athlete.id} className="relative aspect-[4/5] rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow bg-black block">

                        {/* Background Image */}
                        <img
                           src={athlete.image}
                           alt={`${athlete.firstName} ${athlete.lastName}`}
                           className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                        />

                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                        {/* Top Right Flag */}
                        <div className="absolute top-6 right-6 w-8 h-8 rounded-full shadow-sm overflow-hidden border-2 border-white/20">
                           <img src={athlete.flag} alt="Country Flag" className="w-full h-full object-cover" />
                        </div>

                        {/* Bottom Content Area */}
                        <div className="absolute bottom-6 left-6 right-6">
                           <div className="flex flex-col">
                              {/* Large Number */}
                              <span className={`text-[80px] font-black leading-none drop-shadow-lg -mb-6 relative z-0 opacity-90 tracking-tighter ${athlete.accentColor}`}>
                                 {athlete.number}
                              </span>

                              {/* Names */}
                              <div className="relative z-10">
                                 <span className="text-2xl font-bold text-white block drop-shadow-md">
                                    {athlete.firstName}
                                 </span>
                                 {/* Optional Red Underline Styling on Last Name based on design */}
                                 <span className={`text-2xl font-black block drop-shadow-md ${athlete.id === 2 || athlete.id === 5 || athlete.id === 8 ? 'text-[#b50a0a] underline decoration-2 underline-offset-4' : 'text-white'}`}>
                                    {athlete.lastName}
                                 </span>
                              </div>
                           </div>
                        </div>

                     </Link>
                  ))}
               </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col items-center justify-center mb-24 gap-4">
               <div className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:text-[#b50a0a] hover:border-[#b50a0a] transition-colors shadow-sm">
                     <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded bg-[#b50a0a] text-white font-bold shadow-md">
                     1
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-700 font-bold hover:text-[#b50a0a] transition-colors shadow-sm">
                     2
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-700 font-bold hover:text-[#b50a0a] transition-colors shadow-sm">
                     3
                  </button>
                  <span className="text-gray-400 font-bold px-2">...</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-700 font-bold hover:text-[#b50a0a] transition-colors shadow-sm">
                     12
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-400 hover:text-[#b50a0a] hover:border-[#b50a0a] transition-colors shadow-sm">
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Create Profile CTA Banner */}
            <div className="bg-[#fcf5f5] py-20 w-full">
               <div className="max-w-[1000px] mx-auto px-4 lg:px-0">
                  <div className="bg-[#a20000] rounded-xl shadow-xl relative text-center py-16 px-4">

                     {/* 3 Avatar Bubbles overlapping top border */}
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full border-4 border-[#fcf5f5] overflow-hidden -mr-4 z-10 shadow-sm">
                           <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Avatar 1" />
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-[#fcf5f5] overflow-hidden z-20 shadow-md">
                           <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Avatar 2" />
                        </div>
                        <div className="w-14 h-14 rounded-full border-4 border-[#fcf5f5] overflow-hidden -ml-4 z-10 shadow-sm">
                           <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Avatar 3" />
                        </div>
                     </div>

                     <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-6 block mb-3 drop-shadow-sm">
                        Create Profile
                     </span>
                     <h2 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-wide drop-shadow-md">
                        Create a profile to get noticed by sport agencies.
                     </h2>

                     <Link href="/login">
                        <button className="bg-white text-gray-900 hover:text-[#b50a0a] font-bold text-[11px] uppercase tracking-widest px-6 py-3 rounded shadow hover:shadow-lg transition-all inline-flex items-center gap-2">
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
