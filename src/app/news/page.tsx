import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, SlidersHorizontal, ArrowRight, ChevronRight, Filter } from "lucide-react";
import Link from 'next/link';

// Placeholder images for the news posts
const IMG_1 = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop";
const IMG_2 = "https://images.unsplash.com/photo-1518605368461-1ee7c6802a11?q=80&w=800&auto=format&fit=crop";
const IMG_3 = "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop";
const IMG_4 = "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=800&auto=format&fit=crop";
const IMG_5 = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop";

// Sample Data for Latest News
const LATEST_NEWS = [
   {
      id: 1,
      title: "Esperance Reach Total Energies CL Semi-Finals Despite Kabylie Draw",
      date: "29 APRIL, 2023",
      img: IMG_1,
   },
   {
      id: 2,
      title: "Ahly Hold On For Draw In Casablanca To Make Total Energies CL Semis",
      date: "29 APRIL, 2023",
      img: IMG_2,
   },
   {
      id: 3,
      title: "TotalEnergies U17 AFCON: Nigeria's Golden Eaglets Inspired By Stars",
      date: "29 APRIL, 2023",
      img: IMG_3,
   }
];

// Sample Data for All News Grid
const ALL_NEWS = [
   {
      id: 1,
      title: "TotalEnergies U17 AFCON: Regragui Visit Ignites Morocco's Hunger",
      date: "29 APRIL, 2023",
      img: IMG_4,
   },
   {
      id: 2,
      title: "CAF And Local Organizing Committee Officially Launch TotalEnergies U17 Africa Cup Of Nations Algeria 2023",
      date: "29 APRIL, 2023",
      img: IMG_5,
   },
   {
      id: 3,
      title: "TotalEnergies U17 AFCON: The Hard Work Begins Here For Africa, Says Top Official",
      date: "29 APRIL, 2023",
      img: IMG_1,
   },
   {
      id: 4,
      title: "TotalEnergies U17 AFCON: We Are Here To Make Our Own History, Says Zambia's Bakala",
      date: "29 APRIL, 2023",
      img: IMG_2,
   },
   {
      id: 5,
      title: "TotalEnergies U17 AFCON: Ugbade Urges Caution As Nigeria Hunt For Title Number Three",
      date: "29 APRIL, 2023",
      img: IMG_3,
   },
   {
      id: 6,
      title: "Sundowns Secure Passage Into Semis After Defeating Wydad Casablanca",
      date: "29 APRIL, 2023",
      img: IMG_4,
   },
   {
      id: 7,
      title: "Nigeria's Golden Eaglets Inspired By Success Stories Of Super Eagles Stars",
      date: "29 APRIL, 2023",
      img: IMG_5,
   },
   {
      id: 8,
      title: "Teams Wrap Up Friendlies Before TotalEnergies U17 AFCON Kick-Off",
      date: "28 APRIL, 2023",
      img: IMG_1,
   },
   {
      id: 9,
      title: "TotalEnergies U17 AFCON: Teams Ready To 'Do Africa Proud' With Continental Glory",
      date: "28 APRIL, 2023",
      img: IMG_2,
   },
   {
      id: 10,
      title: "Algeria Opens Its Doors To Welcome Africa Again",
      date: "28 APRIL, 2023",
      img: IMG_3,
   },
   {
      id: 11,
      title: "El Mabil Heroics See Wydad Survive Penalties To Reach Semis",
      date: "28 APRIL, 2023",
      img: IMG_4,
   },
   {
      id: 12,
      title: "TotalEnergies U17 AFCON: The Final Word Goes To North Africa, Says CAF",
      date: "28 APRIL, 2023",
      img: IMG_5,
   },
   {
      id: 13,
      title: "TotalEnergies U17 AFCON: Regragui Visit Ignites Morocco's Hunger",
      date: "29 APRIL, 2023",
      img: IMG_4,
   },
   {
      id: 14,
      title: "CAF And Local Organizing Committee Officially Launch TotalEnergies U17 Africa Cup Of Nations Algeria 2023",
      date: "29 APRIL, 2023",
      img: IMG_5,
   },
   {
      id: 15,
      title: "TotalEnergies U17 AFCON: The Hard Work Begins Here For Africa, Says Top Official",
      date: "29 APRIL, 2023",
      img: IMG_1,
   }
];


