import React, { useState } from 'react';
import { Lock, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubscriptionPlan } from '../types';

interface LearnScreenProps {
  speakVani: (text: string) => void;
  streak: number;
  currentPlan: SubscriptionPlan;
  onOpenLessonDetail: (lessonId: string) => void;
  onNavigateToTab: (tab: 'home' | 'topics' | 'latest' | 'talk' | 'progress') => void;
  triggerRechargeModal: () => void;
}

interface TopicItem {
  id: string;
  num: number;
  title: string;
  category: string;
  type: string; // Speaking, Grammar, Vocabulary, Pronunciation, Fluency, Assessment
  level: 1 | 2 | 3 | 4 | 5;
  levelName: string;
  isUnlocked: boolean;
  done: boolean;
  thumbnail: string;
}

// Visual category-based thumbnails
const STUDENT_THUMBNAILS = [
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=360&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=360&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=360&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=360&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618005198143-e52834658512?w=360&auto=format&fit=crop&q=80"
];

// All 50 Spoken Curriculum Data list
const ALL_50_TOPICS: TopicItem[] = [
  // LEVEL 1
  { id: "t-01", num: 1, title: "W vs V Sounds", category: "About Yourself", type: "Pronunciation", level: 1, levelName: "LEVEL 1 — FOUNDATION", isUnlocked: true, done: true, thumbnail: STUDENT_THUMBNAILS[0] },
  { id: "t-02", num: 2, title: "The TH Sound", category: "About Yourself", type: "Pronunciation", level: 1, levelName: "LEVEL 1 — FOUNDATION", isUnlocked: true, done: false, thumbnail: STUDENT_THUMBNAILS[1] },
  { id: "t-03", num: 3, title: "Short and Long Vowels", category: "Daily Life", type: "Pronunciation", level: 1, levelName: "LEVEL 1 — FOUNDATION", isUnlocked: true, done: false, thumbnail: STUDENT_THUMBNAILS[2] },
  { id: "t-04", num: 4, title: "Silent Letters", category: "Daily Life", type: "Pronunciation", level: 1, levelName: "LEVEL 1 — FOUNDATION", isUnlocked: true, done: false, thumbnail: STUDENT_THUMBNAILS[3] },
  { id: "t-05", num: 5, title: "Greetings & Introduction", category: "About Yourself", type: "Speaking", level: 1, levelName: "LEVEL 1 — FOUNDATION", isUnlocked: true, done: false, thumbnail: STUDENT_THUMBNAILS[4] },
  { id: "t-06", num: 6, title: "Numbers, Dates and Time", category: "Daily Life", type: "Speaking", level: 1, levelName: "LEVEL 1 — FOUNDATION", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[0] },
  { id: "t-07", num: 7, title: "Asking Questions Correctly", category: "Daily Life", type: "Speaking", level: 1, levelName: "LEVEL 1 — FOUNDATION", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[1] },
  { id: "t-08", num: 8, title: "Saying No Politely", category: "About Yourself", type: "Speaking", level: 1, levelName: "LEVEL 1 — FOUNDATION", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[2] },
  { id: "t-09", num: 9, title: "Describing People & Places", category: "About Yourself", type: "Speaking", level: 1, levelName: "LEVEL 1 — FOUNDATION", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[3] },
  { id: "t-10", num: 10, title: "Your Daily Routine", category: "Daily Life", type: "Speaking", level: 1, levelName: "LEVEL 1 — FOUNDATION", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[4] },

  // LEVEL 2
  { id: "t-11", num: 11, title: "Speaking About the Past", category: "Daily Life", type: "Speaking", level: 2, levelName: "LEVEL 2 — EVERYDAY SPEAKING", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[0] },
  { id: "t-12", num: 12, title: "Speaking About the Future", category: "Daily Life", type: "Speaking", level: 2, levelName: "LEVEL 2 — EVERYDAY SPEAKING", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[1] },
  { id: "t-13", num: 13, title: "Shopping in English", category: "Daily Life", type: "Speaking", level: 2, levelName: "LEVEL 2 — EVERYDAY SPEAKING", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[2] },
  { id: "t-14", num: 14, title: "Telephonic Conversation", category: "Work Place", type: "Speaking", level: 2, levelName: "LEVEL 2 — EVERYDAY SPEAKING", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[3] },
  { id: "t-15", num: 15, title: "At the Doctor", category: "Daily Life", type: "Speaking", level: 2, levelName: "LEVEL 2 — EVERYDAY SPEAKING", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[4] },
  { id: "t-16", num: 16, title: "Expressing Feelings", category: "Hobbies & Interests", type: "Speaking", level: 2, levelName: "LEVEL 2 — EVERYDAY SPEAKING", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[0] },
  { id: "t-17", num: 17, title: "Giving Compliments", category: "Hobbies & Interests", type: "Speaking", level: 2, levelName: "LEVEL 2 — EVERYDAY SPEAKING", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[1] },
  { id: "t-18", num: 18, title: "Spoken Transition Words", category: "Daily Life", type: "Fluency", level: 2, levelName: "LEVEL 2 — EVERYDAY SPEAKING", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[2] },
  { id: "t-19", num: 19, title: "Workplace English", category: "Work Place", type: "Speaking", level: 2, levelName: "LEVEL 2 — EVERYDAY SPEAKING", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[3] },
  { id: "t-20", num: 20, title: "Telling Stories", category: "Hobbies & Interests", type: "Speaking", level: 2, levelName: "LEVEL 2 — EVERYDAY SPEAKING", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[4] },

  // LEVEL 3
  { id: "t-21", num: 21, title: "Phrasal Verbs in Speech", category: "Work Place", type: "Vocabulary", level: 3, levelName: "LEVEL 3 — FLUENCY BUILDER", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[0] },
  { id: "t-22", num: 22, title: "Common Idioms", category: "Hobbies & Interests", type: "Vocabulary", level: 3, levelName: "LEVEL 3 — FLUENCY BUILDER", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[1] },
  { id: "t-23", num: 23, title: "Difficult Word Pronunciation", category: "Daily Life", type: "Pronunciation", level: 3, levelName: "LEVEL 3 — FLUENCY BUILDER", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[2] },
  { id: "t-24", num: 24, title: "Stress and Intonation", category: "Daily Life", type: "Pronunciation", level: 3, levelName: "LEVEL 3 — FLUENCY BUILDER", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[3] },
  { id: "t-25", num: 25, title: "Indian English Corrections", category: "Daily Life", type: "Speaking", level: 3, levelName: "LEVEL 3 — FLUENCY BUILDER", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[4] },
  { id: "t-26", num: 26, title: "Agreeing & Disagreeing", category: "Work Place", type: "Speaking", level: 3, levelName: "LEVEL 3 — FLUENCY BUILDER", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[0] },
  { id: "t-27", num: 27, title: "Speak for One Minute", category: "About Yourself", type: "Fluency", level: 3, levelName: "LEVEL 3 — FLUENCY BUILDER", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[1] },
  { id: "t-28", num: 28, title: "ED Endings Pronunciation", category: "Daily Life", type: "Pronunciation", level: 3, levelName: "LEVEL 3 — FLUENCY BUILDER", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[2] },
  { id: "t-29", num: 29, title: "Small Talk", category: "About Yourself", type: "Speaking", level: 3, levelName: "LEVEL 3 — FLUENCY BUILDER", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[3] },
  { id: "t-30", num: 30, title: "Apologising in English", category: "About Yourself", type: "Speaking", level: 3, levelName: "LEVEL 3 — FLUENCY BUILDER", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[4] },

  // LEVEL 4
  { id: "t-31", num: 31, title: "Job Interview Introduction", category: "Interview Pro", type: "Speaking", level: 4, levelName: "LEVEL 4 — PROFESSIONAL ENGLISH", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[0] },
  { id: "t-32", num: 32, title: "HR Interview Questions", category: "Interview Pro", type: "Speaking", level: 4, levelName: "LEVEL 4 — PROFESSIONAL ENGLISH", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[1] },
  { id: "t-33", num: 33, title: "Presentations", category: "Work Place", type: "Speaking", level: 4, levelName: "LEVEL 4 — PROFESSIONAL ENGLISH", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[2] },
  { id: "t-34", num: 34, title: "Negotiation & Persuasion", category: "Work Place", type: "Speaking", level: 4, levelName: "LEVEL 4 — PROFESSIONAL ENGLISH", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[3] },
  { id: "t-35", num: 35, title: "Email to Spoken Call", category: "Work Place", type: "Speaking", level: 4, levelName: "LEVEL 4 — PROFESSIONAL ENGLISH", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[4] },
  { id: "t-36", num: 36, title: "Giving Directions", category: "Travel Abroad", type: "Speaking", level: 4, levelName: "LEVEL 4 — PROFESSIONAL ENGLISH", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[0] },
  { id: "t-37", num: 37, title: "Making Complaints", category: "Custom Situations", type: "Speaking", level: 4, levelName: "LEVEL 4 — PROFESSIONAL ENGLISH", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[1] },
  { id: "t-38", num: 38, title: "Banking English", category: "Custom Situations", type: "Speaking", level: 4, levelName: "LEVEL 4 — PROFESSIONAL ENGLISH", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[2] },
  { id: "t-39", num: 39, title: "Accent Softening", category: "Custom Situations", type: "Pronunciation", level: 4, levelName: "LEVEL 4 — PROFESSIONAL ENGLISH", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[3] },
  { id: "t-40", num: 40, title: "IELTS Speaking Basics", category: "Higher Studies", type: "Speaking", level: 4, levelName: "LEVEL 4 — PROFESSIONAL ENGLISH", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[4] },

  // LEVEL 5
  { id: "t-41", num: 41, title: "Advanced Vocabulary", category: "Custom Situations", type: "Vocabulary", level: 5, levelName: "LEVEL 5 — MASTERY", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[0] },
  { id: "t-42", num: 42, title: "Spoken Conditionals", category: "Custom Situations", type: "Speaking", level: 5, levelName: "LEVEL 5 — MASTERY", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[1] },
  { id: "t-43", num: 43, title: "Humour in English", category: "Hobbies & Interests", type: "Speaking", level: 5, levelName: "LEVEL 5 — MASTERY", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[2] },
  { id: "t-44", num: 44, title: "Debating Opinions", category: "Higher Studies", type: "Speaking", level: 5, levelName: "LEVEL 5 — MASTERY", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[3] },
  { id: "t-45", num: 45, title: "Social Media English", category: "Hobbies & Interests", type: "Vocabulary", level: 5, levelName: "LEVEL 5 — MASTERY", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[4] },
  { id: "t-46", num: 46, title: "Describing Data Verbally", category: "Work Place", type: "Speaking", level: 5, levelName: "LEVEL 5 — MASTERY", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[0] },
  { id: "t-47", num: 47, title: "Diplomatic Speaking", category: "About Yourself", type: "Speaking", level: 5, levelName: "LEVEL 5 — MASTERY", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[1] },
  { id: "t-48", num: 48, title: "Travel English", category: "Travel Abroad", type: "Speaking", level: 5, levelName: "LEVEL 5 — MASTERY", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[2] },
  { id: "t-49", num: 49, title: "Customer Service English", category: "Work Place", type: "Speaking", level: 5, levelName: "LEVEL 5 — MASTERY", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[3] },
  { id: "t-50", num: 50, title: "VANI Graduation Test", category: "About Yourself", type: "Assessment", level: 5, levelName: "LEVEL 5 — MASTERY", isUnlocked: false, done: false, thumbnail: STUDENT_THUMBNAILS[4] }
];

