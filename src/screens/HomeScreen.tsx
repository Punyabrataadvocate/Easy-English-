import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, Flame, Shield, ArrowLeft, Grab, RotateCcw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubscriptionPlan } from '../types';

interface MovableCard {
  id: string;
  title: string;
  emoji: string;
  phrase: string;
  phonetic: string;
  tip: string;
  size: 'large' | 'small';
  bgColor: string;      // Flat backdrop color
  borderColor: string;  // Flat border color
  textColor: string;    // Highly legible text matching the topic
  labelColor: string;   // Accent sub-badge background and text colors
}

const MOVABLE_CARDS: MovableCard[] = [
  {
    id: "mov-daily",
    title: "Daily Situations",
    emoji: "🥗",
    phrase: "Can I get a glass of chilled water?",
    phonetic: "chilled WA-ter",
    tip: "Water-এ t-টি হালকা 'd' এর মতো করে বলুন, যেমন মার্কিন বা স্ট্যান্ডার্ড গ্লোবাল স্টাইল।",
    size: 'large',
    bgColor: "bg-[#162D24]",
    borderColor: "border-[#10B981]/30",
    textColor: "text-[#D1FAE5]",
    labelColor: "bg-[#10B981]/20 text-[#A7F3D0]"
  },
  {
    id: "mov-pro",
    title: "Professional Speaking",
    emoji: "👔",
    phrase: "Regarding our roadmap, I'll streamline the output.",
    phonetic: "stream-line the OUT-put",
    tip: "Streamline শব্দে s-টিকে খুব বেশি শিষ দিয়ে বলবেন না।",
    size: 'large',
    bgColor: "bg-[#1E1B4B]",
    borderColor: "border-[#4F46E5]/35",
    textColor: "text-[#E0E7FF]",
    labelColor: "bg-[#4F46E5]/20 text-[#C7D2FE]"
  },
  {
    id: "mov-help",
    title: "Daily & Helpful Situations",
    emoji: "🤝",
    phrase: "Excuse me, where is the nearest metro layout?",
    phonetic: "ex-CUSE me, ME-tro",
    tip: "excuse me-তে x-এর মৃদু উচ্চারণ করুন।",
    size: 'large',
    bgColor: "bg-[#3B1212]",
    borderColor: "border-[#EF4444]/30",
    textColor: "text-[#FEE2E2]",
    labelColor: "bg-[#EF4444]/20 text-[#FCA5A5]"
  },
  {
    id: "mov-s1",
    title: "V vs W Tip",
    emoji: "🗣️",
    phrase: "Very Well",
    phonetic: "VEH-ree WELL",
    tip: "V এবং W এর সূক্ষ্ম পার্থক্যের দিকে নজর রাখুন।",
    size: 'small',
    bgColor: "bg-[#2D200F]",
    borderColor: "border-[#F59E0B]/35",
    textColor: "text-[#FEF3C7]",
    labelColor: "bg-[#F59E0B]/20 text-[#FDE68A]"
  },
  {
    id: "mov-s2",
    title: "Silent D",
    emoji: "🤫",
    phrase: "Wednesday",
    phonetic: "WENZ-day",
    tip: "d উচ্চারণ বর্জন করুন।",
    size: 'small',
    bgColor: "bg-[#3B132C]",
    borderColor: "border-[#EC4899]/30",
    textColor: "text-[#FCE7F3]",
    labelColor: "bg-[#EC4899]/20 text-[#FBCFE8]"
  },
  {
    id: "mov-s3",
    title: "TH Breather",
    emoji: "💨",
    phrase: "Thank You",
    phonetic: "THANK you",
    tip: "জিহ্বা অল্প বের করে বাতাস ছাড়ুন।",
    size: 'small',
    bgColor: "bg-[#23153C]",
    borderColor: "border-[#8B5CF6]/30",
    textColor: "text-[#F3E8FF]",
    labelColor: "bg-[#8B5CF6]/20 text-[#E9D5FF]"
  },
  {
    id: "mov-s4",
    title: "Cricket Vocab",
    emoji: "🏏",
    phrase: "Sizzling Innings",
    phonetic: "SIZ-ling IN-nings",
    tip: "Innings এ s উচ্চারণ করতে ভুলবেন না।",
    size: 'small',
    bgColor: "bg-[#0C2D3E]",
    borderColor: "border-[#0EA5E9]/30",
    textColor: "text-[#E0F2FE]",
    labelColor: "bg-[#0EA5E9]/20 text-[#BAE6FD]"
  },
  {
    id: "mov-s5",
    title: "Greeting Tip",
    emoji: "🙏",
    phrase: "Namaskar VANI",
    phonetic: "Na-mas-KAR Vani",
    tip: "নমস্কার বলে চর্চা শুরু করুন।",
    size: 'small',
    bgColor: "bg-[#112E24]",
    borderColor: "border-[#10B981]/30",
    textColor: "text-[#ECFDF5]",
    labelColor: "bg-[#10B981]/20 text-[#A7F3D0]"
  }
];

interface ScenarioCard {
  id: string;
  title: string;
  duration: string;
  level: 'Easy' | 'Medium' | 'Hard';
  badge?: 'MOST VIEWED' | 'TRENDING NOW' | 'NEWLY ADDED';
  badgeColor?: string;
  imageUrl: string;
  vaniIntro: string;
  points: string[];
  vOpeningMsg: string;
  uOpeningMsg: string;
}

