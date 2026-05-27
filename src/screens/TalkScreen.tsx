import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Unlock, Mic, MicOff, RefreshCw, Volume2, 
  VolumeX, Play, Check, X, AlertCircle, Smile, Sparkles, BookOpen, Square, Loader2
} from 'lucide-react';
import { SubscriptionPlan, ChatMessage } from '../types';
import WaveformVisualizer from '../components/WaveformVisualizer';

interface TalkScreenProps {
  currentPlan: SubscriptionPlan;
  setPlan: (plan: SubscriptionPlan) => void;
  sessionCount: number;
  incrementSessionCount: () => void;
  status: 'idle' | 'listening' | 'speaking' | 'processing';
  setStatus: (status: 'idle' | 'listening' | 'speaking' | 'processing') => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  speakVani: (text: string) => void;
  submitSpokenSentence: (text: string) => void;
  chatHistory: ChatMessage[];
  stats: {
    avgAccuracy: number;
    avgFluency: number;
    wordsSpoken: number;
  };
  teachingBoard: {
    word: string;
    phonetic: string;
    focusArea: string;
    bengaliTip: string;
    incorrectAttempt?: string;
  };
  setTeachingBoard: (board: any) => void;
  resetSession: () => void;
  onNavigateToTab: (tab: 'home' | 'topics' | 'latest' | 'talk' | 'progress') => void;
  triggerMicToggle: () => void;
  speechError: string | null;
  interestTopic: string;
  setInterestTopic: (topic: string) => void;
}

const TALK_CATEGORIES = [
  { id: "free", name: "Free Conversation", icon: "💬", phrase: "Let's share regular everyday chit-chat.", phonetic: "let's share RE-gu-lar", tip: "সাধারণ দৈনন্দিন কথার মতো স্বাভাবিক গতিতে বাক্যটি বলুন।" },
  { id: "interview", name: "Job Interview", icon: "👔", phrase: "Could you kindly explain your key strengths?", phonetic: "ex-PLAIN your key STRENGTHS", tip: "Recruiter-এর সামনে nervous না হয়ে 'strength' শব্দটি স্পষ্ট s-দিয়ে বলুন।" },
  { id: "office", name: "Office English", icon: "🏢", phrase: "Let's align on the project deliverables.", phonetic: "de-LIV-er-a-bles", tip: "deliverables'-এ 'v'-কে সুন্দর ও মৃদু করে ও ঠোঁট আলতো ছুয়ে বলুন।" },
  { id: "market", name: "Shopping & Market", icon: "🛒", phrase: "Is there any special discount on fresh tomatoes?", phonetic: "DIS-count on to-MA-toes", tip: "tomatoes বলতে 't'-এ আলতো বাতাস দিন, 'টমেটো' বলবেন না।" },
  { id: "travel", name: "Travel English", icon: "✈️", phrase: "Where should I retrieve my luggage bags?", phonetic: "re-TRIEVE my LUG-gage", tip: "retrieve শব্দে শেষে 'v' ও focus pronunciation ঠিক রাখুন।" },
  { id: "family", name: "Family & Friends", icon: "👨‍👩‍👧", phrase: "Shall we plan standard gatherings this weekend?", phonetic: "ga-ther-ings this WEEK-end", tip: "gatherings-এ 'th' উচ্চারণ করতে গিয়ে জিভ একটু দন্ত-মাঝে দিন।" },
  { id: "doctor", name: "At the Doctor", icon: "👨‍⚕️", phrase: "I have a severe throat flu since early Wednesday.", phonetic: "se-vere THROAT flu", tip: "severe ‘v’ সঠিক ঠোঁটের স্পর্শে ও 'Wednesday' তে 'D'-টি উহ্য রাখুন।" },
  { id: "phone", name: "Phone Calls", icon: "📞", phrase: "Please hold on while I transfer your call details.", phonetic: "TRANS-fer your call DE-tails", tip: "transfer উচ্চারণ করতে গিয়ে f ও r উচ্চারণ পরিচ্ছন্ন রাখুন।" }
];

