import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Facebook, Instagram, Twitter, Settings2 } from "lucide-react";

export default function PlayerProfilePage({ params }: { params: { id: string } }) {
   return (
      <div className="min-h-screen bg-white">
         <Navbar />

         <main className="pt-20">
            {/* Hero Section */}
            <div className="relative w-full h-[300px] md:h-[400px] bg-gray-100 flex overflow-hidden">
               
               {/* Background Base (Stadium Image placeholder) */}
               <div className="absolute inset-0 w-full md:w-[60%]">
                  <img src="https://images.unsplash.com/photo-1518605368461-1ee7c6802a11?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="stadium" />
               </div>

               {/* Right Side Red Curved Shape */}
               <div 
                  className="absolute inset-y-0 right-0 w-[55%] bg-[#b50a0a]" 
                  style={{ borderTopLeftRadius: '250px' }}
               ></div>

               <div className="max-w-[1200px] mx-auto w-full h-full relative flex px-4 lg:px-0">
                  
                  {/* Player Hero Image Container */}
                  <div className="w-[45%] h-full relative flex items-end justify-center">
                     <img 
                        src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=600&auto=format&fit=crop" // Transparent background player image would go here
                        alt="Samuel Ejoor"
                        className="h-[110%] w-auto object-cover object-top drop-shadow-lg relative z-10 -mb-4"
                     />
                  </div>

                  {/* Player Name and Club Info */}
                  <div className="w-[55%] flex flex-col justify-center items-start pl-16 text-white z-20">
                     <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest mb-6 drop-shadow-md whitespace-nowrap">
                        Samuel Ejoor
                     </h1>
                     
                     <div className="flex items-center gap-4 mb-8">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                           <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kano_Pillars_FC_logo.svg/1200px-Kano_Pillars_FC_logo.svg.png" className="w-full h-full object-contain" alt="Club Logo" />
                           <div className="absolute bottom-0 -right-2 w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/1200px-Flag_of_Nigeria.svg.png" className="w-full h-full object-cover" alt="Country" />
                           </div>
                        </div>
                        <span className="text-2xl font-black tracking-widest uppercase">SV Seekirchen</span>
                     </div>

                     <div className="flex items-center gap-6 text-[15px] font-bold tracking-widest pl-12">
                        <span>Follow Me</span>
                        <div className="flex items-center gap-4">
                           <a href="#" className="hover:text-gray-300 transition-colors"><Facebook className="w-5 h-5 fill-current" /></a>
                           <a href="#" className="hover:text-gray-300 transition-colors"><Instagram className="w-5 h-5" /></a>
                           <a href="#" className="hover:text-gray-300 transition-colors"><Twitter className="w-5 h-5 fill-current" /></a>
                        </div>
                     </div>
                  </div>

               </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="border-b border-gray-100 bg-white shadow-sm sticky top-20 z-40">
               <div className="max-w-[700px] mx-auto px-4 lg:px-0">
                  <div className="flex items-center justify-center gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden pt-4 pb-0">
                     <button className="text-[13px] font-black text-[#b50a0a] uppercase tracking-widest whitespace-nowrap pb-4 border-b-4 border-[#b50a0a]">Profile</button>
                     <span className="text-gray-200 pb-4">|</span>
                     <button className="text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest whitespace-nowrap pb-4 border-b-4 border-transparent">Career Stat.</button>
                     <span className="text-gray-200 pb-4">|</span>
                     <button className="text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest whitespace-nowrap pb-4 border-b-4 border-transparent">Bio</button>
                     <span className="text-gray-200 pb-4">|</span>
                     <button className="text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest whitespace-nowrap pb-4 border-b-4 border-transparent">Gallery</button>
                     <span className="text-gray-200 pb-4">|</span>
                     <button className="text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest whitespace-nowrap pb-4 border-b-4 border-transparent">News</button>
                     <span className="text-gray-200 pb-4">|</span>
                     <button className="text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest whitespace-nowrap pb-4 border-b-4 border-transparent">Shop</button>
                  </div>
               </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 py-16">
               <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                  
                  {/* Left Column: Player Data */}
                  <div className="w-full lg:w-[45%]">
                     <div className="mb-10">
                        <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                           Player Data
                           <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                        </h2>
                     </div>
                     
                     <div className="space-y-6">
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Date Of Birth</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">Oct 20, 2001</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Place Of Birth</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">Lagos</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Age</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">21</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Height</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">6.13m</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Weight</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">70kg</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Citizenship</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">Nigeria</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Position</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">Attack</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Foot</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">Right</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Agent</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">NERVSports Agency</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Current Club</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">SV Seekirchen</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Joined</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">Sept. 20th 2022</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Contract Expires</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">Sept. 20th 2023</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Current Salary</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">$20,000</span>
                        </div>
                        <div className="flex">
                           <span className="w-1/3 text-[13px] font-bold text-gray-500">Social Media</span>
                           <span className="w-2/3 text-[14px] font-black text-gray-900">Facebook, Twitter, Instagram</span>
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Position & Maps */}
                  <div className="w-full lg:w-[55%]">
                     <div className="mb-10 lg:pl-4">
                        <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                           Position
                           <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                        </h2>
                     </div>
                     
                     {/* Pitch SVG Illustration */}
                     <div className="w-full max-w-[400px] mb-8 relative bg-white border border-[#b50a0a]/30 p-2 rounded rounded-xl">
                        <svg viewBox="0 0 400 250" className="w-full h-auto text-[#b50a0a]/40" fill="none" stroke="currentColor" strokeWidth="2">
                           {/* Outer field */}
                           <rect x="10" y="10" width="380" height="230"></rect>
                           {/* Halfway line */}
                           <line x1="200" y1="10" x2="200" y2="240"></line>
                           {/* Center circle */}
                           <circle cx="200" cy="125" r="30"></circle>
                           {/* Left penalty box */}
                           <rect x="10" y="55" width="60" height="140"></rect>
                           {/* Right penalty box */}
                           <rect x="330" y="55" width="60" height="140"></rect>
                        </svg>
                        
                        {/* Position Markers */}
                        <div className="absolute top-[30%] left-[20%] w-4 h-4 bg-[#b50a0a]/60 rounded-full shadow-sm"></div>
                        <div className="absolute top-[50%] left-[8%] w-8 h-8 bg-[#b50a0a] rounded-full shadow-md border-2 border-white -translate-y-1/2"></div>
                     </div>

                     <div className="mb-6">
                        <h3 className="text-[13px] font-bold text-gray-500 mb-2 border-b-2 border-gray-100 pb-1 inline-block">Position</h3>
                        <p className="text-[14px] font-black text-gray-900">Center Forward</p>
                     </div>

                     <div>
                        <h3 className="text-[13px] font-bold text-gray-500 mb-2 border-b-2 border-gray-100 pb-1 inline-block">Other Position</h3>
                        <p className="text-[14px] font-black text-gray-900">Right Winger</p>
                     </div>

                  </div>

               </div>

               {/* Stats Table Section */}
               <div className="mt-20">
                  <div className="flex items-center justify-between mb-8">
                     <div className="lg:pl-4">
                        <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                           Stat 2022/2023
                           <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                        </h2>
                     </div>
                     <button className="flex items-center gap-2 text-[11px] font-bold text-gray-900 uppercase tracking-widest bg-gray-100 px-4 py-2 rounded">
                        <Settings2 className="w-4 h-4" /> Season By
                     </button>
                  </div>

                  <div className="w-full overflow-x-auto">
                     <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                           <tr className="bg-[#a20000] border-b-2 border-white">
                              <th className="font-bold text-[10px] text-white uppercase px-6 py-4 rounded-tl-lg"></th>
                              <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center">Appearances</th>
                              <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center">Min Played</th>
                              <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center">Goals</th>
                              <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center">Assists</th>
                              <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center">YC</th>
                              <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center rounded-tr-lg">RC</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr className="border-b border-gray-100 group hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kano_Pillars_FC_logo.svg/1200px-Kano_Pillars_FC_logo.svg.png" className="w-6 h-6 object-contain" alt="Club" />
                                    <span className="font-black text-[12px] text-gray-700">SV Seekirchen</span>
                                 </div>
                              </td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">16</td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">600</td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">2</td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                              <td className="font-bold text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                              <td className="font-bold text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                           </tr>
                           <tr className="border-b border-gray-100 group hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Enyimba_International_F.C._logo.png/1200px-Enyimba_International_F.C._logo.png" className="w-6 h-6 object-contain" alt="Club" />
                                    <span className="font-black text-[12px] text-gray-700">Regionalliga Salzburg</span>
                                 </div>
                              </td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">8</td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">450</td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">0</td>
                              <td className="font-bold text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                              <td className="font-bold text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                           </tr>
                           <tr className="border-b border-gray-100 group hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-5">
                                 <span className="font-black text-[12px] text-gray-700 pl-9">Cup</span>
                              </td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">2</td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">180</td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">1</td>
                              <td className="font-bold text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                              <td className="font-bold text-[13px] text-gray-400 text-center px-4 py-5">-</td>
                           </tr>
                        </tbody>
                     </table>
                     
                     <div className="flex justify-center mt-6">
                        <button className="bg-[#a20000] hover:bg-[#8b0000] text-white font-bold text-[11px] uppercase tracking-widest px-8 py-3.5 rounded shadow-md transition-colors">
                           View Full Stat
                        </button>
                     </div>
                  </div>
               </div>

               {/* Transfer History Section */}
               <div className="mt-24">
                  <div className="mb-10 lg:pl-4">
                     <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                        Transfer History
                        <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                     </h2>
                  </div>

                  <div className="w-full overflow-x-auto">
                     <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                           <tr className="bg-[#a20000] border-b-2 border-white">
                              <th className="font-bold text-[10px] text-white uppercase px-6 py-4 rounded-tl-lg">Season</th>
                              <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center">Date</th>
                              <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center">Left</th>
                              <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center">Joined</th>
                              <th className="font-bold text-[10px] text-white uppercase px-4 py-4 text-center rounded-tr-lg">Fee</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr className="border-b border-gray-100 group hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kano_Pillars_FC_logo.svg/1200px-Kano_Pillars_FC_logo.svg.png" className="w-6 h-6 object-contain" alt="Club" />
                                    <span className="font-black text-[12px] text-gray-700">SV Seekirchen</span>
                                 </div>
                              </td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">Sep. 20, 2022</td>
                              <td className="px-4 py-5 border-x border-gray-50">
                                 <div className="flex items-center justify-center gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png" className="w-6 h-6 object-contain" alt="Club" />
                                    <span className="font-black text-[12px] text-gray-700">Enyimba FC</span>
                                 </div>
                              </td>
                              <td className="px-4 py-5 border-r border-gray-50">
                                 <div className="flex items-center justify-center gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kano_Pillars_FC_logo.svg/1200px-Kano_Pillars_FC_logo.svg.png" className="w-6 h-6 object-contain" alt="Club" />
                                    <span className="font-black text-[12px] text-gray-700">SV Seekirchen</span>
                                 </div>
                              </td>
                              <td className="font-bold text-[11px] text-gray-500 text-center px-4 py-5">Free Transfer</td>
                           </tr>
                           <tr className="border-b border-gray-100 group hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Enyimba_International_F.C._logo.png/1200px-Enyimba_International_F.C._logo.png" className="w-6 h-6 object-contain" alt="Club" />
                                    <span className="font-black text-[12px] text-gray-700">Enyimba FC</span>
                                 </div>
                              </td>
                              <td className="font-bold text-[13px] text-gray-900 text-center px-4 py-5">Aug 5, 2021</td>
                              <td className="px-4 py-5 border-x border-gray-50">
                                 <div className="flex items-center justify-center gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Nasarawa_United_F.C._logo.svg/1200px-Nasarawa_United_F.C._logo.svg.png" className="w-6 h-6 object-contain" alt="Club" />
                                    <span className="font-black text-[12px] text-gray-700">Nasarawa Utd</span>
                                 </div>
                              </td>
                              <td className="px-4 py-5 border-r border-gray-50">
                                 <div className="flex items-center justify-center gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Enyimba_International_F.C._logo.png/1200px-Enyimba_International_F.C._logo.png" className="w-6 h-6 object-contain" alt="Club" />
                                    <span className="font-black text-[12px] text-gray-700">Enyimba FC</span>
                                 </div>
                              </td>
                              <td className="font-bold text-[11px] text-gray-500 text-center px-4 py-5">$200,000</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Next Match Section */}
               <div className="mt-24">
                  <div className="mb-10 lg:pl-4">
                     <h2 className="text-3xl font-black text-gray-600 inline-block relative">
                        Next Match
                        <span className="absolute -bottom-3 left-0 w-12 border-b-2 border-gray-300"></span>
                     </h2>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-[600px] flex flex-col items-center mx-auto mb-20 shadow-md">
                     
                     <div className="text-center mb-6">
                        <span className="font-bold text-[11px] text-gray-900 block mb-1 uppercase tracking-widest">WED 03 MAY 2023</span>
                        <span className="font-bold text-[11px] text-gray-400 block uppercase tracking-widest">Nigeria League</span>
                     </div>

                     <div className="flex items-center justify-between w-full mb-8">
                        {/* Team 1 */}
                        <div className="flex items-center gap-4 w-[40%] justify-end">
                           <span className="font-bold text-[15px] text-gray-900">Plateau Utd</span>
                           <img src="https://upload.wikimedia.org/wikipedia/en/6/67/Plateau_United_F.C._logo.png" className="w-12 h-12 object-contain" alt="Team 1" />
                        </div>
                        
                        {/* Status/Time */}
                        <div className="font-black text-[20px] text-gray-900 tracking-[0.2em] w-[20%] text-center">
                           17 : 00
                        </div>

                        {/* Team 2 */}
                        <div className="flex items-center gap-4 w-[40%] justify-start">
                           <img src="https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Remo_Stars_FC_logo.png/1200px-Remo_Stars_FC_logo.png" className="w-12 h-12 object-contain" alt="Team 2" />
                           <span className="font-bold text-[15px] text-gray-900">Remo Stars</span>
                        </div>
                     </div>

                     {/* Odds Block */}
                     <div className="flex items-center justify-center gap-4">
                        <div className="border border-[#b50a0a]/20 px-4 py-1.5 rounded-sm flex items-center justify-center">
                           <span className="font-black text-[13px] text-gray-900 shadow-sm border border-red-200 bg-red-50/50 px-2 py-0.5 rounded text-[#b50a0a]">1.46</span>
                        </div>
                        <div className="border border-[#b50a0a]/20 px-4 py-1.5 rounded-sm flex items-center justify-center">
                           <span className="font-bold text-[11px] text-gray-400 mr-2">X</span>
                           <span className="font-black text-[13px] text-gray-900">5.20</span>
                        </div>
                        <div className="border border-[#b50a0a]/20 px-4 py-1.5 rounded-sm flex items-center justify-center">
                           <span className="font-bold text-[11px] text-gray-400 mr-2">2</span>
                           <span className="font-black text-[13px] text-gray-900">7.10</span>
                        </div>
                        <div className="ml-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white text-[8px] font-black px-2 py-1 rounded italic uppercase transform rotate-[-5deg]">
                           jumbo
                        </div>
                     </div>

                  </div>
               </div>

               {/* Video/Image Content placeholder at bottom as seen in design */}
               <div className="w-full h-[200px] bg-gradient-to-r from-gray-200 to-gray-300 mb-10 rounded"></div>

            </div>
         </main>

         <Footer />
      </div>
   );
}
