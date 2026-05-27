import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, MessageSquare, Check, Sparkles, 
  TrendingUp, UserCheck, Shield, ArrowRight, 
  ShieldCheck, AlertCircle, Phone, Lock, CreditCard,
  Crown, Play, BookOpen, Star, HelpCircle, Loader2
} from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (phoneNumber: string) => void;
  speakVani: (text: string) => void;
}

export default function OnboardingScreen({ onComplete, speakVani }: OnboardingScreenProps) {
  // Steps: 'welcome' | 'otp' | 'premium_trial_offer' | 'upi_select' | 'payment_processing' | 'success_activation'
  const [step, setStep] = useState<'welcome' | 'otp' | 'premium_trial_offer' | 'upi_select' | 'payment_processing' | 'success_activation'>('welcome');
  
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);

  const [selectedUPI, setSelectedUPI] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'other' | null>('gpay');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');

  const [paymentStep, setPaymentStep] = useState(0);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      speakVani('Please enter a correct 10 digit mobile number.');
      return;
    }
    setPhoneError('');
    speakVani("We’ve sent a secure OTP to your number for verification. Let's type it below.");
    setStep('otp');
    setOtpTimer(30);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setOtpError('Please enter the 4-digit verification code.');
      speakVani('The verification code must be 4 digits.');
      return;
    }
    setOtpError('');
    speakVani("Login successful! Welcome onboard. Let us explore spectacular English features together.");
    setStep('premium_trial_offer');
  };

  const handleResendOTP = () => {
    if (otpTimer > 0) return;
    setIsResending(true);
    speakVani("Sending another secure code via SMS.");
    setTimeout(() => {
      setIsResending(false);
      setOtpTimer(30);
      setOtp('');
    }, 1200);
  };

  const handleProceedToPayment = () => {
    speakVani("Choose your favorite UPI application for the safe 7 rupees checkout transaction.");
    setStep('upi_select');
  };

  const handleTriggerPayment = () => {
    if (selectedUPI === 'other') {
      const upiPattern = /^[\w.-]+@[\w.-]+$/;
      if (!upiPattern.test(upiId)) {
        setUpiError('Please enter a valid UPI ID (e.g., name@okaxis)');
        speakVani('The UPI address is not valid.');
        return;
      }
    }
    setUpiError('');
    setStep('payment_processing');
    speakVani("Initiating safe transaction. Please authorize Easy English Vani on your UPI application.");
    
    // Simulate payment sequence steps
    setPaymentStep(1); // Connecting
    setTimeout(() => {
      setPaymentStep(2); // Authorizing
      setTimeout(() => {
        setPaymentStep(3); // Completing
        setTimeout(() => {
          setStep('success_activation');
          speakVani("Congratulations! Your 7-day premium trial is now active. All master courses unlocked!");
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const handleFinishOnboarding = () => {
    onComplete(phone);
  };

  const premiumFeatures = [
    { title: "300+ Real-Life Scenario Conversations", desc: "Order food at restaurants, ace Job Interviews, or bargain easily" },
    { title: "Personal AI Speaking Partner", desc: "Practice anytime. Friendly corrections, supportive tone" },
    { title: "Real-Time Pronunciation Feedback", desc: "Detailed accent softeners for Bengali native speakers" },
    { title: "24x7 AI English Teacher", desc: "Get grammar tips, sentence rephrases, and rapid guidance" },
    { title: "Daily Progress Writing Reports", desc: "Keep tracking consistency streaks and level growth stats" },
    { title: "Interview Practice Modules", desc: "Perfect your admissions and HR recruiter responses out loud" },
    { title: "Confidence Building Exercises", desc: "Banish spoken fear under supportive conversational coaching" },
    { title: "Unlimited Free Speaking Practice", desc: "Speak without session limits, time bans, or ads overlays" }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between text-left font-sans text-white select-none" id="onboarding-viewport-enclosure">
      
      <AnimatePresence mode="wait">
        
        {/* STEP 1: WELCOME & PHONE NUMBER */}
        {step === 'welcome' && (
          <motion.div
            key="step-welcome"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-between py-2 space-y-4"
          >
            <div className="space-y-6 pt-4">
              {/* Logo icon header */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#BD53F4] to-[#F0ABFC] flex items-center justify-center shadow-lg shadow-[#BD53F4]/20">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-black uppercase tracking-widest text-[#BD53F4] leading-none">
                    VANI AI
                  </h1>
                  <span className="text-[10px] text-text-secondary uppercase tracking-widest font-mono">
                    EASY ENGLISH COACH
                  </span>
                </div>
              </div>

              {/* Title & Prompt */}
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white font-display uppercase tracking-tight">
                  Master Spoken English <span className="text-[#BD53F4] block">With Absolute Confidence</span>
                </h2>
                <p className="text-xs text-[#A0A0A5] leading-relaxed font-medium">
                  Welcome to Easy English — your AI-powered spoken English companion designed specifically to turn hesitancy into fluent, smooth conversations.
                </p>
              </div>

              {/* Benefits Highlights on Welcome Screen */}
              <div className="bg-[#121214] rounded-2xl border border-[#BD53F4]/10 p-3.5 space-y-2.5">
                <h3 className="text-[9px] font-mono text-[#F0ABFC] font-black uppercase tracking-wider block">
                  Why students love VANI AI:
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs">
                    <Check className="w-4 h-4 text-[#BD53F4] shrink-0" />
                    <span className="text-[#E2E2E6] font-medium">Phonetic correction specifically for Bengali speakers</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Check className="w-4 h-4 text-[#BD53F4] shrink-0" />
                    <span className="text-[#E2E2E6] font-medium">Safe speech workspace with friendly constructive help</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form row */}
            <form onSubmit={handleSendOTP} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-wider font-bold block">
                  Mobile Number Login
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-[#F0ABFC] font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      setPhoneError('');
                    }}
                    className="w-full bg-[#18181B] border border-white/10 hover:border-[#BD53F4]/40 focus:border-[#BD53F4] focus:ring-1 focus:ring-[#BD53F4] rounded-xl pl-14 pr-4 py-3.5 text-sm font-mono text-white placeholder-[#55555C] tracking-widest focus:outline-none transition-all"
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 pt-0.5 font-mono">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {phoneError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#BD53F4] hover:bg-[#F0ABFC] hover:text-black text-white py-3.5 rounded-xl text-xs font-mono font-black uppercase tracking-widest transition-all shadow-lg shadow-[#BD53F4]/10 active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Request Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <p className="text-[9px] text-[#55555C] text-center leading-normal">
                By tapping, you consent to secure OTP verification parameters ensuring PEGI compliant academic standards.
              </p>
            </form>
          </motion.div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <motion.div
            key="step-otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-between py-2 space-y-4"
          >
            <div className="space-y-6 pt-4">
              <button
                onClick={() => setStep('welcome')}
                className="text-xs font-mono text-[#AAAAAA] hover:text-[#BD53F4] flex items-center gap-1 transition-colors cursor-pointer"
              >
                ← Edit Number (+91 {phone})
              </button>

              <div className="space-y-2">
                <h2 className="text-xl font-black text-white uppercase font-display tracking-tight">
                  Enter Secure Verification Code
                </h2>
                <p className="text-xs text-[#A0A0A5] leading-relaxed">
                  We’ve sent a 4-digit verification code to <span className="font-mono text-[#F0ABFC] font-bold">+91 {phone}</span>. Please insert it below to register securely.
                </p>
              </div>

              <div className="p-4 bg-[#121214] border border-[#BD53F4]/10 rounded-2xl flex gap-3 text-xs leading-relaxed text-text-secondary items-start">
                <Lock className="w-4 h-4 text-[#BD53F4] shrink-0 mt-0.5" />
                <p>
                  VANI AI security ensures double encrypted user sessions. Feel free to type any mock 4-digit code (e.g. <span className="font-mono text-white font-bold">1234</span>) to verify instantly!
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-secondary uppercase tracking-wider font-bold block text-center">
                  Verification OTP Code
                </label>
                
                <div className="flex justify-center">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="• • • •"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ''));
                      setOtpError('');
                    }}
                    className="bg-[#18181B] border border-white/10 hover:border-[#BD53F4]/40 focus:border-[#BD53F4] rounded-xl py-3 w-40 text-center text-lg font-mono tracking-widest text-[#BD53F4] focus:outline-none focus:ring-1 focus:ring-[#BD53F4] transition-all"
                  />
                </div>

                {otpError && (
                  <p className="text-xs text-red-500 font-medium text-center font-mono flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {otpError}
                  </p>
                )}
              </div>

              {/* Resend button row */}
              <div className="text-center">
                <button
                  type="button"
                  disabled={otpTimer > 0 || isResending}
                  onClick={handleResendOTP}
                  className={`text-xs font-mono font-bold uppercase tracking-wider select-none transition-colors ${
                    otpTimer > 0 
                      ? 'text-[#44444A]' 
                      : 'text-[#F0ABFC] hover:text-[#BD53F4] cursor-pointer'
                  }`}
                >
                  {isResending ? (
                    <span className="flex items-center gap-1 justify-center">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending...
                    </span>
                  ) : otpTimer > 0 ? (
                    `Resend OTP in ${otpTimer}s`
                  ) : (
                    "Resend SMS Code"
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#BD53F4] to-[#F0ABFC] text-white py-3.5 rounded-xl text-xs font-mono font-black uppercase tracking-widest transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Verify & Log In
              </button>
            </form>
          </motion.div>
        )}

        {/* STEP 3: PREMIUM TRIAL FEATURE OFFER BAR */}
        {step === 'premium_trial_offer' && (
          <motion.div
            key="step-trial-offer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between py-2 space-y-4"
          >
            <div className="space-y-4 pt-1">
              {/* Badge */}
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 bg-[#BD53F4]/10 border border-[#BD53F4]/20 text-[#F0ABFC] rounded-full px-3 py-1 text-[9px] font-mono font-black uppercase tracking-widest">
                  <Star className="w-3 h-3 text-[#BD53F4] animate-pulse" />
                  Premium Trial Invited
                </span>
              </div>

              {/* Core Offer Box */}
              <div className="text-center space-y-1">
                <h2 className="text-lg font-black text-white uppercase font-display leading-tight tracking-tight">
                  Unlock Unrestricted Speaking Levels
                </h2>
                <div className="bg-[#BD53F4] text-black text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md inline-block max-w-max mx-auto font-mono">
                  SPECIAL INR 7 TRIAL PLAN
                </div>
                <p className="text-xs text-[#D8B4FE] pt-1">
                  Experience standard double acceleration growth instantly.
                </p>
              </div>

              {/* Dynamic scroll list of feature values */}
              <div className="bg-[#121214] rounded-2xl border border-white/5 p-3.5 space-y-2.5 max-h-[290px] overflow-y-auto scrollbar-none">
                <span className="text-[8px] font-mono text-[#55555C] uppercase tracking-widest font-black block">What you unlock:</span>
                <div className="space-y-3 font-sans">
                  {premiumFeatures.map((feat, index) => (
                    <div key={index} className="flex gap-2.5 items-start">
                      <div className="w-5 h-5 rounded-md bg-[#BD53F4]/10 border border-[#BD53F4]/20 flex items-center justify-center text-[#F0ABFC] font-black text-[10px] uppercase shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-[#EAEAEA] block leading-tight">{feat.title}</span>
                        <p className="text-[10px] text-[#8c8c91] leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-center space-y-1 bg-gradient-to-r from-purple-950/20 via-[#18181B] to-purple-950/20 p-3 rounded-xl border border-white/5">
                <span className="text-sm font-mono font-black text-[#F0ABFC]">
                  ₹7 only for 7 days trial access
                </span>
                <p className="text-[9px] text-[#D8B4FE] leading-normal font-medium">
                  Cancel anytime. After the trial ends, you can continue with a premium membership plan.
                </p>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full py-3.5 bg-[#BD53F4] hover:bg-[#F0ABFC] hover:text-black text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Start 7 Days Premium (Pay ₹7)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: UPI PAYMENT CHANNELS */}
        {step === 'upi_select' && (
          <motion.div
            key="step-upi-select"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex flex-col justify-between py-2 space-y-4"
          >
            <div className="space-y-4 pt-4">
              <button
                onClick={() => setStep('premium_trial_offer')}
                className="text-xs font-mono text-[#AAAAAA] hover:text-[#BD53F4] cursor-pointer"
              >
                ← Back to benefits
              </button>

              <div className="space-y-1">
                <h2 className="text-lg font-black text-white uppercase font-display tracking-tight leading-snug">
                  Choose UPI Payment Method
                </h2>
                <p className="text-xs text-[#A0A0A5]">
                  Complete transaction with any UPI applications in India safely.
                </p>
              </div>

              {/* UPI Grid selectors */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                
                {/* GPay */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUPI('gpay');
                    setUpiError('');
                  }}
                  className={`p-3.5 rounded-xl border text-center font-bold font-sans transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    selectedUPI === 'gpay' 
                      ? 'bg-[#BD53F4]/10 border-[#BD53F4] text-white font-medium shadow-md' 
                      : 'bg-[#121214] border-white/5 text-[#AAAAAA] hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xl">📱</span>
                  <span className="text-xs uppercase tracking-wider font-mono">Google Pay</span>
                </button>

                {/* PhonePe */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUPI('phonepe');
                    setUpiError('');
                  }}
                  className={`p-3.5 rounded-xl border text-center font-bold font-sans transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    selectedUPI === 'phonepe' 
                      ? 'bg-[#BD53F4]/10 border-[#BD53F4] text-white font-medium shadow-md' 
                      : 'bg-[#121214] border-white/5 text-[#AAAAAA] hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xl">💜</span>
                  <span className="text-xs uppercase tracking-wider font-mono">PhonePe</span>
                </button>

                {/* Paytm */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUPI('paytm');
                    setUpiError('');
                  }}
                  className={`p-3.5 rounded-xl border text-center font-bold font-sans transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    selectedUPI === 'paytm' 
                      ? 'bg-[#BD53F4]/10 border-[#BD53F4] text-white font-medium shadow-md' 
                      : 'bg-[#121214] border-white/5 text-[#AAAAAA] hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xl">💙</span>
                  <span className="text-xs uppercase tracking-wider font-mono">Paytm</span>
                </button>

                {/* BHIM */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUPI('bhim');
                    setUpiError('');
                  }}
                  className={`p-3.5 rounded-xl border text-center font-bold font-sans transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    selectedUPI === 'bhim' 
                      ? 'bg-[#BD53F4]/10 border-[#BD53F4] text-white font-medium shadow-md' 
                      : 'bg-[#121214] border-white/5 text-[#AAAAAA] hover:border-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xl">🇮🇳</span>
                  <span className="text-xs uppercase tracking-wider font-mono">BHIM UPI</span>
                </button>

              </div>

              {/* Custom UPI Field conditional */}
              <button
                type="button"
                onClick={() => {
                  setSelectedUPI('other');
                  setUpiId('');
                }}
                className={`w-full py-3.5 rounded-xl border font-mono text-[10px] uppercase font-black tracking-widest text-center transition-all cursor-pointer ${
                  selectedUPI === 'other'
                    ? 'bg-[#BD53F4]/10 border-[#BD53F4]'
                    : 'bg-[#121214] border-white/5 text-[#AAAAAA]'
                }`}
              >
                ✏️ Use custom UPI Address / VPA ID
              </button>

              <AnimatePresence>
                {selectedUPI === 'other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5"
                  >
                    <input
                      type="text"
                      placeholder="Insert your identity VPA ID (e.g., cell@upi)"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setUpiError('');
                      }}
                      className="w-full bg-[#18181B] border border-white/10 focus:border-[#BD53F4] rounded-xl px-4 py-3 text-xs tracking-wide text-[#F0ABFC] placeholder-[#55555C]"
                    />
                    {upiError && (
                      <p className="text-xs text-red-500 font-mono font-bold leading-normal">
                        ⚠️ {upiError}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3 pt-4">
              <div className="bg-[#121214] p-3 rounded-xl border border-white/5 flex gap-2 text-[10px] items-start text-text-secondary leading-normal">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  Easy English partner checkouts are verified secure under safe payment encryptions. No hidden dues will apply.
                </p>
              </div>

              <button
                onClick={handleTriggerPayment}
                className="w-full py-3.5 bg-gradient-to-r from-[#BD53F4] to-[#F0ABFC] text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Buy Now — ₹7 UPI Checkout
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: LOADER PAYMENT IN PROGRESS */}
        {step === 'payment_processing' && (
          <motion.div
            key="step-paying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col justify-center items-center py-8 space-y-6"
          >
            {/* Ambient Loading Ring */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-[#BD53F4] animate-spin" />
              <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#F0ABFC] w-6 h-6 animate-pulse" />
            </div>

            <div className="text-center space-y-2 max-w-[80%]">
              <h3 className="text-sm font-mono font-black uppercase tracking-widest text-white">
                UPI Security Checkout
              </h3>
              
              <AnimatePresence mode="wait">
                {paymentStep === 1 && (
                  <motion.p
                    key="pstep-1"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-[#AAAAAA] leading-relaxed font-mono font-bold"
                  >
                    🚀 Connecting to safe UPI application...
                  </motion.p>
                )}
                {paymentStep === 2 && (
                  <motion.p
                    key="pstep-2"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-[#F0ABFC] leading-relaxed font-mono font-bold"
                  >
                    💸 Authorizing secure ₹7.00 trial payment...
                  </motion.p>
                )}
                {paymentStep === 3 && (
                  <motion.p
                    key="pstep-3"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-emerald-400 leading-relaxed font-mono font-bold uppercase tracking-wide"
                  >
                    🎉 Complete! Registering premium access...
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="text-[10px] text-[#55555C] leading-normal pt-2">
                Please do not quit this subscreen page or press cancel. Safe banking cycles are concluding.
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 6: CONGRATULATIONS ACTIVE SUCCESS! */}
        {step === 'success_activation' && (
          <motion.div
            key="step-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-between py-2 space-y-4"
          >
            <div className="space-y-6 pt-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/15 rounded-full border border-emerald-500/30 flex items-center justify-center text-emoji text-3xl mx-auto animate-bounce">
                🎉
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full uppercase font-black tracking-widest inline-block border border-[#10B981]/25">
                  Trial Active
                </span>
                <h2 className="text-xl font-black text-white uppercase font-display tracking-tight">
                  Premium Trial Active!
                </h2>
                <p className="text-xs text-[#10B981] font-bold font-mono">
                  Congratulations! Your 7-day premium trial is now active.
                </p>
              </div>

              {/* Unlocked list */}
              <div className="bg-[#121214] rounded-2xl border border-emerald-500/10 p-4 space-y-2.5 text-left max-w-sm mx-auto">
                <span className="text-[9px] font-mono text-[#55555C] font-black uppercase tracking-wider block">UNLOCKED RESOURCES IN VANI AI:</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-white font-bold leading-normal">
                  <div className="flex items-center gap-1.5 grayscale-0">
                    <span className="text-[#BD53F4]">⚡</span> AI Calls
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#BD53F4]">⚡</span> Scenario Dialogs
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#BD53F4]">⚡</span> Unlimited Speech
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#BD53F4]">⚡</span> Phonetic Feedback
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#BD53F4]">⚡</span> Premium Classes
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#BD53F4]">⚡</span> Progress Audit Records
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-[#AAAAAA] text-center max-w-[90%] mx-auto leading-relaxed">
                Start speaking English flawlessly with local Bengali coaching accents softeners today.
              </p>

              <button
                onClick={handleFinishOnboarding}
                className="w-full py-4 bg-gradient-to-r from-[#10B981] to-emerald-500 text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-101 active:scale-98 cursor-pointer"
              >
                Start Learning Now! 🚀
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
