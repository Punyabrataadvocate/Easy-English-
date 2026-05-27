import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, X, ShieldCheck, HelpCircle, 
  CreditCard, Timer, ChevronDown
} from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface StoreScreenProps {
  currentPlan: SubscriptionPlan;
  setPlan: (plan: SubscriptionPlan) => void;
  speakVani: (text: string) => void;
  sessionCount: number;
}

export default function StoreScreen({ currentPlan, setPlan, speakVani, sessionCount }: StoreScreenProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showPlaySheet, setShowPlaySheet] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState<SubscriptionPlan | null>(null);

  // Dynamic state for FAQ accordions expansion
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Countdown timer ticking down (e.g., 23:58:01 starts)
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 58, seconds: 1 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 58, seconds: 1 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatWithZero = (val: number) => val.toString().padStart(2, '0');

  const getPlanPrice = (planId: string) => {
    switch (planId) {
      case 'trial': return '₹0';
      case 'basic': return billingPeriod === 'monthly' ? '₹99/mo' : '₹829/yr';
      case 'premium': return billingPeriod === 'monthly' ? '₹249/mo' : '₹2,090/yr';
      case 'pro': return billingPeriod === 'monthly' ? '₹449/mo' : '₹3,769/yr';
      default: return '₹0';
    }
  };

  const handleCTAButtonPressed = (planId: SubscriptionPlan) => {
    if (planId === currentPlan) return;
    speakVani(`Opening Google Play transaction console for Easy English ${planId} plan.`);
    setSelectedPlanForPurchase(planId);
    setShowPlaySheet(true);
  };

  const confirmMockPurchase = () => {
    if (selectedPlanForPurchase) {
      setPlan(selectedPlanForPurchase);
      speakVani(`Simulated Google Play purchase completed successfully! Welcome to the premium ${selectedPlanForPurchase} level.`);
      setShowPlaySheet(false);
    }
  };

  const cancelActiveSubscription = () => {
    setPlan('locked');
    speakVani("Simulated plan subscription cleared off. Resetting back to Locked state.");
  };

  const faqs = [
    {
      q: "Q1. Will this course help to improve my spoken English?",
      ans: "Absolutely! VANI targets phonetic gaps common in Bengali native speakers, specifically W vs V, TH, silent D, and intonation stresses, helping you sound fluent during client meetings or exams."
    },
    {
      q: "Q2. How does the speech recording evaluate accuracy?",
      ans: "Our voice recognition framework checks your verbal syllables pacing against standard global accents. Scoring is provided in real-time, focusing purely on pronunciation and rhythmic pacing."
    },
    {
      q: "Q3. Can I downgrade or cancel anytime?",
      ans: "Yes, you can manage, cancel, or modify your active subscription through your Google Play payments settings console with absolutely zero hidden fees."
    },
    {
      q: "Q4. Is there an offline mode?",
      ans: "Yes! High-speed premium users have full offline access to VANI's local syllabus materials, phonetic spelling sheets, and historical reviews."
    }
  ];

  return (
    <div className="space-y-6 text-left pb-24" id="billing-vault-page">
      
      {/* 1. TIMED COUNTDOWN BANNER */}
      <div className="bg-gradient-to-tr from-[#BD53F4] via-[#9333EA] to-[#701A75] rounded-3xl p-5 text-shadow border border-[#F0ABFC]/25 relative overflow-hidden shadow-lg shadow-[#BD53F4]/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 uppercase font-mono text-[9px] font-black bg-white/10 px-2.5 py-1 rounded-full text-white">
            <Timer className="w-3.5 h-3.5 animate-pulse" />
            <span>Limited time claim offer active</span>
          </div>
          <div className="text-[11px] font-mono font-black bg-black/45 text-white rounded-lg px-2.5 py-1 tracking-widest leading-none">
            {formatWithZero(timeLeft.hours)}:{formatWithZero(timeLeft.minutes)}:{formatWithZero(timeLeft.seconds)}
          </div>
        </div>

        <div className="space-y-1 pt-3.5">
          <span className="text-[9px] text-[#F3E8FF] font-mono tracking-widest font-black block uppercase">DOUBLE YOUR CONFIDENCE IN 4 WEEKS</span>
          <h2 className="text-lg font-black tracking-tight uppercase font-display text-white">
            Recharge your Membership
          </h2>
          <p className="text-xs text-[#F5F3FF] leading-normal font-medium max-w-[90%]">
            Unlock immediate inside entry to all 50 conversational classrooms, 1-on-1 voice roleplay sessions, and real-time pronunciation scoring.
          </p>
        </div>

        {/* Promotion Quick CTA */}
        <div className="flex justify-between items-center bg-black/25 border border-white/5 rounded-2xl p-3.5 mt-4">
          <div>
            <span className="text-[8px] font-mono font-bold block text-[#F3E8FF] uppercase">PROMO PLAN RATE</span>
            <span className="text-base font-mono font-black text-white">₹99/month</span>
            <span className="text-[10px] font-medium text-[#F5F3FF] pl-1 font-mono">BASIC BUNDLE</span>
          </div>

          <button
            onClick={() => handleCTAButtonPressed('basic')}
            className="px-5 py-3 bg-white hover:bg-[#F5F3FF] text-[#BD53F4] rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md cursor-pointer font-bold"
          >
            Recharge Now
          </button>
        </div>
      </div>

      {/* PLAN SELECTOR TABS */}
      <div className="flex justify-center" id="billing-cycle-selectors">
        <div className="bg-[#1A1A1A] border border-[#BD53F4]/10 rounded-xl p-1 flex">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 font-mono text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
              billingPeriod === 'monthly' ? 'bg-[#BD53F4] text-white shadow shadow-[#BD53F4]/20' : 'text-[#AAAAAA] hover:text-white'
            }`}
          >
            Monthly billing
          </button>
          <button
            onClick={() => {
              setBillingPeriod('yearly');
              speakVani("Yearly plan selected. Secure 25 percent bonus savings!");
            }}
            className={`px-4 py-2 font-mono text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
              billingPeriod === 'yearly' ? 'bg-[#BD53F4] text-white shadow shadow-[#BD53F4]/20' : 'text-[#AAAAAA] hover:text-white'
            }`}
          >
            Yearly Save 25%
          </button>
        </div>
      </div>

      {/* DETAILED FEATURES LISTING */}
      <div className="bg-[#1A1A1A] p-4.5 rounded-2xl border border-[#BD53F4]/15 space-y-3">
        <h4 className="text-[10px] font-mono text-[#AAAAAA] font-black uppercase tracking-wider block">
          All Upgraded Premium Benefits Included
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="flex items-start gap-2.5 text-xs text-[#EAEAEA]">
            <Check className="w-4 h-4 text-[#BD53F4] shrink-0 mt-0.5" />
            <span>50 structured Levels classrooms (1 to 50 curriculum)</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#EAEAEA]">
            <Check className="w-4 h-4 text-[#BD53F4] shrink-0 mt-0.5" />
            <span>Interactive standard voice coaching sessions list</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#EAEAEA]">
            <Check className="w-4 h-4 text-[#BD53F4] shrink-0 mt-0.5" />
            <span>1-on-1 direct corporate recruiter roleplay exercises</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#EAEAEA]">
            <Check className="w-4 h-4 text-[#BD53F4] shrink-0 mt-0.5" />
            <span>Authentic Bengali phonetic instructions & vocal tips</span>
          </div>
        </div>
      </div>

      {/* 3 SUBSCRIPTION PLANS MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="subscription-plans-cards-group">
        
        {/* BASIC */}
        <div className={`p-4.5 bg-[#1A1A1A] rounded-2xl border flex flex-col justify-between space-y-4 ${
          currentPlan === 'basic' ? 'border-[#BD53F4] shadow-md shadow-[#BD53F4]/5' : 'border-[#BD53F4]/10'
        }`}>
          <div className="space-y-1">
            <span className="text-[8px] font-mono text-[#AAAAAA] font-black tracking-widest uppercase">STAGE ONE</span>
            <h4 className="text-sm font-black text-white uppercase font-display">BASIC PLAN</h4>
            <p className="text-[10px] text-[#AAAAAA]">Covers basic sound corrections and 10 speaking classrooms.</p>
          </div>
          <div>
            <span className="text-xl font-mono font-black text-white">{getPlanPrice('basic')}</span>
            <span className="text-[9px] text-[#AAAAAA] pl-0.5 font-mono">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
          <button
            onClick={() => handleCTAButtonPressed('basic')}
            className={`w-full py-2.5 rounded-xl font-mono text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${
              currentPlan === 'basic' 
                ? 'bg-emerald-500 text-white cursor-default' 
                : 'bg-[#BD53F4] text-white hover:bg-[#F0ABFC] hover:text-black font-bold'
            }`}
          >
            {currentPlan === 'basic' ? 'Current Active' : 'Select Basic'}
          </button>
        </div>

        {/* PREMIUM */}
        <div className={`p-4.5 bg-[#1A1A1A] rounded-2xl border flex flex-col justify-between space-y-4 relative ${
          currentPlan === 'premium' ? 'border-[#BD53F4] shadow-md shadow-[#BD53F4]/15' : 'border-[#BD53F4]/25'
        }`}>
          <div className="absolute top-1.5 right-1.5 text-[7px] bg-[#BD53F4] text-white font-mono font-black tracking-widest px-2 py-0.5 rounded uppercase">
            RECOMMENDED
          </div>
          <div className="space-y-1">
            <span className="text-[8px] font-mono text-[#F0ABFC] font-black tracking-widest uppercase">MOST POPULAR</span>
            <h4 className="text-sm font-black text-white uppercase font-display">PREMIUM PLAN</h4>
            <p className="text-[10px] text-[#AAAAAA]">Full access to all 50 Topics, voice roleplay, and active review audit sheets.</p>
          </div>
          <div>
            <span className="text-xl font-mono font-black text-white">{getPlanPrice('premium')}</span>
            <span className="text-[9px] text-[#AAAAAA] pl-0.5 font-mono">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
          <button
            onClick={() => handleCTAButtonPressed('premium')}
            className={`w-full py-2.5 rounded-xl font-mono text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${
              currentPlan === 'premium' 
                ? 'bg-emerald-500 text-white cursor-default' 
                : 'bg-[#BD53F4] text-white hover:bg-[#F0ABFC] hover:text-black font-bold'
            }`}
          >
            {currentPlan === 'premium' ? 'Current Active' : 'Select Premium'}
          </button>
        </div>

        {/* PRO */}
        <div className={`p-4.5 bg-[#1A1A1A] rounded-2xl border flex flex-col justify-between space-y-4 ${
          currentPlan === 'pro' ? 'border-[#BD53F4]' : 'border-[#BD53F4]/10'
        }`}>
          <div className="space-y-1">
            <span className="text-[8px] font-mono text-[#AAAAAA] font-black tracking-widest uppercase">LIFETIME ACCESS</span>
            <h4 className="text-sm font-black text-white uppercase font-display">PRO MASTER</h4>
            <p className="text-[10px] text-[#AAAAAA]">VIP interview coaching queue, IELTS feedback tools, and priority VANI routes.</p>
          </div>
          <div>
            <span className="text-xl font-mono font-black text-white">{getPlanPrice('pro')}</span>
            <span className="text-[9px] text-[#AAAAAA] pl-0.5 font-mono">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
          <button
            onClick={() => handleCTAButtonPressed('pro')}
            className={`w-full py-2.5 rounded-xl font-mono text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${
              currentPlan === 'pro' 
                ? 'bg-emerald-500 text-white cursor-default' 
                : 'bg-[#BD53F4] text-white hover:bg-[#F0ABFC] hover:text-black font-bold'
            }`}
          >
            {currentPlan === 'pro' ? 'Current Active' : 'Select Pro'}
          </button>
        </div>

      </div>

      {/* SIMULATED SUBSCRIPTION CANCELLATION FOR DEMO CONVENIENCES */}
      {currentPlan !== 'locked' && (
        <div className="p-3 bg-[#1A1A1A] rounded-xl text-center border border-[#BD53F4]/15">
          <button
            onClick={cancelActiveSubscription}
            className="text-[9px] font-mono font-black text-[#555555] hover:text-[#BD53F4] uppercase tracking-widest transition-all cursor-pointer"
          >
            ❌ Reset Subscription Back to Free Trial/Locked (Demo Toggle)
          </button>
        </div>
      )}

      {/* FAQ ACCORDION SECTION */}
      <div className="p-5 bg-[#1A1A1A] rounded-3xl border border-[#BD53F4]/15 space-y-4 font-sans" id="faqs-accordion-block">
        <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-2.5">
          {faqs.map((f, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border-b border-white/5 pb-2.5 last:border-0"
              >
                <button
                  onClick={() => {
                    setExpandedFaq(isExpanded ? null : idx);
                    speakVani(`Selected FAQ option ${idx + 1}.`);
                  }}
                  className="w-full flex justify-between items-center text-xs text-white font-black uppercase tracking-tight text-left select-none py-1.5 cursor-pointer"
                >
                  <span className="font-sans">{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#BD53F4] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-[#AAAAAA] leading-relaxed pt-1 select-text"
                    >
                      {f.ans}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* GOOGLE PLAY DIALOG TRANSACTIONS SIMULATION POPUP */}
      <AnimatePresence>
        {showPlaySheet && selectedPlanForPurchase && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-[340px] bg-[#1C1C1E] rounded-3xl p-5 border border-white/10 text-center space-y-4 shadow-2xl relative"
            >
              {/* Play Store brand indicator */}
              <div className="flex justify-between items-center pb-2 border-b border-white/5 text-[9px] font-mono font-black text-white/50">
                <span>🟢 GOOGLE PLAY TRANSACTION CONSOLE</span>
                <button onClick={() => setShowPlaySheet(false)} className="text-white hover:text-white/80 p-1 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Secure logo */}
              <div className="w-12 h-12 bg-emerald-500/15 rounded-full border border-emerald-500/30 font-sans text-xl flex items-center justify-center text-emerald-400 mx-auto select-none">
                🛡️
              </div>

              <div className="space-y-1 text-center">
                <span className="text-[8px] font-mono text-[#AAAAAA] font-black uppercase tracking-widest block">Secure Billing Sandbox</span>
                <h4 className="text-sm font-black text-white uppercase font-display leading-tight">
                  Upgrade to {selectedPlanForPurchase.toUpperCase()} Tier
                </h4>
                <p className="text-[10px] text-[#AAAAAA] leading-relaxed">
                  The Google Play service will simulate a safe sandbox deduction of <span className="text-white font-black font-mono">{getPlanPrice(selectedPlanForPurchase)}</span> for Easy English elements.
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={confirmMockPurchase}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  Confirm & Pay (Simulate) 💸
                </button>
                <button
                  onClick={() => setShowPlaySheet(false)}
                  className="w-full py-3 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-[#AAAAAA] hover:text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  Cancel Transaction
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
