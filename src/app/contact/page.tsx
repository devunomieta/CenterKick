'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
   Mail, 
   Briefcase, 
   Megaphone, 
   MapPin, 
   Send,
   ChevronDown,
   MessageSquare,
   Globe,
   Instagram,
   Twitter,
   Facebook,
   ShieldCheck,
   ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// FAQ Data
const faqs = [
   { q: "What is CenterKick?", a: "CenterKick is a football media and talent exposure platform that helps players, coaches, clubs, agents, and scouts connect through professional e-profiles, football news, and scouting visibility." },
   { q: "Who can create a profile on CenterKick?", a: "Footballers (male and female), coaches, clubs, academies, agents, and football organizations can create profiles on CenterKick." },
   { q: "Is CenterKick only for professional footballers?", a: "No. CenterKick works with both amateur and professional footballers at all levels, including grassroots and youth players." },
   { q: "How does the player e-profile work?", a: "A player e-profile showcases your football information such as bio, career history, stats, photos, videos, and availability status. It can be shared directly with scouts, agents, and clubs." },
   { q: "Can scouts and agents find players on CenterKick?", a: "Yes. Scouts and agents can explore player profiles, add players to their watchlist, and receive updates when profiles are updated." },
   { q: "Do I need to pay to use CenterKick?", a: "Some features may require a subscription, especially for profile management, visibility, and premium tools. Details are available during signup." },
   { q: "Does CenterKick help with transfers or trials?", a: "CenterKick does not directly sign players to clubs, but we provide the visibility, tools, and platform that help players connect with the right football decision-makers." },
   { q: "Can CenterKick promote my club, event, or tournament?", a: "Yes. CenterKick offers media and PR services for clubs, academies, leagues, tournaments, and football events." },
   { q: "How do I contact support?", a: "You can reach us via email or through the contact form on this page. Our team will respond as quickly as possible." },
   { q: "Is CenterKick active on social media?", a: "Yes. CenterKick is active across multiple platforms where we share football news, player features, highlights, and exclusive content." }
];

