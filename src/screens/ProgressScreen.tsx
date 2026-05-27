import React from 'react';
import { Award, CheckCircle2, Circle, Flame, TrendingUp, Calendar, Trophy, ChevronRight } from 'lucide-react';

interface ProgressScreenProps {
  streak: number;
  stats: {
    wordsSpoken: number;
    avgAccuracy: number;
    avgFluency: number;
  };
  sessionCount: number;
  speakVani: (text: string) => void;
}

interface BadgeItem {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  isUnlocked: boolean;
  unlockedMsg: string;
}

const PROGRESS_BADGES: BadgeItem[] = [
  { id: "b1", name: "Rookie Star", emoji: "⭐️", desc: "For completing your very first micro phonetic word drill with VANI.", isUnlocked: true, unlockedMsg: "UNLOCKED on Day 1" },
  { id: "b2", name: "Fluency Nomad", emoji: "🌍", desc: "Speak over 15 distinct, diverse global scenarios cleanly.", isUnlocked: true, unlockedMsg: "UNLOCKED on Day 2" },
  { id: "b3", name: "Phonics Master", emoji: "🎙️", desc: "Complete Vani's Challenge of the Week with an Oral Score > 90%.", isUnlocked: false, unlockedMsg: "Complete Challenge to unlock" },
  { id: "b4", name: "Intonation Wizard", emoji: "🔮", desc: "Correctly pitch sentence word stress 20 times in active coaching.", isUnlocked: true, unlockedMsg: "UNLOCKED on Day 3" },
  { id: "b5", name: "Pacing Elite", emoji: "⏱️", desc: "Adhere to perfect syllable intervals under normal speech speed limits.", isUnlocked: false, unlockedMsg: "Reach Level 3 to unlock" },
  { id: "b6", name: "Conversational Guru", emoji: "🧠", desc: "Complete 10 interactive role-play exercises with recruiter VANI.", isUnlocked: true, unlockedMsg: "UNLOCKED on Day 4" },
  { id: "b7", name: "Active Listener Hero", emoji: "🎧", desc: "Listen to standard correct vocal instructions without skipping tutors.", isUnlocked: true, unlockedMsg: "UNLOCKED on Day 1" },
  { id: "b8", name: "VANI Golden Crown", emoji: "👑", desc: "Clear the final Level 5 VANI Spoken Graduation test successfully.", isUnlocked: false, unlockedMsg: "Reach Level 5 to unlock" }
];

