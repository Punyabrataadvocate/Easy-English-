import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, Sparkles, Volume2, ArrowRight, Award, Info, 
  Check, ShieldCheck, CreditCard, Smartphone, Play, Zap, HelpCircle
} from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface HeroScreenProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  streak: number;
  stats: {
    avgAccuracy: number;
    avgFluency: number;
    wordsSpoken: number;
  };
  currentPlan: SubscriptionPlan;
}

export default function HeroScreen({ onSelectPlan, streak, stats, currentPlan }: HeroScreenProps) {
  const [activePhonicTab, setActivePhonicTab] = useState<number>(0);
  const [showPaySheet, setShowPaySheet] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState<SubscriptionPlan | null>(null);
  const [purchasePrice, setPurchasePrice] = useState<string>('₹7');
  const [purchaseName, setPurchaseName] = useState<string>('7-Day Premium Trial');

  // Real-time 3D Card tilting angles
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate cursor position relative to the card's dimensions
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Target angle calculations (maximum 22 degree tilt)
    const rX = -(mouseY / height) * 22;
    const rY = (mouseX / width) * 22;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handlePointerLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const phoneticTriggers = [
    {
      word: "Wednesday",
      incorrect: "WEH-nes-day (ওয়েডনেস ডে)",
      phonetic: "WENZ-day (ওয়েঞ্জ-ডে)",
      bengaliTip: "মাঝের 'D' অক্ষর টি উচ্চারণ করা ভুল। বলবেন 'WENZ-day', 'ওয়েডনেস ডে' নয়।",
      badge: "Silent 'D' Letter"
    },
    {
      word: "Very",
      incorrect: "Wery (উয়ারি)",
      phonetic: "V-airy (ভে-রী)",
      bengaliTip: "Rest your top teeth gently on your lower lip for 'V' sound, do not round lips like 'W'.",
      badge: "V vs W Phonics"
    },
    {
      word: "This",
      incorrect: "Dis (দিস)",
      phonetic: "ðɪs (TH-iss)",
      bengaliTip: "দিস বলবেন না। জিভ সামান্য দুই দাঁতের মাঝখানে রেখে উচ্চারণ করুন মৃদু 'দ' সাউন্ড।",
      badge: "TH Accent Softening"
    }
  ];

  const triggerPaymentSheet = (plan: SubscriptionPlan) => {
    setSelectedPlanForPurchase(plan);
    if (plan === 'trial_rs7') {
      setPurchasePrice('₹7');
      setPurchaseName('7-Day VIP Trial Pass');
    } else {
      setPurchasePrice('₹249');
      setPurchaseName('Full Lifetime Access Plan');
    }
    setShowPaySheet(true);
  };

  const executeSimulatedPayment = () => {
    if (selectedPlanForPurchase) {
      onSelectPlan(selectedPlanForPurchase);
      setShowPaySheet(false);
    }
  };

  return (
    <div className="w-full text-text-primary space-y-6 pt-3 pb-8 text-left h-full flex flex-col justify-between" id="hero-screen-landing">
      
      {/* 2. TOP MINI LOGO ROW */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">🏆</span>
          <span className="text-xs font-mono font-bold tracking-widest text-gold-primary">VĀṆĪ AI COACH</span>
        </div>
        <span className="text-[10px] bg-amber-500/10 text-gold-light border border-gold-primary/20 px-2 py-0.5 rounded-full font-mono font-extrabold uppercase animate-pulse">
          ⚡ 7-Day OFFER ON
        </span>
      </div>

      {/* 3. HERO INTRODUCTION */}
      <div className="text-center space-y-1 my-1 px-2">
        <h1 className="text-2xl font-serif font-extrabold tracking-tight text-slate-800 leading-tight">
          Speak English Natively <span className="text-purple-600">With VANI</span>
        </h1>
        <p className="text-[11px] text-text-secondary leading-normal font-sans font-medium px-4">
          Acoustic speech diagnostic helper designed specifically for Indian speakers to eliminate accent barriers seamlessly.
        </p>
      </div>

      {/* 4. PREMIUM 3D ROTATIVE ATTRACTION BOX AREA */}
      <div className="flex justify-center py-2" id="space-3d-gantry">
        <div 
          className="relative w-full max-w-[340px] h-[240px] cursor-pointer"
          style={{ perspective: '1000px' }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerEnter={() => setIsHovered(true)}
        >
          <motion.div
            className="w-full h-full rounded-[28px] p-6 relative overflow-hidden select-none flex flex-col justify-between shadow-[0_20px_45px_-12px_rgba(124,58,237,0.3)] border border-white/20 text-white bg-gradient-to-tr from-indigo-600 via-fuchsia-600 to-amber-500"
            style={{
              transformStyle: 'preserve-3d',
              rotateX: rotateX,
              rotateY: rotateY,
            }}
            animate={{
              // Fallback floating tilt animation if user isn't hovering
              rotateY: isHovered ? rotateY : [0, 8, -8, 0],
              rotateX: isHovered ? rotateX : [2, -2, 2, 2],
              scale: isHovered ? 1.03 : 1
            }}
            transition={{
              type: 'spring',
              stiffness: isHovered ? 260 : 35,
              damping: isHovered ? 20 : 12,
              repeat: isHovered ? 0 : Infinity,
              repeatType: 'reverse',
              duration: 5
            }}
          >
            {/* Glossy Reflection Highlight Shimmer Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none transform -skew-x-12 translate-x-3 duration-1000" />

            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-black tracking-widest bg-white/20 backdrop-blur-xs text-amber-100 uppercase px-2 py-0.5 rounded-full inline-block">
                  ⭐ VIP AUDIO LICENSE
                </span>
                <h3 className="text-2xl font-serif font-black tracking-tighter leading-none pt-1">वाणी VĀṆĪ</h3>
              </div>
              <Sparkles className="w-6 h-6 text-amber-200 animate-spin" />
            </div>

            {/* Simulated Audio Spectrum waveform bar */}
            <div className="space-y-3 bg-black/15 p-3 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-sans font-bold text-amber-200 uppercase">OFFER TIER:</span>
                <span className="text-sm font-mono font-black text-white">7 DAYS FOR JUST ₹7!</span>
              </div>
              
              <div className="flex items-center gap-1.5 h-6">
                <span className="w-1 bg-white h-2 rounded-full animate-pulse" />
                <span className="w-1 bg-white h-4 rounded-full" />
                <span className="w-1 bg-white h-5 rounded-full" />
                <span className="w-1 bg-white h-6 rounded-full" />
                <span className="w-1 bg-white h-4 rounded-full" />
                <span className="w-1 bg-white h-1.5 rounded-full animate-pulse" />
                <span className="w-1 bg-amber-400 h-5 rounded-full" />
                <span className="w-1 bg-amber-400 h-6 rounded-full" />
                <span className="w-1 bg-amber-400 h-4 rounded-full" />
                <span className="text-[10px] font-mono text-white/80 font-bold uppercase pl-2">Vocal active</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/10 pt-2 text-[10px] font-mono text-white/90">
              <span>ACCENT REDUCTION PLUS</span>
              <span className="font-extrabold text-amber-100 text-xs">₹7.00 ONLY</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 5. PURCHASING TRIGGER OPTIONS CARD */}
      <div className="space-y-3 bg-bg-card p-4 rounded-3xl border border-border-subtle/80 shadow-md">
        <span className="text-[10px] font-mono text-center text-text-secondary uppercase block font-bold">CHOOSE ENTRANCE OPTIONS</span>
        
        <div className="grid grid-cols-1 gap-2.5">
          {/* OPTION A: Rs 7 for 7 days trial (Primary CTA) */}
          <button
            onClick={() => triggerPaymentSheet('trial_rs7')}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:scale-[1.01] active:scale-[0.99] text-amber-950 font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-amber-500/10 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border border-amber-300"
          >
            <span className="flex items-center gap-1.5 text-[13px] font-black">
              ⚡ GET 7-DAY VIP TRIAL FOR ₹7
            </span>
            <span className="text-[9px] font-mono font-black text-amber-900 leading-none">
              only ₹1 per day! full segment unlock
            </span>
          </button>

          {/* OPTION B: Pay direct amount */}
          <button
            onClick={() => triggerPaymentSheet('premium')}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm select-none"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pay Premium Directly (₹249)</span>
          </button>
        </div>
      </div>

      {/* 6. SAMPLE VALUE PROMPT TRAPS (PREVIEW CONTENT DESIGNED WITH UNIQUE SHADING COLORS) */}
      <div className="space-y-3 bg-bg-surface p-4 rounded-3xl border border-border-subtle/70">
        <h4 className="text-xs font-mono font-bold text-slate-800 uppercase flex items-center gap-1.5">
          ✨ Accent traps we heal
        </h4>
        
        <div className="space-y-2">
          {phoneticTriggers.map((item, idx) => (
            <div 
              key={item.word}
              className={`p-3 rounded-2xl border text-xs flex justify-between items-center transition-all ${
                idx === 0 
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
                  : idx === 1 
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950' 
                  : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
              }`}
            >
              <div className="space-y-0.5 text-left">
                <span className="font-bold text-slate-800 font-serif text-[13px]">{item.word}</span>
                <span className="text-[10px] block opacity-80 font-mono">BENGALI ERROR: {item.incorrect}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-extrabold uppercase border ${
                idx === 0 
                  ? 'bg-rose-100 border-rose-300/40 text-rose-700' 
                  : idx === 1 
                  ? 'bg-amber-100 border-amber-300/40 text-amber-700' 
                  : 'bg-indigo-100 border-indigo-300/40 text-indigo-700'
              }`}>
                {item.word === 'Wednesday' ? 'Silent letter' : 'vocal correction'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GOOGLE PLAY BILLING SERVICE MOCK SHEET OVERLAY */}
      <AnimatePresence>
        {showPaySheet && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center select-none" id="playstore-merchant-backdrop">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full bg-[#FAF9F5] border-t-4 border-emerald-600 rounded-t-[36px] p-6 space-y-5 text-left shadow-[0_-12px_45px_rgba(0,0,0,0.2)]"
            >
              {/* Google Play Safe Header */}
              <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-xs font-serif font-black text-slate-900 block leading-tight">Google Play Billing</span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block font-semibold">Verified Merchant Checkout</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaySheet(false)}
                  className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 font-bold flex items-center justify-center text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Product Info Block */}
              <div className="bg-white p-4 rounded-2xl border border-zinc-200 text-left space-y-1">
                <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/40">
                  Easy English Premium Plan
                </span>
                <h4 className="text-base font-extrabold text-slate-800 leading-tight pt-1">
                  {purchaseName}
                </h4>
                <p className="text-[10px] text-zinc-500">
                  Sub-seconds streaming connection with VANI AI Speech Diagnostics engine inside internal classrooms.
                </p>
                <div className="flex justify-between items-baseline pt-2 border-t border-zinc-100 mt-2">
                  <span className="text-xs font-mono font-bold text-slate-700">TOTAL BILLEDS AMOUNT</span>
                  <span className="text-xl font-mono font-black text-emerald-600">{purchasePrice}</span>
                </div>
              </div>

              {/* Security Shield Callout */}
              <div className="flex items-center gap-3 bg-zinc-100/50 p-3 rounded-xl border border-zinc-200/30">
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                <p className="text-[10px] text-zinc-600 leading-snug">
                  Easy English has simulated a secure Google Play merchant receipt. Funds are simulated. Proceed safely without using credit cards!
                </p>
              </div>

              {/* Secure simulated buy trigger button */}
              <button
                onClick={executeSimulatedPayment}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>SIMULATE & SECURELY PAY {purchasePrice} →</span>
              </button>

              <p className="text-center text-[10px] text-zinc-400 font-mono">
                Transaction ID: GPL-MOCK-{Date.now().toString().slice(-6)} | Safe Sandbox Mode
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
