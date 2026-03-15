"use client";

import { useSearchParams } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronRight, Check, Trophy, Zap, ShieldCheck, Globe, Star } from "lucide-react";
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { getRegistrationData } from '@/lib/registrationStore';

function RegisterPricingContent() {
   const searchParams = useSearchParams();
   const [role, setRole] = useState(searchParams.get('role') || 'athlete');

   useEffect(() => {
      const data = getRegistrationData();
      if (data.role && !searchParams.get('role')) {
         setRole(data.role);
      }
   }, [searchParams]);

   const plan = {
      name: "Quarterly Pro",
      desc: "The professional standard for those seeking maximum exposure and elite career opportunities.",
      features: [
         "Verified Professional Badge",
         "Priority Search & Discovery Listing",
         "Premium Multi-tab Public Profile",
         "Performance & Tactical Dashboards",
         "Unlimited News & Highlight Integration",
         "Direct Agency & Scout Networking",
         "Scouting ROI Analytics",
         "Continuous Profile Support"
      ],
      cta: "Secure Maximum Exposure"
   };

   return (
      <main className="pt-32 pb-24">
         <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-16">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center font-black">✓</div>
                  <div className="w-16 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-12 h-12 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center font-black">✓</div>
                  <div className="w-16 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-12 h-12 rounded-full bg-[#a20000] text-white flex items-center justify-center font-black animate-pulse">3</div>
                  <div className="w-16 h-1 bg-gray-100 rounded-full"></div>
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-black">4</div>
               </div>
            </div>

            <div className="text-center mb-20 px-4">
               <span className="text-[#a20000] font-black text-xs uppercase tracking-[0.4em] mb-4 block underline underline-offset-8">Professional Growth</span>
               <h1 className="text-5xl lg:text-8xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-8">
                  Maximize Your <br />
                  <span className="text-[#a20000]">Market Exposure.</span>
               </h1>
               <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                  Join the elite network with our professional tier. 100% focused on your professional visibility and career advancement.
               </p>
            </div>

            <div className="max-w-[900px] mx-auto">
               <div className="relative flex flex-col md:flex-row items-stretch rounded-[60px] border-4 border-[#a20000]/10 bg-white overflow-hidden shadow-[0_60px_120px_rgba(162,0,0,0.1)] group">
                  
                  {/* Left Panel: Pricing & Desc */}
                  <div className="md:w-1/2 p-12 md:p-16 bg-[#0a0a0a] text-white flex flex-col justify-center relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#a20000] blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                     
                     <div className="relative z-10">
                        <div className="bg-[#a20000] w-fit px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 shadow-lg flex items-center gap-2">
                           <Star className="w-3 h-3 fill-current" /> Official Pro Tier
                        </div>
                        <h3 className="text-4xl font-black uppercase tracking-tight mb-4">{plan.name}</h3>
                        <p className="text-gray-400 text-sm font-semibold mb-12 uppercase tracking-widest border-l-2 border-[#a20000] pl-6 leading-relaxed">{plan.desc}</p>
                        
                        <div className="flex items-baseline gap-3 mb-10">
                           <span className="text-sm font-bold uppercase tracking-widest text-[#a20000]">Professional Verification Hub</span>
                        </div>
                        
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Secure Checkout • Cancel Anytime • Instant Activation</p>
                     </div>
                  </div>

                  {/* Right Panel: Features */}
                  <div className="md:w-1/2 p-12 md:p-16 flex flex-col bg-white">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12 border-b border-gray-100 pb-6">What's Included?</h4>
                     
                     <div className="space-y-6 mb-16">
                        {plan.features.map((feature, j) => (
                           <div key={j} className="flex items-center gap-4 group/item">
                              <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100 transition-colors group-hover/item:bg-[#a20000]">
                                 <Check className="w-3.5 h-3.5 text-[#a20000] transition-colors group-hover/item:text-white" />
                              </div>
                              <span className="text-base font-bold tracking-tight text-gray-700">{feature}</span>
                           </div>
                        ))}
                     </div>

                     <Link href={`/register/payment?role=${role}&plan=pro`} className="mt-auto">
                        <button className="w-full bg-[#a20000] text-white py-6 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all transform active:scale-95 flex items-center justify-center gap-4 shadow-[0_30px_60px_rgba(162,0,0,0.3)] hover:bg-[#8a0000] hover:-translate-y-1">
                           {plan.cta} <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                        </button>
                     </Link>
                  </div>
               </div>
            </div>

            {/* Testimonial / Social Proof */}
            <div className="mt-32 pt-24 border-t border-gray-100 text-center">
               <div className="max-w-2xl mx-auto italic text-2xl font-medium text-gray-500 mb-12 leading-relaxed">
                  "CenterKick didn't just give me a profile, they gave me the stage. Within 3 months of going Elite, I had interests from two major European agencies."
               </div>
               <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#a20000] flex items-center justify-center shrink-0">
                     <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                     <span className="block font-black text-gray-900 uppercase tracking-tighter">Verified Success</span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Over 1,200 Professional Placements</span>
                  </div>
               </div>
            </div>

         </div>
      </main>
   );
}

export default function RegisterPricingPage() {
   return (
      <div className="min-h-screen bg-white">
         <Navbar />
         <Suspense fallback={<div className="pt-32 text-center font-black uppercase tracking-widest animate-pulse">Loading Tiers...</div>}>
            <RegisterPricingContent />
         </Suspense>
         <Footer />
      </div>
   );
}
