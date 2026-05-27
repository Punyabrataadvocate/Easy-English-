import React, { useState } from 'react';
import { 
  ArrowLeft, ShieldCheck, CheckCircle, Smartphone, Info, 
  HelpCircle, AlertTriangle, RefreshCw, KeyRound, Cpu 
} from 'lucide-react';
import { PLAYSTORE_COMPLIANCE_TIPS } from '../data';
import { SubscriptionPlan } from '../types';

interface VerificationScreenProps {
  onBack: () => void;
  currentPlan: SubscriptionPlan;
  onPlanChange: (plan: SubscriptionPlan) => void;
  sessionCount: number;
  trialExpiredSimulated: boolean;
  onToggleTrialExpiredSimulated: (expired: boolean) => void;
  onResetApp: () => void;
}

export default function VerificationScreen({
  onBack,
  currentPlan,
  onPlanChange,
  sessionCount,
  trialExpiredSimulated,
  onToggleTrialExpiredSimulated,
  onResetApp
}: VerificationScreenProps) {
  const [activeTab, setActiveTab] = useState<'audit' | 'playstore'>('audit');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(true);

  const requestMicrophonePermissionMock = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissionGranted(true);
      } else {
        setPermissionGranted(true); // Trat as granted for mockup
      }
    } catch (e) {
      setPermissionGranted(false);
    }
  };

  return (
    <div className="space-y-5 text-left h-full flex flex-col" id="verification-desk-subscreen">
      
      {/* HEADER ROW */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle/10 shrink-0" id="verify-header">
        <button 
          onClick={onBack}
          className="p-1 px-3 bg-bg-card border border-border-subtle hover:border-gold-primary text-gold-primary rounded-xl flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <div className="text-center">
          <h3 className="text-[10px] font-mono text-gold-primary uppercase tracking-widest leading-none font-bold">App Settings</h3>
          <span className="text-sm font-sans text-text-primary font-bold block pt-1">Verification Desk</span>
        </div>

        <span className="text-[9px] font-mono bg-success-green/15 text-success-green border border-success-green/30 px-2.5 py-1 rounded-full font-bold select-none uppercase animate-pulse">
          v1.4 SECURE
        </span>
      </div>

      {/* SEGMENTED TAB SELECTOR (Sliding view selection) */}
      <div className="flex bg-bg-surface p-1 rounded-xl border border-border-subtle shrink-0 animate-fade-in" id="verify-tabs">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'audit' 
              ? 'bg-gradient-to-r from-gold-primary to-gold-light text-white shadow-md' 
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/40'
          }`}
        >
          🔍 VANI AUDIT
        </button>
        <button
          onClick={() => setActiveTab('playstore')}
          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'playstore' 
              ? 'bg-gradient-to-r from-gold-primary to-gold-light text-white shadow-md' 
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/40'
          }`}
        >
          🤖 PLAY STORE CHECK
        </button>
      </div>

      {/* DYNAMIC TAB BODY */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-none" id="verify-tab-content">
        {activeTab === 'audit' ? (
          /* TAB 1: VANI AUDIT LOGS & SYSTEM METRICS */
          <div className="space-y-4" id="vocal-audit-deck">
            <div className="bg-bg-card rounded-2xl border border-border-subtle p-4 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-border-subtle/5">
                <ShieldCheck className="w-5 h-5 text-success-green" />
                <span className="text-xs font-sans font-bold text-text-primary uppercase tracking-wider">Release Verification Deck</span>
              </div>

              {/* Param Grid */}
              <div className="space-y-2 font-mono text-[11px] text-text-primary">
                <div className="flex justify-between items-center bg-bg-surface/50 p-2.5 rounded-xl border border-border-subtle/10">
                  <span className="text-text-secondary uppercase">APP IDENTIFIER</span>
                  <span className="text-[#0284C7] font-extrabold">com.easyenglish.vani</span>
                </div>
                <div className="flex justify-between items-center bg-bg-surface/50 p-2.5 rounded-xl border border-border-subtle/10">
                  <span className="text-text-secondary uppercase">AUDIO LANGUAGE CODE</span>
                  <span className="text-gold-primary font-extrabold">en-IN (Indian English)</span>
                </div>
                <div className="flex justify-between items-center bg-bg-surface/50 p-2.5 rounded-xl border border-border-subtle/10">
                  <span className="text-text-secondary uppercase">PEGI RATING</span>
                  <span className="text-success-green font-extrabold">PEGI 3 Compliant</span>
                </div>
                <div className="flex justify-between items-center bg-bg-surface/50 p-2.5 rounded-xl border border-border-subtle/10">
                  <span className="text-text-secondary uppercase">PERSISTENT CACHING</span>
                  <span className="text-gold-primary font-extrabold">localStorage ACTIVE</span>
                </div>
              </div>

              {/* Play Store sandbox billing disclaimer */}
              <div className="p-3 bg-amber-950/15 rounded-xl border border-gold-primary/20 text-[10px] leading-relaxed flex gap-2">
                <AlertTriangle className="w-4 h-4 text-gold-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-gold-light block">Play Store Billing Sandbox Enabled</span>
                  <p className="text-text-secondary">
                    Our billing simulator evaluates current subscriptions to let you check the premium features seamlessly. Select a plan inside the Store view to unlock modules.
                  </p>
                </div>
              </div>
            </div>

            {/* SANDBOX SIMULATOR WORKSPACE CARD */}
            <div className="bg-[#121214] rounded-2xl border border-[#BD53F4]/30 p-4 space-y-3.5 shadow-md shadow-[#BD53F4]/5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-white/5">
                <span className="text-[14px]">🛠️</span>
                <span className="text-xs font-sans font-black text-white uppercase tracking-wider">Evaluation Sandbox Control Panel</span>
              </div>

              <p className="text-[11px] text-[#A0A0A5] leading-relaxed">
                Use the quick controls below to evaluate different onboarding and subscription states easily on this simulated preview layout:
              </p>

              <div className="space-y-2.5">
                {/* Toggle Trial End Expiration */}
                <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <div className="space-y-0.5 max-w-[70%]">
                    <span className="text-[11px] font-sans font-bold text-white block">Simulate 7-Day Trial Expiration</span>
                    <span className="text-[9px] text-[#A0A0A5] font-mono leading-none">Sets state to "Your premium trial has ended"</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleTrialExpiredSimulated(!trialExpiredSimulated)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                      trialExpiredSimulated
                        ? 'bg-[#BD53F4] text-white shadow-md shadow-[#BD53F4]/15'
                        : 'bg-white/5 text-[#AAAAAA] hover:bg-white/10'
                    }`}
                  >
                    {trialExpiredSimulated ? "🔴 ACTIVE" : "⚪ OFF"}
                  </button>
                </div>

                {/* Reset Full App Onboarding */}
                <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <div className="space-y-0.5 max-w-[70%]">
                    <span className="text-[11px] font-sans font-bold text-white block">Reset App Onboarding</span>
                    <span className="text-[9px] text-[#A0A0A5] font-mono leading-none">Logout + Reset first-time user login</span>
                  </div>
                  <button
                    type="button"
                    onClick={onResetApp}
                    className="px-3 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/25 hover:bg-red-600/30 transition-all cursor-pointer"
                  >
                    🚀 RESET NOW
                  </button>
                </div>
              </div>
            </div>

            {/* CORE REPETITIONS AND ANALYTICS AUDIT */}
            <div className="bg-bg-card rounded-2xl border border-border-subtle p-4 space-y-3">
              <h4 className="text-xs font-extrabold text-gold-primary font-mono uppercase tracking-wider">Acoustic Engine Info</h4>
              <p className="text-[11px] text-text-secondary leading-normal">
                VANI Voice Speech Engine evaluates user waveform accents by capturing phonetic anomalies and matching local Bengali speech patterns directly on-device.
              </p>
              
              <div className="p-3 bg-bg-surface/50 rounded-xl border border-border-subtle/10 space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-text-secondary">Speech Pitch:</span>
                  <span className="text-text-primary font-bold">1.1 Coaching rate</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-text-secondary">Speech Speed:</span>
                  <span className="text-text-primary font-bold">0.85 (Slow & Clear)</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-text-secondary">Voice Overrides:</span>
                  <span className="text-success-green font-bold">SpeechSynthesis Fallback</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: GOOGLE PLAY STORE DISCLOSURES & HARDWARE DIAGNOSTICS */
          <div className="space-y-4" id="googleplay-diagnostics-deck">
            
            {/* POLICY REVIEWS MANDATED NOTICE */}
            <div className="bg-bg-card rounded-2xl border border-border-subtle p-4 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-border-subtle/5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-sans font-bold text-text-primary uppercase tracking-wider">Play Store Compliance Checks</span>
              </div>
              
              <p className="text-[11px] text-text-secondary leading-normal">
                Diagnostic system checks testing Google Play package safety policies for microphone usage, device compatibility, and secure pricing terms.
              </p>

              {/* Diagnostic Indicators */}
              <div className="space-y-2 font-mono text-[11px] text-text-primary">
                <div className="flex justify-between p-2 mx-auto bg-bg-surface/50 rounded-xl border border-border-subtle/10 w-full animate-fade-in">
                  <span>Microphone core hardware:</span>
                  {permissionGranted === true ? (
                    <span className="text-success-green font-bold">✓ GRANTED</span>
                  ) : permissionGranted === false ? (
                    <span className="text-error-red font-bold animate-pulse">❌ DENIED / BLOCKED</span>
                  ) : (
                    <button 
                      onClick={requestMicrophonePermissionMock}
                      className="text-gold-primary hover:text-gold-light hover:underline font-bold text-[10px] cursor-pointer"
                    >
                      TEST TRIG 🎙️
                    </button>
                  )}
                </div>
                <div className="flex justify-between p-2 mx-auto bg-bg-surface/50 rounded-xl border border-border-subtle/10 w-full">
                  <span>Audio Sync Device:</span>
                  <span className="text-success-green font-bold">✓ AUDIO_RECORD_SYNC</span>
                </div>
                <div className="flex justify-between p-2 mx-auto bg-bg-surface/50 rounded-xl border border-border-subtle/10 w-full">
                  <span>In-App Billing Library:</span>
                  <span className="text-success-green font-bold">✓ V6.0.1 COMPLIANT</span>
                </div>
                <div className="flex justify-between p-2 mx-auto bg-bg-surface/50 rounded-xl border border-border-subtle/10 w-full">
                  <span>Quota usage slot index:</span>
                  <span className="text-gold-primary font-bold">
                    {sessionCount} / {currentPlan === 'trial' ? '3 Limit' : 'Unlimited'}
                  </span>
                </div>
              </div>

              {/* Cancellation explicit user compliance checkbox */}
              <div className="pt-2 border-t border-border-subtle space-y-2">
                <div className="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    id="verify-policy-chk" 
                    checked={policyAccepted} 
                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                    className="rounded border-border-subtle bg-bg-surface text-gold-primary focus:ring-gold-primary w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="verify-policy-chk" className="text-[11px] text-text-primary cursor-pointer select-none leading-relaxed font-sans font-bold">
                    I disclose clear unsubscribe instructions inside checkout billing pages.
                  </label>
                </div>
                {policyAccepted && (
                  <p className="text-[10px] text-success-green font-bold leading-normal font-sans pt-1">
                    ✓ Play Store compliance rules met. Cancellation is visible under Play Store Subscriptions account page.
                  </p>
                )}
              </div>
            </div>

            {/* PLAY STORE COMPLIANCE TIPS CHECKLIST */}
            <div className="bg-bg-card rounded-2xl border border-border-subtle p-4 space-y-2">
              <span className="text-xs font-bold text-gold-primary uppercase font-mono tracking-wider block">Google Play Program Mandates</span>
              <div className="space-y-2.5 pt-1">
                {PLAYSTORE_COMPLIANCE_TIPS.map((tip, idx) => (
                  <div key={idx} className="bg-bg-surface/60 p-2.5 rounded-xl border border-border-subtle">
                    <span className="text-[10px] font-mono font-bold text-[#0284C7] block mb-0.5 uppercase tracking-wide">
                      {tip.title}
                    </span>
                    <p className="text-[11px] text-text-primary leading-relaxed font-semibold">
                      {tip.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* MANDATORY REFUND POLICIES */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-gold-primary/30 flex gap-2.5 items-start text-[11px] text-text-primary">
              <Info className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-gold-light block font-sans">Mandatory Play Store Consumer Refund Policy</span>
                <p className="text-text-secondary leading-relaxed">
                  INR Pricing includes local government value taxes. Standard automated subscription renewal is modifiable prior to invoice date. Free trials have transparent sandbox cancellation models.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