export default function TalkScreen({
  currentPlan,
  setPlan,
  sessionCount,
  incrementSessionCount,
  status,
  setStatus,
  voiceEnabled,
  setVoiceEnabled,
  speakVani,
  submitSpokenSentence,
  chatHistory,
  stats,
  teachingBoard,
  setTeachingBoard,
  resetSession,
  onNavigateToTab,
  triggerMicToggle,
  speechError,
  interestTopic,
  setInterestTopic
}: TalkScreenProps) {
  
  const [activeCategory, setActiveCategory] = useState("free");
  const [timeLeft, setTimeLeft] = useState(60);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Determine state locks. Locked if subscription plan is 'locked'
  const isLocked = currentPlan === 'locked';

  // Format seconds ticking
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let intervalId: any;
    if (status === 'listening') {
      setTimeLeft(60);
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            // Time is up! Auto-stop mic
            triggerMicToggle();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(60);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status]);

  const handleSelectCategory = (cat: typeof TALK_CATEGORIES[0]) => {
    if (isLocked) {
      speakVani("Please unlock VANI voice services first.");
      return;
    }
    setActiveCategory(cat.id);
    setInterestTopic(cat.name);
    setTeachingBoard({
      word: cat.phrase,
      phonetic: cat.phonetic,
      focusArea: "Phrasal alignment",
      bengaliTip: cat.tip
    });
    speakVani(`Shifting VANI focus to: ${cat.name}. Try saying "${cat.phrase}"!`);
  };

  const simulateUnlockAction = () => {
    setPlan('premium');
    incrementSessionCount();
    speakVani("VANI has been fully unlocked! Ready for spoken coaching sessions.");
  };

  // Extract last spoken sentence feedback to show as a gorgeous active block
  const lastUserMsg = [...chatHistory].reverse().find(m => m.role === 'user' && m.stats);
  const evaluation = lastUserMsg?.stats;

  return (
    <div className="space-y-6 text-left pb-[20px]" id="talk-screen-viewport">
      
      {/* STATE A: FREE TRIAL LOCKED */}
      <AnimatePresence>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-end"
          >
            {/* Blurred VANI visual representation */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
              <div className="w-24 h-24 rounded-full bg-[#1A1A1A] border-4 border-[#BD53F4]/20 relative flex items-center justify-center animate-pulse-gentle">
                <span className="text-4xl select-none filter blur-[1px]">👑</span>
                <div className="absolute inset-0 rounded-full border border-dashed border-[#BD53F4]/40 animate-spin-slow" />
              </div>
              <h3 className="text-sm font-mono text-[#555555] tracking-widest uppercase">
                Voice Assistant Suspended
              </h3>
            </div>

            {/* Solid Bottom Sheet dialog */}
            <div className="bg-[#1A1A1A] border-t-2 border-[#BD53F4]/40 rounded-t-3xl p-6.5 space-y-5 text-center shadow-2xl">
              <div className="space-y-1">
                <h4 className="text-base font-black text-white uppercase tracking-tight font-display">
                  To start talking with VANI
                </h4>
                <p className="text-xs text-[#AAAAAA] leading-relaxed">
                  Your daily free trial limits are completed. Upgrade to standard premium level for full voice coaching, offline access, and all 50 topics.
                </p>
              </div>

              <div className="space-y-3">
                {/* Activate Free Trial Mode */}
                <button
                  type="button"
                  onClick={() => {
                    setPlan('trial');
                    incrementSessionCount();
                    speakVani("VANI free trial has been activated. Tap the microphone or use the simulation field to practice speaking English!");
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  🔓 Reset limits & Activate Trial Mode
                </button>

                {/* Recharge upgrade button */}
                <button
                  type="button"
                  onClick={() => {
                    speakVani("Redirecting you to the subscription shop options.");
                    onNavigateToTab('topics'); // Tapping locked voice navigates to shop subscreen modal or topics
                  }}
                  className="w-full py-3 bg-[#BD53F4] hover:bg-[#F0ABFC] hover:text-black active:scale-95 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Recharge your Membership 💳
                </button>

                {/* Simulate Unlock (Demo) */}
                <button
                  type="button"
                  onClick={simulateUnlockAction}
                  className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-[#F0ABFC] text-[10px] font-mono font-black uppercase tracking-wider rounded-xl transition-all border border-[#BD53F4]/20 cursor-pointer"
                  title="Bypass locking constraints and enjoy unlimited VANI speech"
                >
                  Simulate Full Premium Unlock ✨
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATE B: UNLOCKED VOICE SESSIONS */}
      {!isLocked && (
        <div className="space-y-5" id="unlocked-audio-session">
          
          {/* SESSIONS HEADER */}
          <div className="flex justify-between items-center bg-transparent">
            <div>
              <h2 className="text-xl font-black text-white font-display">
                Talk to VANI
              </h2>
              <p className="text-[10px] text-[#F0ABFC] font-mono tracking-widest uppercase font-bold">
                Senior Speech Coach
              </p>
            </div>
            {/* Quick rate switcher */}
            <button
              onClick={() => {
                onNavigateToTab('topics');
                speakVani("Viewing complete 50 topics listing.");
              }}
              className="px-3 py-1.5 bg-[#1A1A1A] border border-[#BD53F4]/10 hover:border-[#BD53F4] text-white text-[9px] font-mono font-bold rounded-lg uppercase tracking-wide transition-all cursor-pointer"
            >
              All Topics
            </button>
          </div>

          {/* ACTIVE CATEGORIES (8 REQUIRED PILLS HORIZONTAL GRID) */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono font-black text-[#555555] uppercase tracking-wider block">
              Choose Conversation Focus Category
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x" id="talk-categories-rail">
              {TALK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3.5 py-2.5 rounded-xl font-mono text-[10px] whitespace-nowrap transition-all uppercase tracking-wide cursor-pointer snap-start shrink-0 flex items-center gap-1.5 border font-semibold ${
                    activeCategory === cat.id 
                      ? 'bg-[#BD53F4]/20 border-[#BD53F4] text-white' 
                      : 'bg-[#1A1A1A] border-[#BD53F4]/5 text-[#AAAAAA] hover:bg-[#222222]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STATISTICS PANEL STRIP STRIP */}
          <div className="grid grid-cols-3 gap-2" id="speech-session-statistics">
            <div className="bg-[#1A1A1A] border border-[#BD53F4]/10 p-2.5 rounded-xl text-center space-y-0.5">
              <span className="text-[8px] font-mono text-[#555555] font-black uppercase tracking-wider block">Avg Accuracy</span>
              <span className="text-sm font-black text-white font-mono">{stats.avgAccuracy}%</span>
            </div>
            <div className="bg-[#1A1A1A] border border-[#BD53F4]/10 p-2.5 rounded-xl text-center space-y-0.5">
              <span className="text-[8px] font-mono text-[#555555] font-black uppercase tracking-wider block">Words Spoken</span>
              <span className="text-sm font-black text-white font-mono">{stats.wordsSpoken}</span>
            </div>
            <div className="bg-[#1A1A1A] border border-[#BD53F4]/10 p-2.5 rounded-xl text-center space-y-0.5">
              <span className="text-[8px] font-mono text-[#555555] font-black uppercase tracking-wider block">Rhythm Pacing</span>
              <span className="text-sm font-black text-emerald-400 font-mono">Good</span>
            </div>
          </div>

          {/* MAIN CHALKBOARD PANEL */}
          <div 
            className="p-5 bg-[#14231E] rounded-3xl border-4 border-[#283832] shadow-inner space-y-4 text-left relative overflow-hidden"
            id="vani-chalkboard-coaching-box"
          >
            {/* Wooden aesthetic screw marks */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-amber-800" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-800" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-amber-800" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-800" />

            {/* Focus title */}
            <div className="pb-1 border-b border-white/5 flex justify-between items-center text-[9px] font-mono font-semibold">
              <span className="text-[#F0ABFC] uppercase tracking-wider font-bold">🎯 Target Phrase</span>
              <span className="text-white/40 block">VANI BOARD</span>
            </div>

            {/* Highlighted text presentation with manual audio player capability to bypass browser autoplay constraints */}
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-base sm:text-lg font-black font-display text-white italic tracking-tight leading-snug flex-1">
                "{teachingBoard.word || "Select a phrase from the horizontal list to master standard sounds."}"
              </h3>
              {teachingBoard.word && (
                <button
                  type="button"
                  onClick={() => {
                    speakVani(`Listen carefully: ${teachingBoard.word}`);
                  }}
                  className="p-2 sm:p-2.5 bg-emerald-990 border border-emerald-700 hover:border-emerald-400 rounded-xl text-emerald-300 hover:text-white transition-all cursor-pointer shrink-0 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95"
                  title="Listen to Coach Vani speak this sentence"
                >
                  <Volume2 className="w-4.5 h-4.5" />
                </button>
              )}
            </div>

            {/* Phonics transcription */}
            <div className="space-y-0.5 text-xs text-left">
              <span className="text-[8px] font-mono text-[#AAAAAA] tracking-widest uppercase block font-bold">Phonetic Guide</span>
              <p className="text-[11px] font-mono text-emerald-300 italic">
                {teachingBoard.phonetic || "N/A"}
              </p>
            </div>

            {/* Bengali tip line */}
            {teachingBoard.bengaliTip && (
              <div className="p-2.5 bg-black/35 rounded-xl border border-white/5 space-y-0.5 text-left">
                <span className="text-[8px] font-mono text-emerald-400 font-black tracking-widest uppercase block leading-none">
                  Bengali Tip / ইঙ্গিত 🇧🇩
                </span>
                <p className="font-bengali text-[11px] text-white/90 leading-tight">
                  {teachingBoard.bengaliTip}
                </p>
              </div>
            )}
          </div>

          {/* SANDBOX SIMULATOR & KEYBOARD FALLBACK INPUT */}
          <div className="p-4 bg-[#231A26] border border-[#BD53F4]/20 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-[#F0ABFC] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#BD53F4]" /> Simulation fallbacks (Use if mic is blocked)
              </span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={teachingBoard.word ? `Type: "${teachingBoard.word}"` : "Or type any English sentence..."}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 font-sans focus:outline-none focus:border-[#BD53F4]/50"
                id="sandbox-fallback-typing-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = e.currentTarget.value;
                    if (val.trim()) {
                      submitSpokenSentence(val);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const inputEl = document.getElementById('sandbox-fallback-typing-input') as HTMLInputElement;
                  if (inputEl && inputEl.value.trim()) {
                    submitSpokenSentence(inputEl.value);
                    inputEl.value = '';
                  } else if (teachingBoard.word) {
                    submitSpokenSentence(teachingBoard.word);
                  }
                }}
                className="px-3 bg-[#BD53F4] hover:bg-[#F0ABFC] hover:text-black text-white text-[10px] font-mono font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                Simulate 🎙️
              </button>
            </div>
            
            {teachingBoard.word && (
              <button
                type="button"
                onClick={() => {
                  submitSpokenSentence(teachingBoard.word);
                }}
                className="w-full py-2 bg-[#1E1224] hover:bg-[#2A1833] text-[#F0ABFC] hover:text-white border border-[#BD53F4]/20 rounded-xl font-mono text-[9px] font-bold uppercase transition-all tracking-wider text-center cursor-pointer flex items-center justify-center gap-1"
              >
                <span>🚀 Auto-Pronounce target phrase:</span>
                <span className="italic text-white">"{teachingBoard.word}"</span>
              </button>
            )}
          </div>

          {/* MICROPHONE ERROR ALERT BOX */}
          {speechError && (
            <div className="p-3 bg-red-950/40 border border-red-500/25 text-[#FF8888] rounded-xl flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div>
                <span className="font-bold block uppercase font-mono tracking-wider text-[9px]">Mic Warning</span>
                <p className="text-[11px] leading-tight pt-0.5">{speechError}</p>
              </div>
            </div>
          )}

          {/* EVALUATION FEEDBACK CARD */}
          <AnimatePresence>
            {evaluation && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="p-4 bg-[#1A1A1A] border border-[#BD53F4]/20 rounded-2xl space-y-3 shadow-md"
                id="word-oral-feedback-deck"
              >
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-mono text-[#F0ABFC] font-black uppercase tracking-wider">
                    Micro Assessment Spoken Success
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider font-mono font-black ${
                    evaluation.accuracy >= 80 ? 'text-[#22C55E]' : evaluation.accuracy >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {evaluation.accuracy >= 80 ? '👑 Excellent' : evaluation.accuracy >= 50 ? '👍 Keep Trying' : '💡 Sound Closer'}
                  </span>
                </div>

                {/* Score bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#EAEAEA] font-mono">
                    <span>Oral Accuracy Score:</span>
                    <span className="font-black">{evaluation.accuracy}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        evaluation.accuracy >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                        evaluation.accuracy >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                        'bg-gradient-to-r from-red-500 to-rose-400'
                      }`}
                      style={{ width: `${evaluation.accuracy}%` }}
                    />
                  </div>
                </div>

                {/* Verbal Tip */}
                {evaluation.corrections && (
                  <p className="text-xs text-[#AAAAAA] italic leading-tight bg-[#222222] p-3 rounded-xl border border-white/5">
                    "VANI says: {evaluation.corrections}"
                  </p>
                )}

                {/* Micro Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      speakVani(`Listen carefully. Try saying: "${teachingBoard.word}" cleanly.`);
                    }}
                    className="flex-1 py-2.5 bg-[#222222] hover:bg-[#2A2A2A] text-white text-[10px] font-mono font-black uppercase tracking-wider rounded-xl border border-[#BD53F4]/10 hover:border-[#BD53F4]/40 transition-all cursor-pointer text-center"
                  >
                    Try Again 🔄
                  </button>
                  <button
                    onClick={() => {
                      // Move forward to random index/category
                      const randIdx = Math.floor(Math.random() * TALK_CATEGORIES.length);
                      handleSelectCategory(TALK_CATEGORIES[randIdx]);
                    }}
                    className="flex-1 py-2.5 bg-[#BD53F4] hover:bg-[#F0ABFC] hover:text-black text-white text-[10px] font-mono font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                  >
                    Next Word ➡️
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MESSAGE HISTORIES LIST */}
          <div className="space-y-2.5 pt-2 border-t border-[#BD53F4]/15">
            <span className="text-[9px] font-mono text-[#555555] font-black uppercase tracking-wider">
              Recent Message Logs
            </span>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1.5 pb-[160px] scrollbar-none">
              {chatHistory.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 max-w-[85%] rounded-2xl text-[11px] leading-relaxed italic ${
                    msg.role === 'user' 
                      ? 'bg-[#BD53F4] text-white shadow-md shadow-[#BD53F4]/15' 
                      : 'bg-[#1A1A1A] text-[#EAEAEA] border border-[#BD53F4]/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>

        </div>
      )}

      {/* RIPPLE CLASS KEYFRAMES STYLES INJECTOR FOR SAFETY */}
      <style>{`
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        .animate-ripple-0 {
          animation: ripple 2s infinite ease-out;
        }
        .animate-ripple-300 {
          animation: ripple 2s infinite ease-out;
          animation-delay: 300ms;
        }
        .animate-ripple-600 {
          animation: ripple 2s infinite ease-out;
          animation-delay: 600ms;
        }
      `}</style>



    </div>
  );
}