export default function ProgressScreen({
  streak,
  stats,
  sessionCount,
  speakVani
}: ProgressScreenProps) {
  
  // Weekly checklist mock
  const weekDays = [
    { name: "Mon", active: true, date: "24 May" },
    { name: "Tue", active: true, date: "25 May" },
    { name: "Wed", active: true, date: "26 May" },
    { name: "Thu", active: true, date: "27 May" },
    { name: "Fri", active: false, date: "28 May" },
    { name: "Sat", active: false, date: "29 May" },
    { name: "Sun", active: false, date: "30 May" },
  ];

  return (
    <div className="space-y-6 text-left pb-24 font-sans" id="progress-screen-pane">
      
      {/* HEADER PART */}
      <div>
        <h2 className="text-xl font-black text-white font-display">
          Your Progress
        </h2>
        <p className="text-[10px] text-[#AAAAAA] font-mono tracking-wide uppercase pt-0.5">
          Live statistics and achievements badges
        </p>
      </div>

      {/* SYLLABUS RING Dial and STATS BLOCK */}
      <div className="p-5 bg-[#1A1A1A] rounded-3xl border border-[#BD53F4]/15 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Ring graphical visualizer */}
        <div className="flex flex-col items-center space-y-2 select-none">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer circle layout */}
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="64" 
                cy="64" 
                r="52" 
                className="stroke-[#222222]" 
                strokeWidth="10" 
                fill="transparent" 
              />
              <circle 
                cx="64" 
                cy="64" 
                r="52" 
                className="stroke-[#BD53F4]" 
                strokeWidth="10" 
                fill="transparent" 
                strokeDasharray={326.7}
                strokeDashoffset={326.7 * (1 - 0.24)}  // 24% completed
                strokeLinecap="round"
              />
            </svg>
            
            {/* Inside Label */}
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-white font-mono">24%</span>
              <span className="text-[8px] text-[#AAAAAA] font-mono uppercase tracking-widest font-bold">Completed</span>
            </div>
          </div>
          <span className="text-[10px] text-[#AAAAAA] font-mono uppercase font-black tracking-widest leading-none pt-1">Syllabus Index Ring</span>
        </div>

        {/* User stats details */}
        <div className="space-y-3.5">
          <div className="space-y-1 text-left">
            <span className="text-[9px] font-mono text-[#F0ABFC] bg-[#BD53F4]/10 border border-[#BD53F4]/20 px-2 py-0.5 rounded uppercase font-black">
              Global Performance
            </span>
            <h4 className="text-xs font-black text-white uppercase font-mono pt-1">Active Spoken Progress</h4>
          </div>

          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs py-1 border-b border-white/5">
              <span className="text-[#AAAAAA]">🔥 Day Streak:</span>
              <span className="text-white font-bold">{streak} Days</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-white/5">
              <span className="text-[#AAAAAA]">🎙️ Total Sessions Done:</span>
              <span className="text-white font-bold">{sessionCount} Finished</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-white/5">
              <span className="text-[#AAAAAA]">🎯 Average Oral Accuracy:</span>
              <span className="text-[#F0ABFC] font-black">{stats.avgAccuracy}% Score</span>
            </div>
            <div className="flex justify-between text-xs py-1">
              <span className="text-[#AAAAAA]">📏 Spoken Vocabularies:</span>
              <span className="text-white font-bold">{stats.wordsSpoken} Words</span>
            </div>
          </div>
        </div>

      </div>

      {/* 7-DAY STREAK CHECKLIST */}
      <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#BD53F4]/15 space-y-3">
        <div className="flex justify-between items-baseline">
          <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#BD53F4]" /> 7-Day Streak Checklist
          </h3>
          <span className="text-[8px] text-[#F0ABFC] font-mono font-bold">DAILY STATS</span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center" id="weekly-streak-checklist-view">
          {weekDays.map((day, index) => (
            <div 
              key={index}
              onClick={() => {
                speakVani(`Selected ${day.name} streak info. ${day.active ? "You logged a complete practice session that day!" : "No recorded milestone activity logged."}`);
              }}
              className={`p-2 rounded-xl border flex flex-col items-center justify-between space-y-1.5 cursor-pointer select-none transition-all ${
                day.active 
                  ? 'bg-[#BD53F4]/10 border-[#BD53F4]/40 text-white' 
                  : 'bg-[#222222]/40 border-[#222222] text-[#555555]'
              }`}
            >
              <span className="text-[9px] font-mono font-black uppercase leading-none">{day.name}</span>
              {day.active ? (
                <CheckCircle2 className="w-4 h-4 text-[#BD53F4]" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-[#555555]/50" />
              )}
              <span className="text-[7px] font-mono block leading-none opacity-80">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* VANI'S HIGHLIGHTED HANDWRITTEN-STYLE REVIEW MEMO */}
      <div 
        className="p-4 bg-[#21162B] rounded-2xl border-2 border-dashed border-[#BD53F4]/35 space-y-2.5 relative cursor-pointer"
        onClick={() => speakVani("Review of speech history complete. Work on vowel elongation on Everyday Speaking items to improve results!")}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#BD53F4]/10 border border-[#BD53F4]/20 flex items-center justify-center text-xs">
            🧠
          </div>
          <span className="text-[9px] font-mono text-[#F0ABFC] font-black uppercase tracking-wider">VANI'S SPEECH AUDIT MEMO</span>
        </div>
        <p className="font-bengali text-xs text-white/95 italic leading-relaxed">
          "Sourav, আপনার Standard Intonation অনেক উন্নত হয়েছে! তবে Level 2-এর Phonics exercises চর্চা করার সময় W এবং V অক্ষরের পার্থক্যের দিকে আরেকটু নজর দিন। 'very' উচ্চারণের সময় উপরের দাঁত আলতো করে নিচের ঠোঁটে ছুঁইয়ে বাতাস ছাড়ুন।"
        </p>
      </div>

      {/* ACHIEVEMENT BADGES GRID */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-black text-[#AAAAAA] tracking-wider uppercase flex items-center gap-1.5 leading-none">
          <Trophy className="w-3.5 h-3.5 text-[#BD53F4]" /> Achievement Badges ({PROGRESS_BADGES.filter(b => b.isUnlocked).length}/8)
        </h3>
        
        <div className="grid grid-cols-2 gap-3" id="badges-achievements-matrix">
          {PROGRESS_BADGES.map((badge) => (
            <div
              key={badge.id}
              onClick={() => {
                speakVani(`Achievement: ${badge.name}. ${badge.desc}`);
              }}
              className={`p-3 rounded-2xl border transition-all hover:scale-[1.01] cursor-pointer text-left space-y-2 ${
                badge.isUnlocked 
                  ? 'bg-[#1A1A1A] border-[#BD53F4]/25 text-white' 
                  : 'bg-[#121212] border-[#222222] opacity-40 text-[#555555]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-2xl select-none">{badge.emoji}</span>
                <span className={`text-[7px] font-mono leading-none tracking-widest uppercase font-black px-1.5 py-0.5 rounded border ${
                  badge.isUnlocked ? 'text-[#F0ABFC] border-[#BD53F4]/20 bg-[#BD53F4]/5' : 'text-[#AAAAAA]/50 border-transparent bg-transparent'
                }`}>
                  {badge.isUnlocked ? "UNLOCKED" : "LOCKED"}
                </span>
              </div>
              
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-black uppercase font-display tracking-tight truncate leading-tight">
                  {badge.name}
                </h4>
                <p className="text-[9px] text-[#AAAAAA] leading-snug line-clamp-2">
                  {badge.desc}
                </p>
              </div>

              <span className="text-[7px] font-mono block tracking-tight select-none pt-1 border-t border-white/5 opacity-80 uppercase leading-none">
                {badge.unlockedMsg}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* JOURNEY TIMELINE VERTICAL LIST */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-mono font-black text-[#AAAAAA] tracking-wider uppercase">
          Your Syllabus Milestones Timeline
        </h3>
        
        <div className="space-y-0 relative pl-4 border-l border-[#222222]" id="milestones-journey-rail">
          {/* Level 1 */}
          <div className="relative pb-6 text-left">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-[#22C55E] uppercase tracking-widest font-bold">LEVEL 1 • COMPLETED</span>
              <h4 className="text-xs font-black text-white uppercase font-display leading-tight">Foundation Speaking</h4>
              <p className="text-[10px] text-[#AAAAAA] leading-normal font-medium max-w-[90%]">Tested standard W vs V phonetic lines and primary greetings exercises.</p>
            </div>
          </div>

          {/* Level 2 */}
          <div className="relative pb-6 text-left">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#BD53F4] animate-ping" />
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#BD53F4]" />
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-[#F0ABFC] uppercase tracking-widest font-bold">LEVEL 2 • ACTIVE PRACTICE</span>
              <h4 className="text-xs font-black text-white uppercase font-display leading-tight">Everyday Conversations</h4>
              <p className="text-[10px] text-[#AAAAAA] leading-normal font-medium max-w-[90%]">Unlock shopping scenarios, bargaining lines, and casual office desk small-talk.</p>
            </div>
          </div>

          {/* Level 3 */}
          <div className="relative pb-6 text-left opacity-40">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-800" />
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-[#AAAAAA] uppercase tracking-widest">LEVEL 3 • LOCKED</span>
              <h4 className="text-xs font-black text-white uppercase font-display leading-tight">Fluency Builder</h4>
              <p className="text-[10px] text-[#AAAAAA] leading-normal font-medium max-w-[90%]">Eliminating native language accents drag and correcting sentence stresses.</p>
            </div>
          </div>

          {/* Level 4 */}
          <div className="relative pb-1 text-left opacity-40">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-800" />
            <div className="space-y-1">
              <span className="text-[8px] font-mono text-[#AAAAAA] uppercase tracking-widest">LEVEL 4/5 • LOCKED</span>
              <h4 className="text-xs font-black text-white uppercase font-display leading-tight">Professional English</h4>
              <p className="text-[10px] text-[#AAAAAA] leading-normal font-medium max-w-[90%]">Master HR recruitment queries, presentation slides delivery, and ultimate IELTS oral exams.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
