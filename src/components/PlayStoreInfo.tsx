import React, { useState } from 'react';
import { PLAYSTORE_COMPLIANCE_TIPS } from '../data';
import { ShieldCheck, Calendar, Receipt, Info, CheckCircle, Bell, RefreshCw, Smartphone } from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface PlayStoreInfoProps {
  currentPlan: SubscriptionPlan;
  onPlanChange: (plan: SubscriptionPlan) => void;
  onRegisterPurchase: (plan: SubscriptionPlan) => void;
  sessionCount: number;
}

export default function PlayStoreInfo({ currentPlan, onPlanChange, onRegisterPurchase, sessionCount }: PlayStoreInfoProps) {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(true);

  const requestMicrophonePermissionMock = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissionGranted(true);
      } else {
        setPermissionGranted(true); // Treat as granted for mockup
      }
    } catch (e) {
      setPermissionGranted(false);
    }
  };

  return (
    <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 backdrop-blur-sm space-y-6" id="playstore-compliance-hub">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Play Store Compliance Desk</h2>
            <p className="text-xs text-slate-400 font-sans">Verification benchmarks for "Easy English" app release</p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          READY FOR SYSTEM AUDIT
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Play store policies checklist */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#38bdf8]" /> Required Disclosures & Guidelines
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Google Play's Developer Program policies govern child safety, speech interactions, clear pricing models, and explicit cancel options.
          </p>
          <div className="space-y-2.5 mt-2">
            {PLAYSTORE_COMPLIANCE_TIPS.map((tip, idx) => (
              <div key={idx} className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
                <span className="text-[10px] font-mono font-bold text-[#38bdf8] block mb-0.5">{tip.title}</span>
                <p className="text-xs text-slate-300 leading-normal">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Diagnostics simulator for Android environment */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" /> Android Hardware & API Checks
            </h3>
            <p className="text-xs text-slate-400">
              Diagnostic checklist ensuring mobile sandbox readiness for your Play Store package build.
            </p>

            {/* Simulated indicators */}
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between p-2 bg-slate-900/40 rounded-lg">
                <span>Microphone Core Permission:</span>
                {permissionGranted === true ? (
                  <span className="text-emerald-400 font-bold">GRANTED</span>
                ) : permissionGranted === false ? (
                  <span className="text-rose-400 font-bold">BLOCKED / REFUSED</span>
                ) : (
                  <button 
                    onClick={requestMicrophonePermissionMock}
                    className="text-indigo-400 hover:underline hover:text-indigo-300 font-bold"
                  >
                    TEST TRIGGER
                  </button>
                )}
              </div>
              <div className="flex justify-between p-2 bg-slate-900/40 rounded-lg">
                <span>Android Audio Device Compatibility:</span>
                <span className="text-emerald-400">OK (AUDIO_RECORD_SYNC)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-900/40 rounded-lg">
                <span>Billing Library Core v6.0.1:</span>
                <span className="text-emerald-400">INTEGRATED</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-900/40 rounded-lg">
                <span>Session Quota Used:</span>
                <span className="text-[#38bdf8] font-bold">{sessionCount} / {currentPlan === 'trial' ? '3 Limit' : 'Unlimited'}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Package Policy Disclosures:</span>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="policy-chk" 
                checked={policyAccepted} 
                onChange={(e) => setPolicyAccepted(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
              />
              <label htmlFor="policy-chk" className="text-xs text-slate-300 cursor-pointer select-none">
                Disclose cancellation terms clearly upon checkout.
              </label>
            </div>
            {policyAccepted && (
              <p className="text-[10px] text-emerald-400 leading-normal font-sans">
                ✓ Play Store compliance logic ensures users can freely view unsubscribe instructions within "Configuration & Info".
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Terms Info Card - Play Store Mandated */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col md:flex-row gap-3 items-start">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-semibold text-amber-300">Play Store Consumer Billing Policy Notice</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            All prices listed include local playstore taxes. Subscription pricing model is local currency adjusted (INR). Cancel anytime under Google Play Subscriptions menu at least 24 hours prior to billing cycle renew date.
          </p>
        </div>
      </div>
    </div>
  );
}