const JOB_INTERVIEW_SCENARIOS: ScenarioCard[] = [
  {
    id: "ji-intro",
    title: "Introduce Yourself",
    duration: "8 Mins",
    level: "Easy",
    badge: "MOST VIEWED",
    badgeColor: "bg-[#BD53F4] text-white",
    imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "In this lesson, you will practice introducing yourself in professional job interviews. I will act as the corporate recruiter.",
    points: ["Master a concise 30-second introduction formula", "Soft-pedal grammar mistakes of stative nouns", "Sound highly confident from speech day 1"],
    vOpeningMsg: "Welcome to Easy English Corp! To begin, could you kindly introduce yourself and share a brief snapshot of your journey?",
    uOpeningMsg: "Sure thing! My name is Sourav, a software engineering graduate eager to practice spoken English..."
  },
  {
    id: "ji-edu",
    title: "Describe Your Education",
    duration: "6 Mins",
    level: "Medium",
    badge: "TRENDING NOW",
    badgeColor: "bg-[#22C55E] text-white",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Let's structure your university and specialization details clearly for Indian & global interview recruiters.",
    points: ["Avoid native language grammar drag errors", "Properly enunciate degree titles and core projects", "Structure timelines easily"],
    vOpeningMsg: "Excellent. Could you describe your academic study background and what favorite activities you pursued?",
    uOpeningMsg: "I completed my Bachelor in Technology from Kolkata. I actively studied data analytics..."
  },
  {
    id: "ji-exp",
    title: "Talk About Experience",
    duration: "7 Mins",
    level: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Practice defining past contributions, roles, and major team assignments with active action verbs.",
    points: ["State past actions clearly without trailing fillers", "Pitch your metrics in bullet standards", "Speak at comfortable paces"],
    vOpeningMsg: "I would love to learn more about your actual work or internship experience. What did your weekly duties look like?",
    uOpeningMsg: "In my previous experience, I was responsible for coordinating team roadmaps..."
  },
  {
    id: "ji-tough",
    title: "Handle Tough Questions",
    duration: "8 Mins",
    level: "Hard",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Make difficult scenario responses such as 'Why should we hire you?' or 'What are your salary expectations?' flow cleanly.",
    points: ["Deflect nervousness into constructive sound curves", "Softening abrupt Bengali direct replies", "Exquisite professional tone control"],
    vOpeningMsg: "Why do you feel you should be selected over other candidates with matching qualifications?",
    uOpeningMsg: "My primary asset is my perseverance combined with a strong drive to speak English eloquently..."
  },
  {
    id: "ji-general",
    title: "Job Interview",
    duration: "9 Mins",
    level: "Hard",
    badge: "NEWLY ADDED",
    badgeColor: "bg-[#3B82F6] text-white",
    imageUrl: "https://images.unsplash.com/photo-1618005198143-e52834658512?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Practice a comprehensive, professional mock job interview with full real-time recaps from Vani.",
    points: ["Practice professional body responses", "Navigate diverse interview contexts", "Constructive structure during stress"],
    vOpeningMsg: "Good day! Welcome to this complete mock job interview. To begin, could you define your core ambitions and why you seek to excel here?",
    uOpeningMsg: "Good day! Thank you. I want to build standard professional vocabulary and deliver polished English responses..."
  }
];

const OFFICE_SCENARIOS: ScenarioCard[] = [
  {
    id: "off-greet",
    title: "Chat with Co-workers",
    duration: "7 Mins",
    level: "Easy",
    badge: "MOST VIEWED",
    badgeColor: "bg-[#BD53F4] text-white",
    imageUrl: "https://images.unsplash.com/photo-1618005198143-e52834658512?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Small talk at the office water cooler builds brilliant workplace connections. Let's practice active chatting with Vani.",
    points: ["Initiate friendly greetings naturally", "Handle responses to 'How was your weekend?'", "Polite sign-offs"],
    vOpeningMsg: "Hi Sourav! Good morning. Did you catch the cricket game yesterday? What are you up to today?",
    uOpeningMsg: "Good morning! Yes, it was an incredibly exciting match. Today I am adjusting some client slides..."
  },
  {
    id: "off-meet",
    title: "Talk in Team Meetings",
    duration: "6 Mins",
    level: "Medium",
    badge: "NEWLY ADDED",
    badgeColor: "bg-[#3B82F6] text-white",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Put forward your opinions, interrupt politely, and highlight achievements in recurring daily standups.",
    points: ["Interrupt beautifully with 'Can I quickly add something?'", "State technical progress precisely", "Maintain calm standard speech rhythm"],
    vOpeningMsg: "Thank you all for arriving. Sourav, could you update the team on our roadmap and current progress?",
    uOpeningMsg: "Absolutely. We are on track and currently testing the critical micro-components..."
  },
  {
    id: "off-req",
    title: "Approve a Request",
    duration: "8 Mins",
    level: "Hard",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Practice managing budgets, signing off on paperwork, and issuing formal administrative confirmations.",
    points: ["Sound authoritative yet approachable", "Issue explicit permissions with confidence", "Clarify criteria concisely"],
    vOpeningMsg: "Hello Sourav. I wanted to verify if you approve our extended visual design budget for this quarter.",
    uOpeningMsg: "Yes, I reviewed the drafts and I am fully prepared to approve this request..."
  },
  {
    id: "off-feed",
    title: "Give Feedback to Team",
    duration: "7 Mins",
    level: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "A great leader provides critique without hurting feelings. Master the feedback sandwich with VANI guidance.",
    points: ["Praise first, then introduce scope of growth", "Be extremely direct yet highly respectful", "Follow up with a warm query"],
    vOpeningMsg: "Hi there. I finished editing the document. Do you have any feedback on how I structured the core reports?",
    uOpeningMsg: "You structured it beautiful. I suggest we condense the long introduction to increase impact..."
  }
];

