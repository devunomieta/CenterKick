'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
   Briefcase, 
   Lightbulb, 
   ShieldCheck, 
   Eye, 
   Star, 
   UserCircle,
   ArrowRight
} from "lucide-react";
import Link from "next/link";

const heroImage = "file:///C:/Users/Dev-Unomieta/.gemini/antigravity/brain/1982e174-2be0-4ff6-a634-fa7b706aa06e/about_hero_stadium_1773604309328.png";
const missionImage = "file:///C:/Users/Dev-Unomieta/.gemini/antigravity/brain/1982e174-2be0-4ff6-a634-fa7b706aa06e/about_mission_light_1773604812867.png";
const visionImage = "file:///C:/Users/Dev-Unomieta/.gemini/antigravity/brain/1982e174-2be0-4ff6-a634-fa7b706aa06e/about_vision_light_1773604827170.png";

const philosophies = [
   { icon: <Briefcase className="w-6 h-6 text-[#ff3333]" />, title: "Professionalism", desc: "Presenting players and football content at the highest standard." },
   { icon: <Lightbulb className="w-6 h-6 text-[#ff3333]" />, title: "Innovation", desc: "Adapting to new trends and technologies in football and media." },
   { icon: <ShieldCheck className="w-6 h-6 text-[#ff3333]" />, title: "Integrity", desc: "Operating with honesty and responsibility." },
   { icon: <Eye className="w-6 h-6 text-[#ff3333]" />, title: "Transparency", desc: "Clear processes, fair visibility, and open communication." },
   { icon: <Star className="w-6 h-6 text-[#ff3333]" />, title: "Excellence", desc: "Delivering quality in every profile, story, and project." },
   { icon: <UserCircle className="w-6 h-6 text-[#ff3333]" />, title: "Personalization", desc: "Treating every football journey as unique." }
];

const services = [
   { num: "01", title: "Player E-Profile Creation & Management", desc: "Well-structured and easy to navigate portfolios designed to showcase player data, stats, photos, videos, and career history. Shareable and accessible to agents, scouts, clubs, and managers.", image: "file:///C:/Users/Dev-Unomieta/.gemini/antigravity/brain/1982e174-2be0-4ff6-a634-fa7b706aa06e/about_service_1_1773604842119.png" },
   { num: "02", title: "Scouting & Talent Visibility", desc: "Bridging the gap between talent and opportunity by making player profiles discoverable, allowing scouts and agents to follow players, and supporting scouting events, tournaments, and leagues.", image: "file:///C:/Users/Dev-Unomieta/.gemini/antigravity/brain/1982e174-2be0-4ff6-a634-fa7b706aa06e/about_service_2_1773604859034.png" },
   { num: "03", title: "Media, PR & Football Coverage", desc: "Providing football news, stories, and analysis. Player features, interviews, and media PR for players, clubs, academies, and football organizations wanting professional promotion.", image: "file:///C:/Users/Dev-Unomieta/.gemini/antigravity/brain/1982e174-2be0-4ff6-a634-fa7b706aa06e/about_service_3_1773604873237.png" },
   { num: "04", title: "Marketing & Career Support", desc: "Social media management, personal branding, marketing support, and holistic career development guidance on and off the pitch.", image: "file:///C:/Users/Dev-Unomieta/.gemini/antigravity/brain/1982e174-2be0-4ff6-a634-fa7b706aa06e/about_service_4_1773604890525.png" }
];

