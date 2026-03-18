"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronRight, Users, Briefcase, Trophy, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { getRegistrationData, saveRegistrationData } from "@/lib/registrationStore";

export default function RegisterPage() {
   const [savedRole, setSavedRole] = useState<string | null>(null);

   useEffect(() => {
      const data = getRegistrationData();
      if (data.role) {
         setSavedRole(data.role);
      }
   }, []);

   const roles = [
      {
         id: "athlete",
         title: "Athlete",
         subtitle: "Showcase your talent to the world",
         icon: <Trophy className="w-12 h-12" />,
         benefits: [
            "Professional Digital E-Profile",
            "Scouting & Agency Visibility",
            "Career Performance Tracking",
            "Video Highlight Integration"
         ],
         accent: "from-red-600 to-red-900",
         cta: "Register as Athlete"
      },
      {
         id: "coach",
         title: "Coach",
         subtitle: "Manage and lead the next stars",
         icon: <Users className="w-12 h-12" />,
         benefits: [
            "Technical Management Profile",
            "Tactical Visualization Tools",
            "Coach-Agent Networking",
            "Team Management Dashboard"
         ],
         accent: "from-gray-800 to-black",
         cta: "Register as Coach"
      },
      {
         id: "agent",
         title: "Agent / Scout",
         subtitle: "Find and represent top talent",
         icon: <Briefcase className="w-12 h-12" />,
         benefits: [
            "Agency Portfolio Management",
            "Global Talent Search Access",
            "Transfer History Verification",
            "Strategic Networking Tools"
         ],
         accent: "from-blue-900 to-black",
         cta: "Register as Agent"
      }
   ];

   const handleRoleSelect = (roleId: string) => {
      saveRegistrationData({ role: roleId, step: 1 });
   };

   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-32 pb-24">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
               
               {/* Progress Indicator */}
               <div className="flex items-center justify-center mb-16">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-[#a20000] text-white flex items-center justify-center font-black">1</div>
                     <div className="w-16 h-1 bg-gray-100 rounded-full"></div>
                     <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-black">2</div>
                  </div>
               </div>

               <div className="text-center mb-20 px-4">
                  {savedRole && (
                     <div className="mb-8 inline-flex items-center gap-3 bg-red-50 px-6 py-3 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-4 duration-700">
                        <span className="text-[10px] font-black text-[#a20000] uppercase tracking-widest">Resuming Progress</span>
                        <Link href="/register/details" className="text-[10px] font-black underline uppercase tracking-widest text-[#a20000] hover:text-black transition-colors">Continue with {savedRole} profile →</Link>
                     </div>
                  )}
                  <span className="text-[#a20000] font-black text-xs uppercase tracking-[0.4em] mb-4 block">Get Started</span>
                  <h1 className="text-5xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-6">
                     Choose Your <br />
                     <span className="text-[#a20000]">Professional Identity</span>
                  </h1>
                  <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                     Select the role that best fits your career in football. Each profile type is designed to maximize your visibility and professional networking opportunities.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {roles.map((role) => (
                     <div key={role.id} className="group relative flex flex-col bg-white rounded-[40px] border border-gray-100 hover:border-[#a20000] shadow-sm hover:shadow-[0_40px_80px_rgba(162,0,0,0.1)] transition-all duration-700 overflow-hidden">
                        {/* Top Gradient Header */}
                        <div className={`h-40 bg-gradient-to-br ${role.accent} relative overflow-hidden flex items-center justify-center`}>
                           <div className="absolute inset-0 opacity-20 pointer-events-none">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
                           </div>
                           <div className="text-white group-hover:scale-110 transition-transform duration-700 relative z-10">
                              {role.icon}
                           </div>
                        </div>

                        <div className="p-10 flex-1 flex flex-col">
                           <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">{role.title}</h2>
                           <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-10">{role.subtitle}</p>
                           
                           <div className="space-y-4 mb-12">
                              {role.benefits.map((benefit, i) => (
                                 <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
                                       <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600 tracking-tight">{benefit}</span>
                                 </div>
                              ))}
                           </div>

                           <Link 
                              href={`/register/details?role=${role.id}`} 
                              onClick={() => handleRoleSelect(role.id)}
                              className="mt-auto"
                           >
                              <button className="w-full bg-gray-900 group-hover:bg-[#a20000] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 shadow-xl transform active:scale-95">
                                 {role.cta} <ChevronRight className="w-4 h-4" />
                              </button>
                           </Link>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Help Section */}
               <div className="mt-24 text-center">
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                     Already have an account? <Link href="/login" className="text-[#a20000] hover:underline ml-2">Login Now</Link>
                  </p>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   );
}
