'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, ArrowRight, ArrowLeft, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useState, useEffect, useRef } from 'react';

// Dummy profiles for carousel (8 items)
const DUMMY_PLAYERS = [
   { name: 'Bamidele\nAdeniyi', num: 16, img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80" },
   { name: 'Yemi Daniel\nOlanrewaju', num: 24, img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80" },
   { name: 'Akere\nSamuel', num: 16, img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80" },
   { name: 'Chinedu\nOkonkwo', num: 9, img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80" },
   { name: 'Ibrahim\nMusa', num: 7, img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80" },
   { name: 'Olumide\nAjayi', num: 10, img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80" },
   { name: 'Tunde\nBello', num: 11, img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80" },
   { name: 'Emeka\nUche', num: 4, img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80" }
];

// Dummy images provided via Unsplash
const IMG_HERO = "https://images.unsplash.com/photo-1518605368461-1ee7e537d45c?auto=format&fit=crop&w=1200&q=80"; // Football / World Cup
const IMG_PLAYER_1 = "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80";
const IMG_PLAYER_2 = "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80";
const IMG_PLAYER_3 = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80";
const IMG_NEWS = "https://images.unsplash.com/photo-1431324155629-1a6d0a11f472?auto=format&fit=crop&w=600&q=80";

export default function Home() {
   const [heroSlide, setHeroSlide] = useState(0);
   const [storyPage, setStoryPage] = useState(1);
   const [currentIdx, setCurrentIdx] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentIdx((prev) => (prev + 1) % (DUMMY_PLAYERS.length - 3));
      }, 3000);
      return () => clearInterval(interval);
   }, []);

   const handleHeroScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const scrollLeft = e.currentTarget.scrollLeft;
      const width = e.currentTarget.clientWidth;
      if (width > 0) {
         const currentSlide = Math.round(scrollLeft / width);
         if (currentSlide !== heroSlide) {
            setHeroSlide(currentSlide);
         }
      }
   };

   return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-primary/20">
         <Navbar />

         {/* Main Content Container - Added padding to create space below Nav */}
         <main className="pt-32 pb-0 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-10">

            {/* =======================
            TOP GRID SECTION
        ======================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

               {/* 1st Column: Swipeable Hero (6 columns) */}
               <div className="lg:col-span-6 relative rounded-xl bg-gray-900 border border-transparent overflow-hidden">
                  <div
                     className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden w-full h-full cursor-grab active:cursor-grabbing"
                     onScroll={handleHeroScroll}
                  >
                     {[1, 2, 3].map((slide, idx) => (
                        <div key={idx} className="relative w-full h-[400px] md:h-[420px] shrink-0 snap-center group block">
                           <div className="absolute inset-0 bg-gradient-to-t from-[#8b0000]/90 via-black/40 to-transparent z-10" />
                           <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                              style={{ backgroundImage: `url(${IMG_HERO})` }}
                           />

                           <div className="absolute bottom-0 left-0 p-8 z-20 w-full flex flex-col h-full justify-end">
                              <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 flex items-center gap-1.5 w-max mb-3 rounded shadow-sm">
                                 <div className="w-3.5 h-3.5 bg-blue-100 rounded-sm flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.4 2 2 6.4 2 12s4.4 10 10 10 10-4.4 10-10S17.5 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                                 </div>
                                 LOREM IPSUM
                              </div>

                              <h1 className="text-[28px] md:text-[32px] font-extrabold text-white leading-[1.15] mb-2 max-w-sm drop-shadow-md">
                                 Lorem Ipsum has been the industry's standard
                              </h1>

                              <div className="flex items-center gap-4 text-white/90 text-[10px] font-bold uppercase tracking-widest mt-1 mb-2">
                                 <span>By John Doe</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  {/* Dots navigation overlays on top of Hero */}
                  <div className="absolute bottom-6 left-8 z-30 flex gap-1.5 pointer-events-none">
                     {[0, 1, 2].map((dot) => (
                        <div key={dot} className={`w-1.5 h-1.5 rounded-full shadow-md transition-all duration-300 ${heroSlide === dot ? 'w-6 bg-white' : 'bg-white/40'}`}></div>
                     ))}
                  </div>
               </div>

               {/* 2nd Column: Top Stories (3 columns) */}
               <div className="lg:col-span-3 flex flex-col bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] border border-gray-100 p-8 h-[400px] md:h-[420px] justify-between relative overflow-hidden">
                  <div>
                     <h2 className="text-xs font-black tracking-widest uppercase mb-8 text-gray-900">
                        TOP STORIES
                     </h2>
                     <div className="flex flex-col gap-8 transition-opacity duration-300">
                        {[1, 2, 3].map((item) => (
                           <div key={`${storyPage}-${item}`} className="group cursor-pointer animate-in fade-in duration-500">
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2 block group-hover:text-[#b50a0a] transition-colors">Chelsea News - 27 Mins Ago</span>
                              <h3 className="text-[13px] md:text-[14px] font-bold text-gray-800 leading-[1.3] group-hover:text-[#b50a0a] transition-colors">
                                 {storyPage === 1 ? "Lorem Ipsum Has Been The Industry's Standard" : "Another great piece of football news"}
                              </h3>
                           </div>
                        ))}
                     </div>
                  </div>
                  {/* Pagination */}
                  <div className="flex items-center gap-4 mt-4">
                     <button
                        onClick={() => setStoryPage(prev => Math.max(1, prev - 1))}
                        className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-gray-800 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={storyPage === 1}
                     >
                        <ChevronLeft className="w-3 h-3" />
                     </button>
                     <div className="flex items-center gap-3 text-xs font-black text-gray-900">
                        {[1, 2, 3].map(pageNum => (
                           <span
                              key={pageNum}
                              onClick={() => setStoryPage(pageNum)}
                              className={`cursor-pointer transition-colors ${storyPage === pageNum ? 'text-red-700' : 'text-gray-300 hover:text-gray-900'}`}
                           >
                              {pageNum}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>

               {/* 3rd Column: Upcoming Matches (3 columns) */}
               <div className="lg:col-span-3 flex flex-col relative overflow-hidden bg-white border border-gray-100 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] p-5 h-[400px] md:h-[420px]">
                  <div className="mb-4">
                     <h2 className="text-xs font-black tracking-widest uppercase text-gray-900">Match Fixtures</h2>
                  </div>

                  {/* Static live matches container */}
                  <div className="flex-1 flex flex-col gap-0 -mx-2 px-2">
                     {[1, 2, 3, 4].map((match) => (
                        <div key={match} className="flex flex-col py-3 border-b border-gray-50 last:border-0 relative">
                           {/* LIVE indicator */}
                           <div className="absolute top-3 left-0 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-sm"></div>
                              <span className="text-[7px] font-extrabold text-red-500 uppercase tracking-widest hidden lg:block">Live</span>
                           </div>

                           <div className="text-center text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-2">Today, 20:00</div>

                           <div className="flex justify-between items-center px-1">
                              <div className="flex items-center gap-2 w-[40%] justify-end">
                                 <span className="font-bold text-[10px] text-gray-800 truncate">Chelsea</span>
                                 <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png" className="w-4 h-4 object-contain opacity-90" alt="Chelsea" />
                              </div>
                              <div className="font-black text-[11px] text-[#b50a0a] w-[20%] text-center px-1 py-0.5 rounded italic">2 - 1</div>
                              <div className="flex items-center gap-2 w-[40%] justify-start">
                                 <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png" className="w-4 h-4 object-contain opacity-90" alt="Arsenal" />
                                 <span className="font-bold text-[10px] text-gray-800 truncate">Arsenal</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-4 pt-3 flex justify-center shrink-0">
                     <Link href="/matches" className="text-[9px] font-black text-[#b50a0a] uppercase tracking-widest hover:underline flex items-center gap-1 transition-colors">
                        View More Live Matches <ArrowRight className="w-3 h-3" />
                     </Link>
                  </div>
               </div>

            </div>

            {/* =======================
            4 IMAGE CARDS ROW
        ======================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
               {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="relative rounded-xl overflow-hidden h-[180px] group cursor-pointer shadow-sm border border-gray-100">
                     <div className="absolute inset-0 bg-black/30 z-10 transition-opacity group-hover:bg-black/20" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                     <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${IMG_NEWS})` }}
                     />
                     <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                        <span className="text-white/80 text-[10px] font-semibold mb-1 block flex items-center gap-1">
                           <PlayCircle className="w-3 h-3" /> 17 hours ago
                        </span>
                        <h3 className="text-xs md:text-sm font-bold text-white leading-tight">
                           Lorem Ipsum has been the industry's standard
                        </h3>
                     </div>
                  </div>
               ))}
            </div>

         </main>

         {/* =======================
          PLAYER PROFILES
      ======================== */}
         <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-16 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#b50a0a] flex items-center justify-center shadow-lg shadow-red-900/20">
                     <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Featured</span>
                     <h2 className="text-2xl md:text-3xl font-light text-gray-900">Players Profile</h2>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button
                     onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                     className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#b50a0a] hover:text-[#b50a0a] transition-colors bg-white shadow-sm"
                  >
                     <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                     onClick={() => setCurrentIdx(prev => (prev + 1) % (DUMMY_PLAYERS.length - 3))}
                     className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#b50a0a] hover:text-[#b50a0a] transition-colors bg-white shadow-sm"
                  >
                     <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
            </div>

            <div className="relative w-full overflow-hidden">
               <div
                  className="flex transition-transform duration-700 ease-in-out gap-6"
                  style={{ transform: `translateX(calc(-${currentIdx * 25}% - ${currentIdx * 6}px))` }}
               >
                  {DUMMY_PLAYERS.map((player, idx) => (
                     <div key={idx} className="relative rounded-xl overflow-hidden aspect-[4/5] bg-gray-900 shadow-xl group border border-gray-800 shrink-0 w-[calc((100%-18px)/1)] md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)]">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${player.img})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute inset-0 bg-[#b50a0a]/30 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Flag Icon */}
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-600 border-[1.5px] border-white/40 shadow-xl shrink-0 flex items-center justify-center overflow-hidden">
                           <div className="w-2 h-full bg-white block absolute left-1/2 -translate-x-1/2"></div>
                        </div>

                        <div className="absolute bottom-0 left-0 p-6">
                           <span className="text-[#b50a0a] text-5xl font-black italic block leading-none drop-shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">{player.num}</span>
                           <h3 className="text-2xl font-bold text-white leading-tight mt-2 whitespace-pre-line drop-shadow-md">
                              {player.name}
                           </h3>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex justify-center mt-10">
               <Link href="/athletes">
                  <button className="bg-[#b50a0a] hover:bg-[#8b0000] text-white px-8 py-3 rounded-md text-sm font-bold uppercase tracking-widest shadow-lg shadow-red-900/20 transition-all hover:-translate-y-0.5">
                     View More Players
                  </button>
               </Link>
            </div>
         </section>

         {/* =======================
          AGENCY PROMO BANNER
      ======================== */}
         <section className="bg-[#fcf5f5] py-16">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 relative">

               <div className="bg-[#990000] rounded-xl p-10 md:p-14 text-center relative shadow-2xl border border-red-800">
                  {/* Decorative background grid/pattern could go here */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-10 mix-blend-overlay rounded-xl overflow-hidden"></div>

                  {/* Avatars floating top center */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex -space-x-4">
                     <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-300 shadow-md overflow-hidden"><img src="https://i.pravatar.cc/100?img=1" alt="agent" /></div>
                     <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-400 shadow-md overflow-hidden z-10"><img src="https://i.pravatar.cc/100?img=2" alt="agent" /></div>
                     <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-500 shadow-md overflow-hidden"><img src="https://i.pravatar.cc/100?img=3" alt="agent" /></div>
                  </div>

                  <div className="relative z-20 mt-4">
                     <span className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-3 block">Let's work together</span>
                     <h2 className="text-2xl md:text-4xl font-black text-white px-4 leading-tight mb-8">
                        Our agency works with athelets of all levels
                     </h2>
                     <button className="bg-white text-[#990000] px-8 py-3 rounded text-sm font-bold uppercase tracking-widest shadow-xl hover:bg-gray-50 transition-colors">
                        Contact Us
                     </button>
                  </div>
               </div>

            </div>
         </section>

         {/* =======================
          REVIEWS
      ======================== */}
         <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#b50a0a] flex items-center justify-center shadow-lg shadow-red-900/20">
                     <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Reviews</span>
                     <h2 className="text-2xl md:text-3xl font-light text-gray-900 max-w-[250px] leading-tight">Some reviews from satisfied users</h2>
                  </div>
               </div>
               <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#b50a0a] hover:text-[#b50a0a] transition-colors bg-white shadow-sm">
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#fcfafa]/50 rounded-xl p-8 border border-gray-100 shadow-sm relative hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-2">
                        <div className="w-0 h-0 border-l-8 border-l-transparent border-b-[14px] border-b-blue-600 border-r-8 border-r-transparent"></div>
                        <span className="font-bold text-gray-900 text-sm">Company</span>
                     </div>
                     <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                     </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 😊
                  </p>
                  <div className="flex items-center gap-3">
                     <img src="https://i.pravatar.cc/100?img=11" className="w-10 h-10 rounded-full" alt="User" />
                     <div>
                        <h4 className="font-bold text-gray-900 text-xs">John Carter</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">CEO at Facebook, Meta INC.</p>
                     </div>
                  </div>
               </div>

               <div className="bg-[#fcfafa]/50 rounded-xl p-8 border border-gray-100 shadow-sm relative hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500 inline-block mr-1"></div>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-b-[10px] border-b-yellow-500 border-r-[6px] border-r-transparent -ml-2 inline-block"></div>
                        <span className="font-bold text-gray-900 text-sm">Company</span>
                     </div>
                     <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                     </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8">
                     Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 😆
                  </p>
                  <div className="flex items-center gap-3">
                     <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full" alt="User" />
                     <div>
                        <h4 className="font-bold text-gray-900 text-xs">Phillip K. Dick</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Writer at NYT</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-center mt-10">
               <button className="text-gray-900 text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                  View All Reviews <ChevronRight className="w-3 h-3" />
               </button>
            </div>
         </section>

         {/* =======================
          ADVERT PLACEMENT
      ======================== */}
         <section className="py-24 text-center">
            <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Advert Placement</span>
         </section>

         {/* =======================
          HIGHLIGHTS
      ======================== */}
         <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#b50a0a] flex items-center justify-center shadow-lg shadow-red-900/20">
                     <PlayCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Videos</span>
                     <h2 className="text-2xl md:text-3xl font-light text-gray-900">Highlights</h2>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#b50a0a] hover:text-[#b50a0a] transition-colors bg-white shadow-sm">
                     <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#b50a0a] hover:text-[#b50a0a] transition-colors bg-white shadow-sm">
                     <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[1, 2, 3].map((highlight) => (
                  <div key={highlight} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1">
                     {/* Red Hexagon pattern image area */}
                     <div className="h-44 bg-[#990000] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/honeycomb.png')] opacity-30 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                        {/* Hexagon shape center decoration */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className="w-20 h-20 opacity-20 border-[3px] border-white rotate-[30deg] hexagon-shape"></div>
                        </div>
                     </div>
                     <div className="p-5">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Red Bull VS Chelsea U-19</span>
                        <h3 className="font-bold text-gray-900 text-sm mb-4">2023 Final</h3>
                        <div>
                           <span className="text-[10px] font-bold text-[#b50a0a] flex items-center gap-1 uppercase tracking-wider">
                              Watch Highlight <PlayCircle className="w-3.5 h-3.5 fill-[#b50a0a] text-white" />
                           </span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Carousel Indicator Line */}
            <div className="flex justify-center mt-10">
               <div className="flex items-center gap-2">
                  <div className="w-10 h-[2px] bg-gray-200"></div>
                  <div className="w-10 h-[2px] bg-[#b50a0a]"></div>
                  <div className="w-10 h-[2px] bg-gray-200"></div>
               </div>
            </div>
         </section>

         {/* =======================
          FOOTER BANNER
      ======================== */}
         <section className="bg-[#fcf5f5] py-16">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 relative">
               <div className="bg-[#990000] rounded-xl p-10 md:p-14 text-center relative shadow-2xl border border-red-800">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-10 mix-blend-overlay rounded-xl overflow-hidden"></div>

                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex -space-x-4">
                     <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-300 shadow-md overflow-hidden"><img src="https://i.pravatar.cc/100?img=4" alt="agent" /></div>
                     <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-400 shadow-md overflow-hidden z-10"><img src="https://i.pravatar.cc/100?img=5" alt="agent" /></div>
                     <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-500 shadow-md overflow-hidden"><img src="https://i.pravatar.cc/100?img=6" alt="agent" /></div>
                  </div>

                  <div className="relative z-20 mt-4">
                     <span className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-3 block">Have a question?</span>
                     <h2 className="text-2xl md:text-3xl font-black text-white px-4 leading-tight mb-8">
                        We can help you achieve your goals in football.
                     </h2>
                     <button className="bg-white text-[#990000] px-8 py-3 rounded text-sm font-bold uppercase tracking-widest shadow-xl hover:bg-gray-50 transition-colors">
                        Contact Us
                     </button>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </div>
   );
}
