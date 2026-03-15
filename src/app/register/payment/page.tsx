"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Lock, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";
import { useState, Suspense, useEffect } from "react";
import Link from 'next/link';
import { getRegistrationData } from '@/lib/registrationStore';

function RegisterPaymentContent() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const [role, setRole] = useState('athlete');
   const [isProcessing, setIsProcessing] = useState(false);

   useEffect(() => {
      const data = getRegistrationData();
      if (data.role) {
         setRole(data.role);
      }
   }, []);

   const price = "15,000";

   const handlePayment = (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);
      // Simulate Paystack processing
      setTimeout(() => {
         router.push('/register/success');
      }, 2500);
   };

   return (
      <main className="pt-32 pb-24">
         <div className="max-w-[1000px] mx-auto px-4 lg:px-0">
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-16 px-4">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center font-black">✓</div>
                  <div className="w-16 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-12 h-12 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center font-black">✓</div>
                  <div className="w-16 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-12 h-12 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center font-black">✓</div>
                  <div className="w-16 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-12 h-12 rounded-full bg-[#a20000] text-white flex items-center justify-center font-black animate-pulse">4</div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
               
               {/* Left: Summary */}
               <div className="space-y-10 px-4">
                  <div>
                     <span className="text-[#a20000] font-black text-xs uppercase tracking-[0.4em] mb-4 block underline underline-offset-8">Secure Checkout</span>
                     <h1 className="text-4xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-6">
                        Finalize Your <br />
                        <span className="text-[#a20000]">Subscription</span>
                     </h1>
                  </div>

                  <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100 space-y-6 shadow-sm">
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Order Summary</h3>
                     <div className="flex justify-between items-center py-4 border-b border-gray-200">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{role} Pro Membership</span>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quarterly Exposure Plan</span>
                        </div>
                        <span className="text-[10px] font-black text-[#a20000] uppercase tracking-widest">Pro Activation</span>
                     </div>
                     <div className="flex justify-between items-center py-4">
                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Status</span>
                        <span className="text-sm font-bold text-gray-400">Ready for Payment</span>
                     </div>
                     <div className="flex justify-between items-center py-6 border-t-2 border-gray-200 mt-4">
                        <span className="text-lg font-black text-gray-900 uppercase tracking-widest leading-tight">Proceed to <br />Activation</span>
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                           <ShieldCheck className="w-6 h-6 text-[#a20000]" />
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-6 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                     <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
                     <p className="text-xs font-semibold text-blue-700 leading-relaxed">Your transaction is encrypted with 256-bit SSL security. Payments are securely processed via <span className="font-black">Paystack</span>.</p>
                  </div>
               </div>

               {/* Right: Payment Form */}
               <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-[0_60px_100px_rgba(0,0,0,0.08)] relative overflow-hidden">
                  
                  {isProcessing && (
                     <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                        <div className="w-16 h-16 border-4 border-gray-100 border-t-[#a20000] rounded-full animate-spin mb-8"></div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Processing Payment</h3>
                        <p className="text-gray-400 text-sm font-medium">Please do not refresh the page or close the window. We're securely authorizing your transaction with Paystack.</p>
                     </div>
                  )}

                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                     <CreditCard className="w-4 h-4 text-[#a20000]" /> Payment details
                  </h3>

                  <form onSubmit={handlePayment} className="space-y-8 text-left">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                        <div className="relative">
                           <input 
                              type="text" 
                              placeholder="0000 0000 0000 0000" 
                              required
                              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                           />
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                              <div className="w-8 h-5 bg-orange-400 rounded-sm opacity-50"></div>
                              <div className="w-8 h-5 bg-blue-400 rounded-sm opacity-50"></div>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                           <input 
                              type="text" 
                              placeholder="MM / YY" 
                              required
                              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CVV / CVC</label>
                           <input 
                              type="password" 
                              placeholder="***" 
                              maxLength={3}
                              required
                              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                           />
                        </div>
                     </div>

                     <div className="pt-6">
                         <button 
                            type="submit"
                            className="w-full bg-[#a20000] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#8a0000] transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(162,0,0,0.3)] transform active:scale-95"
                         >
                            <Lock className="w-4 h-4" /> Secure Pro Activation
                         </button>
                     </div>

                     <div className="flex items-center justify-center gap-2 pt-4">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secured by</p>
                        <span className="text-[10px] font-black text-[#00c3f8]">Paystack</span>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </main>
   );
}

export default function RegisterPaymentPage() {
   return (
      <div className="min-h-screen bg-white">
         <Navbar />
         <Suspense fallback={<div className="pt-32 text-center font-black uppercase tracking-widest animate-pulse">Loading Checkout...</div>}>
            <RegisterPaymentContent />
         </Suspense>
         <Footer />
      </div>
   );
}