const FAMILY_SCENARIOS: ScenarioCard[] = [
  {
    id: "fam-friends",
    title: "Make New Friends",
    duration: "7 Mins",
    level: "Easy",
    badge: "MOST VIEWED",
    badgeColor: "bg-[#BD53F4] text-white",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Conversing with strangers at local gatherings or social cafes with ease, security, and humor.",
    points: ["Break the ice with light friendly compliments", "Ask open-ended interest queries", "Exchange contact handles"],
    vOpeningMsg: "Hey, are you also a student here in Kolkata? That's a really cool backpack you have!",
    uOpeningMsg: "Thank you! Yes, I am. I love studying spoken languages and meeting new folks..."
  },
  {
    id: "fam-dinner",
    title: "Plan a Family Dinner",
    duration: "5 Mins",
    level: "Medium",
    badge: "TRENDING NOW",
    badgeColor: "bg-[#22C55E] text-white",
    imageUrl: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Coordinate delicious menus, pick sweet restaurants, and arrange family events on holiday cycles easily.",
    points: ["Suggest food recipes politely", "Ask about dietary choices of relatives", "Schedule pickup times"],
    vOpeningMsg: "Kemon acho? Let's plan a wholesome family dinner for Maa's birthday. Should we make luchi at home, or order biryani?",
    uOpeningMsg: "I suggest we order local biryani as she loves it, and prepare some fresh sweets at home..."
  },
  {
    id: "fam-plans",
    title: "Make Weekend Plans",
    duration: "8 Mins",
    level: "Easy",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Talk with classmates or cousins about going out for movies, shopping, or local weekend outings.",
    points: ["Pitch fun activities with 'How about...?'", "Coordinate meeting spots", "Discuss weather and timings"],
    vOpeningMsg: "Finally, the weekend is here! Are you free this Saturday? Let's go check out the new science exhibition!",
    uOpeningMsg: "That sounds like a brilliant plan! Let's meet at the main avenue gates at 4 PM..."
  },
  {
    id: "fam-console",
    title: "Console a Friend",
    duration: "6 Mins",
    level: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Support a sibling or friend going through exam anxiety or minor professional failures with comforting talk.",
    points: ["Validate feelings with gentle sentences", "Avoid lecturing; emphasize listening", "Suggest simple relaxing steps"],
    vOpeningMsg: "I am really upset, Sourav. I didn't perform well on my final viva today. I felt so nervous and stammered.",
    uOpeningMsg: "Please do not worry. It happens to the best of us. Take a deep breath..."
  }
];

const TRAVEL_SCENARIOS: ScenarioCard[] = [
  {
    id: "tr-airport",
    title: "Airport Check-in",
    duration: "5 Mins",
    level: "Easy",
    badge: "MOST VIEWED",
    badgeColor: "bg-[#BD53F4] text-white",
    imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Conquer check-in desks, bag weighting scales, and border security checks confidently with VANI guidance.",
    points: ["State destination and passport details cleanly", "Select window/aisle seating options", "Answer basic security inquiries"],
    vOpeningMsg: "Good afternoon. Welcome to Indian Airways. May I please have your ticket reference and passport?",
    uOpeningMsg: "Here you go. I would prefer an aisle seat if that is still available on this flight..."
  },
  {
    id: "tr-flight",
    title: "Speak with Flight Attendant",
    duration: "7 Mins",
    level: "Hard",
    badge: "NEWLY ADDED",
    badgeColor: "bg-[#3B82F6] text-white",
    imageUrl: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Communicate requests during your high-altitude cruise politely with safety staff.",
    points: ["Ask for blankets or headphones with 'Could I get...?'", "Request alternative meal preferences", "Understand instruction cues"],
    vOpeningMsg: "Sir, would you like the vegetarian palak paneer meal option, or do you prefer our continental pasta?",
    uOpeningMsg: "I would highly prefer the vegetarian palak paneer option, please. Thank you for asking..."
  },
  {
    id: "tr-directions",
    title: "Ask for Help in a City",
    duration: "8 Mins",
    level: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Get un-lost when wandering around foreign streets or finding hidden subway metro exits.",
    points: ["Signal strangers politely using correct pre-sentences", "Follow instructions containing 'turn left, go past'", "Confirm and repeat the instructions given"],
    vOpeningMsg: "Hello. Yes, I live here block-wise. What exactly are you trying to locate in this neighborhood?",
    uOpeningMsg: "Excuse me. Could you guide me to the nearest electric rail station? I got completely turned around..."
  },
  {
    id: "tr-hotel",
    title: "Hotel Check-in",
    duration: "6 Mins",
    level: "Easy",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Confirm reservations, request early checkout options, and ask for Wifi router passwords at the reception.",
    points: ["Retrieve check-in logs easily", "Inquire about complimentary breakfast timings", "Ask for a quiet, high floor"],
    vOpeningMsg: "Welcome to Emerald Suites. Under what surname was this reservation booked today, sir?",
    uOpeningMsg: "Good evening. It was booked under Sourav Mukherjee. Here is my booking confirmation ID..."
  }
];

const PTM_SCENARIOS: ScenarioCard[] = [
  {
    id: "ptm-teacher",
    title: "Meet Child’s Teacher",
    duration: "6 Mins",
    level: "Easy",
    badge: "NEWLY ADDED",
    badgeColor: "bg-[#3B82F6] text-white",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Connect with educators to review overall classroom parameters and grades safely.",
    points: ["Inquire about class participation metrics", "Adopt highly polite conversational pacing", "Note teacher guidelines"],
    vOpeningMsg: "Hello, thank you for attending today's PTM. Your daughter is a bright student but stays rather quiet during class discussions.",
    uOpeningMsg: "Thank you for the update, teacher. We will encourage her to practice speaking more at home..."
  },
  {
    id: "ptm-results",
    title: "Discuss Exam Results",
    duration: "6 Mins",
    level: "Medium",
    badge: "MOST VIEWED",
    badgeColor: "bg-[#BD53F4] text-white",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Review science, math or spelling scores with focus and action steps.",
    points: ["Highlight specific areas of drop", "Ask about extra-class remedial help", "Maintain cooperation tone"],
    vOpeningMsg: "In this midterm, your son scored excellent in projects but struggled during written algebra. Let's draft a plan.",
    uOpeningMsg: "I see. We will configure an hour of focused math worksheets every afternoon to help him adjust..."
  }
];

const STUDENT_SCENARIOS: ScenarioCard[] = [
  {
    id: "stu-admission",
    title: "Interview for College Admission",
    duration: "7 Mins",
    level: "Medium",
    badge: "MOST VIEWED",
    badgeColor: "bg-[#BD53F4] text-white",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Clear entry vivas for higher studies inside premium colleges with polished speech flow.",
    points: ["Deliver concise reason statements", "Express passion for the specialization field", "Conquer oral hesitation curves"],
    vOpeningMsg: "Welcome to our university placement board. Why did you select Literature and Language Studies as your primary stream?",
    uOpeningMsg: "I chose this because speech has the power to connect global landscapes. I want to build fluency..."
  },
  {
    id: "stu-prof",
    title: "Talk to Professor",
    duration: "6 Mins",
    level: "Easy",
    badge: "NEWLY ADDED",
    badgeColor: "bg-[#3B82F6] text-white",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80",
    vaniIntro: "Request assignment extensions or clarify lecture theories in professors' office cabins.",
    points: ["Ask extensions with 'I was hoping for...'", "State reasons professionally", "Express deep appreciation"],
    vOpeningMsg: "Come in. What question do you have about the assignments due this Friday?",
    uOpeningMsg: "Thank you, Professor. I was hoping for a brief extension of two days due to some health delays..."
  }
];

