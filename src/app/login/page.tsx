"use client";

import { useState } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, Chrome } from "lucide-react";
import Link from 'next/link';
import { login, signup } from './actions';

export default function LoginPage() {
   const [mode, setMode] = useState<'login' | 'signup'>('login');
   const [isLoading, setIsLoading] = useState(false);
   const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setStatus(null);
      
      const formData = new FormData(e.currentTarget);
      
      try {
         const result = mode === 'login' ? await login(formData) : await signup(formData);
         
         const res = result as { error?: string, success?: boolean, message?: string };
         
         if (res.error) {
            setStatus({ type: 'error', message: res.error });
         } else if (res.success) {
            setStatus({ type: 'success', message: res.message || 'Action completed.' });
         }
      } catch (err: any) {
         setStatus({ type: 'error', message: 'An unexpected error occurred.' });
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-32 pb-24">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
               
               {/* Left: Branding & Value Prop */}
               <div className="lg:w-1/2 space-y-10">
                  <div className="inline-flex items-center gap-3 bg-red-50 px-5 py-2 rounded-full border border-red-100">
                     <div className="w-2 h-2 rounded-full bg-[#a20000] animate-pulse"></div>
                     <span className="text-[10px] font-black text-[#a20000] uppercase tracking-widest underline underline-offset-4">Professional Access</span>
                  </div>
                  
                  <div className="space-y-6">
                     <h1 className="text-6xl lg:text-8xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                        ENTER THE <br />
                        <span className="text-[#a20000]">ARENA.</span>
                     </h1>
                     <p className="text-gray-800 text-xl font-medium max-w-lg leading-relaxed">
                        Access your professional football dashboard. Manage your talent, track performances, and connect with global scouts.
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8">
                     <div className="space-y-3">
                        <CheckCircle2 className="w-6 h-6 text-[#a20000]" />
                        <h4 className="font-black uppercase text-xs tracking-tight">Verified Talents</h4>
                        <p className="text-[11px] text-gray-900 font-bold leading-relaxed">Over 5,000+ professionals already on board.</p>
                     </div>
                     <div className="space-y-3">
                        <CheckCircle2 className="w-6 h-6 text-[#a20000]" />
                        <h4 className="font-black uppercase text-xs tracking-tight">Global Network</h4>
                        <p className="text-[11px] text-gray-900 font-bold leading-relaxed">Direct links to agents in 50+ countries.</p>
                     </div>
                  </div>
               </div>

               {/* Right: Auth Card */}
               <div className="lg:w-1/2 w-full max-w-[500px]">
                  <div className="bg-white border border-gray-100 rounded-[60px] p-8 md:p-14 shadow-[0_60px_120px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                     {/* Dynamic Gradient Accent */}
                     <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#a20000] to-transparent"></div>
                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#a20000] blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2 -z-10"></div>
                     
                     <div className="mb-12">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">
                           {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-gray-900 text-sm font-bold uppercase tracking-widest">
                           {mode === 'login' ? 'Please sign in to continue.' : 'Join the elite network today.'}
                        </p>
                     </div>

                     {status && (
                        <div className={`mb-8 p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500 ${status.type === 'success' ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                           {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                           <p className="text-xs font-black uppercase tracking-widest">{status.message}</p>
                        </div>
                     )}

                     <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Work Email</label>
                           <div className="relative">
                              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                              <input 
                                 name="email"
                                 type="email" 
                                 required
                                 placeholder="name@agency.com" 
                                 className="w-full bg-gray-50 border-none rounded-2xl pl-14 pr-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none text-black placeholder:text-gray-900" 
                              />
                           </div>
                        </div>

                        <div className="space-y-3">
                           <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Security Password</label>
                              {mode === 'login' && (
                                 <Link href="/forgot-password" title="Coming soon!" className="text-[10px] font-black text-[#a20000] uppercase tracking-widest hover:underline">Forgot?</Link>
                              )}
                           </div>
                           <div className="relative">
                              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                              <input 
                                 name="password"
                                 type="password" 
                                 required
                                 placeholder="••••••••" 
                                 className="w-full bg-gray-50 border-none rounded-2xl pl-14 pr-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none text-black placeholder:text-gray-900" 
                              />
                           </div>
                        </div>

                        <button 
                           type="submit"
                           disabled={isLoading}
                           className="w-full bg-gray-900 text-white py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#a20000] transition-all flex items-center justify-center gap-4 shadow-xl transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-[0_20px_40px_rgba(162,0,0,0.2)]"
                        >
                           {isLoading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           ) : (
                              <>
                                 {mode === 'login' ? 'Authorize Access' : 'Initial Registration'} <ArrowRight className="w-4 h-4" />
                              </>
                           )}
                        </button>

                        <div className="relative py-4 flex items-center gap-4">
                           <div className="flex-1 h-px bg-gray-100"></div>
                           <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Third Party Entry</span>
                           <div className="flex-1 h-px bg-gray-100"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                           <button type="button" className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-xs font-black uppercase tracking-widest">
                              <Chrome className="w-4 h-4" /> Continue with Google
                           </button>
                        </div>
                     </form>

                     <div className="mt-12 text-center">
                        <Link 
                           href="/register"
                           className="text-[11px] font-black text-gray-900 uppercase tracking-widest hover:text-[#a20000] transition-colors"
                        >
                           No account yet? <span className="text-[#a20000] ml-2">Register as Professional</span>
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   );
}
