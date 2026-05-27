import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, ShieldCheck, Check, Sparkles, 
  Crown, ArrowRight, ArrowLeft, Loader2, Phone
} from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface TrialExpiredScreenProps {
  onUpgradeComplete: (chosenPlan: SubscriptionPlan) => void;
  onResetToTrial: () => void;
  speakVani: (text: string) => void;
}

export default function TrialExpiredScreen({ onUpgradeComplete, onResetToTrial, speakVani }: TrialExpiredScreenProps) {
  const [selectedPlanTab, setSelectedPlanTab] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly');
  const [step, setStep] = useState<'offer' | 'upi_pay' | 'processing' | 'success'>('offer');
  const [selectedUPI, setSelectedUPI] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [paymentStep, setPaymentStep] = useState(0);

  const plans = {
    monthly: { id: 'basic' as SubscriptionPlan, name: 'Monthly Plan', price: '₹249', valueText: 'Perfect for steady improvement', perMonth: '₹249/mo' },
    quarterly: { id: 'premium' as SubscriptionPlan, name: 'Quarterly Plan', price: '₹599', valueText: 'Most popular for fluency (Save 20%)', perMonth: '₹200/mo' },
    yearly: { id: 'pro' as SubscriptionPlan, name: 'Yearly Plan', price: '₹1,499', valueText: 'Best Value for Career Prep! (Save 50%)', perMonth: '₹125/mo' }
  };

  const currentSelection = plans[selectedPlanTab];

  const handleSelectUPIApps = () => {
    speakVani(`Upgrading to ${currentSelection.name} for ${currentSelection.price}. Select your secure UPI checkout option.`);
    setStep('upi_pay');
  };

  const handleExecutePayment = () => {
    setStep('processing');
    setPaymentStep(1);
    speakVani("Re-authorizing secure subscription checkouts. Connecting to bank networks.");

    setTimeout(() => {
      setPaymentStep(2);
      setTimeout(() => {
        setPaymentStep(3);
        setTimeout(() => {
          setStep('success');
          speakVani(`Incredibly fantastic! Your premium upgrade to ${currentSelection.name} succeeded! All conversational tracks are unlocked.`);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const handleFinishUpgrade = () => {
    onUpgradeComplete(currentSelection.id);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between text-left bg-black text-white p-6 overflow-y-auto font-sans select-none" id="expired-vault-viewport">
      
      <AnimatePresence mode="wait">
        
        {/* STEP 1: EXPIRED OFFER ZONE */}
        {step === 'offer' && (
          <motion.div
            key="expired-offer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-5">
              
              {/* Alert header banner */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex gap-3 text-left items-start">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h2 className="text-xs font-mono font-black text-red-400 uppercase tracking-widest leading-none">
                    Trial Limit Reached
                  </h2>
                  <span className="text-sm font-black text-white block pt-1 leading-tight">
                    Your premium trial has ended.
                  </span>
                  <p className="text-[11px] text-[#AAAAAA] leading-normal font-semibold">
                    You have spent your 7 days of safe, high-speed VANI AI trial. Upgrade to any plan to resume speaking English with professional feedback.
                  </p>
                </div>
              </div>

              {/* Gated visual badge lock */}
              <div className="flex justify-center flex-col items-center gap-1.5 py-1">
                <div className="w-12 h-12 bg-[#BD53F4]/10 rounded-full border border-[#BD53F4]/30 flex items-center justify-center text-[#F0ABFC]">
                  <Crown className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">Unseal premium learning tracks</h3>
                  <p className="text-[10px] text-text-secondary">Keep building confidence daily, without pauses</p>
                </div>
              </div>

              {/* Interactive pricing cards switcher */}
              <div className="space-y-2.5">
                <span className="text-[8px] font-mono text-[#55555C] font-black uppercase tracking-widest block">Choose Subscription Plans:</span>
                
                {/* Monthly */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanTab('monthly')}
                  className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                    selectedPlanTab === 'monthly'
                      ? 'bg-[#BD53F4]/10 border-[#BD53F4]'
                      : 'bg-[#121214] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Monthly Plan</span>
                    <span className="text-[9px] text-[#AAAAAA] block leading-none">{plans.monthly.valueText}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-black text-[#F0ABFC] block">{plans.monthly.price}</span>
                    <span className="text-[8px] text-[#A0A0A5]">{plans.monthly.perMonth}</span>
                  </div>
                </button>

                {/* Quarterly - Recommended */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanTab('quarterly')}
                  className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all relative cursor-pointer ${
                    selectedPlanTab === 'quarterly'
                      ? 'bg-[#BD53F4]/15 border-[#BD53F4]'
                      : 'bg-[#121214] border-white/5 hover:border-white/10'
                  }`}
                >
                  <span className="absolute top-[-8px] right-3 bg-[#BD53F4] text-black font-mono font-bold text-[7px] px-1.5 py-0.5 rounded uppercase">
                    RECOMMENDED
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Quarterly Plan</span>
                    <span className="text-[9px] text-[#AAAAAA] block leading-none">{plans.quarterly.valueText}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-black text-[#F0ABFC] block">{plans.quarterly.price}</span>
                    <span className="text-[8px] text-[#A0A0A5]">{plans.quarterly.perMonth}</span>
                  </div>
                </button>

                {/* Yearly */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanTab('yearly')}
                  className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                    selectedPlanTab === 'yearly'
                      ? 'bg-[#BD53F4]/10 border-[#BD53F4]'
                      : 'bg-[#121214] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Yearly Plan</span>
                    <span className="text-[9px] text-[#AAAAAA] block leading-none">{plans.yearly.valueText}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-black text-[#F0ABFC] block">{plans.yearly.price}</span>
                    <span className="text-[8px] text-[#A0A0A5]">{plans.yearly.perMonth}</span>
                  </div>
                </button>

              </div>

            </div>

            <div className="space-y-3.5 pt-4">
              <button
                onClick={handleSelectUPIApps}
                className="w-full py-4 bg-[#BD53F4] hover:bg-[#F0ABFC] hover:text-black text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Subscribe Now ({currentSelection.price})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* DEMO RESET CONVENIENCE FOR TESTERS */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={onResetToTrial}
                  className="text-[9px] font-mono text-white/20 hover:text-white/60 tracking-wider uppercase underline cursor-pointer"
                >
                  🛠️ Tester Option: Reset back to Active ₹7 Trial
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: CHOOSE UPI APP CHECKOUT TO UPGRADE */}
        {step === 'upi_pay' && (
          <motion.div
            key="expired-payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-5">
              <button
                onClick={() => setStep('offer')}
                className="text-xs font-mono text-[#AAAAAA] hover:text-[#BD53F4] flex items-center gap-1 cursor-pointer"
              >
                ← Back to plans
              </button>

              <div className="space-y-1">
                <h2 className="text-lg font-black text-white uppercase font-display tracking-tight leading-none pt-2">
                  Upgrade UPI Payment
                </h2>
                <p className="text-xs text-[#AAAAAA] leading-normal">
                  Fulfill your secure {currentSelection.name} rate of <span className="text-[#F0ABFC] font-black font-mono">{currentSelection.price}</span>.
                </p>
              </div>

              {/* Selector apps */}
              <div className="space-y-2 pt-2">
                
                {/* GPay */}
                <button
                  type="button"
                  onClick={() => setSelectedUPI('gpay')}
                  className={`w-full p-3.5 rounded-xl border flex gap-3 text-left items-center transition-all cursor-pointer ${
                    selectedUPI === 'gpay'
                      ? 'bg-[#BD53F4]/10 border-[#BD53F4]'
                      : 'bg-[#121214] border-white/5'
                  }`}
                >
                  <span className="text-xl">📱</span>
                  <div>
                    <span className="text-xs font-bold text-white block">Google Pay Checkout</span>
                    <span className="text-[9px] text-[#A0A0A5]">Authorize on your Google Pay UPI application</span>
                  </div>
                </button>

                {/* PhonePe */}
                <button
                  type="button"
                  onClick={() => setSelectedUPI('phonepe')}
                  className={`w-full p-3.5 rounded-xl border flex gap-3 text-left items-center transition-all cursor-pointer ${
                    selectedUPI === 'phonepe'
                      ? 'bg-[#BD53F4]/10 border-[#BD53F4]'
                      : 'bg-[#121214] border-white/5'
                  }`}
                >
                  <span className="text-xl">💜</span>
                  <div>
                    <span className="text-xs font-bold text-white block">PhonePe BHIM UPI</span>
                    <span className="text-[9px] text-[#A0A0A5]">Fulfill billing on PhonePe securely</span>
                  </div>
                </button>

                {/* Paytm */}
                <button
                  type="button"
                  onClick={() => setSelectedUPI('paytm')}
                  className={`w-full p-3.5 rounded-xl border flex gap-3 text-left items-center transition-all cursor-pointer ${
                    selectedUPI === 'paytm'
                      ? 'bg-[#BD53F4]/10 border-[#BD53F4]'
                      : 'bg-[#121214] border-white/5'
                  }`}
                >
                  <span className="text-xl">💙</span>
                  <div>
                    <span className="text-xs font-bold text-white block">Paytm Wallet / UPI</span>
                    <span className="text-[9px] text-[#A0A0A5]">Authorize payment alerts from Paytm</span>
                  </div>
                </button>

              </div>
            </div>

            <div className="space-y-3 pt-4 animate-fade-in">
              <button
                onClick={handleExecutePayment}
                className="w-full py-4 bg-gradient-to-r from-[#BD53F4] to-[#F0ABFC] text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Simulate UPI Payment ({currentSelection.price})
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PAYMENT PROCESSING BAR */}
        {step === 'processing' && (
          <motion.div
            key="expired-processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col justify-center items-center py-8 space-y-6 animate-pulse"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-[#BD53F4] animate-spin" />
              <Crown className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#F0ABFC] w-5 h-5" />
            </div>

            <div className="text-center space-y-2 max-w-[80%]">
              <h3 className="text-xs font-mono font-black uppercase tracking-widest text-[#BD53F4]">Connecting Security</h3>
              
              <AnimatePresence mode="wait">
                {paymentStep === 1 && (
                  <motion.p
                    key="p1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-[#AAAAAA] font-mono leading-relaxed"
                  >
                    📡 Syncing upgrade token with banking lines...
                  </motion.p>
                )}
                {paymentStep === 2 && (
                  <motion.p
                    key="p2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-[#F0ABFC] font-mono leading-relaxed"
                  >
                    🔒 Deposited payment values for secure registration...
                  </motion.p>
                )}
                {paymentStep === 3 && (
                  <motion.p
                    key="p3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-emerald-400 font-mono leading-relaxed uppercase font-black"
                  >
                    🎉 Transaction succeeded! Provisioning account level...
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS CONGRATULATOR SCREEN */}
        {step === 'success' && (
          <motion.div
            key="expired-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-between py-2 space-y-4"
          >
            <div className="space-y-6 pt-8 text-center">
              <div className="w-16 h-16 bg-emerald-500/15 rounded-full border border-emerald-500/30 flex items-center justify-center text-emoji text-3xl mx-auto animate-bounce">
                👑
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full uppercase font-black tracking-widest inline-block border border-[#10B981]/25">
                  Access Upgraded
                </span>
                <h2 className="text-xl font-black text-white uppercase font-display tracking-tight">
                  Congratulations!
                </h2>
                <p className="text-xs text-[#10B981] font-bold font-mono">
                  You are now fully upgraded to the Easy English {currentSelection.name}.
                </p>
                <p className="text-xs text-[#AAAAAA] leading-normal max-w-[85%] mx-auto pt-1 font-medium">
                  We have unlocked all 50 level lessons, unlimited speaking dialogues, and customized real-time phonetic Softeners audits for your career.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleFinishUpgrade}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Resume Speaking English! 🚀
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
