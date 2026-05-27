import React from 'react';
import { motion } from 'motion/react';

interface VANIAvatarProps {
  status: 'idle' | 'listening' | 'speaking' | 'processing';
  size?: number;
  emoji?: string;
}

export default function VANIAvatar({ status, size = 160, emoji }: VANIAvatarProps) {
  // Animation states
  const isListening = status === 'listening';
  const isSpeaking = status === 'speaking';
  const isProcessing = status === 'processing';

  // Mandala rotation speed and scale based on active states
  const rotateAnimation = isSpeaking
    ? { rotate: 360, transition: { repeat: Infinity, duration: 12, ease: "linear" } }
    : isListening
    ? { rotate: [0, 15, -15, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } }
    : isProcessing
    ? { rotate: 360, transition: { repeat: Infinity, duration: 3, ease: "linear" } }
    : { rotate: 0 };

  const scaleAnimation = isListening
    ? { scale: [1, 1.08, 0.98, 1.05, 1], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } }
    : isSpeaking
    ? { scale: [1, 1.12, 1], transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" } }
    : { scale: 1 };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer ambient gold portal glow ring */}
      {(isSpeaking || isListening) && (
        <motion.div
          animate={{
            scale: isSpeaking ? [1, 1.3, 1] : [1, 1.15, 1],
            opacity: isSpeaking ? [0.2, 0.6, 0.2] : [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: isSpeaking ? 1.2 : 2,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-primary via-gold-light to-gold-primary filter blur-xl opacity-40"
        />
      )}

      {/* Pulsing ring indicator */}
      <motion.div
        animate={scaleAnimation}
        className={`absolute inset-2 rounded-full border-2 border-dashed transition-colors duration-500 flex items-center justify-center ${
          isListening 
            ? 'border-error-red/60 bg-error-red/5' 
            : isSpeaking 
            ? 'border-gold-light/80 bg-gold-primary/10'
            : isProcessing
            ? 'border-accent-purple/60 bg-accent-purple/5'
            : 'border-gold-primary/30 bg-gold-glow'
        }`}
      >
        {/* Inner Solid Mandala Ring container */}
        <motion.div
          animate={rotateAnimation}
          className="w-full h-full p-2 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 100 100"
            className={`w-full h-full transition-colors duration-500 ${
              isListening ? 'text-error-red' : isSpeaking ? 'text-gold-light' : 'text-gold-primary'
            }`}
          >
            {/* Sacred geometric path representation */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" />
            
            {/* Geometric Mandala Petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <g key={i} transform={`rotate(${angle} 50 50)`}>
                {/* Petal Loop */}
                <path
                  d="M50,15 C55,30 55,45 50,50 C45,45 45,30 50,15 Z"
                  fill="currentColor"
                  fillOpacity={isSpeaking ? "0.3" : isListening ? "0.2" : "0.15"}
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                
                {/* Decorative Points */}
                <circle cx="50" cy="15" r="1.5" fill="currentColor" />
                <line x1="50" y1="50" x2="50" y2="28" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
              </g>
            ))}

            {/* Accent elements - overlapping squares/triangles representing Sanskrit sound ripples */}
            <polygon points="50,22 78,50 50,78 22,50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            <polygon points="50,28 72,50 50,72 28,50" fill="none" stroke="currentColor" strokeWidth="0.75" />

            {/* Center Core dot */}
            <circle cx="50" cy="50" r="8" fill="currentColor" className="animate-pulse" />
            <circle cx="50" cy="50" r="4" fill="#0A0F1E" />
          </svg>
        </motion.div>
      </motion.div>

      {/* If coach emoji exists, render it right in the center! */}
      {emoji && (
        <div className="absolute w-[44px] h-[44px] rounded-full bg-white border border-border-subtle shadow-md flex items-center justify-center text-xl select-none z-20">
          {emoji}
        </div>
      )}

      {/* Tiny active floating status light */}
      <span className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-bg-primary flex items-center justify-center ${
        isListening ? 'bg-error-red animate-ping' : isSpeaking ? 'bg-gold-light' : 'bg-success-green'
      }`} />
    </div>
  );
}
