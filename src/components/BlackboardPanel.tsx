import React from 'react';
import { motion } from 'motion/react';
import { Pin, HelpCircle, CheckCircle2 } from 'lucide-react';

interface BlackboardPanelProps {
  targetWordDetail: {
    word: string;
    phonetic: string;
    focusArea?: string;
    bengaliTip: string;
    incorrectAttempt?: string;
  };
  repetitionsCount: number; // 0 to 5
}

export default function BlackboardPanel({ targetWordDetail, repetitionsCount }: BlackboardPanelProps) {
  // Safe default values
  const { 
    word = 'Wednesday', 
    phonetic = 'WENZ-day', 
    bengaliTip = "মাঝের 'D' অক্ষর টি উচ্চারণ করবেন না। বলুন 'WENZ-day'।", 
    incorrectAttempt = 'WEH-nes-day' 
  } = targetWordDetail;

  // Render checkbox check marks (e.g. ✅ ✅ ✅ 🔲 🔲)
  const repBlocks = Array.from({ length: 5 }, (_, idx) => idx < repetitionsCount);

  return (
    <motion.div 
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="chalkboard-bg border-[10px] border-amber-900 rounded-3xl p-5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8),0_10px_32px_rgba(0,0,0,0.5)] relative overflow-hidden"
      id="vani-chalkboard-component"
    >
      {/* Wooden corner screws/joints simulation */}
      <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-yellow-600/60 border border-yellow-800" />
      <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-yellow-600/60 border border-yellow-800" />
      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 rounded-full bg-yellow-600/60 border border-yellow-800" />
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-yellow-600/60 border border-yellow-800" />

      {/* Title Tag */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-2 mb-3">
        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
          ✏️ VANI's spoken grammatical blackboard
        </span>
        <span className="text-[9px] font-mono text-white/50 bg-black/40 px-2 py-0.5 rounded-md">
          CHALKBOARD FORMAT
        </span>
      </div>

      {/* Handwritten blackboard notes */}
      <div className="space-y-4 font-caveat text-white/90">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-sans tracking-tight text-white/40 block">Today's Target Word</span>
            <span className="text-3xl text-gold-light hover:scale-105 transition-transform inline-block font-bold">
              {word}
            </span>
          </div>
          <div>
            <span className="text-sm font-sans tracking-tight text-white/40 block">Phonetic Guide</span>
            <span className="text-2xl text-emerald-300 font-mono italic tracking-wide">
              {phonetic}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/5">
          <div>
            <span className="text-sm font-sans tracking-tight text-white/40 block">Avoid saying (Wrong Pronunciation):</span>
            <span className="text-xl text-rose-400 line-through tracking-wide">
              {incorrectAttempt}
            </span>
          </div>
          <div>
            <span className="text-sm font-sans tracking-tight text-white/40 block">Bengali tip / বাংলা সাহায্য:</span>
            <p className="text-lg text-slate-100 font-bengali leading-relaxed">
              {bengaliTip}
            </p>
          </div>
        </div>

        {/* Repetitions progress bar ticks */}
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-[10px] font-mono uppercase text-[#9ca3af] block">Repetitions completed:</span>
            <div className="flex gap-1.5 mt-0.5">
              {repBlocks.map((done, idx) => (
                <div 
                  key={idx} 
                  className={`w-5 h-5 rounded-md flex items-center justify-center border text-[11px] font-sans font-bold transition-all ${
                    done 
                      ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-400 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'border-white/10 bg-white/5 text-transparent'
                  }`}
                >
                  ✓
                </div>
              ))}
            </div>
          </div>
          <span className="text-[14px] leading-tight text-emerald-300 italic font-mono">
            {repetitionsCount >= 5 ? "🎖️ SOUND MASTERED" : `🎯 ${repetitionsCount}/5 practiced`}
          </span>
        </div>
      </div>

      {/* Blackboard Chalk dust trace animation */}
      <span className="absolute bottom-2 right-4 text-[10px] font-mono text-white/10 select-none">
        Easy English Spoken Blackboard v2
      </span>
    </motion.div>
  );
}