const SCENARIO_IMAGE_PROMPTS: Record<string, string> = {
  "ji-intro": "An elegant, realistic photography of an Indian job applicant, mid-20s, greeting an interviewer with a polite smile in a modern glass conference room, photorealistic standard professional lighting.",
  "ji-edu": "A bright photography of classroom desk with degrees, diplomas, and stacks of academic notebooks under elegant university hall lighting, photorealistic modern education concept.",
  "ji-exp": "A realistic photography of a software developer presenting a project roadmap metrics chart to corporate colleagues in a sleek IT room, photorealistic, shallow depth of field.",
  "ji-tough": "A photographic close-up of a confident, smiling candidate listening to a standard tough interview question in a cozy corporate interview room, photorealistic.",
  "ji-general": "A complete realistic scene of a standard corporate mock job interview with an Indian applicant and global interview panels in a neat, well-lit executive forum, high-fidelity photorealistic.",
  "off-greet": "Two happy diverse corporate teammates talking and laughing near a modern office water lounge with natural sunlight streaming in, photorealistic warm mood.",
  "off-meet": "A group of diverse office colleagues participating in an active standup team meeting around a bright whiteboard inside a glass workspace, photorealistic.",
  "off-req": "A manager's hands cleanly signing a formal leave approval letter on a classic mahogany executive table with an approved stamp, photorealistic.",
  "off-feed": "A supportive Indian team leader politely offering constructive feedback and guidance to a colleague at a modern desktop computer screen, photorealistic warm workplace.",
  "fam-friends": "Diverse group of smiling young friends meeting and chatting merrily over milkshakes at a vibrant college campus bistro, photorealistic sunny day.",
  "fam-dinner": "A warm festive Indian family enjoying dinner together with luchi, curry, and traditional sweets on a beautiful wooden table under warm dining lamps, photorealistic.",
  "fam-plans": "Young Indian colleagues standing at a modern science park entry gate, reviewing exhibition guides and happily planning their saturday, photorealistic.",
  "fam-console": "An empathetic photographic depiction of a friend warmheartedly placing a reassuring hand on an anxious friend's shoulder to console them under soft warm ambient lighting, photorealistic.",
  "tr-airport": "A neat modern international airport check-in desk with a polite counter officer checking a traveler's flight boarding ticket and passport, photorealistic traveler experience.",
  "tr-flight": "A professional flight attendant offering a neat vegetarian tray of meals to a passenger inside a premium airliner cabin, photorealistic flight service.",
  "tr-directions": "A lost tourist happily asking an Indian local resident for directions on a charming historic street corner, holding a map, photorealistic.",
  "tr-hotel": "A traveler politely checking in at a cozy reception desk with a smiling hotel receptionist, neat interior decorations, photorealistic lobby landscape.",
  "ptm-teacher": "An Indian parent discussing their child's school progress with a polite smiling teacher in a bright, modern elementary classroom, photorealistic parent teacher meeting.",
  "ptm-results": "A parent and a teacher smiling proudly looking at an excellent student midterm report card on a school desk, photorealistic classroom environment.",
  "stu-admission": "A young college applicant answering academic committee questions confidently at admission interview board desk, photorealistic.",
  "stu-prof": "A polite university student requesting an assignment extension from a friendly professor inside an office filled with book towers, photorealistic."
};

interface HomeScreenProps {
  currentPlan: SubscriptionPlan;
  streak: number;
  stats: {
    wordsSpoken: number;
    avgAccuracy: number;
    avgFluency: number;
  };
  currentCoachId: string;
  onSelectCoach: (coachId: string) => void;
  onNavigateToTab: (tab: 'home' | 'topics' | 'latest' | 'talk' | 'progress' | 'store') => void;
  onSelectWord: (word: string, phonetic: string, tip: string) => void;
  onSelectLesson: (lessonId: string) => void;
  speakVani: (text: string) => void;
  imageService: {
    scenarioImages: Record<string, string>;
    loadingImages: Record<string, boolean>;
    generateScenarioImage: (id: string, title: string) => Promise<string>;
    loadAllScenarioImages: (scenariosList: Array<{ id: string; title: string }>) => Promise<void>;
    clearImageCache: (scenariosList: Array<{ id: string; title: string }>) => Promise<void>;
  };
}

