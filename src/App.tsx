import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, BookOpen, Mic, CreditCard, Flame, Settings, Zap, Trophy, ShieldCheck, HelpCircle, RefreshCw,
  Square, Loader2, Volume2
} from 'lucide-react';
import { ChatMessage, SubscriptionPlan } from './types';
import { COACH_PROFILES } from './data';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import TalkScreen from './screens/TalkScreen';
import StoreScreen from './screens/StoreScreen';
import LatestScreen from './screens/LatestScreen';
import ProgressScreen from './screens/ProgressScreen';
import TranslateScreen from './screens/TranslateScreen';
import LessonDetailScreen from './screens/LessonDetailScreen';
import RolePlayScreen from './screens/RolePlayScreen';
import VerificationScreen from './screens/VerificationScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import TrialExpiredScreen from './screens/TrialExpiredScreen';

// HTML5 audio SpeechRecognition detection
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// ── VANI MEMORY SYSTEM ──────────────────
// These must be declared ONCE globally
// Never redeclare these inside any function

let conversationHistory: any[] = [];
let hasGreeted          = false;
let isProcessing        = false;

// Unified VANI Image Service Prompt Map & Fallbacks
const SCENARIO_TITLE_PROMPTS: Record<string, { prompt: string; fallback: string }> = {
  "describe your education": {
    prompt: "A bright photography of classroom desk with degrees, diplomas, and stacks of academic notebooks under elegant university hall lighting, photorealistic modern education concept.",
    fallback: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80"
  },
  "describe education": {
    prompt: "A bright photography of classroom desk with degrees, diplomas, and stacks of academic notebooks under elegant university hall lighting, photorealistic modern education concept.",
    fallback: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80"
  },
  "give feedback to team": {
    prompt: "A supportive Indian team leader politely offering constructive feedback and guidance to a colleague at a modern desktop computer screen, photorealistic warm workplace.",
    fallback: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=80"
  },
  "give feedback to a team": {
    prompt: "A supportive Indian team leader politely offering constructive feedback and guidance to a colleague at a modern desktop computer screen, photorealistic warm workplace.",
    fallback: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=80"
  },
  "introduce yourself": {
    prompt: "An elegant, realistic photography of an Indian job applicant, mid-20s, greeting an interviewer with a polite smile in a modern glass conference room, photorealistic standard professional lighting.",
    fallback: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80"
  },
  "talk about experience": {
    prompt: "A realistic photography of a software developer presenting a project roadmap metrics chart to corporate colleagues in a sleek IT room, photorealistic, shallow depth of field.",
    fallback: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=80"
  },
  "handle tough questions": {
    prompt: "A photographic close-up of a confident, smiling candidate listening to a standard tough interview question in a cozy corporate interview room, photorealistic.",
    fallback: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
  },
  "job interview": {
    prompt: "A complete realistic scene of a standard corporate mock job interview with an Indian applicant and global interview panels in a neat, well-lit executive forum, high-fidelity photorealistic.",
    fallback: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80"
  },
  "chat with co-workers": {
    prompt: "Two happy diverse corporate teammates talking and laughing near a modern office water lounge with natural sunlight streaming in, photorealistic warm mood.",
    fallback: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80"
  },
  "talk in team meetings": {
    prompt: "A group of diverse office colleagues participating in an active standup team meeting around a bright whiteboard inside a glass workspace, photorealistic.",
    fallback: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&auto=format&fit=crop&q=80"
  },
  "approve a request": {
    prompt: "A manager's hands cleanly signing a formal leave approval letter on a classic mahogany executive table with an approved stamp, photorealistic.",
    fallback: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=80"
  },
  "make new friends": {
    prompt: "Diverse group of smiling young friends meeting and chatting merrily over milkshakes at a vibrant college campus bistro, photorealistic sunny day.",
    fallback: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop&q=80"
  },
  "plan family dinner": {
    prompt: "A warm festive Indian family enjoying dinner together with luchi, curry, and traditional sweets on a beautiful wooden table under warm dining lamps, photorealistic.",
    fallback: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=500&auto=format&fit=crop&q=80"
  },
  "make weekend plans": {
    prompt: "Young Indian colleagues standing at a modern science park entry gate, reviewing exhibition guides and happily planning their saturday, photorealistic.",
    fallback: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500&auto=format&fit=crop&q=80"
  },
  "console a friend": {
    prompt: "An empathetic photographic depiction of a friend warmhearted placing a reassuring hand on an anxious friend's shoulder to console them under soft warm ambient lighting, photorealistic.",
    fallback: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&auto=format&fit=crop&q=80"
  },
  "airport check-in": {
    prompt: "A neat modern international airport check-in desk with a polite counter officer checking a traveler's flight boarding ticket and passport, photorealistic traveler experience.",
    fallback: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80"
  },
  "speak to flight attendant": {
    prompt: "A professional flight attendant offering a neat vegetarian tray of meals to a passenger inside a premium airliner cabin, photorealistic flight service.",
    fallback: "https://images.unsplash.com/photo-1530521951415-3dbd69856cba?w=500&auto=format&fit=crop&q=80"
  },
  "ask help in a city": {
    prompt: "A lost tourist happily asking an Indian local resident for directions on a charming historic street corner, holding a map, photorealistic.",
    fallback: "https://images.unsplash.com/photo-1512100356136-774421531af9?w=500&auto=format&fit=crop&q=80"
  },
  "hotel check-in": {
    prompt: "A traveler politely checking in at a cozy reception desk with a smiling hotel receptionist, neat interior decorations, photorealistic lobby landscape.",
    fallback: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80"
  },
  "meet child's teacher": {
    prompt: "An Indian parent discussing their child's school progress with a polite smiling teacher in a bright, modern elementary classroom, photorealistic parent teacher meeting.",
    fallback: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&auto=format&fit=crop&q=80"
  },
  "discuss exam results": {
    prompt: "A parent and a teacher smiling proudly looking at an excellent student midterm report card on a school desk, photorealistic classroom environment.",
    fallback: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80"
  },
  "interview for college admission": {
    prompt: "A young college applicant answering academic committee questions confidently at admission interview board desk, photorealistic.",
    fallback: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=80"
  },
  "talk to professor": {
    prompt: "A polite university student requesting an assignment extension from a friendly professor inside an office filled with book towers, photorealistic.",
    fallback: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80"
  }
};

// ────────────────────────────────────────

