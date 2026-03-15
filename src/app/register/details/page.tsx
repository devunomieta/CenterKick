"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronRight, Camera, MapPin } from "lucide-react";
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { getRegistrationData, saveRegistrationData } from '@/lib/registrationStore';

function RegisterDetailsContent() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const roleFromUrl = searchParams.get('role');
   const [role, setRole] = useState(roleFromUrl || 'athlete');
   const [formData, setFormData] = useState<any>({});

   useEffect(() => {
      const data = getRegistrationData();
      if (data.role && !roleFromUrl) {
         setRole(data.role);
      }
      if (data.details) {
         setFormData(data.details);
      }
   }, [roleFromUrl]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const updatedData = { ...formData, [name]: value };
      setFormData(updatedData);
      saveRegistrationData({ details: updatedData, step: 2 });
   };

   return (
      <main className="pt-32 pb-24">
         <div className="max-w-[800px] mx-auto px-4 lg:px-0">
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-16">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center font-black">✓</div>
                  <div className="w-16 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-12 h-12 rounded-full bg-[#a20000] text-white flex items-center justify-center font-black animate-pulse">2</div>
                  <div className="w-16 h-1 bg-gray-100 rounded-full"></div>
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-black">3</div>
                  <div className="w-16 h-1 bg-gray-100 rounded-full"></div>
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-black">4</div>
               </div>
            </div>

            <div className="text-center mb-16 px-4">
               <span className="text-[#a20000] font-black text-xs uppercase tracking-[0.4em] mb-4 block underline underline-offset-4">{role} Profile</span>
               <h1 className="text-4xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-6">
                  Tell Us More <br />
                  <span className="text-[#a20000]">About Yourself</span>
               </h1>
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-16 shadow-[0_60px_100px_rgba(0,0,0,0.06)] relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#a20000] to-black opacity-20"></div>
               
               <form className="space-y-10">
                  
                  {/* Photo Upload Placeholder */}
                  <div className="flex flex-col items-center">
                     <div className="w-32 h-32 rounded-[40px] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group cursor-pointer hover:border-[#a20000] hover:bg-red-50 transition-all shadow-sm">
                        <Camera className="w-8 h-8 mb-1 group-hover:text-[#a20000] transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                           name="fullName"
                           value={formData.fullName || ''}
                           onChange={handleInputChange}
                           type="text" 
                           placeholder="John Doe" 
                           className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                        <input 
                           name="dob"
                           value={formData.dob || ''}
                           onChange={handleInputChange}
                           type="date" 
                           className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location / City</label>
                     <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                           name="location"
                           value={formData.location || ''}
                           onChange={handleInputChange}
                           type="text" 
                           placeholder="Lagos, Nigeria" 
                           className="w-full bg-gray-50 border-none rounded-2xl pl-14 pr-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                           name="email"
                           value={formData.email || ''}
                           onChange={handleInputChange}
                           type="email" 
                           placeholder="john@example.com" 
                           className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input 
                           name="phone"
                           value={formData.phone || ''}
                           onChange={handleInputChange}
                           type="tel" 
                           placeholder="+234..." 
                           className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                        />
                     </div>
                  </div>

                  {/* Role Specific Fields */}
                  {role === 'athlete' && (
                     <div className="pt-12 border-t border-gray-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-4 mb-2">
                           <div className="h-0.5 w-8 bg-[#a20000]"></div>
                           <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Career Stats</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Position</label>
                              <select 
                                 name="position"
                                 value={formData.position || ''}
                                 onChange={handleInputChange}
                                 className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none appearance-none"
                              >
                                 <option value="">Select Position</option>
                                 <option>Forward</option>
                                 <option>Midfielder</option>
                                 <option>Defender</option>
                                 <option>Goalkeeper</option>
                              </select>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jersey Number</label>
                              <input 
                                 name="jerseyNumber"
                                 value={formData.jerseyNumber || ''}
                                 onChange={handleInputChange}
                                 type="number" 
                                 placeholder="10" 
                                 className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preferred Foot</label>
                              <select 
                                 name="preferredFoot"
                                 value={formData.preferredFoot || ''}
                                 onChange={handleInputChange}
                                 className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none appearance-none"
                              >
                                 <option value="">Select Foot</option>
                                 <option>Right</option>
                                 <option>Left</option>
                                 <option>Both</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  )}

                  {role === 'coach' && (
                     <div className="pt-12 border-t border-gray-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-4 mb-2">
                           <div className="h-0.5 w-8 bg-[#a20000]"></div>
                           <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Technical Data</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Experience (Years)</label>
                              <input 
                                 name="experience"
                                 value={formData.experience || ''}
                                 onChange={handleInputChange}
                                 type="number" 
                                 placeholder="5" 
                                 className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">UEFA / FIFA License</label>
                              <select 
                                 name="license"
                                 value={formData.license || ''}
                                 onChange={handleInputChange}
                                 className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none appearance-none"
                              >
                                 <option value="">Select License</option>
                                 <option>Pro License</option>
                                 <option>A License</option>
                                 <option>B License</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  )}

                  {role === 'agent' && (
                     <div className="pt-12 border-t border-gray-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-4 mb-2">
                           <div className="h-0.5 w-8 bg-[#a20000]"></div>
                           <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Agency Data</h3>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Agency Name</label>
                           <input 
                              name="agencyName"
                              value={formData.agencyName || ''}
                              onChange={handleInputChange}
                              type="text" 
                              placeholder="Apex Sports Management" 
                              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">FIFA License Number</label>
                           <input 
                              name="fifaLicense"
                              value={formData.fifaLicense || ''}
                              onChange={handleInputChange}
                              type="text" 
                              placeholder="EX-12345678" 
                              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-[#a20000] focus:bg-white transition-all outline-none" 
                           />
                        </div>
                     </div>
                  )}

                  <div className="pt-10 flex gap-6">
                     <Link href="/register" className="flex-1">
                        <button type="button" className="w-full bg-gray-100 text-gray-500 py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all transform active:scale-95">
                           Back
                        </button>
                     </Link>
                     <Link href={`/register/pricing?role=${role}`} className="flex-1">
                        <button type="button" className="w-full bg-[#a20000] text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#8a0000] transition-all flex items-center justify-center gap-4 shadow-[0_30px_60px_rgba(162,0,0,0.2)] transform active:scale-95">
                           Next Step <ChevronRight className="w-5 h-5" />
                        </button>
                     </Link>
                  </div>

               </form>
            </div>
         </div>
      </main>
   );
}

export default function RegisterDetailsPage() {
   return (
      <div className="min-h-screen bg-white">
         <Navbar />
         <Suspense fallback={<div className="pt-32 text-center font-black uppercase tracking-widest animate-pulse">Loading Profile...</div>}>
            <RegisterDetailsContent />
         </Suspense>
         <Footer />
      </div>
   );
}
