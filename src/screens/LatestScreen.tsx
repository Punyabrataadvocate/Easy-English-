import React, { useState } from 'react';
import { Sparkles, Trophy, Zap, Clock, ArrowRight } from 'lucide-react';

interface LatestScreenProps {
  speakVani: (text: string) => void;
  onNavigateToTab: (tab: 'home' | 'topics' | 'latest' | 'talk' | 'progress') => void;
  onSelectWord: (word: string, phonetic: string, tip: string) => void;
}

interface FeedItem {
  id: string;
  topicTitle: string;
  desc: string;
  category: 'speaking' | 'pronunciation' | 'vocabulary' | 'fluency';
  levelName: string;
  duration: string;
}

const LATEST_FEED: FeedItem[] = [
  { id: "fe-1", topicTitle: "Topic 05: Greetings & Introduction", desc: "Learn to introduce yourself professionally to recruiters and break ice safely in social gatherings.", category: "speaking", levelName: "Foundation Level 1", duration: "8 Mins" },
  { id: "fe-2", topicTitle: "Topic 02: The TH Sound", desc: "Unlock correct air flow pacing for voiced and unvoiced TH. Learn 'This' vs 'Think' properly.", category: "pronunciation", levelName: "Everyday Level 2", duration: "7 Mins" },
  { id: "fe-3", topicTitle: "Topic 13: Shopping in English", desc: "Learn essential phrases to bargain, ask for pricing options, and interact with global shopkeepers.", category: "vocabulary", levelName: "Everyday Level 2", duration: "6 Mins" },
  { id: "fe-4", topicTitle: "Topic 24: Stress and Intonation", desc: "Pitch sentence stress correctly to project genuine vocal authority and improve oral accuracy scores.", category: "fluency", levelName: "Fluency Level 3", duration: "8 Mins" },
  { id: "fe-5", topicTitle: "Topic 35: Email to Spoken Call", desc: "Transition cleanly from writing dry formal emails to pitching business ideas on voice meetings with ease.", category: "speaking", levelName: "Professional Level 4", duration: "9 Mins" }
];

const TRENDING_CARDS = [
  { title: "Softening Indian Accent Tips", emoji: "🎙️", duration: "7 Mins", category: "Pronunciation", border: "border-purple-400/25 text-[#D8B4FE]", tag: "HOT TREND" },
  { title: "Speaking Under Pressure", emoji: "🦁", duration: "6 Mins", category: "Fluency", border: "border-fuchsia-400/25 text-[#E0F2FE]", tag: "POPULAR" },
  { title: "Avoiding Fillers (Like, Uhm)", emoji: "🤫", duration: "8 Mins", category: "Speaking", border: "border-pink-400/25 text-[#F472B6]", tag: "MOST LIKED" }
];