export default function HomeScreen({
  currentPlan,
  streak,
  stats,
  onNavigateToTab,
  onSelectWord,
  speakVani,
  imageService
}: HomeScreenProps) {
  const [resetKey, setResetKey] = useState(0);
  const playgroundRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  
  // Daily goals state
  const [goalCompleted, setGoalCompleted] = useState<boolean[]>([false, false]);

  // Scenario detail modal/subscreen state
  const [activeScenarioDetail, setActiveScenarioDetail] = useState<ScenarioCard | null>(null);

  // Destructure image records and loading maps from high-fidelity global service
  const { scenarioImages, loadingImages } = imageService;

  // Unified image id helper for recommends or detail duplicates
  const getImgId = (id: string) => {
    return id === "off-greet-recommend-detail" ? "off-greet" : id;
  };

  // Predefined gorgeous dark gradients and Category Icons
  const useFallbackGradient = (id: string) => {
    const actualId = getImgId(id);
    if (actualId.startsWith("ji")) {
      return { gradient: "bg-gradient-to-br from-[#2E1065] to-[#0F051D]", icon: "💼" };
    } else if (actualId.startsWith("off")) {
      return { gradient: "bg-gradient-to-br from-[#064E3B] to-[#022C22]", icon: "🏢" };
    } else if (actualId.startsWith("fam")) {
      return { gradient: "bg-gradient-to-br from-[#831843] to-[#4C0519]", icon: "👨‍👩‍👧" };
    } else if (actualId.startsWith("tr")) {
      return { gradient: "bg-gradient-to-br from-[#1E40AF] to-[#172554]", icon: "✈️" };
    } else if (actualId.startsWith("ptm")) {
      return { gradient: "bg-gradient-to-br from-[#1E293B] to-[#0F172A]", icon: "🏫" };
    } else if (actualId.startsWith("stu")) {
      return { gradient: "bg-gradient-to-br from-[#701A75] to-[#4A044E]", icon: "🎓" };
    }
    return { gradient: "bg-gradient-to-br from-[#BD53F4]/20 to-[#0A0512]", icon: "🎯" };
  };

  // Helper lists of all active simulation cards
  const getAllScenariosCompactList = () => {
    return [
      ...JOB_INTERVIEW_SCENARIOS, 
      ...OFFICE_SCENARIOS, 
      ...FAMILY_SCENARIOS, 
      ...TRAVEL_SCENARIOS, 
      ...PTM_SCENARIOS, 
      ...STUDENT_SCENARIOS
    ].map(s => ({ id: s.id, title: s.title }));
  };

  const clearImageCache = async () => {
    await imageService.clearImageCache(getAllScenariosCompactList());
  };

  // Synchronize on load and verify missing images using global maps
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Migration check to auto-clear outdated, missing, or abstract cache values for specific updated scenarios
    const updatedIds = ["off-feed", "fam-dinner", "tr-airport", "tr-flight"];
    let mutated = false;
    updatedIds.forEach(id => {
      const cached = localStorage.getItem(`easy_english_img_${id}`);
      if (cached && (
        cached.includes("photo-1618005198143-e52834658512") ||
        cached.includes("photo-1633356122544-f134324a6cee") ||
        cached.includes("photo-1561731216-c3a4d99437d5") ||
        cached.includes("photo-1531535934208-95c22901a74e")
      )) {
        localStorage.removeItem(`easy_english_img_${id}`);
        mutated = true;
      }
    });

    // Automatically trigger generation for empty caches globally
    imageService.loadAllScenarioImages(getAllScenariosCompactList());

    console.log("[VANI Orchestration] App initialized. Standard high-quality curated assets loaded.");
  }, []);

  const renderSkeleton = () => (
    <div className="w-full h-full bg-[#1A1A1A] animate-pulse flex flex-col items-center justify-center relative">
      <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#BD53F4]/40 animate-spin flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-[#BD53F4]/10" />
      </div>
      <span className="text-[9px] font-mono text-[#F0ABFC] mt-3 uppercase tracking-widest font-black">AI Generating...</span>
    </div>
  );

  const handleSelectMovableCard = (card: MovableCard) => {
    onSelectWord(card.phrase, card.phonetic, card.tip);
    speakVani(`Selected phrase "${card.phrase}". Moving you directly to micro-practice!`);
    onNavigateToTab('talk');
  };

  const handleStartPractice = (scenario: ScenarioCard) => {
    // Satisfy locking mechanism
    if (currentPlan === 'locked') {
      speakVani("This scenario requires a standard premium subscription plan to unlock. Let us check the recharge details!");
      onNavigateToTab('store');
      return;
    }
    onSelectWord(scenario.title, "Conversational Role-Play with VANI", scenario.vaniIntro);
    setActiveScenarioDetail(null);
    onNavigateToTab('talk');
  };

  const renderHorizontalScroll = (title: string, subtitle: string | React.ReactNode, scenarios: ScenarioCard[]) => {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-display">
            {title}
          </h4>
          <span className="text-[10px] text-[#BD53F4] hover:underline font-semibold cursor-pointer">
            {subtitle}
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
          {scenarios.map((scr) => (
            <div 
              key={scr.id}
              data-scenario={scr.id}
              role="button"
              tabIndex={0}
              aria-label={`Scenario: ${scr.title}. ${scr.level} level, duration ${scr.duration}.`}
              onClick={() => {
                setActiveScenarioDetail(scr);
                speakVani(`Opened scenario preview for: ${scr.title}.`);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveScenarioDetail(scr);
                  speakVani(`Opened scenario preview for: ${scr.title}.`);
                }
              }}
              className="w-[160px] h-[160px] bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#BD53F4]/20 hover:border-[#BD53F4]/50 transition-all flex flex-col justify-between shrink-0 cursor-pointer select-none active:scale-[0.98] snap-start relative group focus:outline-none focus:ring-2 focus:ring-[#BD53F4]"
            >
              {/* Photo Background */}
              <div className="h-[100px] w-full relative overflow-hidden bg-slate-900 flex items-center justify-center">
                {loadingImages[scr.id] ? (
                  renderSkeleton()
                ) : scenarioImages[scr.id] ? (
                  <img 
                    src={scenarioImages[scr.id]} 
                    alt={scr.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 contrast-[1.10] saturate-[1.20] brightness-[1.06]"
                  />
                ) : (
                  <img 
                    src={scr.imageUrl || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80"} 
                    alt={scr.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 contrast-[1.10] saturate-[1.20] brightness-[1.06]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
                
                {/* Visual badge top-left */}
                {scr.badge && (
                  <span className={`absolute top-1.5 left-1.5 text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none ${
                    scr.badgeColor ? scr.badgeColor.replace('#FF6B2B', '#BD53F4') : "bg-[#BD53F4] text-white"
                  }`}>
                    {scr.badge}
                  </span>
                )}
              </div>

              {/* Specs and title overlay bottom */}
              <div className="p-3 pt-0 flex-1 flex flex-col justify-end space-y-1 z-10 bg-[#1A1A1A]">
                <div className="flex items-center gap-1.5 text-[8px] text-[#AAAAAA] font-mono leading-none">
                  <span>⏱ {scr.duration}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <span className={`w-1 h-1 rounded-full ${scr.level === 'Easy' ? 'bg-[#22C55E]' : scr.level === 'Medium' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} />
                    {scr.level}
                  </span>
                </div>
                <h5 className="text-[11px] font-bold text-white tracking-tight leading-tight line-clamp-2">
                  {scr.title}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="home-view-container">
      {/* Dynamic Sub-screen Active Detail */}
      <AnimatePresence>
        {activeScenarioDetail && (
          <motion.div 
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            className="fixed inset-0 bg-[#0D0D0D] p-5 z-50 overflow-y-auto flex flex-col space-y-6"
          >
            {/* Header sub */}
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setActiveScenarioDetail(null)}
                className="p-1.5 rounded-xl bg-[#1A1A1A] border border-[#BD53F4]/20 hover:border-[#BD53F4]/60 text-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Scenario Details
              </h3>
            </div>

            {/* Title Block */}
            <div className="space-y-1.5">
              <h1 className="text-xl font-black text-white font-display">
                {activeScenarioDetail.title}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#BD53F4]/10 border border-[#BD53F4]/20 text-[#F5D0FE] px-2.5 py-1 rounded-lg font-mono tracking-widest uppercase font-bold">
                  ⏱ {activeScenarioDetail.duration}
                </span>
                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-mono tracking-widest uppercase font-bold border ${
                  activeScenarioDetail.level === 'Easy' ? 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]' :
                  activeScenarioDetail.level === 'Medium' ? 'bg-[#FCD34D]/10 border-[#FCD34D]/20 text-[#FCD34D]' :
                  'bg-[#F87171]/10 border-[#F87171]/20 text-[#F87171]'
                }`}>
                  {activeScenarioDetail.level}
                </span>
              </div>
            </div>

            {/* Visual Hero Photo */}
            <div className="h-[180px] w-full bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#BD53F4]/20 relative flex items-center justify-center">
              {loadingImages[getImgId(activeScenarioDetail.id)] ? (
                renderSkeleton()
              ) : scenarioImages[getImgId(activeScenarioDetail.id)] ? (
                <img 
                  src={scenarioImages[getImgId(activeScenarioDetail.id)]} 
                  alt={activeScenarioDetail.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover contrast-[1.10] saturate-[1.20] brightness-[1.06]"
                />
              ) : (
                <img 
                  src={activeScenarioDetail.imageUrl || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80"} 
                  alt={activeScenarioDetail.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover contrast-[1.10] saturate-[1.20] brightness-[1.06]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
            </div>

            {/* VANI says container */}
            <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-[#BD53F4]/25 space-y-2 relative" id="vani-introduction-memo">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#BD53F4]/10 border border-[#BD53F4]/20 flex items-center justify-center text-xs">
                  👑
                </div>
                <span className="text-xs font-bold text-[#F5D0FE] uppercase font-mono tracking-wider">VANI Says</span>
              </div>
              <p className="text-xs text-[#EAEAEA] leading-relaxed">
                "{activeScenarioDetail.vaniIntro}"
              </p>
            </div>

            {/* Learning target points */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-[#AAAAAA] font-black uppercase tracking-wider block">What You Will Learn</span>
              <ul className="space-y-2">
                {activeScenarioDetail.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#AAAAAA]">
                    <span className="w-1.5 h-1.5 bg-[#BD53F4] rounded-full mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct preview mock bubbles */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-[#AAAAAA] font-black uppercase tracking-wider block">Conversation Preview</span>
              <div className="space-y-2.5">
                {/* Vani bubble */}
                <div className="p-3 bg-[#1A1A1A] border border-[#BD53F4]/20 rounded-2xl max-w-[85%] text-left space-y-1">
                  <span className="text-[8px] font-mono text-[#F0ABFC] font-black uppercase block">COACH VANI</span>
                  <p className="text-xs text-[#EAEAEA] italic leading-tight">
                    "{activeScenarioDetail.vOpeningMsg}"
                  </p>
                </div>
                {/* User bubble */}
                <div className="p-3 bg-[#BD53F4] text-white rounded-2xl max-w-[85%] self-end ml-auto text-left space-y-1 shadow-md">
                  <span className="text-[8px] font-mono text-white/85 font-black uppercase block">YOUR RESPONSE</span>
                  <p className="text-xs text-white italic leading-tight">
                    "{activeScenarioDetail.uOpeningMsg}"
                  </p>
                </div>
              </div>
            </div>

            {/* Actions CTA */}
            <button
              onClick={() => handleStartPractice(activeScenarioDetail)}
              className="w-full py-4.5 bg-[#BD53F4] hover:bg-[#F0ABFC] hover:text-black active:scale-95 text-white text-sm font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 mt-auto"
            >
              Start Practice with VANI 🎙️
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER */}
      <div className="flex justify-between items-center bg-transparent pt-1" id="home-top-header">
        <div className="flex items-center gap-1">
          <span className="text-xl font-black text-[#BD53F4] tracking-tight font-display">
            Easy English
          </span>
          <span className="text-[8px] font-mono text-[#D8B4FE] tracking-widest uppercase border border-[#BD53F4]/20 bg-[#BD53F4]/5 px-1.5 py-0.5 rounded ml-1">
            VANI Speak
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearImageCache}
            title="Force-regenerate all scenarios using Google's Imagen API"
            className="text-[9px] font-mono font-bold bg-[#BD53F4]/15 border border-[#BD53F4]/35 hover:border-[#BD53F4]/80 text-[#F5D0FE] hover:text-white px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
          >
            🎨 REGEN AI
          </button>
          <div className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#BD53F4]/20 px-2.5 py-1 rounded-full text-xs font-mono font-bold text-white">
            <Flame className="w-4 h-4 text-[#BD53F4] animate-pulse shrink-0 fill-[#BD53F4]" />
            <span>🔥 {streak} days</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#222222] border border-[#BD53F4]/40 flex items-center justify-center font-bold text-xs text-[#BD53F4] font-mono uppercase shadow-inner cursor-pointer" title="Self details">
            SM
          </div>
        </div>
      </div>

      {/* VANI HERO BANNER */}
      <div className="relative bg-gradient-to-br from-[#BD53F4]/20 to-[#0A0512] border-2 border-[#BD53F4]/35 rounded-3xl p-5 space-y-4 overflow-hidden shadow-lg shadow-[#BD53F4]/10" id="vani-coach-hero-banner">
        {/* Abstract CSS Mandala vector */}
        <div className="absolute -right-12 -bottom-10 w-44 h-44 rounded-full border border-[#BD53F4]/25 flex items-center justify-center opacity-30 select-none animate-spin-slow">
          <div className="w-36 h-36 rounded-full border border-dashed border-[#F0ABFC]/30 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-dotted border-[#BD53F4]/40" />
          </div>
        </div>

        <div className="space-y-1 max-w-[70%]">
          <span className="text-[9px] font-mono text-[#F0ABFC] font-black uppercase tracking-widest block">Core Spoken intelligence</span>
          <h2 className="text-lg font-black text-white tracking-tight leading-tight uppercase font-display">
            VANI — Your Personal English Coach
          </h2>
          <p className="text-xs text-[#D8B4FE] leading-normal font-medium">
            Available 24x7 | Anytime Anywhere
          </p>
        </div>

        <button 
          onClick={() => {
            speakVani("Let us commence our practice session. Tell me what is on your mind!");
            onNavigateToTab('talk');
          }}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#BD53F4] hover:bg-[#F0ABFC] hover:text-black active:scale-95 text-white text-xs font-black tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase shadow-md shadow-[#BD53F4]/15 z-10 relative cursor-pointer"
        >
          Talk to Vani now 🎙️
        </button>
      </div>

      {/* CONTINUE LEARNING CARD */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-[#BD53F4]/20 p-4.5 flex justify-between items-center transition-all hover:border-[#BD53F4]/50 cursor-grab" id="continue-practice-shortcut">
        <div className="space-y-1">
          <span className="text-[8px] font-mono text-[#F0ABFC] font-black uppercase tracking-wider block">Continue Where You Left Off 🔥</span>
          <h3 className="text-xs font-bold text-white leading-tight">
            Topic 01: W vs V Sounds
          </h3>
          <div className="w-36 h-1 rounded-full bg-[#222222] overflow-hidden mt-1.5 shrink-0">
            <div className="w-[60%] h-full bg-[#BD53F4]" />
          </div>
        </div>
        <button
          onClick={() => {
            speakVani("Resuming your spelling exercise of V versus W phonetic training lines.");
            onNavigateToTab('talk');
          }}
          className="px-3.5 py-2 bg-[#BD53F4]/10 hover:bg-[#BD53F4]/20 border border-[#BD53F4]/35 hover:border-[#BD53F4]/60 text-[#F0ABFC] hover:text-white rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
        >
          Resume →
        </button>
      </div>

      {/* DAILY GOAL STRIP */}
      <div className="bg-[#1A1A1A]/80 border border-[#BD53F4]/20 rounded-2xl p-4 space-y-2.5" id="daily-streaking-goals">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white font-mono">Today's Goal: Practice 2 topics</span>
          <span className="text-[10px] text-[#F0ABFC] font-mono font-bold bg-[#BD53F4]/10 px-2 py-0.5 rounded-full">
            {goalCompleted.filter(Boolean).length}/2 Done
          </span>
        </div>
        
        {/* Goals pills row */}
        <div className="flex gap-3">
          {goalCompleted.map((done, idx) => (
            <button
              key={idx}
              onClick={() => {
                const copy = [...goalCompleted];
                copy[idx] = !copy[idx];
                setGoalCompleted(copy);
                if (copy[idx]) {
                  speakVani("Topic milestone updated as done. Great pacing!");
                }
              }}
              className={`flex-1 p-2.5 rounded-xl border flex items-center justify-between transition-all font-mono text-[9px] font-bold ${
                done 
                  ? 'bg-[#BD53F4]/20 border-[#BD53F4] text-white' 
                  : 'bg-[#222222] border-[#222222] text-[#D8B4FE] hover:border-[#BD53F4]/50'
              }`}
            >
              <span className="uppercase">Topic 0{idx + 1}</span>
              <span className="text-[11px] font-sans">{done ? "💜 Done" : "⬜ Mark"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TODAY'S SCENARIO CARD */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-[#BD53F4]/20 overflow-hidden flex flex-col sm:flex-row shadow-sm" id="vani-recommended-scenario">
        {/* Left/top Thumbnail Image */}
        <div className="h-[140px] sm:w-[150px] relative overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center">
          {loadingImages["off-greet"] ? (
            renderSkeleton()
          ) : scenarioImages["off-greet"] ? (
            <img 
              src={scenarioImages["off-greet"]} 
              alt="Team Meeting"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80 contrast-[1.10] saturate-[1.20] brightness-[1.06]"
            />
          ) : (
            <div className={`w-full h-full ${useFallbackGradient("off-greet").gradient} flex flex-col items-center justify-center select-none`}>
              <span className="text-3xl filter drop-shadow">{useFallbackGradient("off-greet").icon}</span>
            </div>
          )}
          <span className="absolute top-2 left-2 text-[8px] font-mono font-black text-white bg-[#BD53F4] px-2 py-0.5 rounded uppercase tracking-wider">
            VANI'S PICK 🎯
          </span>
        </div>

        {/* Info Block */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest block bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded w-max">
              RECOMMENDED
            </span>
            <h3 className="text-sm font-black text-white leading-tight font-display uppercase">
              Greet & Chat with Co-workers
            </h3>
            <p className="text-[11px] text-[#AAAAAA] leading-normal line-clamp-2">
              Learn clean icebreakers to initiate natural conversations at your workplace.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="text-[9px] font-mono text-[#AAAAAA] flex items-center gap-1.5 uppercase font-bold">
              <span>⏱ 7 Mins</span>
              <span>•</span>
              <span className="text-emerald-400">Easy</span>
            </div>
            <button
              onClick={() => {
                setActiveScenarioDetail({
                  id: "off-greet-recommend-detail",
                  title: "Greet & Chat with Co-workers",
                  duration: "7 Mins",
                  level: "Easy",
                  imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80",
                  vaniIntro: "Learn standard, friendly icebreakers to start dialogue naturally with colleagues.",
                  points: ["Polite ways to ask 'How are you?'", "Avoid robotic sentences", "Handle basic office replies easily"],
                  vOpeningMsg: "Good morning! Great to sync up. Ready to review simple conversation starters today?",
                  uOpeningMsg: "Indeed, VANI! I am ready to practice daily office small talk..."
                });
                speakVani("Opening details for recommended scenario.");
              }}
              className="px-4 py-2 bg-[#BD53F4] hover:bg-[#F0ABFC] hover:text-black text-white font-mono font-black text-[10px] rounded-lg transition-all uppercase tracking-wider shrink-0 cursor-pointer"
            >
              Start with VANI →
            </button>
          </div>
        </div>
      </div>

      {/* JOB INTERVIEW SECTION */}
      {renderHorizontalScroll("Job Interview 💼", "See All →", JOB_INTERVIEW_SCENARIOS)}

      {/* TALK IN OFFICE SECTION */}
      {renderHorizontalScroll("Talk in Office 🏢", "See All →", OFFICE_SCENARIOS)}

      {/* TALK TO FAMILY & FRIENDS */}
      {renderHorizontalScroll("Talk to Family & Friends 👨‍👩‍👧", "See All →", FAMILY_SCENARIOS)}

      {/* TRAVEL ABROAD SECTION */}
      {renderHorizontalScroll("Travel Abroad ✈️", "See All →", TRAVEL_SCENARIOS)}

      {/* PTM SECTION */}
      {renderHorizontalScroll("PTM for Parents 👨‍👧", "See All →", PTM_SCENARIOS)}

      {/* HIGHER STUDIES SECTION */}
      {renderHorizontalScroll("Higher Studies 🎓", "See All →", STUDENT_SCENARIOS)}

      {/* DRAGGABLE SPEAKING ARENA (MOVABLE COLOR DECK) */}
      <div className="bg-[#1A1A1A] border border-[#BD53F4]/20 rounded-3xl p-5 shadow-inner space-y-4 relative" id="movable-speaking-sandbox">
        <div className="flex justify-between items-center pb-2 border-b border-[#BD53F4]/15">
          <div>
            <h4 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-[#BD53F4] to-[#F0ABFC] uppercase font-mono tracking-wider flex items-center gap-1.5 leading-none font-display">
              <Grab className="w-4 h-4 text-[#BD53F4] animate-pulse shrink-0" /> Playful Speaking Decks
            </h4>
            <span className="text-[9px] text-[#D8B4FE] block pt-1 font-medium font-sans">Drag and reposition. Tap any card to speak!</span>
          </div>
          <button 
            type="button"
            onClick={() => {
              setResetKey(prev => prev + 1);
              speakVani("Cards rearranged back to standard grid lanes.");
            }}
            className="p-1.5 px-2.5 rounded-lg bg-[#222222] border border-[#BD53F4]/10 hover:border-[#BD53F4] text-[#D8B4FE] hover:text-white text-[9px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer shrink-0"
            title="Reset cards positions"
          >
            <RotateCcw className="w-2.5 h-2.5" /> Reset
          </button>
        </div>

        {/* Ref container to restrict dragging to bounds */}
        <div 
          ref={playgroundRef} 
          className="relative min-h-[380px] bg-[#0D0D0D]/60 rounded-2xl p-3 border border-dashed border-[#BD53F4]/25 overflow-hidden flex flex-col gap-3 select-none" 
          id="movable-sandbox-viewport"
        >
          {/* Main Large Cards */}
          <div className="grid grid-cols-1 gap-2.5">
            {MOVABLE_CARDS.filter(c => c.size === 'large').map((card) => (
              <motion.div
                key={`${card.id}-${resetKey}`}
                drag
                dragConstraints={playgroundRef}
                dragElastic={0.08}
                whileDrag={{ scale: 1.02, zIndex: 40, boxShadow: "0px 4px 10px rgba(0,0,0,0.3)" }}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleSelectMovableCard(card)}
                className={`rounded-2xl p-3 border ${card.bgColor} ${card.borderColor} ${card.textColor} cursor-grab active:cursor-grabbing flex flex-col justify-between select-none space-y-1 relative`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{card.emoji}</span>
                    <h5 className="font-bold text-[11px] font-mono uppercase tracking-wide opacity-95">{card.title}</h5>
                  </div>
                  <span className={`text-[7px] font-mono font-black border border-current opacity-80 px-1.5 rounded uppercase`}>
                    Drag ↔
                  </span>
                </div>
                
                <div className="py-0.5">
                  <p className="text-xs font-sans font-black tracking-tight italic leading-snug">
                    "{card.phrase}"
                  </p>
                  <p className="text-[10px] opacity-85 font-mono">
                    Speak: {card.phonetic}
                  </p>
                </div>
                
                <div className="text-[9px] opacity-90 leading-normal pt-1 border-t border-white/5 flex items-center justify-between">
                  <span className="font-bengali text-[9px] pr-2 line-clamp-1 opacity-70">
                    {card.tip}
                  </span>
                  <span className={`text-[8px] font-mono font-black ${card.labelColor} rounded px-1.5 py-0.5 shrink-0 uppercase tracking-wider leading-none`}>
                    PRACTICE
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-[8px] text-[#555555] font-mono font-black text-center tracking-widest select-none uppercase py-1">
            🌈 Fun Micro-Decks (Draggable Too) 🌈
          </div>

          {/* Colorful Small Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {MOVABLE_CARDS.filter(c => c.size === 'small').map((card) => (
              <motion.div
                key={`${card.id}-${resetKey}`}
                drag
                dragConstraints={playgroundRef}
                dragElastic={0.08}
                whileDrag={{ scale: 1.03, zIndex: 40, boxShadow: "0px 3px 6px rgba(0,0,0,0.2)" }}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleSelectMovableCard(card)}
                className={`rounded-xl p-2.5 border ${card.bgColor} ${card.borderColor} ${card.textColor} cursor-grab active:cursor-grabbing flex flex-col justify-between select-none min-h-[90px]`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-base">{card.emoji}</span>
                  <span className={`text-[7px] font-mono font-black border border-current opacity-85 px-1 rounded select-none uppercase`}>
                    Mini ↔
                  </span>
                </div>
                
                <div className="space-y-0.5 pt-1 text-left">
                  <h6 className="text-[8px] font-mono font-black uppercase tracking-wider opacity-85 leading-none">{card.title}</h6>
                  <p className="text-[11px] font-sans font-black italic leading-tight truncate">
                    {card.phrase}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
