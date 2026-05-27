import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Languages, Mic, MicOff, Volume2, Play, Check, ArrowRight, Trash2, HelpCircle 
} from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface TranslateScreenProps {
  currentPlan: SubscriptionPlan;
  speakVani: (text: string) => void;
  setTeachingBoard: (board: any) => void;
  setActiveTab: (tabId: 'home' | 'topics' | 'talk' | 'progress') => void;
}

interface TranslationHistoryItem {
  bengali: string;
  english: string;
  timestamp: string;
}

export default function TranslateScreen({
  currentPlan,
  speakVani,
  setTeachingBoard,
  setActiveTab
}: TranslateScreenProps) {
  
  const [bengaliText, setBengaliText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [vaniTip, setVaniTip] = useState('');
  const [phoneticText, setPhoneticText] = useState('');
  
  const [translateState, setTranslateState] = useState<'idle' | 'recording' | 'processing' | 'done'>('idle');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  
  const recRef = useRef<any>(null);

  // Stop mic on unmount
  useEffect(() => {
    return () => {
      if (recRef.current) {
        try {
          recRef.current.abort();
        } catch (e) {
          console.warn("Clean up translate mic error:", e);
        }
      }
    };
  }, []);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('easyEnglishTranslations');
      if (saved) {
        setHistory(JSON.parse(saved).slice(0, 5));
      }
    } catch (e) {
      console.error("Error loading translate history", e);
    }
  }, []);

  // Save translation result to history
  const saveToHistory = (bn: string, en: string) => {
    try {
      const newItem: TranslationHistoryItem = {
        bengali: bn,
        english: en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const currentHistory = localStorage.getItem('easyEnglishTranslations');
      let parsed: TranslationHistoryItem[] = currentHistory ? JSON.parse(currentHistory) : [];
      // Max 20 items stored, newest first
      parsed = [newItem, ...parsed.filter(item => item.bengali !== bn)].slice(0, 20);
      
      localStorage.setItem('easyEnglishTranslations', JSON.stringify(parsed));
      setHistory(parsed.slice(0, 5));
    } catch (e) {
      console.error("Error saving translate history", e);
    }
  };

  // Clear translation history
  const handleClearHistory = () => {
    if (window.confirm("Clear all translation history?")) {
      try {
        localStorage.removeItem('easyEnglishTranslations');
        setHistory([]);
      } catch (e) {
        console.error("Error clearing history", e);
      }
    }
  };

  // Speaks English phrase
  const speakEnglish = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 0.82;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => 
        v.lang === "en-IN" || 
        v.name.includes("Raveena")
      ) || voices.find(v => v.lang.startsWith("en"));
      
      if (indianVoice) utterance.voice = indianVoice;
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  // VANI built-in tip generator
  const generateVANITip = (english: string) => {
    const text = english.toLowerCase();
    
    if (text.includes(" the ") || text.startsWith("the ")) {
      return "Notice the word 'the' — this is called a definite article. English uses it before specific things!";
    }
    else if (text.includes(" am ") || text.includes(" is ") || text.includes(" are ")) {
      return "See how English always needs am, is, or are in sentences? Bengali does not need this — but English always does!";
    }
    else if (text.includes("going to") || text.includes("will ")) {
      return "This is how English talks about the future — using 'will' or 'going to'. Very useful phrase!";
    }
    else if (text.includes("have") || text.includes("has")) {
      return "In English we say 'have' for possession — like 'I have a book'. Bengali uses আছে but English uses have!";
    }
    else if (text.includes("please") || text.includes("thank")) {
      return "Adding please and thank you makes your English sound very polite and professional!";
    }
    else {
      const tips = [
        "This is a very natural English phrase — practice saying it out loud every day!",
        "Notice how short and direct English sentences can be — simple is powerful!",
        "This phrase will be very useful in daily conversations. Remember it!",
        "Great phrase to learn! Try using it in a conversation with someone today."
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
  };

  // Clean phonetic helper
  const generatePhonetic = (english: string) => {
    const words = english.split(' ');
    const phoneticMap: Record<string, string> = {
      "i": "Eye",
      "am": "am",
      "going": "GOH-ing",
      "to": "to",
      "the": "the",
      "market": "MAR-ket",
      "office": "OFF-is",
      "home": "HOHM",
      "school": "SKOOL",
      "beautiful": "BEW-ti-ful",
      "is": "iz",
      "are": "ahr",
      "water": "WAH-ter",
      "food": "food",
      "rice": "reys",
      "happy": "HAP-ee",
      "sad": "sad",
      "sorry": "SAWR-ee",
      "please": "pleez",
      "thank": "thangk",
      "you": "yoo",
      "good": "gud",
      "morning": "MAWR-ning",
      "night": "neyt",
      "hello": "heh-LOH",
      "name": "neym",
      "friend": "frend",
      "family": "FAM-i-lee",
      "doctor": "DAK-ter",
      "hospital": "HOS-pi-tl"
    };
    
    return words.map(w => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (phoneticMap[clean]) {
        return w.toLowerCase().replace(clean, phoneticMap[clean]);
      }
      if (clean.length > 4) {
        return clean.slice(0, 3).toUpperCase() + "-" + clean.slice(3);
      }
      return clean;
    }).join(' ');
  };

  // Translation dispatch using MyMemory free translation API
  const translateToEnglish = async (bengali: string) => {
    setTranslateState("processing");
    setErrorText(null);
    
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(bengali)}&langpair=bn|en`;
    
    try {
      if (!navigator.onLine) {
        throw new Error("offline");
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("api_error");
      }
      
      const data = await response.json();
      const english = data.responseData.translatedText;
      
      if (!english) {
        throw new Error("empty_translation");
      }
      
      // Update result cards
      setEnglishText(english);
      const tip = generateVANITip(english);
      setVaniTip(tip);
      const phonetic = generatePhonetic(english);
      setPhoneticText(phonetic);
      
      saveToHistory(bengali, english);
      setTranslateState("done");
      
      // Speech synthesis callback after translation
      setTimeout(() => {
        speakEnglish(english);
      }, 600);
      
    } catch (err: any) {
      console.error("Translation Dispatch Failure:", err);
      if (err.message === "offline") {
        setErrorText("You need internet for translation. But you can still practice speaking with VANI in the Talk section!");
      } else {
        setErrorText("Translation not available right now. Please check your internet and try again.");
      }
      setTranslateState("idle");
    }
  };

  // Launch microphone for translate
  const toggleRecording = () => {
    if (translateState === 'recording') {
      if (recRef.current) {
        try {
          recRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setTranslateState('idle');
      return;
    }

    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechAPI) {
      setErrorText("Acoustic browser voice capture is not supported in this frame. Use falling simulation cards!");
      return;
    }

    setTranslateState('recording');
    setErrorText(null);

    try {
      const recognition = new SpeechAPI();
      recognition.lang = "bn-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setBengaliText(transcript);
          translateToEnglish(transcript);
        }
      };

      recognition.onerror = (e: any) => {
        console.error("SpeechAPI error", e);
        if (e.error === 'not-allowed') {
          setErrorText("Mic block permission. Click standard simulator buttons inside browser!");
        } else {
          setErrorText("Did not catch your voice clearly. Click spelling button mock simulated input below!");
        }
        setTranslateState('idle');
      };

      recognition.onend = () => {
        // Only set status idle if we haven't already advanced to processing
        setTranslateState(prev => prev === 'recording' ? 'idle' : prev);
      };

      recognition.start();
      recRef.current = recognition;

    } catch (err: any) {
      console.error("Failed speech activation", err);
      setErrorText("Browser mic is temporarily unavailable or blocked.");
      setTranslateState('idle');
    }
  };

  // Connect phrase to Coach Talk panel
  const handlePracticePhrase = () => {
    if (!englishText) return;
    
    // Configure phonetic layout
    setTeachingBoard({
      word: englishText,
      phonetic: phoneticText || generatePhonetic(englishText),
      focusArea: "Practice Spoken Bengali-Translation",
      bengaliTip: `How to say it: "${phoneticText || generatePhonetic(englishText)}". Speak out loud! 🎙️`
    });
    
    // Navigate back to core vocal arena
    setActiveTab('talk');
    
    // Greet and Drill
    setTimeout(() => {
      speakVani(`Let us practice your phrase! Say after me: "${englishText}". Now you try speaking it!`);
    }, 600);
  };

  // Simulated fallback triggering
  const triggerSimulation = (mockBengali: string) => {
    setBengaliText(mockBengali);
    translateToEnglish(mockBengali);
  };

  return (
    <div className="space-y-6 text-left pb-24" id="translate-viewport">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-black font-display text-white italic tracking-tight flex items-center gap-2">
          Translate & Learn <span className="text-[#BD53F4] shrink-0 animate-pulse">🔄</span>
        </h2>
        <p className="text-xs text-[#888888] font-mono tracking-wide uppercase pt-0.5">
          Speak in Bengali — see English
        </p>
      </div>

      {/* PURPOSE GRADIENT CARD */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#BD53F4] to-[#9333EA] text-white flex items-center gap-4.5 shadow-lg select-none">
        <span className="text-4xl">🎙️</span>
        <div className="space-y-0.5">
          <p className="text-sm font-black uppercase tracking-tight">Speak anything in Bengali</p>
          <p className="text-xs text-white/80">Coach VANI converts it to natural English instantly!</p>
        </div>
      </div>

      {/* LANGUAGE SELECTOR ROW */}
      <div className="grid grid-cols-11 items-center gap-1 select-none">
        <div className="col-span-5 bg-[#141416]/90 border-2 border-[#BD53F4] rounded-2xl p-3 text-center space-y-1">
          <span className="text-[9px] font-mono font-black text-gray-400 block uppercase">You Speak</span>
          <p className="text-sm font-black text-white flex items-center justify-center gap-1">
            <span>🇮🇳</span> <span className="font-sans">বাংলা (Bengali)</span>
          </p>
        </div>
        
        <div className="col-span-1 flex justify-center">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#BD53F4]/20 flex items-center justify-center text-[#BD53F4] shadow-md animate-bounce-horizontal">
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        <div className="col-span-5 bg-[#141416]/90 border-2 border-[#9333EA] rounded-2xl p-3 text-center space-y-1">
          <span className="text-[9px] font-mono font-black text-gray-400 block uppercase">VANI Shows</span>
          <p className="text-sm font-black text-white flex items-center justify-center gap-1">
            <span>🇬🇧</span> <span className="font-sans">English</span>
          </p>
        </div>
      </div>

      {/* RIPPLE CLASS INJECTOR IN THE RENDER FLOW FOR SANITY */}
      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
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
        @keyframes bounce-right-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        .animate-bounce-horizontal {
          animation: bounce-right-left 1.2s infinite ease-in-out;
        }
      `}</style>

      {/* CORE MIC TRIGGERS */}
      <div className="flex flex-col items-center justify-center py-6 bg-[#161618] rounded-3xl border border-white/5 space-y-3 relative overflow-hidden">
        
        <div className="relative">
          {/* Active ripple rings */}
          {translateState === 'recording' && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-red-500 bg-red-500/10 animate-ripple-0 z-0 scale-102" />
              <div className="absolute inset-0 rounded-full border-2 border-red-500 bg-red-500/10 animate-ripple-300 z-0 scale-102" />
              <div className="absolute inset-0 rounded-full border-2 border-red-500 bg-red-500/10 animate-ripple-600 z-0 scale-102" />
            </>
          )}

          <button
            onClick={toggleRecording}
            disabled={translateState === 'processing'}
            className={`w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center transition-all shadow-xl border-4 z-10 relative cursor-pointer ${
              translateState === 'recording'
                ? 'bg-gradient-to-br from-red-600 to-red-700 text-white scale-102 border-red-400 ring-8 ring-red-500/25'
                : translateState === 'processing'
                ? 'bg-[#374151] border-gray-500 text-gray-300 pointer-events-none'
                : 'bg-gradient-to-br from-[#BD53F4] to-[#9333EA] hover:from-[#F0ABFC] hover:to-[#A855F7] text-white active:scale-95 border-[#BD53F4]/40 ring-8 ring-[#BD53F4]/10'
            }`}
          >
            {translateState === 'recording' ? (
              <MicOff className="w-8 h-8 stroke-[2.5]" />
            ) : translateState === 'processing' ? (
              <div className="w-8 h-8 rounded-full border-4 border-t-white border-transparent animate-spin" />
            ) : (
              <Mic className="w-8 h-8 stroke-[2.5]" />
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="font-bengali text-sm font-bold text-white uppercase tracking-wider">
            {translateState === 'recording' 
              ? 'শুনছি...' 
              : translateState === 'processing' 
              ? 'অনুবাদ হচ্ছে...' 
              : 'বাংলায় বলুন'}
          </p>
          <p className="text-[10px] text-[#888888] font-mono uppercase tracking-widest pt-0.5">
            {translateState === 'recording' 
              ? '🔴 Speaking in Bengali India' 
              : translateState === 'processing' 
              ? 'VANI in progress' 
              : 'Tap and speak'}
          </p>
        </div>
      </div>

      {/* ERROR PANELS */}
      {errorText && (
        <div className="p-4 bg-red-950/40 border-2 border-red-500/25 text-[#FF8888] rounded-2xl text-xs space-y-1">
          <span className="font-black font-mono tracking-wider uppercase block">Capture Warning</span>
          <p className="leading-tight">{errorText}</p>
        </div>
      )}

      {/* MAIN RESULT CARD DISPLAY */}
      <AnimatePresence>
        {(bengaliText || englishText) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-5 bg-[#1F1F22] border border-[#BD53F4]/20 rounded-[24px] space-y-4 shadow-xl text-left"
            id="translation-card"
          >
            {/* Section A — What you said */}
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider block font-bengali">
                আপনি বললেন (You said):
              </span>
              <div className="bg-black/30 p-3.5 rounded-xl border border-white/5">
                <p className="font-bengali text-base text-white leading-normal">
                  {bengaliText || "..."}
                </p>
              </div>
            </div>

            {/* Divider with Center Translation Icon */}
            <div className="relative flex items-center justify-center my-1 select-none">
              <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#BD53F4]/45 to-transparent" />
              <div className="relative w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#BD53F4]/40 flex items-center justify-center text-[#BD53F4] text-xs">
                🔄
              </div>
            </div>

            {/* Section B — English Translation */}
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-mono text-[#F0ABFC] font-black uppercase tracking-widest block">
                English Version ✨
              </span>
              <div className="bg-black/40 p-3.5 rounded-xl border-l-4 border-[#BD53F4] border-y border-r border-[#BD53F4]/10">
                <p className="text-base font-bold text-white tracking-tight leading-snug">
                  {englishText || "Processing transcription..."}
                </p>
              </div>
            </div>

            {/* Section C — Teaching tips */}
            {englishText && vaniTip && (
              <div className="p-3 bg-[#13201B]/80 border border-green-500/10 rounded-xl space-y-1">
                <span className="text-[9px] font-mono font-black text-yellow-500 block uppercase tracking-wider">
                  VANI says 💡
                </span>
                <p className="text-xs text-[#E0E0E5] italic leading-snug">
                  "{vaniTip}"
                </p>
              </div>
            )}

            {/* Section D — How to say pronunciation block */}
            {englishText && (
              <div className="p-3 bg-[#111112] rounded-xl border border-white/5 flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="text-[8px] font-mono text-gray-500 font-black block uppercase tracking-wider">
                    How to say it 🔊
                  </span>
                  <p className="text-xs font-mono font-bold text-[#BD53F4] tracking-wide truncate">
                    {phoneticText || generatePhonetic(englishText)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => speakEnglish(englishText)}
                  className="w-8 h-8 rounded-full bg-[#BD53F4] hover:bg-[#F0ABFC] text-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title="Re-play pronunciation text"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                </button>
              </div>
            )}

            {/* PRACTICE IT BUTTON */}
            {englishText && (
              <button
                type="button"
                onClick={handlePracticePhrase}
                className="w-full py-3 bg-[#BD53F4] hover:bg-[#F0ABFC] active:scale-95 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 border border-white/10 font-bold"
              >
                Practice This Phrase with VANI 🎙️
              </button>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK FALLBACK BOARD OF TYPICAL MOCK CARDS */}
      <div className="p-4 bg-[#231E2A]/45 rounded-2xl border border-[#BD53F4]/15 space-y-2.5">
        <span className="text-[9px] font-mono text-[#F0ABFC] font-black uppercase tracking-wider flex items-center gap-1">
          💡 Spelling Simulator fallback (Quick test)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { tag: "আমি কি আসবো?", label: "আমি কি আসবো? 📋" },
            { tag: "আজকের আবহাওয়া কেমন?", label: "আজকের আবহাওয়া ☔" },
            { tag: "আমি খুব খুশি আজ!", label: "খুশি আজ 🎉" },
            { tag: "জল তেষ্টা পেয়েছে", label: "জল চেষ্টা 💧" }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => triggerSimulation(item.tag)}
              className="px-2.5 py-1.5 bg-[#141416] hover:bg-black border border-white/5 text-[10px] text-gray-300 font-bold rounded-lg cursor-pointer transition-all hover:border-[#BD53F4]/40 active:scale-95"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* RECENT HISTORIES */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center select-none">
          <span className="text-xs font-black font-sans text-white tracking-wide uppercase flex items-center gap-1">
            Recent Translations 📋
          </span>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[10px] font-mono text-gray-500 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History 🗑️
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-6 bg-[#121214] border border-white/5 rounded-2xl text-center">
            <p className="text-[11px] text-gray-500 font-mono uppercase tracking-wider">
              No recent translations found.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none">
            {history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setBengaliText(item.bengali);
                  setEnglishText(item.english);
                  setVaniTip(generateVANITip(item.english));
                  setPhoneticText(generatePhonetic(item.english));
                }}
                className="p-3 bg-[#131315] hover:bg-[#18181A] border border-white/5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-4 group hover:border-[#BD53F4]/20"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-bengali text-xs text-gray-400 truncate">
                    {item.bengali}
                  </p>
                  <p className="text-sm font-bold text-white tracking-tight truncate group-hover:text-[#BD53F4] transition-colors">
                    {item.english}
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-mono text-gray-600 block">
                    {item.timestamp}
                  </span>
                  <span className="text-[8px] font-mono text-[#BD53F4]/60 font-black tracking-wider uppercase group-hover:text-[#BD53F4] transition-colors block">
                    REPLAY →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
