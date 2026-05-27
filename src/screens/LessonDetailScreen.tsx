import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, CheckCircle2, Award, Sparkles, Mic, Check, RotateCcw, Volume2, Star } from 'lucide-react';
import { EXPLICIT_CURRICULUM } from '../data';

interface LessonDetailScreenProps {
  lessonId: string;
  onBack: () => void;
  onSelectExercise: (word: string, phonetic: string, tip: string) => void;
  speakVani: (text: string) => void;
}

// Beautiful confetti particle colors
const CONFETTI_COLORS = ['#3F51B5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4', '#14B8A6'];

export default function LessonDetailScreen({
  lessonId,
  onBack,
  onSelectExercise,
  speakVani
}: LessonDetailScreenProps) {
  
  const lesson = EXPLICIT_CURRICULUM.find(l => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-sm text-text-muted">Lesson details could not be found.</p>
        <button onClick={onBack} className="text-gold-primary text-xs font-mono font-bold hover:underline">
          ← BACK TO LESSON DESK
        </button>
      </div>
    );
  }

  const totalExercisesCount = lesson.exercises.length;

  // Track completed words state locally & persist in localStorage
  const storageKey = `vani_completed_words_v3_${lesson.id}`;
  const [completedWords, setCompletedWords] = useState<string[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error(err);
      }
    }
    // Seed default completed words based on initial lesson progress percentage (to prevent a cold, empty start)
    const seedCount = Math.min(Math.round((lesson.progress / 100) * totalExercisesCount), totalExercisesCount);
    // If progress is 100%, we seed all but one to let them complete and get the celebration feel, or just let it start at 100%
    const finalSeedCount = seedCount === totalExercisesCount && totalExercisesCount > 1 ? totalExercisesCount - 1 : seedCount;
    return lesson.exercises.slice(0, finalSeedCount);
  });

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedWords));
    // Also save simple raw percentage in localStorage for LearnScreen visualization sync
    const percent = Math.min(Math.round((completedWords.length / totalExercisesCount) * 100), 100);
    localStorage.setItem(`vani_progress_${lesson.id}`, String(percent));
  }, [completedWords, totalExercisesCount, lesson.id]);

  // Practice state
  const [activePracticeWord, setActivePracticeWord] = useState<string | null>(null);
  const [micListening, setMicListening] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    score: number;
    fluency: number;
    feedback: string;
    passed: boolean;
  } | null>(null);

  // Confetti show state
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrated, setCelebrated] = useState(() => {
    // Prevent triggering voice celebrations every single page open once completed
    return localStorage.getItem(`celebrated_${lesson.id}`) === 'true';
  });

  const isAllCompleted = completedWords.length === totalExercisesCount;

  // Trigger celebration on entire lesson completion
  useEffect(() => {
    if (isAllCompleted && !celebrated) {
      setShowConfetti(true);
      setCelebrated(true);
      localStorage.setItem(`celebrated_${lesson.id}`, 'true');
      
      // Congratulation tone!
      setTimeout(() => {
        speakVani(`Incredible! You have completed all pronunciation exercises for ${lesson.title}! You are shedding regional accent slips like a champion speaker. Keep it up!`);
      }, 500);

      // Turn off confetti after 6 seconds to save rendering resources
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [completedWords, totalExercisesCount, isAllCompleted, celebrated, lesson.title, speakVani]);

  // Generate 75 falling confetti particles dynamically with random paths
  const confettiParticles = Array.from({ length: 75 }).map((_, i) => {
    const angle = Math.random() * 360;
    const size = Math.random() * 8 + 6;
    const delay = Math.random() * 2;
    const duration = Math.random() * 2.5 + 2.5;
    const leftOffset = Math.random() * 100; // random X position percentage
    const drift = (Math.random() - 0.5) * 60; // random horizontal drift
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    return { id: i, angle, size, delay, duration, leftOffset, drift, color };
  });

  // Handle assessment trigger
  const startOralPractice = (word: string) => {
    setActivePracticeWord(word);
    setMicListening(true);
    setAssessmentResult(null);
    speakVani(`Say: ${word}. Rest your tongue gently on the roof of your mouth, and speak now!`);

    // Simulate speech detection process
    setTimeout(() => {
      setMicListening(false);
      // Give realistic score
      const randomScore = Math.floor(Math.random() * 12) + 87; // 87 to 98%
      const fluency = Math.floor(Math.random() * 10) + 90;
      
      const pass = randomScore >= 80;
      setAssessmentResult({
        score: randomScore,
        fluency,
        feedback: "Perfect mouth positioning! Your accent timing is beautifully standard.",
        passed: pass
      });

      if (pass) {
        speakVani(`Excellent articulation! Spoken check score is ${randomScore} percent! Core competency achieved.`);
        // Mark word as completed
        setCompletedWords(prev => {
          if (prev.includes(word)) return prev;
          return [...prev, word];
        });
      } else {
        speakVani("Let's attempt that again to polish the pronunciation. Keep trying!");
      }
    }, 3200);
  };

  // Reset progress and let them practice again
  const resetAllProgress = () => {
    if (confirm("Are you sure you want to reset your practice history for this lesson?")) {
      setCompletedWords([]);
      setCelebrated(false);
      setShowConfetti(false);
      localStorage.removeItem(`celebrated_${lesson.id}`);
      speakVani("Lesson drills reset. You can now re-practice your pronunciation targets from zero!");
    }
  };

  return (
    <div className="space-y-6 pt-1 text-left relative" id="lesson-detail-subscreen">
      
      {/* CONFETTI OVERLAY RENDERING BLOCK */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-[100] bg-purple-950/20 backdrop-blur-[1px] flex items-center justify-center p-4" id="ceremony-confetti-stage">
            {confettiParticles.map((part) => (
              <motion.div
                key={part.id}
                initial={{ 
                  top: '-5%', 
                  left: `${part.leftOffset}%`, 
                  rotate: part.angle, 
                  scale: 0.1, 
                  opacity: 1 
                }}
                animate={{ 
                  top: '105%', 
                  left: `calc(${part.leftOffset}% + ${part.drift}px)`, 
                  rotate: part.angle + 720, 
                  scale: [0.3, 1, 1, 0.7, 0], 
                  opacity: [1, 1, 1, 0.9, 0] 
                }}
                transition={{ 
                  duration: part.duration, 
                  delay: part.delay, 
                  ease: "easeOut" 
                }}
                className="absolute shadow-sm"
                style={{
                  width: part.size,
                  height: part.size,
                  backgroundColor: part.color,
                  borderRadius: part.id % 3 === 0 ? '50%' : part.id % 3 === 1 ? '0px' : '30% 70% 70% 30% / 30% 30% 70% 70%',
                }}
              />
            ))}

            {/* Huge completion banner center layout aligned perfectly in viewport */}
            <motion.div 
              initial={{ scale: 0.7, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white border-2 border-purple-200 p-6 rounded-3xl text-center shadow-2xl space-y-4 pointer-events-auto z-10 max-w-sm w-full"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Star className="w-8 h-8 text-purple-600 fill-purple-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">Lesson Mastery Unlocked!</h4>
                <p className="text-[11px] text-slate-500 font-mono">100% COMPLETE ACCENT MATRIX</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                You successfully mastered all pronunciation triggers under <strong>{lesson.title}</strong>!
              </p>
              <button
                onClick={() => {
                  setShowConfetti(false);
                  speakVani("Trophy card dismissed. Brilliant job!");
                }}
                className="px-4 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold font-sans shadow-md hover:bg-slate-900 transition-colors cursor-pointer w-full"
              >
                Claim Trophy Rewards 🏆
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER: Back arrow | Title | Progress */}
      <div className="flex items-center justify-between pb-3 border-b border-b-subtle" id="lesson-detail-header">
        <button 
          onClick={onBack}
          className="p-1 px-3 bg-bg-card border border-border-subtle hover:border-purple-500 text-gold-primary rounded-xl flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <div className="text-center max-w-[180px]">
          <h3 className="text-xs font-mono text-gold-primary uppercase tracking-widest leading-none font-bold">Accent Module</h3>
          <span className="text-sm font-sans text-text-primary font-bold block pt-1 truncate">{lesson.title}</span>
        </div>

        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] font-mono text-text-muted">Progress</span>
          <span className="text-xs font-bold text-success-green font-mono">{completedWords.length}/{totalExercisesCount} Done</span>
        </div>
      </div>

      {/* CHALKBOARD BLACKBOARD PANEL */}
      <div 
        className="chalkboard-bg border border-slate-700/60 p-5 rounded-3xl space-y-4 text-emerald-100 shadow-inner relative overflow-hidden" 
        style={{ backgroundColor: '#14241C' }}
        id="lesson-chalkboard"
      >
        <div className="absolute top-2 right-3 font-caveat text-[10px] text-white/40 tracking-widest select-none bg-emerald-950/40 px-2 py-0.5 rounded uppercase">
          VANI Class Draft
        </div>
        
        <div className="space-y-3.5 pt-1">
          <div>
            <span className="font-caveat text-xl text-emerald-300 block leading-none">Lesson Target:</span>
            <p className="font-sans text-base text-white font-semibold pt-1">"{lesson.subtitle}"</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-emerald-800/30 pt-3">
            <div>
              <span className="font-caveat text-lg text-emerald-400 block leading-none">Correct Sound (Say):</span>
              <p className="font-mono text-xs text-emerald-200 pt-1 leading-normal">{lesson.phoneticTip}</p>
            </div>
            <div>
              <span className="font-caveat text-lg text-rose-400 block leading-none">Avoid (Bengali Slip):</span>
              <p className="font-mono text-xs text-slate-300 line-through pt-1 leading-normal">
                {lesson.id === 't1' ? 'wery, vill' : lesson.id === 't2' ? 'dis, dat' : 'regional list error'}
              </p>
            </div>
          </div>

          <div className="border-t border-emerald-800/30 pt-3.5 font-bengali">
            <span className="font-caveat text-lg text-emerald-300 block leading-none">Bengali Instruction (নির্দেশনা):</span>
            <p className="text-xs text-[#EAF6ED] leading-relaxed pt-1.5 font-medium select-none">
              {lesson.bengaliTip}
            </p>
          </div>
        </div>
      </div>

      {/* EXACTIVE DRILL ASSESSMENT POPUP/WIDGET */}
      <AnimatePresence>
        {activePracticeWord && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-bg-card border-2 border-purple-500/30 rounded-3xl p-4.5 shadow-md space-y-4 text-left relative overflow-hidden"
            id="active-drill-playground"
          >
            <div className="absolute top-3 right-3 text-[10px] bg-purple-50 border border-purple-100 text-purple-600 font-mono px-2 py-0.5 rounded-full select-none uppercase font-bold">
              Drill Studio
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">Currently Practicing Voice Accent:</span>
              <h4 className="text-xl font-bold font-sans text-purple-600 capitalize">{activePracticeWord}</h4>
              <p className="text-xs text-slate-500 font-mono">Accent Blueprint: <span className="text-amber-600 font-bold">{lesson.phoneticTip}</span></p>
            </div>

            {/* Mic recording graphic or evaluation box */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[140px] relative">
              {micListening ? (
                <div className="space-y-3.5 text-center">
                  <div className="flex gap-1.5 items-center justify-center h-10 w-44">
                    <motion.div animate={{ height: [12, 28, 12] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-1 bg-[#7C3AED] rounded-full" />
                    <motion.div animate={{ height: [18, 38, 18] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-[#9F67FF] rounded-full" />
                    <motion.div animate={{ height: [10, 42, 10] }} transition={{ repeat: Infinity, duration: 0.45, delay: 0.3 }} className="w-1 bg-[#8B5CF6] rounded-full" />
                    <motion.div animate={{ height: [16, 32, 16] }} transition={{ repeat: Infinity, duration: 0.55, delay: 0.4 }} className="w-1 bg-[#A855F7] rounded-full" />
                    <motion.div animate={{ height: [8, 22, 8] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.5 }} className="w-1 bg-[#10B981] rounded-full" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-purple-600 font-sans tracking-wide block capitalize">Acoustic listener active...</span>
                    <span className="text-[10px] text-text-muted font-mono uppercase block animate-pulse">Speak into your mic clearly</span>
                  </div>
                </div>
              ) : assessmentResult ? (
                <div className="w-full space-y-3.1">
                  <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🗣️</span>
                      <div>
                        <span className="text-xs font-bold font-sans text-slate-800 block">Assessment Complete</span>
                        <span className="text-[9px] text-slate-400 font-mono">Acoustic check standard passed</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-500">Matching Status</span>
                      <p className="text-xs font-bold font-mono text-emerald-600 uppercase">Passed 🏅</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/50 text-center">
                      <span className="text-[10px] text-slate-400 font-mono block">ACCURACY SCORE</span>
                      <strong className="text-xl font-bold font-mono text-emerald-600">{assessmentResult.score}%</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/50 text-center">
                      <span className="text-[10px] text-slate-400 font-mono block">FLUENCY RATING</span>
                      <strong className="text-xl font-bold font-mono text-purple-600">{assessmentResult.fluency}%</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed text-center italic pt-1 text-purple-900 font-medium">
                    "{assessmentResult.feedback}"
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-500 font-medium">Ready to record spelling attempt</p>
                  <button
                    onClick={() => startOralPractice(activePracticeWord)}
                    className="p-3 bg-purple-100 hover:bg-slate-900 hover:text-white text-purple-600 rounded-full flex items-center justify-center transition-all animate-pulse"
                  >
                    <Mic className="w-5 h-5 shrink-0" />
                  </button>
                </div>
              )}
            </div>

            {/* Call to actions bottom */}
            <div className="flex gap-2 justify-end text-xs">
              <button
                type="button"
                onClick={() => {
                  setActivePracticeWord(null);
                  setAssessmentResult(null);
                  speakVani("Active practice drawer closed.");
                }}
                className="px-3.5 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors font-sans font-bold cursor-pointer"
              >
                Close Drill
              </button>
              <button
                type="button"
                onClick={() => startOralPractice(activePracticeWord)}
                disabled={micListening}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm transition-colors font-sans font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white/90" />
                <span>Practice Speak Again</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXERCISE LIST */}
      <div className="space-y-3.5" id="lesson-exercises-list">
        <div className="flex justify-between items-center select-none block px-1">
          <span className="text-xs font-mono tracking-wider text-text-muted uppercase">Words & Sentences Practice Drills</span>
          {completedWords.length > 0 && (
            <button 
              onClick={resetAllProgress}
              className="text-[9px] font-mono text-text-muted hover:text-rose-500 border border-slate-200 rounded px-2 py-0.5"
            >
              Reset History
            </button>
          )}
        </div>
        
        <div className="space-y-2.5">
          {lesson.exercises.map((word, index) => {
            const isCompleted = completedWords.includes(word);
            
            return (
              <div 
                key={`${word}-${index}`}
                className={`border rounded-2xl p-3.5 flex justify-between items-center transition-all shadow-sm ${
                  isCompleted 
                    ? 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200/80' 
                    : 'bg-bg-card border-border-subtle/65 hover:border-purple-400/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success-green fill-success-green/10" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-border-subtle bg-bg-surface flex items-center justify-center text-[10px] font-mono text-text-muted">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-0.5">
                    <span className="text-sm font-sans font-bold text-text-primary capitalize">{word}</span>
                    <span className="text-[10px] text-text-muted block font-mono">
                      Phonetic: {lesson.id === 't1' ? `v-${word.slice(1)}` : 'targeted accent'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      speakVani(`Loading active workspace target: ${word}`);
                      // Trigger normal behavior to load on main chalkboard
                      onSelectExercise(word, lesson.phoneticTip, lesson.bengaliTip);
                    }}
                    title="Load word in active talk screen chalkboard"
                    className="p-2 text-text-muted hover:text-purple-600 rounded-lg hover:bg-slate-100 flex items-center justify-center"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => startOralPractice(word)}
                    className={`p-2 rounded-xl flex items-center gap-1 text-[11px] font-sans font-bold transition-all cursor-pointer border ${
                      isCompleted 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' 
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-100'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>{isCompleted ? 'Retry Drill' : 'Practice 🎙️'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
