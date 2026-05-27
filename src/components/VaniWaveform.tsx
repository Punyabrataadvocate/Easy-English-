import React from 'react';
import { motion } from 'motion/react';

interface VaniWaveformProps {
  status: 'idle' | 'listening' | 'speaking' | 'processing';
  voiceOn: boolean;
}

export default function VaniWaveform({ status, voiceOn }: VaniWaveformProps) {
  // Generate random heights for the SVG equalizer bars
  const barsCount = 18;
  const bars = Array.from({ length: barsCount });

  let animationType = {};
  let colorClass = "from-emerald-400 to-teal-500";
  let pulseScale = [1, 1.05, 1];

  switch (status) {
    case 'listening':
      colorClass = "from-rose-500 to-orange-400";
      animationType = {
        y: [0, -14, 0],
        transition: {
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
        }
      };
      pulseScale = [1, 1.15, 1];
      break;
    case 'speaking':
      colorClass = "from-indigo-500 via-purple-500 to-emerald-400 animate-gradient-xy";
      animationType = {
        y: [0, -22, 0],
        transition: {
          repeat: Infinity,
          duration: 0.6,
          ease: "easeInOut",
        }
      };
      pulseScale = [1, 1.1, 1];
      break;
    case 'processing':
      colorClass = "from-amber-400 to-orange-500";
      animationType = {
        y: [0, -8, 0],
        transition: {
          repeat: Infinity,
          duration: 1.2,
          ease: "linear"
        }
      };
      pulseScale = [1, 1.02, 1];
      break;
    default:
      colorClass = "from-teal-400 to-emerald-500";
      animationType = {
        y: [0, -2, 0],
        transition: {
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut"
        }
      };
      pulseScale = [1, 1.01, 1];
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-3xl border border-slate-800/80 backdrop-blur-md shadow-2xl relative overflow-hidden" id="vani-waveform-container">
      {/* Dynamic Aura Background */}
      <motion.div 
        animate={{
          scale: pulseScale,
          opacity: status === 'speaking' ? 0.25 : status === 'listening' ? 0.35 : 0.15,
        }}
        transition={{
          repeat: Infinity,
          duration: status === 'listening' ? 1 : 2,
        }}
        className={`absolute inset-0 w-full h-full rounded-full blur-3xl opacity-15 filter transition-colors duration-500 bg-gradient-to-r ${colorClass}`}
      />

      {/* Pulsating Center Orb representing VANI's mind */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        <motion.div
          animate={status === 'speaking' ? {
            scale: [1, 1.2, 0.95, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
          } : status === 'listening' ? {
            scale: [1, 1.15, 1],
            boxShadow: ["0 0 10px rgba(244,63,94,0.3)", "0 0 35px rgba(244,63,94,0.6)", "0 0 10px rgba(244,63,94,0.3)"]
          } : {
            scale: [1, 1.04, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: status === 'speaking' ? 4 : 1.5,
            ease: "easeInOut"
          }}
          className={`w-32 h-32 rounded-full bg-gradient-to-tr ${colorClass} flex items-center justify-center shadow-lg cursor-pointer z-10`}
        >
          <div className="w-[118px] h-[118px] rounded-full bg-slate-950 flex flex-col items-center justify-center text-center p-3 relative">
            <span className="text-[10px] tracking-widest text-[#cfd3db] font-mono select-none">AI COACH</span>
            <span className="text-2xl font-bold font-display tracking-tight text-white select-none">VANI</span>
            {status === 'speaking' ? (
              <span className="text-[9px] font-mono text-emerald-400 mt-1 select-none">SPEAKING</span>
            ) : status === 'listening' ? (
              <span className="text-[9px] font-mono text-rose-400 mt-1 select-none animate-pulse">LISTENING</span>
            ) : status === 'processing' ? (
              <span className="text-[9px] font-mono text-amber-400 mt-1 select-none">ANALYSING...</span>
            ) : (
              <span className="text-[9px] font-mono text-slate-500 mt-1 select-none">IDLE VOICE</span>
            )}

            {/* Speaking voice state indicator */}
            {voiceOn && (
              <div className="absolute bottom-2.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[8px] font-semibold text-emerald-500 tracking-wider">TTS ON</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Pulse Equalizier Bars */}
      <div className="flex items-end justify-center gap-1.5 h-16 w-64 px-4 relative z-10" id="waveform-equalizer-bars">
        {bars.map((_, i) => {
          // Stagger delays for a fluid wave effect
          const randomDelay = (i % 6) * 0.12;
          const heightMultiplier = Math.sin((i / (barsCount - 1)) * Math.PI) * 45;
          const minHeight = status === 'idle' ? 4 : 8;

          return (
            <motion.div
              key={i}
              animate={animationType}
              transition={{
                delay: randomDelay,
                repeat: Infinity,
                duration: status === 'speaking' ? 0.5 : 0.9,
              }}
              style={{
                height: `${minHeight}px`,
                transformOrigin: "bottom",
              }}
              className={`w-1.5 rounded-full bg-gradient-to-t ${colorClass}`}
              custom={i}
            />
          );
        })}
      </div>

      <p className="text-xs font-mono text-slate-400 mt-4 tracking-normal text-center select-none" id="status-tag">
        {status === 'idle' && "🪷 Ready. Tap 'Push to Speak' or select an oral drill."}
        {status === 'listening' && "🔴 Capture Active. Release or tap Stop when done talking!"}
        {status === 'processing' && "🔍 VANI is evaluating your pronunciation & grammar..."}
        {status === 'speaking' && "📢 VANI voice synthesizer feedback broadcast initiated."}
      </p>
    </div>
  );
}