interface ThemeItem {
  name: string;
  emoji: string;
  count: number;
  imageUrl: string;
}

const EXPERT_THEMES: ThemeItem[] = [
  { name: "About Yourself", emoji: "👤", count: 13, imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=80" },
  { name: "Interview Pro", emoji: "💼", count: 7, imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80" },
  { name: "Work Place", emoji: "🏢", count: 5, imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&auto=format&fit=crop&q=80" },
  { name: "Daily Life", emoji: "💬", count: 8, imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80" },
  { name: "Hobbies & Interests", emoji: "🎸", count: 6, imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=80" },
  { name: "Custom Situations", emoji: "🌍", count: 7, imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80" },
  { name: "Travel Abroad", emoji: "✈️", count: 5, imageUrl: "https://images.unsplash.com/photo-1618005198143-e52834658512?w=400&auto=format&fit=crop&q=80" },
  { name: "PTM for Parents", emoji: "👨‍👧", count: 4, imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80" },
  { name: "Higher Studies", emoji: "🎓", count: 6, imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80" }
];

const RECOMMENDED_CARDS = [
  { title: "Customer Support", type: "Speaking", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=80" },
  { title: "Daily Conversations", type: "Speaking", imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=80" },
  { title: "Workplace English", type: "Speaking", imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop&q=80" },
  { title: "Travel Talk", type: "Speaking", imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&auto=format&fit=crop&q=80" }
];

export default function LearnScreen({
  speakVani,
  currentPlan,
  onNavigateToTab,
  triggerRechargeModal
}: LearnScreenProps) {
  // Theme category filtering
  const [activeThemeFilter, setActiveThemeFilter] = useState<string | null>(null);

  const isActuallyUnlocked = (topic: TopicItem) => {
    // Topics 1-5 are always free
    if (topic.num <= 5) return true;
    // Premium plan unlocks everything
    return currentPlan === 'premium' || currentPlan === 'pro' || currentPlan === 'basic' || currentPlan === 'trial_rs7';
  };

  const handleSelectTopicItem = (topic: TopicItem) => {
    if (!isActuallyUnlocked(topic)) {
      speakVani(`Topic ${topic.num}: ${topic.title} is a premium course resource. Please subscribe to unlock complete study levels.`);
      triggerRechargeModal();
      return;
    }
    speakVani(`Initializing lesson of ${topic.title}. Let's focus on phonetic alignments!`);
    onNavigateToTab('talk');
  };

  const displayedTopics = activeThemeFilter
    ? ALL_50_TOPICS.filter((t) => t.category === activeThemeFilter)
    : ALL_50_TOPICS;

  // Levels grouping
  const levels = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-6 text-left relative pb-32" id="learn-topics-pane">
      
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-xl font-black text-white font-display">
          Topics
        </h2>
      </div>

      {/* PROGRESS BAR SECTION */}
      <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#BD53F4]/15 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#AAAAAA] font-mono tracking-wider font-bold">COMPLETED TOPICS</span>
          <span className="text-[#BD53F4] text-sm font-black font-mono">1</span>
        </div>
        <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
          <div className="h-full bg-[#22C55E] rounded-full" style={{ width: "2%" }} />
        </div>
      </div>

      {/* DETAILED THEME FILTER ACTIVE ACTION */}
      <AnimatePresence>
        {activeThemeFilter && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-between p-3 bg-[#BD53F4]/10 border border-[#BD53F4]/35 rounded-xl text-xs gap-3"
          >
            <span className="text-white font-mono font-medium">
              Filtered Theme: <span className="text-[#F0ABFC] font-black">{activeThemeFilter}</span> ({displayedTopics.length} topics)
            </span>
            <button
              onClick={() => {
                setActiveThemeFilter(null);
                speakVani("Cleared themes filter. Viewing full syllabus levels.");
              }}
              className="px-2 py-1 bg-[#BD53F4] text-white text-[9px] font-black uppercase rounded font-mono hover:scale-105 transition-all cursor-pointer"
            >
              Clear ←
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECOMMENDED FOR YOU (LARGE CARDS HORIZONTAL SCROLL) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-mono font-black text-[#AAAAAA] tracking-wider uppercase">
          Recommended for you
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
          {RECOMMENDED_CARDS.map((rc, index) => (
            <div
              key={index}
              onClick={() => {
                speakVani(`Launching recommendation: ${rc.title}. Learn to speak naturally!`);
                onNavigateToTab('talk');
              }}
              className="w-[240px] bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#BD53F4]/10 hover:border-[#BD53F4]/30 transition-all shrink-0 cursor-pointer select-none snap-start active:scale-[0.98]"
            >
              <div className="h-[120px] relative">
                <img 
                  src={rc.imageUrl} 
                  alt={rc.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover contrast-[1.10] saturate-[1.20] brightness-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
              </div>
              <div className="p-3 text-left">
                <h4 className="text-xs font-black text-white font-display uppercase tracking-tight line-clamp-1">{rc.title}</h4>
                <p className="text-[9px] text-[#AAAAAA] font-mono mt-0.5">{rc.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THEMES SECTION (CIRCULAR GRID WITH PHOTO BACKGROUNDS) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-mono font-black text-[#AAAAAA] tracking-wider uppercase">
          Themes
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
          {EXPERT_THEMES.map((th, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveThemeFilter(th.name === activeThemeFilter ? null : th.name);
                speakVani(`Filtered curriculum to ${th.name} situations.`);
              }}
              className="flex flex-col items-center space-y-1.5 shrink-0 select-none cursor-pointer snap-start active:scale-95 group"
            >
              {/* Image Circle with gradient wrap */}
              <div className={`w-18 h-18 rounded-full overflow-hidden p-0.5 border-2 transition-all ${
                activeThemeFilter === th.name 
                  ? 'border-[#BD53F4] scale-105' 
                  : 'border-[#222222] group-hover:border-[#BD53F4]/45'
              }`}>
                <div className="w-full h-full rounded-full overflow-hidden relative bg-[#222222]">
                  <img 
                    src={th.imageUrl} 
                    alt={th.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover contrast-[1.10] saturate-[1.20] brightness-[1.06]"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center font-sans text-xl">
                    {th.emoji}
                  </div>
                </div>
              </div>
              <div className="text-center w-[100px] space-y-0.5">
                <h4 className="text-[10px] font-black text-white leading-tight truncate uppercase font-mono">{th.name}</h4>
                <span className="text-[8px] text-[#AAAAAA] font-mono block leading-none">{th.count} Topics</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALL TOPICS CURRICULUM VERTICAL LEVELS */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-black text-[#AAAAAA] tracking-wider uppercase">
          All Topics
        </h3>
        
        {levels.map((lvl) => {
          const lvlTopics = displayedTopics.filter((t) => t.level === lvl);
          if (lvlTopics.length === 0) return null;
          
          return (
            <div key={lvl} className="space-y-3">
              <span className="text-[10px] font-mono text-[#F0ABFC] font-black tracking-widest uppercase block bg-[#BD53F4]/10 px-3 py-1 rounded w-max border border-[#BD53F4]/20">
                {lvlTopics[0].levelName}
              </span>
              
              <div className="space-y-2">
                {lvlTopics.map((topic) => {
                  const unlocked = isActuallyUnlocked(topic);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleSelectTopicItem(topic)}
                      className={`p-2.5 bg-[#1A1A1A] hover:bg-[#222222] border rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99] select-none ${
                        unlocked 
                          ? 'border-[#BD53F4]/10 hover:border-[#BD53F4]/35' 
                          : 'border-transparent opacity-50'
                      }`}
                    >
                      {/* Left Square Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#222222] border border-[#BD53F4]/10 shrink-0 relative flex items-center justify-center font-sans text-[#BD53F4] text-lg font-black font-mono">
                        <img 
                          src={topic.thumbnail} 
                          alt={topic.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-50 contrast-[1.10] saturate-[1.20] brightness-[1.06]"
                        />
                        <span className="absolute text-white font-black text-sm drop-shadow-md font-mono">
                          0{topic.num}
                        </span>
                      </div>

                      {/* Right Text Block */}
                      <div className="flex-1 min-w-0 py-0.5">
                        <h4 className="text-xs font-black text-white tracking-tight leading-tight line-clamp-2 uppercase">
                          Topic 0{topic.num}: {topic.title}
                        </h4>
                        <span className="text-[9px] text-[#AAAAAA] font-mono uppercase mt-0.5 block leading-none font-semibold">
                          {topic.type} • {topic.category}
                        </span>
                      </div>

                      {/* Locking indicators right */}
                      <div className="shrink-0 flex items-center pr-1.5">
                        {topic.done ? (
                          <div className="w-6 h-6 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]" title="Completed Lesson">
                            <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                          </div>
                        ) : unlocked ? (
                          <div className="w-6 h-6 rounded-full bg-[#BD53F4]/10 border border-[#BD53F4]/20 flex items-center justify-center text-[#F0ABFC]" title="Unlocked">
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#222222] border border-transparent flex items-center justify-center text-[#555555]" title="Locked">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* FLOATING CTA BAR (Always present on Topics above tab bar) */}
      <div className="fixed bottom-20 inset-x-4 h-14 bg-[#1A1A1A]/95 border border-[#BD53F4]/35 backdrop-blur rounded-2xl px-4 flex items-center justify-between shadow-lg z-30 animate-pulse-gentle">
        <div className="flex items-center gap-2">
          <span className="text-lg select-none">❓</span>
          <div>
            <h4 className="text-[10px] font-black text-white leading-none uppercase font-mono tracking-widest">Unsure?</h4>
            <span className="text-[8px] text-[#AAAAAA] block pt-0.5 font-medium">Clear doubt with speaking coach.</span>
          </div>
        </div>
        <button
          onClick={() => {
            speakVani("Greeting! Let's clear any spoken doubt or vocabulary questions together today.");
            onNavigateToTab('talk');
          }}
          className="px-3 py-2 bg-[#BD53F4] hover:bg-[#F0ABFC] hover:text-black text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer font-mono font-bold"
        >
          Talk to VANI 🎙️
        </button>
      </div>

    </div>
  );
}
