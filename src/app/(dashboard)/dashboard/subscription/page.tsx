'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  History, 
  Check, 
  ChevronRight, 
  Star,
  Zap,
  Lock,
  Calendar,
  Globe
} from 'lucide-react';

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState('My Plan');
  const [subscription, setSubscription] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string}|null>(null);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch subscription
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        // Fetch profile for verification status
        const { data: profData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Fetch payment settings from CMS
        const { data: settings } = await supabase
          .from('site_content')
          .select('content')
          .eq('page', 'settings')
          .eq('section', 'payment')
          .single();
        
        setSubscription(subData);
        setProfile(profData);
        setPaymentSettings(settings?.content || { paymentLink: 'https://paystack.com/pay/centerkick-pro' });
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleClaimVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg(null);
    
    const formData = new FormData(e.currentTarget);
    const { requestVerification } = await import('./actions');
    const res = await requestVerification(formData);

    if (res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      setMsg({ type: 'success', text: 'Verification request submitted! Admin will review your payment shortly.' });
      // Update local state
      setProfile({ ...profile, verification_requested: true });
    }
    setIsSubmitting(false);
  };

  const plan = {
    name: "Quarterly Pro",
    price: "₦15,000",
    period: "Per Quarter",
    status: profile?.status === 'active' ? 'Active' : (profile?.verification_requested ? 'Pending Approval' : 'Unverified'),
    features: [
      "Verified Professional Badge",
      "Priority Search & Discovery Listing",
      "Premium Multi-tab Public Profile",
      "Performance & Tactical Dashboards",
      "Unlimited News & Highlight Integration",
      "Direct Agency & Scout Networking",
      "Scouting ROI Analytics",
    ]
  };

  if (isLoading) return <div className="pt-20 text-center font-black uppercase tracking-widest animate-pulse text-gray-400">Loading Billing Data...</div>;

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Billing & <span className="text-[#b50a0a]">Subscription</span></h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Manage your professional tier and payment confirmation.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:w-1/4">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {[
              { id: 'My Plan', icon: ShieldCheck },
              { id: 'History', icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap lg:w-full ${activeTab === tab.id ? 'bg-gray-900 text-white shadow-lg shadow-black/20' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.id}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === 'My Plan' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               {/* Current Status Card */}
               <div className="relative group overflow-hidden bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-12">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#b50a0a] blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                     <div className="space-y-6 flex-1">
                        <div className="bg-[#b50a0a] w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-2">
                           <Star className="w-3 h-3 fill-current" /> Professional Tier
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">{plan.name}</h2>
                        <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black text-[#b50a0a] italic">{plan.price}</span>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{plan.period}</span>
                        </div>
                        
                        {plan.status === 'Unverified' && (
                           <div className="pt-6 space-y-6">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">To activate your professional badge and unlock all features, please complete payment using the secure link below.</p>
                              <a 
                                 href={paymentSettings.paymentLink} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[#b50a0a] transition-all shadow-xl hover:-translate-y-1"
                              >
                                 Subscribe Now <ChevronRight className="w-5 h-5" />
                              </a>
                           </div>
                        )}
                     </div>

                     <div className="w-full md:w-64 space-y-4">
                        <div className={`${
                           plan.status === 'Active' ? 'bg-green-50 border-green-100' : 
                           plan.status === 'Pending Approval' ? 'bg-blue-50 border-blue-100' :
                           'bg-red-50 border-red-100'
                        } border px-6 py-6 rounded-[30px] shadow-sm`}>
                           <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                              plan.status === 'Active' ? 'text-green-700' : 
                              plan.status === 'Pending Approval' ? 'text-blue-700' :
                              'text-red-700'
                           }`}>Account Status</p>
                           <p className={`text-xl font-black uppercase tracking-tighter ${
                              plan.status === 'Active' ? 'text-green-800' : 
                              plan.status === 'Pending Approval' ? 'text-blue-800' :
                              'text-red-800'
                           }`}>{plan.status}</p>
                        </div>

                        {plan.status === 'Unverified' && (
                           <form onSubmit={handleClaimVerification} className="space-y-4 bg-gray-50 p-6 rounded-[30px] border border-gray-100">
                              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Claim Payment</p>
                              <input 
                                 name="payment_reference"
                                 type="text" 
                                 placeholder="Transaction Ref/ID" 
                                 required
                                 className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-[#b50a0a] outline-none transition-all"
                              />
                              <button 
                                 disabled={isSubmitting}
                                 className="w-full bg-white border border-gray-200 text-gray-900 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-[#b50a0a] hover:text-[#b50a0a] transition-all disabled:opacity-50"
                              >
                                 {isSubmitting ? 'Processing...' : 'Notify Admin'}
                              </button>
                           </form>
                        )}

                        {msg && (
                           <div className={`p-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              {msg.text}
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="mt-12 pt-12 border-t border-gray-50">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Professional Features Included:</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                             <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                                <Check className="w-3 h-3 text-green-600" />
                             </div>
                             <span className="text-xs font-bold text-gray-700">{feature}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Why Go Pro Section */}
               <div className="bg-[#0a0a0b] rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden">
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                     <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-4">Maximum <br /><span className="text-[#b50a0a]">Market Visibility</span></h3>
                        <p className="text-[11px] font-medium text-gray-400 leading-relaxed mb-8">Our proprietary algorithm prioritizes verified profiles in scout searches, ensuring you're seen by the decision-makers that matter most.</p>
                        <div className="flex items-center gap-4">
                           <div className="flex -space-x-3">
                              {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0b] bg-gray-700"></div>)}
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Join 1,200+ Professionals</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        {[
                           { icon: Zap, label: 'Instant', sub: 'Verification' },
                           { icon: Globe, label: 'Global', sub: 'Reach' },
                           { icon: ShieldCheck, label: 'Official', sub: 'Status' },
                           { icon: Calendar, label: 'Flexible', sub: 'Billing' },
                        ].map((item, i) => (
                           <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                              <item.icon className="w-5 h-5 text-[#b50a0a] mb-2" />
                              <p className="text-[10px] font-black uppercase text-white">{item.label}</p>
                              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{item.sub}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'History' && (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
               <div className="p-8 border-b border-gray-100">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Transaction History</h3>
               </div>
               <div className="divide-y divide-gray-50">
                  <div className="p-12 text-center">
                     <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <History className="w-6 h-6" />
                     </div>
                     <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">No Transactions Found</p>
                     <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed">Your payment history will appear here once you activate your first professional plan.</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
