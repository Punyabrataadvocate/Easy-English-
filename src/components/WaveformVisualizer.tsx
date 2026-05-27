import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface WaveformVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  amplitude?: number; // 0 to 1
}

export default function WaveformVisualizer({ isListening, isSpeaking, amplitude = 0.4 }: WaveformVisualizerProps) {
  const barsCount = 24;
  const [sineOffset, setSineOffset] = useState(0);

  // Animate speaking state wave offset using periodic timing
  useEffect(() => {
    if (!isSpeaking) return;
    const interval = setInterval(() => {
      setSineOffset(prev => (prev + 0.5) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-border-subtle/45 relative" id="voice-spectrum-monitor">
      <span className="text-[9px] font-mono tracking-widest text-[#cfd3db] uppercase block mb-3">
        {isListening ? "🔴 mic frequency amplitude capture" : isSpeaking ? "📢 wave synthesizer sound spectrum" : "🎧 acoustic audio idle"}
      </span>
      
      {/* 24 vertical bars */}
      <div className="flex items-end justify-center gap-[4px] h-[52px] w-full max-w-[280px]">
        {Array.from({ length: barsCount }).map((_, idx) => {
          // Base height calculations depending on active state
          let targetHeight = 6; // Idle height limit

          if (isListening) {
            // Animate randomly coupled with amplitude input
            const multiplier = 0.5 + Math.random() * 0.5;
            targetHeight = Math.max(4, Math.round(amplitude * multiplier * 48));
          } else if (isSpeaking) {
            // Create a gorgeous sine wave sweeping from left to right
            const normalizedPosition = (idx / barsCount) * Math.PI * 3;
            const waveValue = Math.sin(normalizedPosition - sineOffset);
            // Translate range from -1..1 to 10..48
            targetHeight = Math.max(6, Math.round(((waveValue + 1) / 2) * 44) + 4);
          } else {
            // Idle breathing effect - subtle wave loop
            const waveValue = Math.sin((idx / barsCount) * Math.PI * 2);
            targetHeight = Math.max(6, Math.round(6 + waveValue * 3));
          }

          return (
            <motion.div
              key={idx}
              animate={{
                height: `${targetHeight}px`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              style={{
                width: '3px',
                borderRadius: '4px'
              }}
              className="bg-gold-primary shadow-[0_0_8px_rgba(201,168,76,0.25)] transition-colors duration-500"
            />
          );
        })}
      </div>
    </div>
  );
}