export default function AboutUsPage() {
   return (
      <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#b50a0a] selection:text-white">
         <Navbar />

         <main className="flex-grow pt-20">
            
            {/* 1. Immersive Tech Hero (Kept dark for impact, fading to white) */}
            <div className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 z-0 bg-[#050505]">
                  <img src={heroImage} className="w-full h-full object-cover scale-105 opacity-60" alt="Stadium" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/60 to-white mix-blend-multiply"></div>
               </div>
               
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 overflow-hidden pointer-events-none">
                  <h1 className="text-[15vw] font-black uppercase tracking-tighter text-transparent stroke-text opacity-10 leading-none">
                     CENTERKICK
                  </h1>
               </div>

               <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center mt-20">
                  <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                     <span className="w-2 h-2 rounded-full bg-[#ff3333] animate-pulse"></span>
                     <span className="text-white font-bold text-xs uppercase tracking-widest drop-shadow-md">Who We Are</span>
                  </div>
                  
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                     About <span className="text-[#ff4d4d]">Us</span>
                  </h2>
                  
                  <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-[700px] mx-auto font-medium drop-shadow-md">
                     A modern football media, marketing, and talent exposure platform built to <span className="text-white font-bold">empower footballers</span> at all levels.
                  </p>
               </div>
               
               <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-10"></div>
            </div>

            {/* 2. The Statement Block */}
            <div className="w-full bg-white py-24 px-6 relative z-20">
               <div className="max-w-[1000px] mx-auto text-center">
                  <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight uppercase tracking-tight">
                     Our goal is simple. <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b50a0a] to-[#ff4d4d]">
                        Make football visibility accessible, professional, and impactful.
                     </span>
                  </h3>
               </div>
            </div>

            {/* 3. Revamped Mission & Vision (Photography Driven) */}
            <div className="w-full bg-white pb-32">
               {/* Mission Row */}
               <div className="max-w-[1200px] mx-auto px-6 py-16 border-t border-gray-100">
                  <div className="flex flex-col lg:flex-row items-center gap-16">
                     {/* Image Left */}
                     <div className="w-full lg:w-1/2">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] aspect-[4/3] group">
                           <div className="absolute inset-0 bg-[#b50a0a]/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                           <img src={missionImage} alt="Our Mission" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                     </div>
                     {/* Text Right */}
                     <div className="w-full lg:w-1/2">
                        <div className="inline-flex items-center gap-3 mb-6">
                           <span className="w-10 h-1 bg-[#b50a0a]"></span>
                           <h3 className="text-sm font-black text-[#b50a0a] tracking-[0.2em] uppercase">Our Mission</h3>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                           Empowering Talent <br className="hidden md:block"/> At All Levels
                        </h2>
                        <p className="text-gray-600 text-xl leading-relaxed font-medium">
                           To empower footballers at all levels by providing them with a professional and user-friendly <strong className="text-gray-900">e-profile platform</strong> that showcases their skills and experience, connecting them directly with agents, scouting teams, and managers.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Vision Row */}
               <div className="max-w-[1200px] mx-auto px-6 py-16">
                  <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                     {/* Image Right */}
                     <div className="w-full lg:w-1/2">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] aspect-[4/3] group">
                           <div className="absolute inset-0 bg-[#16a34a]/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                           <img src={visionImage} alt="Our Vision" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                     </div>
                     {/* Text Left */}
                     <div className="w-full lg:w-1/2">
                        <div className="inline-flex items-center gap-3 mb-6">
                           <span className="w-10 h-1 bg-gray-800"></span>
                           <h3 className="text-sm font-black text-gray-800 tracking-[0.2em] uppercase">Our Vision</h3>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                           The Leading Sports <br className="hidden md:block"/> Marketing Agency
                        </h2>
                        <p className="text-gray-600 text-xl leading-relaxed mb-8 font-medium">
                           To become the leading Sports Marketing Agency in the football industry, recognised for innovative solutions, personalised services, and an unwavering commitment to empowerment.
                        </p>
                        <div className="pl-6 border-l-4 border-gray-200">
                           <p className="text-gray-500 text-lg italic leading-relaxed">
                              "Revolutionizing the way footballers showcase their talent and connect... creating a more accessible, fair, and inclusive football community."
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 4. Core Philosophy Grid (PIITEP) */}
            <div className="w-full bg-gray-50 py-32 px-6 border-y border-gray-100">
               <div className="max-w-[1200px] mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                     <div>
                        <span className="text-[#b50a0a] font-bold tracking-[0.2em] uppercase mb-4 block text-sm">P.I.I.T.E.P</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">Our Philosophy</h2>
                     </div>
                     <p className="text-gray-500 max-w-[400px] font-medium text-lg">
                        Strong values that guide everything we do, empowering footballers to achieve their full potential.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                     {philosophies.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(181,10,10,0.15)] hover:border-[#b50a0a]/20 hover:-translate-y-2 transition-all duration-300 group">
                           <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-[#b50a0a]/5 group-hover:scale-110 transition-all border border-gray-100 group-hover:border-[#b50a0a]/20">
                              {item.icon}
                           </div>
                           <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{item.title}</h3>
                           <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* 5. What We Do (Services) - Image Integrated Layout */}
            <div className="w-full bg-white py-32">
               <div className="max-w-[1200px] mx-auto px-6">
                  
                  <div className="text-center mb-24 relative">
                     <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-50 uppercase tracking-tighter w-full pointer-events-none select-none">
                        WHAT WE DO
                     </h2>
                     <p className="text-[#b50a0a] text-xl md:text-2xl font-black uppercase tracking-widest absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full mt-4 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                        Core Services
                     </p>
                  </div>

                  <div className="space-y-32">
                     {services.map((svc, idx) => {
                        const isEven = idx % 2 !== 0;
                        return (
                           <div key={idx} className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20 relative`}>
                              
                              <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'left-0 lg:-left-10' : 'right-0 lg:-right-10'} text-[200px] md:text-[250px] font-black text-gray-50 pointer-events-none z-0 hidden lg:block select-none leading-none`}>
                                 {svc.num}
                              </div>

                              <div className="w-full lg:w-1/2 relative z-10 mt-8 lg:mt-0">
                                 <div className="inline-block text-[#b50a0a] font-black text-sm uppercase tracking-widest mb-6 border-b-2 border-[#b50a0a] pb-1">
                                    Service {svc.num}
                                 </div>
                                 <h3 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-8 leading-tight">
                                    {svc.title}
                                 </h3>
                                 <p className="text-gray-600 text-xl leading-relaxed font-medium mb-8">
                                    {svc.desc}
                                 </p>
                                 <Link href="/transfer-focus" className="inline-flex items-center gap-2 text-[#b50a0a] font-bold uppercase tracking-wider hover:text-gray-900 transition-colors group">
                                    Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                 </Link>
                              </div>

                              {/* Service Specific Custom Imagery */}
                              <div className="w-full lg:w-1/2 relative z-10">
                                 <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group aspect-square max-w-[500px] mx-auto">
                                    <div className="absolute inset-0 bg-[#b50a0a]/5 mix-blend-multiply z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                                    <img src={svc.image} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                 </div>
                              </div>

                           </div>
                        );
                     })}
                  </div>

               </div>
            </div>

            {/* 6. Footer CTA - Deep Charcoal */}
            <div className="w-full bg-slate-950 py-24 px-6 relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#b50a0a]/15 blur-[120px] pointer-events-none rounded-full rounded-t-none"></div>
               
               <div className="max-w-[800px] mx-auto text-center relative z-10">
                  <div className="inline-block mb-8 bg-white/5 p-4 rounded-[2rem] border border-white/10 backdrop-blur-sm shadow-xl">
                     <ShieldCheck className="w-10 h-10 text-[#ff4d4d]" />
                  </div>
                  <h2 className="text-xs font-black text-gray-400 tracking-[0.4em] uppercase mb-6">
                     Why CenterKick
                  </h2>
                  <p className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight uppercase mb-8">
                     Be seen. Be discovered. <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d4d] to-[#b50a0a]">Build your football future.</span>
                  </p>
                  <p className="text-gray-400 text-lg font-medium max-w-[600px] mx-auto mb-12">
                     More than just a platform — an elite network built to support your growth, maximize visibility, and unlock true footballing opportunities.
                  </p>
                  
                  <Link href="/login" className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-[#b50a0a] font-black uppercase tracking-widest px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(181,10,10,0.15)] hover:shadow-[0_0_40px_rgba(181,10,10,0.3)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto overflow-hidden group">
                     <span className="relative z-10 flex items-center gap-3">
                        Join The Network <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </span>
                  </Link>
               </div>
            </div>

         </main>
         <Footer />
         
         <style dangerouslySetInnerHTML={{__html: `
            .stroke-text {
               -webkit-text-stroke: 1px rgba(255,255,255,0.6);
            }
         `}} />
      </div>
   );
}