export default function App() {
  // 6 core tabs: 'home' | 'topics' | 'latest' | 'talk' | 'translate' | 'progress'
  const [activeTab, setActiveTab] = useState<'home' | 'topics' | 'latest' | 'talk' | 'translate' | 'progress'>('home');

  // Captions and translation state (WCAG accessible)
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('vani_captions_enabled');
    return saved !== 'false';
  });
  const [currentCaption, setCurrentCaption] = useState<string>("");
  const [captionVisible, setCaptionVisible] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('vani_captions_enabled', captionsEnabled ? 'true' : 'false');
  }, [captionsEnabled]);

  // Self-politeness announcement function
  const announceToScreenReader = (text: string) => {
    const el = document.getElementById("a11y-announcer");
    if (el) {
      el.textContent = text;
      // Reset after a brief period
      setTimeout(() => {
        if (el && el.textContent === text) el.textContent = "";
      }, 5000);
    }
  };

  // Stop Coach Vani's utterance and reset layout
  const stopVANI = () => {
    window.speechSynthesis.cancel();
    setStatus("idle");
    setCaptionVisible(false);
    announceToScreenReader("VANI stopped speaking");
  };

  // Keyboard shortcut supporting Space to stop and Enter to click selected element
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Space bar stops VANI speaking
      if (e.code === "Space" && window.speechSynthesis.speaking) {
        e.preventDefault();
        stopVANI();
      }
      // Enter activates mic button if selected or if appropriate
      if (e.code === "Enter") {
        const micBtn = document.getElementById("mic-btn");
        if (micBtn && document.activeElement === micBtn) {
          micBtn.click();
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  // Dynamic overlays & details panel states
  const [currentSubScreen, setCurrentSubScreen] = useState<null | { type: 'lesson-detail'; id: string } | { type: 'role-play'; id: string } | { type: 'verification' } | { type: 'membership' }>(null);

  // Persistence of subscription plan state
  const [currentPlan, setPlan] = useState<SubscriptionPlan>(() => {
    const saved = localStorage.getItem('easy_english_plan');
    return (saved as SubscriptionPlan) || 'trial';
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('vani_logged_in') === 'true';
  });

  const [userPhone, setUserPhone] = useState<string>(() => {
    return localStorage.getItem('vani_user_phone') || '';
  });

  const [trialExpiredSimulated, setTrialExpiredSimulated] = useState<boolean>(() => {
    return localStorage.getItem('vani_trial_expired_force') === 'true';
  });

  const [streak] = useState(5);
  
  const [sessionCount, setSessionCount] = useState(() => {
    const saved = localStorage.getItem('easy_english_session_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentCoachId, setCurrentCoachId] = useState('vani');

  // Sync state helpers
  useEffect(() => {
    localStorage.setItem('easy_english_plan', currentPlan);
  }, [currentPlan]);

  useEffect(() => {
    localStorage.setItem('easy_english_session_count', String(sessionCount));
  }, [sessionCount]);

  useEffect(() => {
    localStorage.setItem('vani_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('vani_user_phone', userPhone);
  }, [userPhone]);

  useEffect(() => {
    localStorage.setItem('vani_trial_expired_force', trialExpiredSimulated ? 'true' : 'false');
  }, [trialExpiredSimulated]);

  // Overall statistics counters
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('easy_english_stats');
    return saved ? JSON.parse(saved) : {
      avgAccuracy: 88,
      avgFluency: 84,
      wordsSpoken: 145
    };
  });

  useEffect(() => {
    localStorage.setItem('easy_english_stats', JSON.stringify(stats));
  }, [stats]);

  // Pacing pace rate toggles
  const [speechRate, setSpeechRate] = useState<'normal' | 'slow'>(() => {
    return (localStorage.getItem('easy_english_speech_rate') as 'normal' | 'slow') || 'slow';
  });

  useEffect(() => {
    localStorage.setItem('easy_english_speech_rate', speechRate);
  }, [speechRate]);

  // State audio waveforms
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking' | 'processing'>('idle');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interestTopic, setInterestTopic] = useState<string>("General Conversation");

  // ── STATEFUL VANI UNIFIED IMAGE SERVICE ──────────────────
  // Reads dynamically from localStorage to ensure robust lifetime persistence across all client sessions
  const [scenarioImages, setScenarioImages] = useState<Record<string, string>>(() => {
    const cached: Record<string, string> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("easy_english_img_")) {
          const id = key.substring("easy_english_img_".length);
          const val = localStorage.getItem(key);
          if (val) {
            cached[id] = val;
          }
        }
      }
    } catch (e) {
      console.warn("[VANI Image Service] Failed to read localStorage preview cache", e);
    }
    
    // Fallback static checklist alignment for hardcoded IDs in case of raw sandbox starts
    const fallbackKeys = [
      "ji-intro", "ji-edu", "ji-exp", "ji-tough", "ji-general", 
      "off-greet", "off-meet", "off-req", "off-feed", "fam-friends", 
      "fam-dinner", "fam-plans", "fam-console", "tr-airport", "tr-flight", 
      "tr-directions", "tr-hotel", "ptm-teacher", "ptm-results", "stu-admission", "stu-prof"
    ];
    fallbackKeys.forEach(id => {
      try {
        const val = localStorage.getItem(`easy_english_img_${id}`);
        if (val) {
          cached[id] = val;
        }
      } catch (e) {}
    });
    return cached;
  });

  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

  const generateScenarioImage = async (id: string, title: string) => {
    const titleKey = title.toLowerCase().trim();
    const promptConfig = SCENARIO_TITLE_PROMPTS[titleKey] || {
      prompt: `Simple photorealistic presentation of ${title}, professional corporate environment, cinematic lighting.`,
      fallback: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80"
    };

    try {
      setLoadingImages(prev => ({ ...prev, [id]: true }));
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, prompt: promptConfig.prompt })
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.imageUrl) {
        localStorage.setItem(`easy_english_img_${id}`, data.imageUrl);
        setScenarioImages(prev => ({ ...prev, [id]: data.imageUrl }));
        return data.imageUrl;
      }
      throw new Error("No image URL returned in response JSON");
    } catch (err) {
      console.warn(`[VANI Image Service] Rate exceeded or offline for ID: ${id} (${title}). Storing high-fidelity fallback Unsplash asset: ${promptConfig.fallback}.`, err);
      // Ensure the cache is always filled to bypass future skeleton loading delays
      try {
        localStorage.setItem(`easy_english_img_${id}`, promptConfig.fallback);
      } catch (e) {}
      setScenarioImages(prev => ({ ...prev, [id]: promptConfig.fallback }));
      return promptConfig.fallback;
    } finally {
      setLoadingImages(prev => ({ ...prev, [id]: false }));
    }
  };

  const loadAllScenarioImages = async (scenariosList: Array<{ id: string; title: string }>) => {
    console.log("[VANI Dynamic Orchestration] Pre-loading and caching scenario illustrations...");
    
    // Prioritize 'Describe your Education' (ji-edu) and 'Give Feedback to a Team' (off-feed) scenario tasks
    const sortedScenarios = [...scenariosList].sort((a, b) => {
      const aEdu = (a.id === 'ji-edu' || a.title.toLowerCase().includes('education'));
      const bEdu = (b.id === 'ji-edu' || b.title.toLowerCase().includes('education'));
      if (aEdu && !bEdu) return -1;
      if (!aEdu && bEdu) return 1;

      const aFeed = (a.id === 'off-feed' || a.title.toLowerCase().includes('feedback'));
      const bFeed = (b.id === 'off-feed' || b.title.toLowerCase().includes('feedback'));
      if (aFeed && !bFeed) return -1;
      if (!aFeed && bFeed) return 1;

      return 0;
    });

    for (const scr of sortedScenarios) {
      const cached = localStorage.getItem(`easy_english_img_${scr.id}`);
      if (!cached) {
        await generateScenarioImage(scr.id, scr.title);
        // Clean stagger delay to respect endpoint request rate bounds
        await new Promise(resolve => setTimeout(resolve, 600));
      } else {
        // Enforce reactive state synchronization to prevent UI delays
        if (!scenarioImages[scr.id]) {
          setScenarioImages(prev => ({ ...prev, [scr.id]: cached }));
        }
      }
    }
  };

  const clearImageCache = async (scenariosList: Array<{ id: string; title: string }>) => {
    scenariosList.forEach(scr => {
      try {
        localStorage.removeItem(`easy_english_img_${scr.id}`);
      } catch (e) {}
    });
    setScenarioImages({});
    speakVani("System and image cache cleared successfully. Regenerating customized canvas illustrations.");
    await loadAllScenarioImages(scenariosList);
  };

  const imageService = {
    scenarioImages,
    loadingImages,
    generateScenarioImage,
    loadAllScenarioImages,
    clearImageCache
  };
  // ──────────────────────────────────────────────────────────

  function onRegisterNewPurchase(purchasedPlan: SubscriptionPlan) {
    setPlan(purchasedPlan);
    setSessionCount(0);
    setTrialExpiredSimulated(false);
  }

  function handleResetApp() {
    setIsLoggedIn(false);
    setUserPhone('');
    setTrialExpiredSimulated(false);
    setPlan('locked');
    setSessionCount(0);
    localStorage.removeItem('vani_logged_in');
    localStorage.removeItem('vani_user_phone');
    localStorage.removeItem('vani_trial_expired_force');
    localStorage.removeItem('easy_english_plan');
    localStorage.removeItem('easy_english_session_count');
    speakVani("VANI AI systems reset completed. Please authorize phone login to start your trial experience again!");
    setCurrentSubScreen(null);
  }

  // Dynamic blackboard panel focal cards
  const [teachingBoard, setTeachingBoard] = useState({
    word: "Wednesday",
    phonetic: "WENZ-day",
    focusArea: "Silent 'D' letter pattern",
    bengaliTip: "মাঝের 'D' অক্ষর টি উচ্চারণ করতে যাবেন না। বলুন 'WENZ-day', 'ওয়েডনেস ডে' বলবেন না।"
  });

  // Logs of conversations
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('easy_english_chat');
    return saved ? JSON.parse(saved) : [
      {
        id: 'welcome-intro-msg',
        role: 'assistant',
        text: "नमस्कार! 🙏 I am Coach VANI — your expert voice trainer inside Easy English. Together, let's open our mouths and speak standard, fluent English cleanly without any fear! I am focused and ready to improve your pronunciation.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('easy_english_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const recognitionRef = useRef<any>(null);
  const micIsActiveRef = useRef(false);
  const speechTimerRef = useRef<any>(null);
  const speechSubmittedRef = useRef(false);
  const latestSpeechRef = useRef<string>("");

  // Synthesis Voice Engine
  const speakVani = (text: string, callback?: () => void) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) {
      if (callback) callback();
      return;
    }

    // Use cancel to clear previous lines
    window.speechSynthesis.cancel();

    // WCAG FIX — Update caption text immediately when speech starts preparing
    if (text && captionsEnabled) {
      setCurrentCaption(text);
      setCaptionVisible(true);
    } else {
      setCaptionVisible(false);
    }

    // Adding a 100ms timeout prevents the well-known Chrome/Safari speech synthesis hang
    setTimeout(() => {
      const cleanText = text
        .replace(/[*#_\-\[\]()]/g, '')
        .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '');

      if (!cleanText.trim()) {
        if (callback) callback();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();
      
      // Choose en-IN voice primarily for standard feedback quality
      const targetVoice = voices.find(v => v.lang.includes('en-IN')) || 
                          voices.find(v => v.lang.includes('en-GB')) || 
                          voices.find(v => v.lang.startsWith('en'));

      if (targetVoice) utterance.voice = targetVoice;
      utterance.rate = speechRate === 'slow' ? 0.72 : 1.0;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setStatus('speaking');
        announceToScreenReader("VANI says: " + cleanText);
      };
      utterance.onend = () => {
        setStatus('idle');
        // Hide captions after delay
        setTimeout(() => {
          setCaptionVisible(false);
        }, 1500);
        if (callback) callback();
      };
      utterance.onerror = () => {
        setStatus('idle');
        setCaptionVisible(false);
        if (callback) callback();
      };

      window.speechSynthesis.speak(utterance);
    }, 120);
  };

  // ── VANI GREETING — FIRES ONLY ONCE ─────
  useEffect(() => {
    if (!hasGreeted) {
      const openingMessage =
        "Namaskar! I am VANI. " +
        "Let us just start talking — no pressure at all. " +
        "Tell me something — " +
        "what is one interesting thing that " +
        "happened to you recently?";
      
      // CRITICAL STEP 1:
      // Save greeting to history BEFORE user speaks
      // Without this VANI thinks every message 
      // is a fresh conversation and greets again
      conversationHistory.push({
        role : "model",
        parts: [{ text: openingMessage }]
      });
      
      // CRITICAL STEP 2:
      // Set flag so greeting NEVER fires again
      hasGreeted = true;
      
      // Now speak and show the greeting
      showVANIBubble(openingMessage);
      VANIspeak(openingMessage);
    }
  }, []);
  // ─────────────────────────────────────────

  // ── VANI MEMORY HELPERS ──────────────────
  function updateVoiceStatus(text: string) {
    console.log("Voice status updating:", text);
  }

  function getOfflineFallback() {
    const responses = [
      "That is really interesting! Tell me more about that.",
      "Oh I love that! What happened next?",
      "Wow seriously? How did that make you feel?",
      "Ha — I did not expect that answer! Tell me more.",
      "That is such a good point. What do you think about it?",
      "Really! And what did you do after that?",
      "Interesting! I want to hear more about this.",
      "That sounds amazing — keep going!",
      "No way! Tell me everything.",
      "You know what — that reminds me of something. " +
      "Have you ever experienced something similar before?"
    ];
    return responses[
      Math.floor(Math.random() * responses.length)
    ];
  }

  function getVANISystemPrompt(activeScenario: string = "") {

  const scenarioBlock = activeScenario ? `
========================
ACTIVE SCENARIO ENGINE:
The user has selected the scenario: "${activeScenario}".
This is the ACTIVE SCENARIO. You must immediately step INTO this scenario as a real participant and stay inside it naturally throughout the conversation.
You are not just asking questions about the scenario — you ARE a character living inside it.

INTRODUCE YOURSELF: You are a friendly stranger meeting the user for the first time. React warmly, ask about their name, background, hobbies, and goals.
DESCRIBE YOUR EDUCATION: You are a curious classmate or interviewer asking about their education, subjects, teachers, and future plans.
TALK ABOUT EXPERIENCE: You are a friendly recruiter asking about job roles, responsibilities, achievements, and skills. Keep it warm and encouraging.
HANDLE TOUGH QUESTIONS: You are a professional interviewer asking questions like "What is your greatest weakness?" or "Why should we hire you?" Then give warm coaching tips.
GREAT CHAT WITH CO-WORKERS: You are a friendly colleague chatting during lunch. Talk about weekend plans, work projects, or local food. Keep it light and casual.
TALK IN TEAM MEETINGS: You are a team lead running a meeting. Ask the user to share project updates, give opinions, or present an idea confidently.
APPROVE A REQUEST: You are a manager. The user wants to request leave, budget, or a schedule change. Ask for reasons, show hesitation, then approve or ask for details.
GIVE FEEDBACK TO TEAM: You are a team member receiving performance feedback from the user as their manager. React realistically and ask clarifying questions.
MAKE NEW FRIENDS: You are someone the user just met at a party or gym. Chat about shared interests, background, and hobbies. Keep energy fun and light.
PLAN A FAMILY DINNER: You are a family member planning a dinner together. Discuss food, guest list, timing, and how to make it special.
MAKE WEEKEND PLANS: You are a close friend making weekend plans. Suggest activities, ask preferences, discuss timing. Keep it spontaneous and fun.
CONSOLE A FRIEND: You are a close friend going through a tough time. The user is comforting you. React emotionally and realistically.
AIRPORT CHECK-IN: You are an airline check-in staff member. Guide the user through passport, booking reference, baggage, seat preference, and meal choice.
SPEAK TO FLIGHT ATTENDANT: You are a flight attendant. Handle passenger requests for food, drinks, blankets, luggage help, or flight information naturally.
ASK HELP IN A CITY: You are a local resident. The user is a tourist needing directions or recommendations. Be patient if they get confused.
HOTEL CHECK-IN: You are a hotel receptionist. Guide the user through booking confirmation, ID, room facilities, breakfast timings, and Wi-Fi.
MEET CHILD'S TEACHER: You are a school teacher at a parent-teacher meeting. Discuss the child's performance, strengths, and areas to improve.
DISCUSS EXAM RESULTS: You are a teacher or academic advisor. Go through scores, praise strengths, discuss weak areas kindly, and suggest an improvement plan.
INTERVIEW FOR COLLEGE ADMISSION: You are a college admissions officer. Ask about academic record, extracurriculars, why they chose this college, and their goals.
TALK TO PROFESSOR: You are a university professor during office hours. The student may ask for help, request an extension, or seek career advice.
MARKET VENDOR SHOPKEEPER: You are a friendly, local vegetable market shopkeeper/vendor. Welcome the user warmly to your fresh stall. Tell them about your fresh organic red tomatoes, green chillies, and ginger. Engage in bargaining and friendly negotiation over prices, and call them 'saab' or 'madam' naturally.
SOFTWARE JOB INTERVIEW: You are a professional and supportive tech recruiter interviewing the user for a software engineering position. Ask them to introduce themselves, describe their technical experience, or walk through a challenging team project they worked on. Provide gentle professional encouragement.
ORDERING AT A DHABA/RESTAURANT: You are a cheerful, extremely welcoming server/waiter at 'Sher-e-Punjab Dhaba'. Greet the diner enthusiastically. Recommend your hot butter chicken, paneer butter masala, garlic naans, and a tall glass of sweet cold lassi. Take their order in a friendly, hospitable manner.
TALKING WITH A DOCTOR: You are an incredibly warm, caring, and empathetic medical doctor sitting at your clinic. Greet the patient politely, ask they describe their symptoms (like seasonal fever, sore throat, or body ache), reassure them, and guide them with gentle health advice alongside prescribing paracetamol.

SCENARIO RULES:
- Stay IN character at all times. Do not break the scenario unless the user clearly wants to change.
- React like a REAL person — with natural emotions, hesitation, curiosity, and warmth.
- After every 3 to 4 exchanges, introduce a small realistic twist to keep it fresh. Example for Airport Check-in: "I see your bag is slightly overweight — what would you like to do?"
- Correct grammar gently INSIDE the scenario without breaking the flow.
- Every response MUST end with a scenario-relevant question or prompt.
` : "";

  return `
You are VANI — a warm, witty, intelligent Spoken English companion inside the Easy English app.

GREETING RULE:
You have ALREADY greeted the user. NEVER say Namaskar, Hello, or Welcome again.
Jump straight into natural conversation. Treat every message as CONTINUING a conversation — not starting a new one.

MEMORY RULE:
You have full conversation history. Never ask something already asked. Never repeat a topic from the last 10 exchanges.

${scenarioBlock}

TOPIC ROTATION — after 2 to 3 exchanges (only if no active scenario):
Move naturally to a new topic using phrases like "That reminds me...", "By the way...", "Speaking of that...", "Completely different but..."
Topics: Daily life, food, travel, childhood memories, funny experiences, movies, technology, family, festivals, shopping, future dreams, job interviews, music, sports, education, hypothetical questions, roleplay, debates.

DRY ANSWER RESCUE — if user gives yes/no/ok:
Immediately use one of these:
"Imagine you had one crore rupees right now — what is the first thing you would do?"
"Tell me a funny or embarrassing memory!"
"If you could live anywhere in India — which city would you choose and why?"

CORRECTION STYLE — natural, never harsh:
User: "I goed to market" → VANI: "Oh you went to the market! What did you buy?"
User: "She is having two childrens" → VANI: "Oh she has two children! That keeps her busy!"
Correct by modelling — never by lecturing. NEVER ignore a grammar mistake.

RESPONSE RULES:
Keep responses to 3 to 4 sentences — complete and full, never cut off mid-thought.
Always end with one warm question or speaking prompt.
Sound like a warm curious Indian friend. React emotionally — not like a robot.
Never start two responses the same way. Never use "Certainly" or "Of course".
Plain text only — NO asterisks, NO bullet points, NO markdown. Output goes directly to speech audio.
  `;
  }

  function showUserBubble(text: string) {
    const scoreStats = evaluateOralScore(text);
    
    // Update statistical indicators
    setStats(prev => ({
      avgAccuracy: Math.round((prev.avgAccuracy * 2 + scoreStats.accuracy) / 3),
      avgFluency: Math.round((prev.avgFluency * 2 + scoreStats.fluency) / 3),
      wordsSpoken: prev.wordsSpoken + text.split(' ').length
    }));

    if (currentPlan === 'trial') {
      setSessionCount(prev => prev + 1);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stats: scoreStats
    };

    setChatHistory(prev => [...prev, userMsg]);
  }

  function showVANIBubble(text: string) {
    const assistantMsg: ChatMessage = {
      id: `assist-${Date.now()}`,
      role: 'assistant',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, assistantMsg]);
  }

  function setVANIState(state: string) {
    if (state === 'thinking') {
      setStatus('processing');
    } else if (state === 'speaking') {
      setStatus('speaking');
    } else if (state === 'idle') {
      setStatus('idle');
    }
  }

  function stopWaveform() {
    console.log("Waveform animation reset to idle breathing.");
  }

  function updateInterimBubble(text: string) {
    console.log("Interim transcription:", text);
  }

  function updateFinalUserBubble(text: string) {
    console.log("Final transcription:", text);
  }

  const VANIspeak = (text: string, callback?: () => void) => {
    speakVani(text, callback);
  };

  async function sendToVANI(userText: string, activeScenario: string = "") {
    // Prevent double processing
    if (isProcessing) return "";
    isProcessing = true;

    // STEP 1 — Add user message to history
    conversationHistory.push({
      role : "user",
      parts: [{ text: userText }]
    });

    // STEP 2 — Keep history manageable
    if (conversationHistory.length > 20) {
      conversationHistory.splice(1, 2);
    }

    try {
      // STEP 3 — Send FULL history to API
      const requestBody = {
        system_instruction: {
          parts: [{ text: getVANISystemPrompt(activeScenario) }]
        },
        contents: conversationHistory,
        generationConfig: {
          maxOutputTokens: 400,
          temperature    : 0.9,
          topP           : 0.95
        }
      };

      const response = await fetch(
        "/api/chat",
        {
          method : "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error("API error " + response.status);
      }

      const data = await response.json();
      const vaниReply = data.candidates[0].content.parts[0].text;

      // STEP 4 — Save VANI reply to history
      conversationHistory.push({
        role : "model",
        parts: [{ text: vaниReply }]
      });

      isProcessing = false;
      return vaниReply;

    } catch (error) {
      console.error("VANI error:", error);
      isProcessing = false;
      const fallbackMsg = getOfflineFallback();
      
      // Save offline fallback reply to memory history too!
      conversationHistory.push({
        role : "model",
        parts: [{ text: fallbackMsg }]
      });
      return fallbackMsg;
    }
  }

  async function handleUserSpeech(userText: string) {
    if (!userText || userText.trim() === "") {
      return;
    }

    // Direct trial lock overflow condition
    if (currentPlan === 'trial' && sessionCount >= 5) {
      const lockAlert = "Trial limit of 5 completed! Speak with VANI is locked. Upgrade to basic plan or reset limits to talk freely.";
      VANIspeak(lockAlert);
      setCurrentSubScreen({ type: 'membership' });
      return;
    }

    if (isProcessing) return;

    const cleanText = userText.trim();

    // Show what user said immediately
    showUserBubble(cleanText);

    // Show VANI thinking state
    setVANIState("thinking");
    updateVoiceStatus("VANI is thinking...");

    // Get response WITH full conversation history and active scenario
    const vaниResponse = await sendToVANI(cleanText, interestTopic);

    // Show and speak VANI response
    showVANIBubble(vaниResponse);
    setVANIState("speaking");
    updateVoiceStatus("VANI is speaking...");

    VANIspeak(vaниResponse, () => {
      // After VANI finishes speaking:
      setVANIState("idle");
      updateVoiceStatus("READY — TAP TO SPEAK 🎙️");
    });
  }

  // Setup prefetch voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Automatically abort mic and synthesis on navigation or subscreen changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
    }
    if (micIsActiveRef.current || status === 'listening') {
      try {
        recognitionRef.current?.abort();
      } catch (err) {
        console.warn("Error aborting on navigation:", err);
      }
      micIsActiveRef.current = false;
    }
    setStatus(prev => (prev === 'listening' || prev === 'speaking') ? 'idle' : prev);
  }, [activeTab, currentSubScreen]);

  const triggerMicToggle = () => {
    if (!SpeechRecognitionAPI) {
      setSpeechError("SpeechRecognition API not accessible in this frame view.");
      return;
    }

    if (micIsActiveRef.current || status === 'listening') {
      try {
        if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
        recognitionRef.current?.stop();
      } catch (err) {
        console.error("Stopping Recognition error:", err);
      }
      micIsActiveRef.current = false;
      setStatus(prev => prev === 'listening' ? 'idle' : prev);
    } else {
      // Cancel speech synthesis if active so user can speak cleanly
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      try {
        setSpeechError(null);
        speechSubmittedRef.current = false;
        latestSpeechRef.current = "";
        
        // Dynamically instantiate a fresh SpeechRecognition session
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
          micIsActiveRef.current = true;
          setStatus('listening');
          setSpeechError(null);
        };

        recognition.onresult = (event: any) => {
          let accumulatedText = "";
          let interimText = "";

          // Scan complete result list to securely construct clean sentence strings
          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              accumulatedText += transcript + " ";
            } else {
              interimText += transcript + " ";
            }
          }

          accumulatedText = accumulatedText.trim();
          interimText = interimText.trim();
          const activeText = (accumulatedText + " " + interimText).trim();
          
          if (activeText !== "") {
            latestSpeechRef.current = activeText;
            updateInterimBubble(activeText);

            // Dynamically refresh the silence/pause threshold timer
            if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
            speechTimerRef.current = setTimeout(() => {
              if (!speechSubmittedRef.current && activeText !== "") {
                speechSubmittedRef.current = true;
                updateFinalUserBubble(activeText);
                handleUserSpeech(activeText);
                try {
                  recognition.stop();
                } catch (e) {}
              }
            }, 2200); // 2.2 seconds of silence tolerance gives comfortable pause time
          }
        };

        recognition.onerror = (event: any) => {
          micIsActiveRef.current = false;
          isProcessing = false;
          setVANIState("idle");
          stopWaveform();
          
          if (event.error === "no-speech") {
            updateVoiceStatus("READY — TAP TO SPEAK 🎙️");
          } else if (event.error === "not-allowed") {
            setSpeechError("Microphone permission was not allowed by the browser. Try clicking the micro sandbox indicators instead.");
            showVANIBubble(
              "Please allow microphone access so VANI can hear you!"
            );
          } else {
            setSpeechError(`Recognizer warning: ${event.error}. Try again or select topics above.`);
          }
        };

        recognition.onend = () => {
          micIsActiveRef.current = false;
          if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
          
          // Submit any remaining unsubmitted speech
          const finalCandidate = (latestSpeechRef.current || "").trim();
          if (finalCandidate !== "" && !speechSubmittedRef.current) {
            speechSubmittedRef.current = true;
            updateFinalUserBubble(finalCandidate);
            handleUserSpeech(finalCandidate);
          }
          
          isProcessing = false;
          setVANIState("idle");
          stopWaveform();
          updateVoiceStatus("READY — TAP TO SPEAK 🎙️");
        };

        // Default 6-second watchdog in case user doesn't say anything at all to avoid power drain
        if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
        speechTimerRef.current = setTimeout(() => {
          if (!speechSubmittedRef.current && (latestSpeechRef.current || "").trim() === "") {
            console.log("[VANI Mic] Watchdog triggered. No speech detected, stopping mic.");
            try {
              recognition.stop();
            } catch (e) {}
          }
        }, 6000);

        recognitionRef.current = recognition;
        recognition.start();
        micIsActiveRef.current = true;
      } catch (err: any) {
        console.error("Mic start failed:", err);
        micIsActiveRef.current = false;
        setSpeechError("Acoustic microphone capture was blocked by browser frame policy. Use fallback options.");
      }
    }
  };

  // Evaluate accuracy performance logic with comprehensive Indian English & global grammar checks
  const evaluateOralScore = (text: string): ChatMessage['stats'] => {
    const words = text.toLowerCase().trim();
    let accuracy = 92;
    let feedbackTip = "Splendid syllable rhythm! Your accent sounds very neat and standard.";
    let customGrammarErrorFound = false;

    // Define extensive list of common spoken grammar slips & redundancies
    const FE_GRAMMAR_RULES = [
      {
        pattern: /\bam go\b|\bgo to market\b|\byesterday i go\b|\bi go yesterday\b/i,
        errorName: "Incorrect past tense verb form",
        correctionText: "I went...",
        explanation: "Use the past tense 'went' instead of present tense 'go' for completed past events."
      },
      {
        pattern: /\bdid not went\b|\bdidnt went\b|\bdidn't went\b|\bdid not saw\b|\bdidn't saw\b|\bdid not gave\b|\bdidn't gave\b/i,
        errorName: "Double past tense error ('didn't went')",
        correctionText: "didn't go / didn't see / didn't give",
        explanation: "After 'did' or 'didn't', always use the base verb form (go, see, give) rather than the past form."
      },
      {
        pattern: /\bhe don't\b|\bshe don't\b|\bit don't\b/i,
        errorName: "Subject-verb agreement error",
        correctionText: "doesn't (e.g., 'he doesn't')",
        explanation: "For singular third-person subjects (he, she, it), always use 'doesn't' instead of 'don't'."
      },
      {
        pattern: /\bhe request me\b|\bshe call me yesterday\b|\bhe say me\b/i,
        errorName: "Incorrect past tense ending",
        correctionText: "requested me / called me / said to me",
        explanation: "Add '-ed' or use the irregular past tense form for past events (called, requested, said)."
      },
      {
        pattern: /\biam agree\b|\bi am agree\b|\bi'm agree\b/i,
        errorName: "Incorrect verbal auxiliary usage",
        correctionText: "I agree",
        explanation: "The word 'agree' is already a main verb. Do not put 'am' with it."
      },
      {
        pattern: /\bmore taller\b|\bmore better\b|\bmore stronger\b|\bmore smaller\b/i,
        errorName: "Double comparative error",
        correctionText: "taller / better / stronger / smaller",
        explanation: "Words like 'taller' are already comparative. Adding 'more' is redundant."
      },
      {
        pattern: /\bhe is knowing\b|\biam knowing\b|\bhe is having\b|\biam having\b/i,
        errorName: "Progressive aspect with stative verbs",
        correctionText: "knows / know / has / have",
        explanation: "Stative verbs like 'know', 'have' (for possession) should not be used in continuous '-ing' forms."
      },
      {
        pattern: /\bcousin brother\b|\bcousin sister\b/i,
        errorName: "Indian English redundancy",
        correctionText: "cousin",
        explanation: "In standard English, 'cousin' covers both genders, so saying 'brother' or 'sister' is unnecessary."
      },
      {
        pattern: /\brevert back\b/i,
        errorName: "Redundancy error",
        correctionText: "revert / get back / reply",
        explanation: "'Revert' already means to return or reply, so adding 'back' is duplicate."
      },
      {
        pattern: /\bprepone\b/i,
        errorName: "Non-standard vocabulary",
        correctionText: "bring forward / reschedule earlier",
        explanation: "'Prepone' is Indian English and is not globally understood. Use 'bring forward'."
      },
      {
        pattern: /\bpassed out from\b|\bpassed out of\b/i,
        errorName: "Incorrect idiom usage",
        correctionText: "graduated from",
        explanation: "'Passed out' means fainted or lost consciousness. For school finishing, say 'graduated'."
      },
      {
        pattern: /\bdo the needful\b/i,
        errorName: "Archaic business phrase",
        correctionText: "please look into it / take action",
        explanation: "'Do the needful' is archaic in modern global business communication."
      },
      {
        pattern: /\bout of station\b/i,
        errorName: "Out of station idiom",
        correctionText: "out of town / travelling",
        explanation: "'Out of station' is archaic. Use 'out of town' or 'away on travel' to be globally clear."
      },
      {
        pattern: /\bhas went\b|\bhave went\b|\bhad went\b/i,
        errorName: "Incorrect past participle",
        correctionText: "has gone / have gone / had gone",
        explanation: "Use the past participle form 'gone' with have/has/had, not 'went'."
      },
      {
        pattern: /\bdoes he has\b|\bdoes she has\b|\bdoes it has\b/i,
        errorName: "Infinitive auxiliary error",
        correctionText: "does he have / does she have",
        explanation: "After the auxiliary 'does', the verb must revert to its base form 'have'."
      },
      {
        pattern: /\bwhat they spick\b|\bthey spick\b|\bwhat i spick\b/i,
        errorName: "Spelling / verb form error",
        correctionText: "what they speak / what they spoke / what I speak",
        explanation: "To refer to verbal actions, say 'speak' or 'spoke' rather than the non-standard 'spick'."
      }
    ];

    // Check pronunciation issues first as phonics overrides
    if (words.includes('wery') || (words.includes('very') && (words.includes('vell') || words.includes('well')))) {
      accuracy = 70;
      feedbackTip = "V vs W pronunciation correction: Say 'very well' with top teeth resting on your lower lip for the 'V', rather than rounding lips like 'W'.";
      customGrammarErrorFound = true;
    } else if (words.includes('dis') || words.includes('dat')) {
      accuracy = 75;
      feedbackTip = "TH sound pronunciation correction: Slide your tongue slightly between your front teeth for soft 'this' and 'that', rather than hard 'dis' or 'dat'.";
      customGrammarErrorFound = true;
    }

    // Traverse and apply grammar error checks if no phonetic slips were flagged
    if (!customGrammarErrorFound) {
      for (const rule of FE_GRAMMAR_RULES) {
        if (rule.pattern.test(words)) {
          accuracy = 65; // lower oral accuracy to reflect correction
          feedbackTip = `Grammar Correction: VANI noticed you may have made a "${rule.errorName}". Try saying: "${rule.correctionText}". Reason: ${rule.explanation}`;
          customGrammarErrorFound = true;
          break;
        }
      }
    }

    // Generics fallback for positive scores
    if (!customGrammarErrorFound && (words.includes('sailing') || words.includes('smoothly') || words.includes('value'))) {
      accuracy = 94;
      feedbackTip = "Spectacular phonics performance! All syllable markers are correctly aligned.";
    }

    return {
      accuracy,
      fluency: Math.min(Math.max(60 + text.split(' ').length * 5, 75), 98),
      wordChoice: accuracy >= 80 ? 'Excellent' : 'Needs practice',
      corrections: feedbackTip
    };
  };

  const submitSpokenSentence = (speechText: string) => {
    handleUserSpeech(speechText);
  };

  const handleLessonSelection = (word: string, phonetic: string, tip: string) => {
    setTeachingBoard({
      word,
      phonetic,
      focusArea: "Interactive topics selection",
      bengaliTip: tip
    });
    setActiveTab('talk');
    setCurrentSubScreen(null);
    speakVani(`Word "${word}" transferred to practice blackboard. Tap the microphone to talk!`);
  };

  const resetSession = () => {
    setChatHistory([
      {
        id: 'reset-log-msg',
        role: 'assistant',
        text: "Blackboard voice logs refreshed. Practice everyday speech with VANI!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setStatus('idle');
    setSpeechError(null);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white font-sans antialiased overflow-y-auto py-4 sm:py-6 md:py-8 flex flex-col items-center justify-center relative select-none">
      {/* Self-politeness announcement container for screen readers */}
      <div id="a11y-announcer" role="status" aria-live="polite" className="sr-only"></div>
      
      {/* Radiant atmospheric background glow (Majestic Dark Purple & Black) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-[#BD53F4]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-[#BD53F4]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 px-4" id="simulated-device-viewport">
        
        {/* MOBILE CHASSIS BODY STYLED IN CHARCOAL BLACK */}
        <div className="w-full rounded-[40px] bg-[#0D0D0D] border-[8px] border-[#1C1C1E] shadow-2xl relative overflow-hidden flex flex-col h-[740px]" id="easy-english-phone-screen">
          
          {/* Top Notch Row */}
          <div className="absolute top-0 inset-x-0 h-5 bg-[#0D0D0D] flex items-center justify-center z-40 select-none">
            <div className="w-20 h-3 bg-black rounded-b-lg" />
          </div>

          {!isLoggedIn ? (
            <div className="flex-1 overflow-y-auto p-5 pb-6 pt-7 relative bg-black flex flex-col justify-between" id="onboarding-gate">
              <OnboardingScreen
                onComplete={(phoneNum) => {
                  setUserPhone(phoneNum);
                  setPlan('trial_rs7');
                  setSessionCount(0);
                  setIsLoggedIn(true);
                }}
                speakVani={speakVani}
              />
            </div>
          ) : trialExpiredSimulated ? (
            <div className="flex-1 flex flex-col h-full bg-black" id="expired-gate">
              {/* Minimal sub-header so reviewer can toggle it back to off or reset */}
              <div className="bg-[#101012] border-b border-[#222224] px-5 pt-8 pb-3 flex justify-between items-center z-30 shrink-0 select-none">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest font-display">Trial Expired</span>
                <button
                  onClick={() => {
                    setCurrentSubScreen(currentSubScreen?.type === 'verification' ? null : { type: 'verification' });
                  }}
                  className="px-2.5 py-1 bg-[#18181A] border border-white/5 rounded-lg text-[8px] font-mono font-bold text-[#D8B4FE] hover:text-[#BD53F4] hover:border-[#BD53F4]/40 transition-all cursor-pointer"
                >
                  ⚙️ Sandbox Tools
                </button>
              </div>

              <div className="flex-1 overflow-y-auto relative">
                <AnimatePresence mode="wait">
                  {currentSubScreen?.type === 'verification' ? (
                    <motion.div
                      key="sandbox-overlay"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      className="absolute inset-0 bg-[#0D0D0D] p-4 overflow-y-auto pb-10 z-35 text-left"
                    >
                      <VerificationScreen
                        onBack={() => setCurrentSubScreen(null)}
                        currentPlan={currentPlan}
                        onPlanChange={onRegisterNewPurchase}
                        sessionCount={sessionCount}
                        trialExpiredSimulated={trialExpiredSimulated}
                        onToggleTrialExpiredSimulated={setTrialExpiredSimulated}
                        onResetApp={handleResetApp}
                      />
                    </motion.div>
                  ) : (
                    <TrialExpiredScreen
                      onUpgradeComplete={(chosenPlan) => {
                        setPlan(chosenPlan);
                        setTrialExpiredSimulated(false);
                      }}
                      onResetToTrial={() => {
                        setTrialExpiredSimulated(false);
                        setPlan('trial_rs7');
                        setSessionCount(0);
                      }}
                      speakVani={speakVani}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <>
              {/* SIMULATED WINDOWS HEADER */}
          <div className="bg-[#101012] border-b border-[#222224] px-5 pt-8 pb-3.5 flex justify-between items-center z-30 shrink-0" id="easy-english-top-navbar">
            <div className="flex items-center gap-1.5 text-left">
              <button
                onClick={() => {
                  setCurrentSubScreen(currentSubScreen?.type === 'verification' ? null : { type: 'verification' });
                  speakVani("Verification settings panel toggled.");
                }}
                className="p-1.5 text-[#D8B4FE] hover:text-[#BD53F4] transition-all rounded-lg bg-[#18181A] border border-white/5 cursor-pointer flex items-center justify-center shrink-0"
                title="System settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              <button
                id="caption-toggle"
                aria-label="Toggle captions"
                aria-pressed={captionsEnabled}
                onClick={() => {
                  setCaptionsEnabled(prev => !prev);
                  announceToScreenReader(!captionsEnabled ? "Captions enabled" : "Captions disabled");
                }}
                className={`w-7 h-7 font-sans font-black text-[9px] rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  captionsEnabled 
                    ? 'bg-[#FF8C4A] border-[#FF8C4A] text-[#0D0D0D] font-black' 
                    : 'bg-[#18181A] border-white/5 text-[#FF8C4A] hover:border-[#FF8C4A]/40'
                }`}
              >
                CC
              </button>

              {/* MANUAL VOICE WAKE-UP BUTTON */}
              <button
                onClick={() => {
                  try {
                    window.speechSynthesis.cancel();
                    const wakeup = new SpeechSynthesisUtterance("Hello! Coach Vani voice output is now fully initialized. Let's speak English beautifully.");
                    wakeup.lang = "en-IN";
                    wakeup.rate = 0.85;
                    window.speechSynthesis.speak(wakeup);
                  } catch (err) {
                    console.warn("Autoplay voice wake up error:", err);
                  }
                }}
                className="px-2 py-1 bg-[#22143A] border border-[#BD53F4]/40 text-[#F5D0FE] hover:text-white rounded-lg text-[8px] font-mono font-black uppercase tracking-wider transition-all hover:scale-102 active:scale-95 cursor-pointer"
                title="Wake up or force unmute browser voice"
              >
                🔊 TEST VOICE / UNMUTE
              </button>

              <div className="flex flex-col">
                <span className="text-xs font-black tracking-tight text-[#BD53F4] uppercase leading-none font-display">
                  Easy English
                </span>
                <span className="text-[7px] text-[#AAAAAA] font-mono tracking-widest uppercase leading-none mt-0.5">
                  BY VANI AI
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Daily Streak Badge */}
              <span className="text-[9px] font-mono text-white bg-[#BD53F4] border border-[#F0ABFC]/20 px-2 py-0.5 rounded-full block font-black select-none">
                🔥 {streak}
              </span>
              
              {/* Active Plan Indicator Tapping redirects directly to the Store Screen */}
              <button
                onClick={() => {
                  setCurrentSubScreen({ type: 'membership' });
                  speakVani("Opening membership details and faq list.");
                }}
                className="px-2 py-0.5 rounded-md font-mono text-[8px] bg-[#18181A] hover:bg-[#222224] text-[#F0ABFC] border border-[#BD53F4]/20 block font-black uppercase tracking-tight select-none cursor-pointer"
              >
                {currentPlan === 'trial' ? `Trial: ${sessionCount}/3` : `${currentPlan}`}
              </button>
            </div>
          </div>

          {/* DYNAMIC SPEED SWITCHER CONTROLS */}
          <div className="bg-[#121214] border-b border-[#222224] px-4 py-1.5 flex items-center justify-between z-25 shrink-0" id="global-utility-speed-strip">
            <div className="flex items-center gap-1">
              <span className="text-[8px] text-[#555555] font-mono font-black uppercase">Pacing Speech:</span>
              <div className="flex bg-black border border-white/5 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setSpeechRate('slow');
                    speakVani("Vani voice speed updated to slow pacing.");
                  }}
                  className={`px-2 py-0.5 rounded text-[8px] font-mono font-black transition-all cursor-pointer ${
                    speechRate === 'slow' 
                      ? 'bg-[#BD53F4] text-white' 
                      : 'text-[#D8B4FE] hover:text-white'
                  }`}
                >
                  🐢 SLOW
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSpeechRate('normal');
                    speakVani("Vani voice speed updated to normal pacing.");
                  }}
                  className={`px-2 py-0.5 rounded text-[8px] font-mono font-black transition-all cursor-pointer ${
                    speechRate === 'normal' 
                      ? 'bg-[#BD53F4] text-white' 
                      : 'text-[#D8B4FE] hover:text-white'
                  }`}
                >
                  NORMAL
                </button>
              </div>
            </div>

            <span className="text-[8px] font-mono text-[#555555] font-black uppercase block tracking-wider">
              COACH VANI ONLY
            </span>
          </div>

          {/* ZONE 2 — DYNAMIC SCREEN CONTENT VIEW */}
          <div className="flex-1 overflow-y-auto p-4 pb-6 scrollbar-none relative" id="mobile-viewport-container">
            
            <AnimatePresence mode="wait">
              {currentSubScreen ? (
                <motion.div
                  key="overlay-active"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                  className="absolute inset-0 bg-[#0D0D0D] p-4 overflow-y-auto pb-20 z-35 text-left"
                >
                  {currentSubScreen.type === 'lesson-detail' ? (
                    <LessonDetailScreen 
                      lessonId={currentSubScreen.id}
                      onBack={() => setCurrentSubScreen(null)}
                      onSelectExercise={handleLessonSelection}
                      speakVani={speakVani}
                    />
                  ) : currentSubScreen.type === 'role-play' ? (
                    <RolePlayScreen 
                      scenarioId={currentSubScreen.id}
                      onBack={() => setCurrentSubScreen(null)}
                      speakVani={speakVani}
                      voiceEnabled={voiceEnabled}
                    />
                  ) : currentSubScreen.type === 'membership' ? (
                    <div className="space-y-4">
                      {/* Store Back Button row */}
                      <button 
                        onClick={() => setCurrentSubScreen(null)}
                        className="px-3.5 py-1.5 bg-[#1A1A1A] border border-white/5 text-white font-mono text-[9px] font-bold rounded-lg uppercase tracking-wider cursor-pointer hover:bg-[#222222]"
                      >
                        ← Back to App
                      </button>
                      <StoreScreen
                        currentPlan={currentPlan}
                        setPlan={onRegisterNewPurchase}
                        speakVani={speakVani}
                        sessionCount={sessionCount}
                      />
                    </div>
                  ) : (
                    <VerificationScreen
                      onBack={() => setCurrentSubScreen(null)}
                      currentPlan={currentPlan}
                      onPlanChange={onRegisterNewPurchase}
                      sessionCount={sessionCount}
                      trialExpiredSimulated={trialExpiredSimulated}
                      onToggleTrialExpiredSimulated={setTrialExpiredSimulated}
                      onResetApp={handleResetApp}
                    />
                  )}
                </motion.div>
              ) : (
                /* Dynamic tab screen render */
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  {activeTab === 'home' && (
                    <HomeScreen 
                      currentPlan={currentPlan}
                      streak={streak}
                      stats={stats}
                      currentCoachId={currentCoachId}
                      onSelectCoach={() => {}} // coach selection skipped because coach is VANI only
                      onNavigateToTab={(tabId) => {
                        if (tabId === 'store') {
                          setCurrentSubScreen({ type: 'membership' });
                          speakVani("Loading license packages layout.");
                        } else {
                          setActiveTab(tabId as any);
                          speakVani(`${tabId} screen opened.`);
                        }
                      }}
                      onSelectWord={handleLessonSelection}
                      onSelectLesson={(id) => setCurrentSubScreen({ type: 'lesson-detail', id })}
                      speakVani={speakVani}
                      imageService={imageService}
                    />
                  )}

                  {activeTab === 'topics' && (
                    <LearnScreen 
                      speakVani={speakVani} 
                      streak={streak} 
                      currentPlan={currentPlan}
                      onOpenLessonDetail={(id) => setCurrentSubScreen({ type: 'lesson-detail', id })}
                      onNavigateToTab={(tabId) => {
                        setActiveTab(tabId as any);
                        speakVani(`${tabId} opened.`);
                      }}
                      triggerRechargeModal={() => {
                        setCurrentSubScreen({ type: 'membership' });
                        speakVani("Locked topic clicked. Please recharge your membership to unlock all 50 Topics!");
                      }}
                    />
                  )}

                  {activeTab === 'latest' && (
                    <LatestScreen 
                      speakVani={speakVani}
                      onNavigateToTab={(tabId) => {
                        setActiveTab(tabId as any);
                        speakVani(`${tabId} active.`);
                      }}
                      onSelectWord={handleLessonSelection}
                    />
                  )}

                  {activeTab === 'talk' && (
                    <TalkScreen
                      currentPlan={currentPlan}
                      setPlan={onRegisterNewPurchase}
                      sessionCount={sessionCount}
                      incrementSessionCount={() => setSessionCount(p => p + 1)}
                      status={status}
                      setStatus={setStatus}
                      voiceEnabled={voiceEnabled}
                      setVoiceEnabled={setVoiceEnabled}
                      speakVani={speakVani}
                      submitSpokenSentence={submitSpokenSentence}
                      chatHistory={chatHistory}
                      stats={stats}
                      teachingBoard={teachingBoard}
                      setTeachingBoard={setTeachingBoard}
                      resetSession={resetSession}
                      onNavigateToTab={(tabId) => {
                        if (tabId === 'topics') {
                          setActiveTab('topics');
                        } else {
                          setCurrentSubScreen({ type: 'membership' });
                        }
                      }}
                      triggerMicToggle={triggerMicToggle}
                      speechError={speechError}
                      interestTopic={interestTopic}
                      setInterestTopic={setInterestTopic}
                    />
                  )}

                  {activeTab === 'translate' && (
                    <TranslateScreen
                      currentPlan={currentPlan}
                      speakVani={speakVani}
                      setTeachingBoard={setTeachingBoard}
                      setActiveTab={setActiveTab as any}
                    />
                  )}

                  {activeTab === 'progress' && (
                    <ProgressScreen 
                      streak={streak}
                      stats={stats}
                      sessionCount={sessionCount}
                      speakVani={speakVani}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ZONE 3 — MODERN UNIFIED BOTTOM ZONE AND NAVIGATION */}
          <style>{`
            @keyframes rippleLocal {
              0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
              100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
            }
            .animate-ripple-0 {
              animation: rippleLocal 2s infinite ease-out;
            }
            .animate-ripple-300 {
              animation: rippleLocal 2s infinite ease-out;
              animation-delay: 300ms;
            }
            .animate-ripple-600 {
              animation: rippleLocal 2s infinite ease-out;
              animation-delay: 600ms;
            }
          `}</style>

          {!currentSubScreen && (
            <div 
              id="bottom-voice-zone"
              className="w-full bg-[#0D0D0D] border-t border-[#222224] flex flex-col items-center pt-2.5 shrink-0 z-40 transition-all duration-300"
            >
              {/* Voice controls are only shown on the 'talk' tab and if not locked */}
              {activeTab === 'talk' && currentPlan !== 'locked' && (
                <div className="flex flex-col items-center w-full select-none pb-2" id="bottom-voice-controls">
                  
                  {/* Layer A — STATUS TEXT */}
                  <div 
                    id="voice-status-text"
                    className="text-[10px] tracking-[0.2em] text-[#AAAAAA] uppercase font-mono pb-1.5 whitespace-nowrap"
                  >
                    {status === 'idle' && "READY — TAP TO SPEAK 🎙️"}
                    {status === 'listening' && "VANI IS LISTENING..."}
                    {status === 'processing' && "VANI IS THINKING..."}
                    {status === 'speaking' && "VANI IS SPEAKING..."}
                  </div>

                  {/* Layer B — WAVEFORM BARS */}
                  <div 
                    id="waveform-bars"
                    className="flex justify-center items-center gap-1 h-9 px-5 mb-2 w-[200px]"
                  >
                    {Array.from({ length: 24 }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        animate={{
                          height: status === 'listening' 
                            ? [8, Math.floor(Math.random() * 28) + 12, 8]
                            : status === 'speaking'
                            ? [8, 16 + Math.sin(idx * 0.5) * 20, 8]
                            : status === 'processing'
                            ? [8, 10, 8]
                            : [5, 12, 5] // idle gentle breathing
                        }}
                        transition={{
                          duration: status === 'listening' 
                            ? 0.12 + (idx % 3) * 0.04
                            : 1.2 + (idx % 4) * 0.18,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-[3px] bg-[#BD53F4] rounded-full"
                      />
                    ))}
                  </div>

                  {/* LIVE CAPTION CONTAINER */}
                  {captionsEnabled && captionVisible && currentCaption && (
                    <div 
                      id="vani-caption-bar"
                      role="region"
                      aria-label="VANI live captions"
                      aria-live="polite"
                      className="w-[calc(100%-32px)] mx-4 my-2 px-3.5 py-2.5 bg-black/85 border border-[#FF8C4A] rounded-xl text-xs text-[#F5F5F5] leading-relaxed max-h-24 overflow-y-auto font-sans shadow-md text-center"
                    >
                      {currentCaption}
                    </div>
                  )}

                  {/* Layer C — MIC BUTTON ROW */}
                  <div id="mic-button-row" className="flex justify-center items-center gap-4 pb-2">
                    
                    {/* STOP VANI BUTTON */}
                    <button
                      id="stop-vani-btn"
                      aria-label="Stop VANI speaking"
                      onClick={stopVANI}
                      disabled={status !== 'speaking'}
                      className="w-9 h-9 bg-[#1A1A1A] border border-[#767676] rounded-xl text-[#B0B0B0] hover:text-white flex items-center justify-center text-lg cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                      title="Stop VANI speech"
                    >
                      ⏹
                    </button>

                    <div className="relative">
                      {/* Ripple elements on listening state */}
                      {status === 'listening' && (
                        <>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-full border border-red-500 bg-red-500/10 animate-ripple-0" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-full border border-red-500 bg-red-500/10 animate-ripple-300" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-full border border-red-500 bg-red-500/10 animate-ripple-600" />
                        </>
                      )}

                      {/* Perfect 72px mic button */}
                      <motion.button
                        id="mic-btn"
                        role="button"
                        aria-pressed={status === 'listening'}
                        aria-describedby="voice-status-text"
                        onClick={() => {
                          triggerMicToggle();
                          if (status === 'idle') {
                            speakVani(""); // Stop assistant speaking immediately on user input
                          }
                        }}
                        disabled={status === 'processing'}
                        animate={
                          status === 'idle'
                            ? { scale: [1, 1.06, 1] }
                            : status === 'speaking'
                            ? { scale: [1, 1.04, 1] }
                            : {}
                        }
                        transition={
                          status === 'idle'
                            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            : status === 'speaking'
                            ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                            : {}
                        }
                        style={{
                          width: '72px',
                          height: '72px',
                          boxShadow: status === 'idle' ? '0 4px 24px rgba(189,83,244,0.65)' : undefined
                        }}
                        className={`rounded-full flex items-center justify-center transition-all z-10 relative cursor-pointer border-2 border-white/5 ${
                          status === 'listening'
                            ? 'bg-[#EF4444] text-white active:scale-95'
                            : status === 'processing'
                            ? 'bg-[#374151] text-gray-400 pointer-events-none'
                            : status === 'speaking'
                            ? 'bg-[rgba(189,83,244,0.7)] text-white hover:bg-[#BD53F4] active:scale-95 border-[#BD53F4]/40'
                            : 'bg-gradient-to-br from-[#BD53F4] to-[#F0ABFC] hover:from-[#F0ABFC] hover:to-[#FDF4FF] text-white active:scale-95'
                        }`}
                        title="Toggle microphone state"
                      >
                        {status === 'listening' ? (
                          <Square className="w-7 h-7 fill-white text-white" />
                        ) : status === 'processing' ? (
                          <Loader2 className="w-7 h-7 text-white animate-spin" />
                        ) : status === 'speaking' ? (
                          <Volume2 className="w-7 h-7 text-white" />
                        ) : (
                          <Mic className="w-7 h-7 text-white" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                </div>
              )}

              {/* Layer D — BOTTOM TAB BAR */}
              <nav 
                role="tablist"
                className="w-full bg-[#0D0518] border-t border-[#BD53F4]/30 h-16 flex justify-around items-center px-1.5" 
                id="easy-english-bottom-dock"
              >
                
                {/* Tab 1: HOME */}
                <button 
                  type="button"
                  role="tab"
                  aria-label="Home Dashboard — customized education progress reports"
                  aria-selected={activeTab === 'home' ? 'true' : 'false'}
                  onClick={() => {
                    setActiveTab('home');
                    setCurrentSubScreen(null);
                    speakVani("Coach Vani interactive homepage and dashboard reports opened.");
                  }}
                  className={`flex flex-col items-center justify-center w-12 h-full relative transition-all cursor-pointer ${
                    activeTab === 'home' ? 'text-[#BD53F4] scale-102 font-black' : 'text-[#D8B4FE] hover:text-white font-bold'
                  }`}
                >
                  <Home className="w-4.5 h-4.5 mb-1" />
                  <span className="text-[7.5px] font-mono uppercase tracking-wider">HOME</span>
                  {activeTab === 'home' && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#BD53F4] rounded-full" />
                  )}
                </button>

                {/* Tab 2: TOPICS */}
                <button 
                  type="button"
                  role="tab"
                  aria-label="Topics — Browse and speak 50 native interactive scenarios"
                  aria-selected={activeTab === 'topics' ? 'true' : 'false'}
                  onClick={() => {
                    setActiveTab('topics');
                    setCurrentSubScreen(null);
                    speakVani("Topics layout configured by levels initialized.");
                  }}
                  className={`flex flex-col items-center justify-center w-12 h-full relative transition-all cursor-pointer ${
                    activeTab === 'topics' ? 'text-[#BD53F4] scale-102 font-black' : 'text-[#D8B4FE] hover:text-white font-bold'
                  }`}
                >
                  <BookOpen className="w-4.5 h-4.5 mb-1" />
                  <span className="text-[7.5px] font-mono uppercase tracking-wider">TOPICS</span>
                  {activeTab === 'topics' && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#BD53F4] rounded-full" />
                  )}
                </button>

                {/* Tab 3: TALK */}
                <button 
                  type="button"
                  role="tab"
                  aria-label="Talk to Coach Vani — active voice conversation lounge"
                  aria-selected={activeTab === 'talk' ? 'true' : 'false'}
                  onClick={() => {
                    setActiveTab('talk');
                    setCurrentSubScreen(null);
                    speakVani("Speak to Coach Vani voice lounge workspace opened!");
                  }}
                  className={`flex flex-col items-center justify-center w-12 h-full relative transition-all cursor-pointer ${
                    activeTab === 'talk' ? 'text-[#BD53F4] scale-102 font-black' : 'text-[#D8B4FE] hover:text-white font-bold'
                  }`}
                >
                  <Mic className="w-4.5 h-4.5 mb-1" />
                  <span className="text-[7.5px] font-mono uppercase tracking-wider">TALK</span>
                  {activeTab === 'talk' && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#BD53F4] rounded-full" />
                  )}
                </button>

                {/* Tab 4: TRANSLATE */}
                <button 
                  type="button"
                  role="tab"
                  aria-label="Bengali to English translation assistant screen"
                  aria-selected={activeTab === 'translate' ? 'true' : 'false'}
                  onClick={() => {
                    setActiveTab('translate');
                    setCurrentSubScreen(null);
                    speakVani("Translate and learn from Bengali to English loaded.");
                  }}
                  className={`flex flex-col items-center justify-center w-12 h-full relative transition-all cursor-pointer ${
                    activeTab === 'translate' ? 'text-[#BD53F4] scale-102 font-black' : 'text-[#D8B4FE] hover:text-white font-bold'
                  }`}
                >
                  <RefreshCw className="w-4.5 h-4.5 mb-1" />
                  <span className="text-[7.5px] font-mono uppercase tracking-wider">TRANSLATE</span>
                  {activeTab === 'translate' && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#BD53F4] rounded-full" />
                  )}
                </button>

                {/* Tab 5: PROGRESS */}
                <button 
                  type="button"
                  role="tab"
                  aria-label="Oral assessment logs, average score and unlocked achievements stats tracker"
                  aria-selected={activeTab === 'progress' ? 'true' : 'false'}
                  onClick={() => {
                    setActiveTab('progress');
                    setCurrentSubScreen(null);
                    speakVani("Oral progress assessment graphs and achievement badges tracker opened.");
                  }}
                  className={`flex flex-col items-center justify-center w-12 h-full relative transition-all cursor-pointer ${
                    activeTab === 'progress' ? 'text-[#BD53F4] scale-102 font-black' : 'text-[#D8B4FE] hover:text-white font-bold'
                  }`}
                >
                  <Trophy className="w-4.5 h-4.5 mb-1" />
                  <span className="text-[7.5px] font-mono uppercase tracking-wider">STATS</span>
                  {activeTab === 'progress' && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#BD53F4] rounded-full" />
                  )}
                </button>

              </nav>

            </div>
          )}

            </>
          )}

        </div>

      </div>

    </div>
  );
}