const MOST_POPULAR_RELEASES = [
  { title: "Corporate Presentation Rules", reviews: "14.2k plays", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop&q=80" },
  { title: "Hospitality & Travel English", reviews: "9.8k plays", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=80" },
  { title: "Talking to Bank Tellers", reviews: "8.5k plays", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop&q=80" }
];

export default function LatestScreen({
  speakVani,
  onNavigateToTab,
  onSelectWord
}: LatestScreenProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'speaking' | 'pronunciation' | 'vocabulary' | 'fluency'>('all');

  const filterPills = [
    { id: 'all' as const, label: 'All Updates' },
    { id: 'speaking' as const, label: 'Speaking' },
    { id: 'pronunciation' as const, label: 'Pronunciation' },
    { id: 'vocabulary' as const, label: 'Vocabulary' },
    { id: 'fluency' as const, label: 'Fluency' }
  ];

  const filteredFeed = activeFilter === 'all' 
    ? LATEST_FEED 
    : LATEST_FEED.filter(f => f.category === activeFilter);

  const handleStartPracticeItem = (feed: FeedItem) => {
    onSelectWord(feed.topicTitle, "Latest Feed Training Session", feed.desc);
    speakVani(`Selected recent updater: ${feed.topicTitle}. Let's speak & score high!`);
    onNavigateToTab('talk');
  };

  return (
    <div className="space-y-6 text-left pb-24" id="latest-updates-pane">
      
      {/* PAGE HEADER */}
      <div>
        <h2 className="text-xl font-black text-white font-display">
          Latest Feed
        </h2>
        <p className="text-[10px] text-[#AAAAAA] font-mono tracking-wide uppercase pt-0.5">
          New resources and exercises this week
        </p>
      </div>

      {/* VANI'S WEEKLY CHALLENGE BANNER */}
      <div 
        className="relative p-5 rounded-3xl bg-gradient-to-r from-[#BD53F4] via-[#9333EA] to-[#701A75] overflow-hidden shadow-lg border border-[#F0ABFC]/30 flex flex-col justify-between space-y-4"
        id="weekly-fluency-challenge"
      >
        <div className="absolute top-2 right-2 flex gap-1.5 select-none opacity-85">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          <Zap className="w-4 h-4 text-[#F5F3FF] shrink-0" />
        </div>

        <div className="space-y-1 z-10">
          <span className="text-[9px] font-mono text-[#F3E8FF] font-extrabold tracking-widest uppercase block">
            Vani's Speaking Challenge 🏆
          </span>
          <h3 className="text-base font-black text-white uppercase tracking-tight leading-tight font-display">
            Score 90%+ in Indian Phonics
          </h3>
          <p className="text-xs text-[#F5F3FF] font-medium leading-relaxed max-w-[85%]">
            Speak the focus sentence perfectly under 10 seconds. Correct your syllables pacing to win the Golden Crown badge!
          </p>
        </div>

        <button
          onClick={() => {
            onSelectWord("Sailing smoothly in standard V vs W sounds", "Weekly Phonics Challenge", "Say 'We value very wet winter weather' cleanly with crisp syllable splits.");
            speakVani("Accepting Weekly Phonics Challenge. Speak 'We value very wet winter weather' three times cleanly to score 90 plus!");
            onNavigateToTab('talk');
          }}
          className="px-5 py-3 bg-white text-[#BD53F4] hover:bg-[#F5F3FF] active:scale-95 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md self-start flex items-center gap-1.5 cursor-pointer font-bold"
        >
          Accept Challenge <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* FILTER PILLS (HORIZONTAL SCROLL) */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x" id="latest-filter-rail">
        {filterPills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => {
              setActiveFilter(pill.id);
              speakVani(`Viewing standard filter: ${pill.label}.`);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wide tracking-tight cursor-pointer snap-start shrink-0 ${
              activeFilter === pill.id 
                ? 'bg-[#BD53F4] text-white shadow shadow-[#BD53F4]/20' 
                : 'bg-[#1A1A1A] text-[#AAAAAA] hover:bg-[#222222]'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* NEW THIS WEEK SECTION LISTING */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-mono font-black text-[#AAAAAA] tracking-wider uppercase flex items-center gap-1.5 leading-none">
          <Zap className="w-3.5 h-3.5 text-[#BD53F4]" /> New This Week
        </h3>
        
        <div className="space-y-3">
          {filteredFeed.map((feed) => (
            <div
              key={feed.id}
              className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#BD53F4]/10 hover:border-[#BD53F4]/35 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-[#F0ABFC] bg-[#BD53F4]/10 px-2 py-0.5 rounded font-black uppercase border border-[#BD53F4]/20">
                    {feed.levelName}
                  </span>
                  <span className="text-[9px] text-[#AAAAAA] font-mono uppercase font-semibold">
                    ⏱ {feed.duration}
                  </span>
                </div>
                <h4 className="text-xs font-black text-white uppercase leading-tight font-display">
                  {feed.topicTitle}
                </h4>
                <p className="text-[11px] text-[#AAAAAA] leading-relaxed line-clamp-2 font-medium">
                  {feed.desc}
                </p>
              </div>

              <button
                onClick={() => handleStartPracticeItem(feed)}
                className="px-4 py-2 bg-[#BD53F4]/10 hover:bg-[#BD53F4]/25 border border-[#BD53F4]/30 hover:border-[#BD53F4]/60 text-[#F0ABFC] hover:text-white font-mono font-black text-[10px] rounded-lg transition-all uppercase shrink-0 w-full sm:w-auto text-center cursor-pointer font-bold"
              >
                Practice 🎙️
              </button>
            </div>
          ))}
          {filteredFeed.length === 0 && (
            <div className="text-center py-8 text-[#555555] font-mono text-xs uppercase tracking-widest select-none">
              No matching feeds found this week.
            </div>
          )}
        </div>
      </div>

      {/* TRENDING NOW (VISUALLY STACKED FLUID COVERS) */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-black text-[#AAAAAA] tracking-wider uppercase flex items-center gap-1.5 leading-none">
          <Clock className="w-3.5 h-3.5 text-[#BD53F4]" /> Trending Now
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TRENDING_CARDS.map((tc, index) => (
            <div
              key={index}
              onClick={() => {
                onSelectWord(tc.title, "Trending Exercise", "Learn to speak perfectly with VANI's spoken alignment engine.");
                speakVani(`Starting popular trending exercise: ${tc.title}`);
                onNavigateToTab('talk');
              }}
              className={`p-4 bg-[#1A1A1A] rounded-2xl border ${tc.border} transition-all hover:scale-[1.01] cursor-pointer flex justify-between items-center select-none`}
            >
              <div className="space-y-1 text-left">
                <span className="text-[8px] font-mono font-black tracking-widest uppercase block">
                  {tc.tag}
                </span>
                <h4 className="text-xs font-black text-white uppercase font-display leading-tight">{tc.title}</h4>
                <p className="text-[9px] text-[#AAAAAA] font-mono uppercase">{tc.category} • {tc.duration}</p>
              </div>
              <span className="text-2xl pl-2 shrink-0 select-none">
                {tc.emoji}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MOST POPULAR (IMAGE THUMBNAILS CAROUSEL) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-mono font-black text-[#AAAAAA] tracking-wider uppercase">
          Most Popular Releases
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
          {MOST_POPULAR_RELEASES.map((mpr, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectWord(mpr.title, "Popular Release", "Master standard globally aligned speaking templates with VANI.");
                speakVani(`Launching: ${mpr.title}`);
                onNavigateToTab('talk');
              }}
              className="w-[180px] bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#BD53F4]/10 hover:border-[#BD53F4]/30 transition-all shrink-0 cursor-pointer snap-start active:scale-[0.98]"
            >
              <div className="h-[100px] relative">
                <img 
                  src={mpr.image} 
                  alt={mpr.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover contrast-[1.10] saturate-[1.20] brightness-[1.06] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
              </div>
              <div className="p-3 text-left">
                <h4 className="text-[10px] font-black text-white font-display uppercase tracking-tight truncate">{mpr.title}</h4>
                <p className="text-[8px] text-[#F0ABFC] font-mono mt-0.5 font-bold">{mpr.reviews}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