export default function ContactPage() {
   const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

   return (
      <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#b50a0a] selection:text-white">
         <Navbar />

         <main className="flex-grow pt-[104px]">
            
            {/* Header Section */}
            <div className="w-full bg-gray-50 py-24 md:py-32 relative overflow-hidden border-b border-gray-100">
               {/* Decorative background blurs */}
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#b50a0a]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gray-200/50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
               
               <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
                  <span className="text-[#b50a0a] font-bold tracking-[0.2em] uppercase mb-4 block text-sm">Contact Us</span>
                  <h1 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter mb-8 drop-shadow-sm">
                     Get in <span className="text-[#ff4d4d]">Touch</span>
                  </h1>
                  <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-[600px] mx-auto font-medium">
                     Have questions? Need support? Want to work with CenterKick? <strong className="text-gray-900">We’re here to help.</strong>
                  </p>
               </div>
            </div>

            {/* Contact Split Layout */}
            <div className="max-w-[1200px] mx-auto px-6 py-24 md:py-32">
               <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                  
                  {/* Left Side: Contact Information & Direct Links */}
                  <div className="w-full lg:w-1/3 flex flex-col gap-12">
                     <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Direct Contacts</h2>
                        
                        <div className="space-y-8">
                           {/* Support */}
                           <div className="group flex items-start gap-4 p-4 -ml-4 rounded-2xl hover:bg-gray-50 transition-colors">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-[#b50a0a]/10 group-hover:text-[#b50a0a] transition-colors border border-gray-200 group-hover:border-[#b50a0a]/20">
                                 <Mail className="w-5 h-5 text-gray-600 group-hover:text-[#b50a0a]" />
                              </div>
                              <div>
                                 <h3 className="font-bold text-gray-900 mb-1">General Support</h3>
                                 <a href="mailto:support@centerkick.com" className="block text-gray-500 hover:text-[#b50a0a] font-medium transition-colors">support@centerkick.com</a>
                                 <a href="mailto:info.centerkick@gmail.com" className="block text-gray-500 hover:text-[#b50a0a] text-sm font-medium transition-colors mt-1">info.centerkick@gmail.com</a>
                              </div>
                           </div>
                           
                           {/* Business */}
                           <div className="group flex items-start gap-4 p-4 -ml-4 rounded-2xl hover:bg-gray-50 transition-colors">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-[#b50a0a]/10 group-hover:text-[#b50a0a] transition-colors border border-gray-200 group-hover:border-[#b50a0a]/20">
                                 <Briefcase className="w-5 h-5 text-gray-600 group-hover:text-[#b50a0a]" />
                              </div>
                              <div>
                                 <h3 className="font-bold text-gray-900 mb-1">Business & Partnerships</h3>
                                 <a href="mailto:partnerships@centerkick.com" className="block text-gray-500 hover:text-[#b50a0a] font-medium transition-colors">partnerships@centerkick.com</a>
                              </div>
                           </div>

                           {/* Media */}
                           <div className="group flex items-start gap-4 p-4 -ml-4 rounded-2xl hover:bg-gray-50 transition-colors">
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-[#b50a0a]/10 group-hover:text-[#b50a0a] transition-colors border border-gray-200 group-hover:border-[#b50a0a]/20">
                                 <Megaphone className="w-5 h-5 text-gray-600 group-hover:text-[#b50a0a]" />
                              </div>
                              <div>
                                 <h3 className="font-bold text-gray-900 mb-1">Media & PR</h3>
                                 <a href="mailto:media@centerkick.com" className="block text-gray-500 hover:text-[#b50a0a] font-medium transition-colors">media@centerkick.com</a>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent"></div>

                     {/* Social Links */}
                     <div>
                        <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Follow Us</h2>
                        <div className="flex gap-4">
                           <a href="#" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#b50a0a]/5 hover:text-[#b50a0a] hover:border-[#b50a0a]/30 transition-all hover:scale-110 shadow-sm">
                              <Instagram className="w-5 h-5" />
                           </a>
                           <a href="#" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#b50a0a]/5 hover:text-[#b50a0a] hover:border-[#b50a0a]/30 transition-all hover:scale-110 shadow-sm">
                              <Twitter className="w-5 h-5 fill-current" />
                           </a>
                           <a href="#" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#b50a0a]/5 hover:text-[#b50a0a] hover:border-[#b50a0a]/30 transition-all hover:scale-110 shadow-sm">
                              <Facebook className="w-5 h-5 fill-current" />
                           </a>
                           <a href="#" className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#b50a0a]/5 hover:text-[#b50a0a] hover:border-[#b50a0a]/30 transition-all hover:scale-110 shadow-sm">
                              <Globe className="w-5 h-5" />
                           </a>
                        </div>
                     </div>
                  </div>

                  {/* Right Side: Contact Form */}
                  <div className="w-full lg:w-2/3">
                     <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden">
                        {/* Subtle accent border on top */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b50a0a] to-[#ff4d4d]"></div>
                        
                        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
                           <MessageSquare className="w-8 h-8 text-[#b50a0a]" /> Send a Message
                        </h2>
                        
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                 <input 
                                    type="text" 
                                    id="name" 
                                    placeholder="John Doe"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b50a0a] focus:ring-4 focus:ring-[#b50a0a]/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                 <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="john@example.com"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b50a0a] focus:ring-4 focus:ring-[#b50a0a]/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                 />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label htmlFor="subject" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                              <input 
                                 type="text" 
                                 id="subject" 
                                 placeholder="How can we help you?"
                                 className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b50a0a] focus:ring-4 focus:ring-[#b50a0a]/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                              />
                           </div>

                           <div className="space-y-2">
                              <label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
                              <textarea 
                                 id="message" 
                                 rows={6}
                                 placeholder="Tell us about your inquiry..."
                                 className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b50a0a] focus:ring-4 focus:ring-[#b50a0a]/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 resize-none"
                              ></textarea>
                           </div>

                           <button type="submit" className="w-full md:w-auto inline-flex justify-center items-center gap-3 bg-[#b50a0a] hover:bg-[#8f0808] text-white font-black uppercase tracking-widest px-10 py-5 rounded-xl shadow-[0_10px_30px_rgba(181,10,10,0.2)] hover:shadow-[0_15px_40px_rgba(181,10,10,0.3)] transition-all hover:-translate-y-1">
                              Send Message <Send className="w-5 h-5" />
                           </button>
                        </form>
                     </div>
                  </div>

               </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="w-full bg-gray-50 py-32 px-6 border-y border-gray-200">
               <div className="max-w-[800px] mx-auto">
                  <div className="text-center mb-16">
                     <span className="text-[#b50a0a] font-bold tracking-[0.2em] uppercase mb-4 block text-sm">Got Questions?</span>
                     <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight flex items-center justify-center gap-3">
                        <span className="text-5xl">❔</span> FAQs
                     </h2>
                  </div>

                  <div className="space-y-4">
                     {faqs.map((faq, idx) => (
                        <div 
                           key={idx} 
                           className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${openFaq === idx ? 'border-[#b50a0a] shadow-[0_10px_30px_rgba(181,10,10,0.1)]' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                           <button 
                              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                              className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#b50a0a] rounded-2xl group"
                           >
                              <div className="flex items-center gap-4">
                                 <span className={`font-black text-lg ${openFaq === idx ? 'text-[#b50a0a]' : 'text-gray-300'} transition-colors w-8`}>{(idx + 1).toString().padStart(2, '0')}</span>
                                 <h3 className={`font-bold pr-8 transition-colors ${openFaq === idx ? 'text-gray-900 text-[17px]' : 'text-gray-700 text-base group-hover:text-gray-900'}`}>
                                    {faq.q}
                                 </h3>
                              </div>
                              <ChevronDown 
                                 className={`w-6 h-6 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#b50a0a]' : 'text-gray-400 group-hover:text-gray-600'}`} 
                              />
                           </button>
                           
                           <div 
                              className={`transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                           >
                              <div className="p-6 md:p-8 pt-0 border-t border-gray-50">
                                 <p className="text-gray-600 font-medium leading-relaxed ml-12">
                                    {faq.a}
                                 </p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

               </div>
            </div>

            {/* Outro CTA - Deep Charcoal */}
            <div className="w-full bg-slate-950 py-24 px-6 relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#b50a0a]/15 blur-[120px] pointer-events-none rounded-full rounded-t-none"></div>
               <div className="max-w-[800px] mx-auto text-center relative z-10">
                  <div className="inline-block mb-8 bg-white/5 p-4 rounded-[2rem] border border-white/10 backdrop-blur-sm shadow-xl">
                     <ShieldCheck className="w-10 h-10 text-[#ff4d4d]" />
                  </div>
                  <h2 className="text-xs font-black text-gray-400 tracking-[0.4em] uppercase mb-6">
                     Join Us Today
                  </h2>
                  <p className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight uppercase mb-8">
                     Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d4d] to-[#b50a0a]">Take the next step?</span>
                  </p>
                  <p className="text-gray-400 text-lg font-medium max-w-[600px] mx-auto mb-12">
                     Whether you are a player looking for exposure, or a club looking for talent, CenterKick is your ultimate destination.
                  </p>
                  
                  <Link href="/login" className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-[#b50a0a] font-black uppercase tracking-widest px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(181,10,10,0.15)] hover:shadow-[0_0_40px_rgba(181,10,10,0.3)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto overflow-hidden group">
                     <span className="relative z-10 flex items-center gap-3">
                        Create Your Profile <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </span>
                  </Link>
               </div>
            </div>

         </main>
         <Footer />
      </div>
   );
}
