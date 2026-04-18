'use client';

import { useState } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { resetPassword } from './actions';

export default function ForgotPasswordPage() {
   const [isLoading, setIsLoading] = useState(false);
   const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
   const [email, setEmail] = useState('');
   const [countdown, setCountdown] = useState(0);

   const startCountdown = () => {
      setCountdown(60);
      const timer = setInterval(() => {
         setCountdown((prev) => {
            if (prev <= 1) {
               clearInterval(timer);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      setStatus(null);
      
      const formData = new FormData(e.currentTarget);
      const emailValue = formData.get('email') as string;
      setEmail(emailValue);
      
      try {
         const result = await resetPassword(formData);
         
         if (result.error) {
            setStatus({ type: 'error', message: result.error });
         } else if (result.success) {
            setStatus({ type: 'success', message: result.message || 'Reset link sent.' });
            startCountdown();
         }
      } catch (err: any) {
         setStatus({ type: 'error', message: 'An unexpected error occurred.' });
      } finally {
         setIsLoading(false);
      }
   };

   const handleResend = async () => {
      if (countdown > 0 || !email) return;
      
      setIsLoading(true);
      setStatus(null);
      
      const formData = new FormData();
      formData.append('email', email);
      
      try {
         const result = await resetPassword(formData);
         if (result.error) {
            setStatus({ type: 'error', message: result.error });
         } else {
            setStatus({ type: 'success', message: 'A new link has been sent to your email.' });
            startCountdown();
         }
      } catch (err: any) {
         setStatus({ type: 'error', message: 'Failed to resend link.' });
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
                     <span className="text-[10px] font-black text-[#a20000] uppercase tracking-widest underline underline-offset-4">Security Center</span>
                  </div>
                  
                  <div className="space-y-6">
                     <h1 className="text-6xl lg:text-8xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                        RECOVER <br />
                        <span className="text-[#a20000]">ACCESS.</span>
                     </h1>
                     <p className="text-gray-800 text-xl font-medium max-w-lg leading-relaxed">
                        Don't lose your edge. Reset your password and get back to managing your professional football career.
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8">
                     <div className="space-y-3">
                        <CheckCircle2 className="w-6 h-6 text-[#a20000]" />
                        <h4 className="font-black uppercase text-xs tracking-tight">Secure Recovery</h4>
                        <p className="text-[11px] text-gray-900 font-bold leading-relaxed">Industry standard encryption for your safety.</p>
                     </div>
                     <div className="space-y-3">
                        <CheckCircle2 className="w-6 h-6 text-[#a20000]" />
                        <h4 className="font-black uppercase text-xs tracking-tight">Instant Support</h4>
                        <p className="text-[11px] text-gray-900 font-bold leading-relaxed">Automated reset links sent to your inbox.</p>
                     </div>
                  </div>
               </div>

               {/* Right: Forgot Password Card */}
               <div className="lg:w-1/2 w-full max-w-[500px]">
                  <div className="bg-white border border-gray-100 rounded-[60px] p-8 md:p-14 shadow-[0_60px_120px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                     {/* Dynamic Gradient Accent */}
                     <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#a20000] to-transparent"></div>
                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#a20000] blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2 -z-10"></div>
                     
                     <div className="mb-12">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">
                           Reset Password
                        </h2>
                        <p className="text-gray-900 text-sm font-bold uppercase tracking-widest">
                           Enter your email to receive a reset link.
                        </p>
                     </div>

                     {status && (
                        <div className={`mb-8 p-5 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500 ${status.type === 'success' ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'}`}>
                           <div className="flex items-center gap-4 mb-3">
                              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                              <p className="text-xs font-black uppercase tracking-widest">{status.message}</p>
                           </div>
                           
                           {status.type === 'success' && (
                              <button
                                 onClick={handleResend}
                                 disabled={isLoading || countdown > 0}
                                 className="text-[10px] font-black uppercase tracking-widest text-green-800 underline underline-offset-4 hover:text-green-900 disabled:opacity-50 disabled:no-underline flex items-center gap-2"
                              >
                                 {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Link'}
                                 {isLoading && <div className="w-3 h-3 border border-green-800/30 border-t-green-800 rounded-full animate-spin"></div>}
                              </button>
                           )}
                        </div>
                     )}

                     {status?.type !== 'success' && (
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

                           <button 
                              type="submit"
                              disabled={isLoading}
                              className="w-full bg-gray-900 text-white py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#a20000] transition-all flex items-center justify-center gap-4 shadow-xl transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-[0_20px_40px_rgba(162,0,0,0.2)]"
                           >
                              {isLoading ? (
                                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                 <>
                                    Send Reset Link <ArrowRight className="w-4 h-4" />
                                 </>
                              )}
                           </button>
                        </form>
                     )}

                     <div className="mt-12 text-center">
                        <Link 
                           href="/login"
                           className="text-[11px] font-black text-gray-900 uppercase tracking-widest hover:text-[#a20000] transition-colors"
                        >
                           Back to <span className="text-[#a20000] ml-2">Login</span>
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
