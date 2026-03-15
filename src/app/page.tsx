import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import { ArrowRight, PlayCircle, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-screen-xl mx-auto px-4">
          
          {/* Top Section: Hero & Matches */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Hero Banner */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-[400px] shadow-lg group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
              {/* Fallback pattern if no image */}
              <div className="absolute inset-0 bg-primary/20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee7e537d45c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 mix-blend-overlay" />
              
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-4 inline-block">Latest News</span>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-2">
                  Lorem Ipsum has been the<br />industry's standard
                </h1>
                <p className="text-gray-300 text-sm mt-2 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-primary inline-block"></span>
                  Read more
                </p>
              </div>
            </div>

            {/* Upcoming Matches Panel */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Upcoming Matches</h2>
                <span className="bg-red-100 text-primary text-xs font-bold px-2 py-1 rounded">Live</span>
              </div>
              
              <div className="space-y-4 flex-1">
                {[1, 2, 3].map((match, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col items-center gap-2 w-1/3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex justify-center items-center font-bold text-blue-700 text-xs">TEA</div>
                      <span className="text-xs font-semibold text-gray-700">Team A</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                      <span className="text-xs font-bold text-gray-400 mb-1">12:00 PM</span>
                      <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-800">VS</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-1/3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex justify-center items-center font-bold text-green-700 text-xs">TEB</div>
                      <span className="text-xs font-semibold text-gray-700">Team B</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm font-bold text-primary hover:text-primary-dark flex items-center justify-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
          </div>

          {/* Secondary News Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3].map((news) => (
              <div key={news} className="relative rounded-xl overflow-hidden h-[200px] shadow-md group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gray-800 transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute bottom-0 p-4 z-20">
                  <span className="text-primary text-[10px] uppercase font-bold tracking-wider">Analysis</span>
                  <h3 className="text-white font-bold leading-tight mt-1 text-sm md:text-base group-hover:text-primary transition-colors">
                    Tactical breakdown of the weekend's biggest victory
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Player Showcase Section */}
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Featured</span>
                <h2 className="text-3xl font-bold text-gray-900">Players Profile</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Bamidele Adeniyi', num: 16, img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=600&q=80' },
                { name: 'Yemi Daniel Olanrewaju', num: 24, img: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80' },
                { name: 'Akere Samuel', num: 16, img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80' }
              ].map((player, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-xl group cursor-pointer">
                  <div className="absolute inset-0 bg-black" />
                  <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" style={{ backgroundImage: `url(${player.img})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-green-500 border-2 border-white/20 shadow-lg" />
                  
                  <div className="absolute bottom-0 left-0 p-6 z-20">
                    <span className="text-primary text-5xl font-black italic mb-2 block opacity-90 drop-shadow-md">{player.num}</span>
                    <h3 className="text-2xl font-bold text-white leading-tight w-2/3 drop-shadow-lg">
                      {player.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-10">
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                View All Profiles
              </button>
            </div>
          </div>

        </div>

        {/* Banner Break */}
        <div className="w-full bg-[#8b0000] mt-20 py-12 px-4 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
            <h2 className="text-2xl md:text-4xl font-black text-white capitalize w-full md:w-2/3 leading-tight mb-6 md:mb-0 text-center md:text-left drop-shadow-md">
              Our agency works with athletes of all levels
            </h2>
            <button className="bg-white text-[#8b0000] hover:bg-gray-100 px-8 py-4 rounded-lg font-bold shadow-xl transition-transform hover:-translate-y-1">
              Join Us Today
            </button>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="max-w-screen-xl mx-auto px-4 mt-20">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Videos</span>
                <h2 className="text-3xl font-bold text-gray-900">Highlights</h2>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((highlight) => (
              <div key={highlight} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                <div className="h-48 bg-gray-900 relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 text-white fill-white/80" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">Red Bull vs Chelsea U-19</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm font-semibold text-gray-500">2023 Final</span>
                    <span className="text-xs font-bold text-primary bg-red-50 px-2 py-1 rounded">Watch Highlight</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