export default function NewsPage() {
   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20">
            {/* Page Header */}
            <div className="bg-[#383838] py-8">
               <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
                  <h1 className="text-white text-3xl font-black tracking-wide uppercase">News</h1>
               </div>
            </div>

            {/* Sub-Navigation */}
            <div className="bg-[#292929] border-b border-gray-800">
               <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
                  <ul className="flex items-center gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth whitespace-nowrap">
                     <li>
                        <Link href="/news" className="text-[#b50a0a] text-[10px] font-bold uppercase tracking-widest py-4 block">
                           All News
                        </Link>
                     </li>
                     <li>
                        <Link href="/news/fixtures" className="text-white hover:text-[#b50a0a] transition-colors text-[10px] font-bold uppercase tracking-widest py-4 block">
                           Match Fixtures
                        </Link>
                     </li>
                     <li>
                        <Link href="/news/results" className="text-white hover:text-[#b50a0a] transition-colors text-[10px] font-bold uppercase tracking-widest py-4 block">
                           Results
                        </Link>
                     </li>
                     <li>
                        <Link href="/news/tables" className="text-white hover:text-[#b50a0a] transition-colors text-[10px] font-bold uppercase tracking-widest py-4 block">
                           Tables
                        </Link>
                     </li>
                     <li>
                        <Link href="/news/live-scores" className="text-white hover:text-[#b50a0a] transition-colors text-[10px] font-bold uppercase tracking-widest py-4 block">
                           Live Scores
                        </Link>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 py-12">
               {/* Search Bar */}
               <div className="flex justify-center mb-16">
                  <div className="relative w-full max-w-[600px]">
                     <input 
                        type="text" 
                        placeholder="Search....." 
                        className="w-full border-b-2 border-gray-900 py-3 pl-4 pr-24 text-sm font-bold text-gray-900 focus:outline-none placeholder:text-gray-900"
                     />
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4 text-[#b50a0a]">
                        <Search className="w-4 h-4 cursor-pointer hover:text-red-900 transition-colors" />
                        <span className="text-gray-300">|</span>
                        <Filter className="w-4 h-4 cursor-pointer hover:text-red-900 transition-colors hidden sm:block" />
                     </div>
                  </div>
               </div>

               {/* Latest News Section */}
               <section className="mb-16">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-black text-gray-900">Latest News</h2>
                     <Link href="#" className="text-[10px] font-bold text-gray-400 hover:text-[#b50a0a] uppercase tracking-widest flex items-center gap-1">
                        See All <ChevronRight className="w-3 h-3" />
                     </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {LATEST_NEWS.map((news) => (
                        <div key={news.id} className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full">
                           <div className="h-44 overflow-hidden">
                              <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           </div>
                           <div className="p-5 flex flex-col flex-1 justify-between">
                              <h3 className="font-bold text-gray-900 text-[13px] leading-snug mb-4 group-hover:text-[#b50a0a] transition-colors">
                                 {news.title}
                              </h3>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                 {news.date}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Carousel Indicators for Latest News */}
                  <div className="flex justify-center items-center gap-2 mt-8">
                     <div className="w-8 h-1 bg-[#b50a0a] rounded-full"></div>
                     <div className="w-4 h-1 bg-gray-200 rounded-full"></div>
                  </div>
               </section>

               {/* All News Section */}
               <section className="mb-12">
                  <h2 className="text-xl font-black text-gray-900 mb-6">All News</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {ALL_NEWS.map((news) => (
                        <div key={news.id} className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full">
                           <div className="h-44 overflow-hidden relative">
                              {/* Overlay gradient just for polish */}
                              <div className="absolute inset-0 bg-black/5 block transition-opacity group-hover:opacity-0 pointer-events-none z-10" />
                              <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           </div>
                           <div className="p-5 flex flex-col flex-1 justify-between">
                              <h3 className="font-bold text-gray-900 text-[13px] leading-snug mb-4 group-hover:text-[#b50a0a] transition-colors">
                                 {news.title}
                              </h3>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                 {news.date}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Load More Button */}
               <div className="flex justify-center mt-12 mb-8">
                  <button className="bg-[#b50a0a] hover:bg-[#8b0000] text-white font-bold text-[11px] uppercase tracking-widest px-10 py-3.5 rounded-sm shadow-md transition-colors w-full max-w-[400px]">
                     LOAD MORE
                  </button>
               </div>

            </div>
         </main>

         <Footer />
      </div>
   );
}
