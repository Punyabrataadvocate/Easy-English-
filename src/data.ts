import { PracticeScenario, PronunciationCard, SentenceCard, SubscriptionPlan } from './types';

export interface LessonItem {
  id: string;
  topicNum: number;
  title: string;
  subtitle: string;
  level: 'foundation' | 'everyday' | 'fluency' | 'professional' | 'mastery';
  icon: 'mic' | 'waveform' | 'user' | 'star' | 'book';
  phoneticTip: string;
  bengaliTip: string;
  exercises: string[];
  progress: number; // 0 to 100
  status: 'done' | 'active' | 'locked';
  durationLabel?: string;
  difficulty?: 'Easy' | 'Medium' | 'Advanced';
  themeCategory?: 'workplace' | 'daily' | 'travel' | 'phonics' | 'academic';
  trendingTag?: 'TRENDING NOW' | 'POPULAR' | 'NEW' | 'MOST REPETITIVE';
}

export interface CoachProfile {
  id: string;
  name: string;
  emoji: string;
  title: string;
  bengaliLabel: string;
  description: string;
  accent: string;
  tag: string;
  bgGradient: string;
  textColor: string;
  interestTopic: string;
  initialGreeting: string;
  imageUrl?: string;
}

export const COACH_PROFILES: CoachProfile[] = [
  {
    id: "vani",
    name: "Coach VANI",
    emoji: "👑",
    title: "Chief Vocal Architect",
    bengaliLabel: "ভানি (প্রধান সহকারী)",
    description: "Our main AI focused on phonetic alignments, rhythm syllable intervals, and standard spoken feedback.",
    accent: "Standard en-IN accent",
    tag: "👑 Main Coach",
    bgGradient: "from-amber-50 to-orange-100 border-amber-350 hover:border-amber-600 shadow-amber-100",
    textColor: "text-amber-800",
    interestTopic: "General Conversation",
    initialGreeting: "नमस्कार! 🙏 I am VANI, your senior speech coach. Let's practice standard pacing and clear articulation together today!",
    imageUrl: "https://images.unsplash.com/photo-1618005198143-e52834658512?w=300&auto=format&fit=crop&q=85&bri=18&con=14&sharp=25&sat=12"
  }
];

export interface BadgeDefinition {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedMsg: string;
}

// Complete 50 Topic Curriculum matching VANI Spoken Coach guidelines
export const EXPLICIT_CURRICULUM: LessonItem[] = [
  // LEVEL 1: FOUNDATION (Topics 01-10)
  {
    id: "t1",
    topicNum: 1,
    title: "Topic 01: W vs V Sounds",
    subtitle: "W (lips rounded) vs V (teeth touch lower lip)",
    level: "foundation",
    icon: "mic",
    phoneticTip: "W: rounded lips | V: upper teeth on lower lip. Rest top teeth gently.",
    bengaliTip: "বাংলায় V-এর আলাদা বর্ণ নেই। 'ভ' বলবেন না, ওপরের দাঁত নিচের ঠোঁটে হালকা ছুঁয়ে বলুন 'very', 'voice'।",
    exercises: ["very", "village", "voice", "victory", "violin", "water", "window", "winner", "wave"],
    progress: 100,
    status: "done",
    durationLabel: "7 Min",
    difficulty: "Easy",
    themeCategory: "phonics",
    trendingTag: "TRENDING NOW"
  },
  {
    id: "t2",
    topicNum: 2,
    title: "Topic 02: Voiced & Unvoiced TH",
    subtitle: "Put tongue slightly between front teeth",
    level: "foundation",
    icon: "waveform",
    phoneticTip: "Voiced (this, that) & Unvoiced (think, three). Flow gentle air.",
    bengaliTip: "বাঙালিরা TH-কে 'দ' (d) বা 'থ' বলে। জিভ দাঁতের মাঝে আলতো ছুঁয়িয়ে বাতাস বের করুন: 'this' ও 'think'।",
    exercises: ["this", "that", "these", "thank", "three", "through", "both", "mouth", "teeth"],
    progress: 80,
    status: "active",
    durationLabel: "6 Min",
    difficulty: "Medium",
    themeCategory: "phonics",
    trendingTag: "POPULAR"
  },
  {
    id: "t3",
    topicNum: 3,
    title: "Topic 03: Short vs Long Vowels",
    subtitle: "Changing vowel length changes meaning",
    level: "foundation",
    icon: "book",
    phoneticTip: "Pairs: ship/sheep, bit/beat, man/main, cut/coat, hat/heart.",
    bengaliTip: "স্বল্প ও দীর্ঘ স্বরের পার্থক্য জানুন। 'sitting' কে 'seeting' বলবেন না, ছোট করে বলুন।",
    exercises: ["bit", "beat", "ship", "sheep", "sitting", "feeling", "hat", "heart"],
    progress: 0,
    status: "locked",
    durationLabel: "8 Min",
    difficulty: "Easy",
    themeCategory: "phonics"
  },
  {
    id: "t4",
    topicNum: 4,
    title: "Topic 04: Silent Letters in Speech",
    subtitle: "Letters that stay hidden in speech",
    level: "foundation",
    icon: "star",
    phoneticTip: "know (silent K), honest (silent H), Wednesday (silent D), receipt (silent P).",
    bengaliTip: "ইংরেজিতে কিছু অক্ষর অনুচ্চারিত থাকে। যেমন honest-এ H নয় 'অ' দিয়ে শুরু করুন, Wednesday-তে D বাদ দিন।",
    exercises: ["know", "knife", "honest", "wrong", "write", "Wednesday", "psychology", "receipt"],
    progress: 0,
    status: "locked",
    durationLabel: "9 Min",
    difficulty: "Medium",
    themeCategory: "phonics",
    trendingTag: "NEW"
  },
  {
    id: "t5",
    topicNum: 5,
    title: "Topic 05: Greetings & Self Intro",
    subtitle: "Formal vs Informal spoken introductions",
    level: "foundation",
    icon: "user",
    phoneticTip: "Keep speech clear. 'Pleasure to meet you' / 'How do you do?'",
    bengaliTip: "আত্মবিশ্বাসের সাথে সংক্ষেপে নিজের নাম, কাজ ও বাড়ি কোথায় তা সোজা সরল ইংরেজি বাক্যে বলুন।",
    exercises: ["Hello", "Good morning", "My name is", "I work as a", "Pleasure to meet you"],
    progress: 0,
    status: "locked",
    durationLabel: "10 Min",
    difficulty: "Easy",
    themeCategory: "daily"
  },
  {
    id: "t6",
    topicNum: 6,
    title: "Topic 06: Numbers, Dates & Time",
    subtitle: "How to SAY values naturally in conversation",
    level: "foundation",
    icon: "mic",
    phoneticTip: "Large values, dates 'the fifth of March', time 'quarter past three'.",
    bengaliTip: "তারিখ বলতে '5 March' নয় বলুন 'the fifth of March'। সময় বলতে 'Half past seven' ব্যবহার করুন।",
    exercises: ["one hundred thousand", "fifth of March", "quarter past three", "twenty twenty-four"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t7",
    topicNum: 7,
    title: "Topic 07: Asking Questions Correctly",
    subtitle: "Rising vs Falling sentence intonations",
    level: "foundation",
    icon: "waveform",
    phoneticTip: "Yes/No (rising tone: Are you?), WH questions (falling tone: Where are you?).",
    bengaliTip: "'You are going where?' ভুল বাক্য। সঠিক বলুন 'Where are you going?' এবং প্রশ্নবোধক ভঙ্গিমায় বলুন।",
    exercises: ["Where are you going", "What time does it start", "Are you coming", "Could you help me"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t8",
    topicNum: 8,
    title: "Topic 08: Saying NO Politely",
    subtitle: "Decline, disagree and refuse with tact",
    level: "foundation",
    icon: "book",
    phoneticTip: "I'm afraid I can't... / I appreciate the offer but... / I see your point but...",
    bengaliTip: "সরাসরি 'No' না বলে ভদ্রভাবে বলুন: 'I am afraid I cannot make it' বা 'I will have to decline'।",
    exercises: ["I am afraid I cannot", "With all respect", "I appreciate the offer but"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t9",
    topicNum: 9,
    title: "Topic 09: Describing People & Places",
    subtitle: "Flowing descriptions of everyday objects",
    level: "foundation",
    icon: "user",
    phoneticTip: "Adjective Order: Opinion -> Size -> Age -> Color -> Origin.",
    bengaliTip: "মানুষ ও জাগগার বর্ণনা দিতে এডজেক্টিভের ক্রম বজায় রাখুন: 'A beautiful large old Indian red silk sari'।",
    exercises: ["tall with curly hair", "patient and kind", "beautiful old city", "crowded marketplace"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t10",
    topicNum: 10,
    title: "Topic 10: Talking About Routine",
    subtitle: "Habit expressions & Simple Present structures",
    level: "foundation",
    icon: "star",
    phoneticTip: "Use always, usually, often, then, after that, finally.",
    bengaliTip: "'Daily I am going' ভুল। অভ্যাস বোঝাতে 'I go every day' বা 'I usually wake up at six' বলুন।",
    exercises: ["I usually wake up", "after breakfast I take", "I go every day", "before sleeping I read"],
    progress: 0,
    status: "locked"
  },

  // LEVEL 2: EVERYDAY SPEAKING (Topics 11-20)
  {
    id: "t11",
    topicNum: 11,
    title: "Topic 11: Speaking About Past (Past Tense)",
    subtitle: "Irregular past tense mouth forms",
    level: "everyday",
    icon: "mic",
    phoneticTip: "went (not am go), came, saw, ate, took, made, knew, thought.",
    bengaliTip: "'I am go yesterday' বলবেন না। অতীতকালের জন্য সরাসরি বলুন 'I went yesterday' বা 'I saw him'।",
    exercises: ["went", "came", "saw", "ate", "took", "made", "knew", "thought"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t12",
    topicNum: 12,
    title: "Topic 12: Speaking About the Future",
    subtitle: "Will vs Going to vs Present Continuous",
    level: "everyday",
    icon: "waveform",
    phoneticTip: "will (sudden decisions), going to (prior designs), meeting (fixed setup).",
    bengaliTip: "ভবিষ্যতের কথা বলতে ‘will’, ‘going to’ এবং বর্তমান কন্টিনিউয়াস (I am meeting him tomorrow) ব্যবাহার করুন।",
    exercises: ["I will call you", "I am going to visit", "I am meeting him on Friday"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t13",
    topicNum: 13,
    title: "Topic 13: Shopping & Bargaining",
    subtitle: "Ask prices, claim discounts & check refunds",
    level: "everyday",
    icon: "book",
    phoneticTip: "How much does this cost? / Do you accept card? / Can I get a discount?",
    bengaliTip: "দোকানে গিয়ে কেনাকাটা ও দরাদরি করার স্মার্ট বাক্য অভ্যাস করুন।",
    exercises: ["How much is this", "Can you give me a discount", "do you accept cards", "return this please"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t14",
    topicNum: 14,
    title: "Topic 14: Telephonic Conversation",
    subtitle: "Formulating greetings, holds & transfers",
    level: "everyday",
    icon: "user",
    phoneticTip: "Hello, this is [name] calling. / Could you hold on? / Transfer you to...",
    bengaliTip: "ফোনে কথা শুরুতে এবং মাঝে হোল্ডে বা কাউকে ট্রান্সফার করার শিষ্ট বাক্যগুলি শিখুন।",
    exercises: ["This is calling", "Could I speak to", "hold on for a moment", "transfer you to"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t15",
    topicNum: 15,
    title: "Topic 15: At the Doctor (Medical English)",
    subtitle: "Expressing symptoms & dosages clearly",
    level: "everyday",
    icon: "star",
    phoneticTip: "sore throat, dizzy, headache, dosage, follow-up.",
    bengaliTip: "ডাক্তারের কাছে নিজের অসুস্থতা খুলে বলতে 'sore throat' (গলা ব্যথা) বা 'feel dizzy' (মাথা ঘোরা) বলুন।",
    exercises: ["headache since morning", "throat is sore", "feel dizzy", "take medicines thrice"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t16",
    topicNum: 16,
    title: "Topic 16: Expressing Feelings & Emotions",
    subtitle: "Expanding beyond simple 'I am fine'",
    level: "everyday",
    icon: "mic",
    phoneticTip: "Positive: excited, relieved, content. Negative: frustrated, anxious, overwhelmed.",
    bengaliTip: "শুধু 'fine' বা 'sad' নয়, অনুভূতি প্রকাশ করুন 'exhausted' বা 'delighted' দিয়ে।",
    exercises: ["quite exhausted", "really anxious", "absolutely delighted", "overwhelmed with joy"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t17",
    topicNum: 17,
    title: "Topic 17: Giving & Receiving Compliments",
    subtitle: "Reacting gracefully without 'only' fillers",
    level: "everyday",
    icon: "waveform",
    phoneticTip: "That is kind of you to say. / I really appreciate that. Avoid 'only' at the end.",
    bengaliTip: "প্রশংসার উত্তরে শুধু Thank you নয়, বলুন 'That is so kind of you to say'। বাক্যের শেষে 'only' বলা বন্ধ করুন।",
    exercises: ["excellent job", "lovely idea", "kind of you to say", "appreciate that"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t18",
    topicNum: 18,
    title: "Topic 18: Spoken Fillers & Connectors",
    subtitle: "Connect your speech smoothly instead of 'um'",
    level: "everyday",
    icon: "book",
    phoneticTip: "As I was saying... / To put it another way... / What I mean is...",
    bengaliTip: "কথা বলার সময় 'আআআ' (um/er) না করে 'Let me think for a moment' বা 'What I mean is' বলুন।",
    exercises: ["As I was saying", "To put it another way", "What I mean is", "Let me think about that"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t19",
    topicNum: 19,
    title: "Topic 19: Spoken English at the Workplace",
    subtitle: "Office professional phrases for client syncs",
    level: "everyday",
    icon: "user",
    phoneticTip: "follow up on, schedule a meeting, clarify, get back to you.",
    bengaliTip: "অফিসে কথা বলতে 'I wanted to follow up' বা 'Could we schedule a meeting' বলুন।",
    exercises: ["follow up regarding", "schedule a meeting", "clarification on", "get back to you shortly"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t20",
    topicNum: 20,
    title: "Topic 20: Telling Stories & Experiences",
    subtitle: "Using narrative past markers dynamically",
    level: "everyday",
    icon: "star",
    phoneticTip: "So this one time, Last year when, I was waiting when suddenly...",
    bengaliTip: "গল্প বলার সময় শুরু করুন 'So this one time' দিয়ে। ঘটনা প্রবাহে অতীত কাল বজায় রাখুন।",
    exercises: ["this one time", "I remember the day", "I was waiting when suddenly", "strange thing happened"],
    progress: 0,
    status: "locked"
  },

  // LEVEL 3: FLUENCY BUILDER (Topics 21-30)
  {
    id: "t21",
    topicNum: 21,
    title: "Topic 21: Phrasal Verbs in Daily Speech",
    subtitle: "Give up, look into, carry on...",
    level: "fluency",
    icon: "mic",
    phoneticTip: "give up (quit), look into (investigate), put off (delay).",
    bengaliTip: "চলতি ইংরেজিতে Phrasal Verbs দিয়ে সহজে মনের ভাব প্রকাশ করা শিখুন। 'investigate' এর জায়গায় বলুন 'look into'।",
    exercises: ["look into this", "gave up smoking", "put off the meeting", "get along well"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t22",
    topicNum: 22,
    title: "Topic 22: Common Idioms in Conversation",
    subtitle: "Make expressions look and sound natural",
    level: "fluency",
    icon: "waveform",
    phoneticTip: "break the ice, under the weather, cost an arm and a leg, hit the sack.",
    bengaliTip: "একটু এডভান্সড ইংরেজি শোনাতে বাগধারা ব্যবহার করুন, যেমন অসুস্থ বোঝাতে 'under the weather' বলুন।",
    exercises: ["break the ice", "under the weather", "cost an arm and a leg", "hit the nail on the head"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t23",
    topicNum: 23,
    title: "Topic 23: Difficult Pronunciations",
    subtitle: "Soften common corporate tongue slips",
    level: "fluency",
    icon: "book",
    phoneticTip: "Comfortable (KUMF-ter-bul), Vegetables (VEJ-tuh-bulz), Chocolate (CHOK-lit).",
    bengaliTip: "কিছু বড় শব্দ সহজ করে সঠিক সিলেবলে বলুন। ভেজিটেবল নয়, বলুন 'KUMF-ter-bul' ও 'VEJ-tuh-bulz'।",
    exercises: ["comfortable", "vegetables", "chocolate", "wednesday", "receipt", "library"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t24",
    topicNum: 24,
    title: "Topic 24: Stress & Intonation",
    subtitle: "How stress on specific words alters meaning",
    level: "fluency",
    icon: "user",
    phoneticTip: "Stress: I didn't say, I DIDN'T say, I didn't say HE, I didn't SAY it.",
    bengaliTip: "বাক্যের কোন শব্দে জোর দিচ্ছেন তার ওপর নির্ভর করে বাক্যের অর্থ বদলায়। এটি মনোযোগ দিয়ে চর্চা করুন।",
    exercises: ["I didn't say", "did you see him", "she didn't call yesterday", "what are you doing"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t25",
    topicNum: 25,
    title: "Topic 25: Vocabulary for Indian Speakers",
    subtitle: "Stop using 'good name' or 'passed out'",
    level: "fluency",
    icon: "star",
    phoneticTip: "Avoid: good name -> name, passed out -> graduated, cousin brother -> cousin.",
    bengaliTip: "ভুল ইন্ডিয়ান ইংরেজি পরিহার করুন। 'passed out' মানে অজ্ঞান হওয়া, কলেজ পাশ বোঝালে বলুন 'graduated'।",
    exercises: ["state your name", "graduated last year", "she is my cousin", "move the meeting forward"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t26",
    topicNum: 26,
    title: "Topic 26: Respectful Disagreement",
    subtitle: "Softening counter arguments in formal debates",
    level: "fluency",
    icon: "mic",
    phoneticTip: "Absolutely / I take your point, however... / I see it slightly differently.",
    bengaliTip: "কারও সাথে দ্বিমত প্রকাশ করতে সরাসরি 'No' বা 'You are wrong' না বলে ভদ্রভাবে নিজের যুক্তি পেশ করুন।",
    exercises: ["I agree up to a point", "I see it differently", "with all due respect", "exactly my point"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t27",
    topicNum: 27,
    title: "Topic 27: 1-Minute Continuous Speech",
    subtitle: "Train sentence linking and lung pacing",
    level: "fluency",
    icon: "waveform",
    phoneticTip: "Describe hometown or job for 60 seconds. Keep pacing stable.",
    bengaliTip: "থতমত না খেয়ে, মনের ভাব পর পর গুছিয়ে টানা এক মিনিট ইংরেজিতে কথা বলার অভ্যাস গড়ে তুলুন।",
    exercises: ["my favorite festival", "description of hometown", "the person I admire", "memorable journey"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t28",
    topicNum: 28,
    title: "Topic 28: Pronunciation of -ED Endings",
    subtitle: "The 3 phonetic sound rules for past endings",
    level: "fluency",
    icon: "book",
    phoneticTip: "/t/ (worked, watched), /d/ (played, lived), /id/ (wanted, started).",
    bengaliTip: "-ed এর ৩টি আলাদা আওয়াজ হয়: /t/, /d/ এবং /id/। 'worked' কে ওয়ার্কেড উচ্চারণ করবেন না, বলুন 'workt'।",
    exercises: ["worked", "played", "wanted", "started", "watched", "lived", "needed", "stopped"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t29",
    topicNum: 29,
    title: "Topic 29: Small Talk with Strangers",
    subtitle: "Ice-breaking cashiers & commute routines",
    level: "fluency",
    icon: "user",
    phoneticTip: "Lovely weather today, isn't it? / Have you been waiting long?",
    bengaliTip: "নতুন অপরিচিত কারোর সাথে চমৎকার কথপোকথন শুরু করতে আবহাওয়া বা কুশল বিনিময় অভ্যাস করুন।",
    exercises: ["lovely weather today", "have you been waiting long", "first time here", "enjoy your weekend"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t30",
    topicNum: 30,
    title: "Topic 30: Apologising & Forgiving",
    subtitle: "Calming upset partners & taking accountability",
    level: "fluency",
    icon: "star",
    phoneticTip: "Minor: sorry about that. Serious: I sincerely apologise. Acceptance: No worries.",
    bengaliTip: "ভুলের গভীরতা বুঝে ক্ষমা চান। সাধারণ ভুলের জন্য 'Sorry about that' এবং গুরুতর ভুলের জন্য 'I sincerely apologise' বলুন।",
    exercises: ["sincerely apologise", "it was my fault", "no worries at all", "these things happen"],
    progress: 0,
    status: "locked"
  },

  // LEVEL 4: PROFESSIONAL ENGLISH (Topics 31-40)
  {
    id: "t31",
    topicNum: 31,
    title: "Topic 31: Job Interview - Self Intro",
    subtitle: "Perfecting the 90-second elevator story",
    level: "professional",
    icon: "mic",
    phoneticTip: "Framework: Present (role) -> Past (experience) -> Skills -> Achievment -> Future.",
    bengaliTip: "চাকরির ইন্টারভিউতে নিজের পরিচিতি দিন চমৎকারভাবে। শুরু করুন আপনার বর্তমান কাজ ও অর্জন দিয়ে।",
    exercises: ["currently studying at", "years of experience in", "particularly good at", "looking for opportunity"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t32",
    topicNum: 32,
    title: "Topic 32: Common HR Questions",
    subtitle: "Addressing gaps, weakness & future plans",
    level: "professional",
    icon: "waveform",
    phoneticTip: "Strengths (examples), Weakness (lessons to improve), 5-year views.",
    bengaliTip: "আপনার দুর্বলতা বলার সময় ইতিবাচকভাবে বলুন যে কীভাবে আপনি সেটি শুধরে নিচ্ছেন।",
    exercises: ["my biggest strengths are", "area where I improve", "see myself in five years", "why should we hire you"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t33",
    topicNum: 33,
    title: "Topic 33: Presentation Structures",
    subtitle: "Construct hook, transitions & call-to-actions",
    level: "professional",
    icon: "book",
    phoneticTip: "Opening hook -> Max 3 clear points -> Smooth transition -> Conclusion summary.",
    bengaliTip: "যেকোনো প্রেজেন্টেশনের শুরু করুন একটি প্রশ্ন বা আকর্ষণীয় তথ্য দিয়ে যাতে শ্রোতারা মনোযোগী হন।",
    exercises: ["let's begin with", "moving on to the next", "to summarize the key", "thank you for listening"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t34",
    topicNum: 34,
    title: "Topic 34: Negotiation & Persuasion",
    subtitle: "Finding common ground & placing formal offers",
    level: "professional",
    icon: "user",
    phoneticTip: "Would you be open to... / Find a middle ground... / What if we were to...",
    bengaliTip: "বেতন বা চুক্তি নিয়ে দরকষাকষির জন্য মার্জিত ও জোরালো ইংরেজি বাক্যগুলো আয়ত্ত করুন।",
    exercises: ["open to negotiation", "find a middle ground", "what if we were to", "agree on these terms"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t35",
    topicNum: 35,
    title: "Topic 35: Email Content Out Loud",
    subtitle: "Convert written notes to natural spoken dial-ins",
    level: "professional",
    icon: "star",
    phoneticTip: "I wanted to touch base regarding... / Just circling back on...",
    bengaliTip: "ইমেইল ভাষাকে মুখের ভাষায় পালটে ফেলুন: 'I wanted to touch base regarding today's project'।",
    exercises: ["touch base regarding", "circling back on", "bring to your attention", "follow up on email"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t36",
    topicNum: 36,
    title: "Topic 36: Giving Directives & Directions",
    subtitle: "Pave paths using clear logical sequences",
    level: "professional",
    icon: "mic",
    phoneticTip: "Sequences: First, Then, Finally. Commands: Turn left, Go straight, Past the hospital.",
    bengaliTip: "কাউকে রাস্তা চেনাতে বা কাজের নির্দেশ দিতে পর পর ক্রমানুসারে সহজ ইংরেজি ও ডিরেকশন কি-ওয়ার্ড ব্যবহার করুন।",
    exercises: ["turn left at the light", "go straight for meters", "just past the green building", "you cannot miss it"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t37",
    topicNum: 37,
    title: "Topic 37: Making Complaints Professionally",
    subtitle: "Calmly state problems & demand resolutions",
    level: "professional",
    icon: "waveform",
    phoneticTip: "State problem -> Impact -> Resolution wanted. Remain calm and firm.",
    bengaliTip: "রাগ প্রকাশ না করে মার্জিতভাবে সার্ভিস বা প্রোডাক্টের ত্রুটি নিয়ে অভিযোগ জানান।",
    exercises: ["there seems to be a problem", "this is not what expected", "appreciate if you could", "resolve this by tomorrow"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t38",
    topicNum: 38,
    title: "Topic 38: Banking & Finance English",
    subtitle: "Navigate loans, credits, statements & interest",
    level: "professional",
    icon: "book",
    phoneticTip: "savings account, dispute transaction, interest rate, withdraw, balance inquiry.",
    bengaliTip: "ব্যাংকে কাজ পরিচালনার জন্য দরকারি অর্থনৈতিক শব্দগুলি দিয়ে বাক্য সহজে তৈরি করুন।",
    exercises: ["open savings account", "dispute a transaction", "what is the interest rate", "apply for car loan"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t39",
    topicNum: 39,
    title: "Topic 39: Bengali Accent Softening Drill",
    subtitle: "Remedy retroflex sounds & syllable-timed pace",
    level: "professional",
    icon: "user",
    phoneticTip: "Slight dental T & D. Reduction: want to -> wanna. Link terminal consonants: next fact.",
    bengaliTip: "বাঙালিরা T এবং D খুব শক্ত করে ফেলে, জিব পেছনে না নিয়ে সামনে এনে হালকাভাবে উচ্চারণ করুন।",
    exercises: ["next fact on Wednesday", "pick it up immediately", "about the project issue", "text book on table"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t40",
    topicNum: 40,
    title: "Topic 40: IELTS Speaking Part 1 Prep",
    subtitle: "Scramble for vocabulary variety & coherence",
    level: "professional",
    icon: "star",
    phoneticTip: "Talk about hobbies or hometown. Display grammatical range and accurate flow.",
    bengaliTip: "IELTS টেস্টের প্রথম অংশের জন্য প্রস্তুত হোন। পরীক্ষকের প্রশ্নের সাবলীল ও বিস্তারিত উত্তর দিন।",
    exercises: ["tell me about hometown", "what do you enjoy doing", "prefer mornings or evenings", "leisure activities in Bengal"],
    progress: 0,
    status: "locked"
  },

  // LEVEL 5: MASTERY (Topics 41-50)
  {
    id: "t41",
    topicNum: 41,
    title: "Topic 41: Advanced Vocabulary Synonyms",
    subtitle: "Swap basic adjectives to powerful indicators",
    level: "mastery",
    icon: "mic",
    phoneticTip: "good -> outstanding/brilliant, bad -> dreadful/terrible, want -> intend/desire.",
    bengaliTip: "সহজ শব্দ বাদ দিয়ে চমৎকার প্রতিশব্দ যেমন 'unbelievable' বা 'appalling' ব্যবহার করতে শিখুন।",
    exercises: ["superb and outstanding", "dreadful consequence", "intend to establish", "considerable expansion"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t42",
    topicNum: 42,
    title: "Topic 42: Spoken Conditional Structures",
    subtitle: "If clauses & hypothetical predictions (regrets)",
    level: "mastery",
    icon: "waveform",
    phoneticTip: "Second (If I were rich, I would), Third (If I had studied, I would have). Avoid would-have-would-have.",
    bengaliTip: "অতীতের আফসোস বোঝাতে 'If I had studied, I would have passed' সঠিক গঠন ব্যবহার করুন।",
    exercises: ["if I were you I would", "if I had known earlier", "if you heat water it", "had she studied she would"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t43",
    topicNum: 43,
    title: "Topic 43: Humour, Understatement & Wit",
    subtitle: "Express self-deprecating light jokes naturally",
    level: "mastery",
    icon: "book",
    phoneticTip: "Understatement (not my finest hour), Exaggeration (waiting forever), Timing play.",
    bengaliTip: "কথায় বুদ্ধিমত্তার পরিচয় দিতে মৃদু রসবোধ বা ইংরেজি কৌতুকের সঠিক বাচনভঙ্গি আয়ত্ত করুন।",
    exercises: ["not exactly my finest hour", "waiting approximately forever", "I'm not the best cook", "made a silly blunder"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t44",
    topicNum: 44,
    title: "Topic 44: Debating & Strong Opinions",
    subtitle: "Counter arguments, statistics & core stances",
    level: "mastery",
    icon: "user",
    phoneticTip: "I firmly believe that... / While I understand that view... / The evidence suggests...",
    bengaliTip: "বিতর্কে গম্ভীর মতামত প্রকাশে 'I firmly believe' বা 'The evidence actually suggests' বলে শুরু করুন।",
    exercises: ["firmly believe that", "evidence suggests that", "while understand that view", "counter this argument"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t45",
    topicNum: 45,
    title: "Topic 45: Tech & Social Media Vocabulary",
    subtitle: "Identify reels, trends, algorithms & laggy frames",
    level: "mastery",
    icon: "star",
    phoneticTip: "algorithm, viral story, engagement, laggy screen share, unstable frame.",
    bengaliTip: "সোশ্যাল মিডিয়া ও আধুনিক প্রযুক্তি জগতের সঠিক পরিভাষায় ইংরেজি বলা অভ্যাস করুন।",
    exercises: ["algorithmic feed reach", "the platform went viral", "unstable screen laggy", "share your window screen"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t46",
    topicNum: 46,
    title: "Topic 46: Describing Data Trends Verbally",
    subtitle: "Slay presentation graphs with graphic markers",
    level: "mastery",
    icon: "mic",
    phoneticTip: "rose sharply, fell gradually, fluctuated, peaked at, remained stable.",
    bengaliTip: "গ্রাফের ওঠানামা বোঝাতে 'rose sharply' (খাড়া উঠেছিল) বা 'fell gradually' (ধীরে পড়েছিল) বলুন।",
    exercises: ["rose sharply in quarter", "peaked at fifty thousand", "remained stable this year", "fluctuated between percent"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t47",
    topicNum: 47,
    title: "Topic 47: Diplomatic & Tactful Speech",
    subtitle: "Deliver bitter truths using gentle softeners",
    level: "mastery",
    icon: "waveform",
    phoneticTip: "Instead of 'wrong idea' -> 'Interesting angle, have you also considered...?'",
    bengaliTip: "মতামত কঠোর না শোনায় জন্য নরম শব্দ ব্যবহার করুন: 'You may want to consider this potential option'।",
    exercises: ["have you also considered", "worth checking other options", "definitely potential here", "perhaps we could modify"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t48",
    topicNum: 48,
    title: "Topic 48: Spoken English for Travel",
    subtitle: "Navigate airport check-ins & hotel complaints",
    level: "mastery",
    icon: "book",
    phoneticTip: "window seat, late checkout, missing luggage, dispute reservation.",
    bengaliTip: "ভ্রমণের সময় বিমানবন্দরে, হোটেলে বা ট্যাক্সিচালকের সাথে সাবলীল কথা বলা শিখুন।",
    exercises: ["window seat please", "reservation under name", "late checkout options", "luggage seems missing"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t49",
    topicNum: 49,
    title: "Topic 49: Advanced Roleplay Simulation",
    subtitle: "Practice customer support escalations with managers",
    level: "mastery",
    icon: "user",
    phoneticTip: "escalating problem, request refund, supervisors, timeline to resolve.",
    bengaliTip: "কাস্টমার সাপোর্টের প্রতিনিধির সাথে তর্কাতর্কি বা রিফান্ডের অনুরোধ দৃঢ় গলায় ভদ্রভাবে বলা শিখুন।",
    exercises: ["connect with supervisor", "timeline for resolving this", "request complete refund", "documented details of complain"],
    progress: 0,
    status: "locked"
  },
  {
    id: "t50",
    topicNum: 50,
    title: "Topic 50: VANI's Graduation Assessment",
    subtitle: "Complete VANI's spoken competency assessment",
    level: "mastery",
    icon: "star",
    phoneticTip: "Review all 49 topics. Prove your voice confidence and get the VANI Certified Speaker seal!",
    bengaliTip: "৫০তম শেষ পাঠ! ভানির সাথে সম্পূর্ণ কথ্য পরীক্ষা দিন এবং আপনার চূড়ান্ত রিপোর্ট কার্ড ও সার্টিফিকেট জয় করুন!",
    exercises: ["VANI certified speaker", "graduated vocal master", "speaking English with confidence", "competency test completed"],
    progress: 0,
    status: "locked"
  }
];

export const PROGRESS_BADGES: BadgeDefinition[] = [
  {
    id: "badge-first-word",
    emoji: "🎙️",
    title: "First Word",
    description: "Say your first word correctly with VANI",
    unlocked: true,
    unlockedMsg: "Congratulations! You earned the 'First Word' badge! Keep speaking to open more treasures."
  },
  {
    id: "badge-five-streak",
    emoji: "🔥",
    title: "5-Day Streak",
    description: "Practice spoken lessons 5 days in a row",
    unlocked: true,
    unlockedMsg: "Fantastic consistency! You earned the '5-Day Streak' badge. Your lips are moving naturally!"
  },
  {
    id: "badge-sound-master",
    emoji: "🌟",
    title: "Sound Master",
    description: "Complete all sound pronunciation modules",
    unlocked: false,
    unlockedMsg: "Congratulations! You earned the 'Sound Master' badge! VANI is proud of your accent adjustment."
  },
  {
    id: "badge-conversationalist",
    emoji: "💬",
    title: "Conversationalist",
    description: "Finish 3 core situational roleplay scenarios",
    unlocked: false,
    unlockedMsg: "Fabulous script complete! You earned the 'Conversationalist' badge for conversational mastery."
  },
  {
    id: "badge-vani-star",
    emoji: "🏆",
    title: "VANI's Star",
    description: "Score 90% or higher in any audio verification draft",
    unlocked: true,
    unlockedMsg: "Spectacular! You scored over 90% and unlocked the prestigious 'VANI's Star' badge!"
  },
  {
    id: "badge-month-warrior",
    emoji: "📅",
    title: "Month Warrior",
    description: "Maintain continuous 30-day speech drills",
    unlocked: false,
    unlockedMsg: "Unbelievable dedication! You earned the 'Month Warrior' badge. You speak outstanding English now!"
  }
];

export const PRONUNCIATION_LIST: PronunciationCard[] = [
  {
    word: "Very",
    phonetic: "VEH-ree",
    focusArea: "V vs W sound",
    bengaliTip: "ঠোঁট কামড়ে বলুন 'ভি'। 'ডব্লিউ' নয়। বলুন 'VEH-ree', 'WEH-ree' নয়।"
  },
  {
    word: "This",
    phonetic: "ðɪs (TH-iss)",
    focusArea: "TH vs D sound",
    bengaliTip: "'দিস' বলবেন না। জিভ দাঁতের মাঝে রেখে বাতাস বের করে বলুন 'this'।"
  },
  {
    word: "Sheep",
    phonetic: "ʃiːp (SHeep - long sound)",
    focusArea: "Long Vowel vs Short Vowel (Ship)",
    bengaliTip: "একতু টেনে বলুন 'সীইপ'। ছোট করে বলবেন না, নয়তো 'জাহাজ' (ship) শোনায়।"
  },
  {
    word: "Honest",
    phonetic: "AH-nest (silent H)",
    focusArea: "Silent 'H'",
    bengaliTip: "'হনেস্ট' নয়, 'অ' দিয়ে শুরু করুন। বলুন 'AH-nest'।"
  },
  {
    word: "Wednesday",
    phonetic: "WENZ-day (silent D)",
    focusArea: "Silent letters",
    bengaliTip: "'ওয়েডনেস-ডে' নয়। বলুন 'WENZ-day'।"
  },
  {
    word: "Receipt",
    phonetic: "ri-SEET (silent P)",
    focusArea: "Silent letters",
    bengaliTip: "'রিসিপ্ট' নয়। মাঝের 'P' উচ্চারণ হবে না। বলুন 'ri-SEET'।"
  },
  {
    word: "Vanilla",
    phonetic: "və-NIH-lə",
    focusArea: "V vs W sound",
    bengaliTip: "ঠোঁটের ভেতরের অংশ দাঁতে লাগিয়ে বলুন 'və-NIH-lə'।"
  }
];

export const SENTENCE_CORRECTIONS: SentenceCard[] = [
  {
    wrong: "I am go to market yesterday",
    correct: "I went to the market yesterday",
    concept: "Past tense simple correction"
  },
  {
    wrong: "He is knowing me very well",
    correct: "He knows me very well",
    concept: "Continuous vs Stative verb"
  },
  {
    wrong: "He is more taller than me",
    correct: "He is taller than me",
    concept: "Double comparative adjective error"
  },
  {
    wrong: "Discuss about the matter",
    correct: "Discuss the matter",
    concept: "Redundant preposition"
  }
];

export const ROLEPLAY_SCENARIOS: PracticeScenario[] = [
  {
    id: "shopkeeper",
    title: "Market Vendor Shopkeeper",
    description: "Practice bargaining and buying fresh vegetables inside a busy local marketplace.",
    category: "Daily Situations",
    vaniRole: "Shopkeeper",
    userRole: "Customer",
    starterPrompt: "Namaskar saab, welcome to Vani Fresh Mart! Today we have pure organic tomatoes and beautiful green chillies. What can I get for you today?"
  },
  {
    id: "interview",
    title: "Software Job Interview",
    description: "Introduce yourself, explain your strengths, and talk about your past projects professionally.",
    category: "Professional Speaking",
    vaniRole: "Interviewer",
    userRole: "Job Applicant",
    starterPrompt: "Welcome. Thank you for taking the time to interview with Us today. To begin, could you introduce yourself and tell me why you think you fit this role?"
  },
  {
    id: "restaurant",
    title: "Ordering at a Dhaba/Restaurant",
    description: "Inquire about specials and order tasty butter chicken or dhal with hot tandoori rotis.",
    category: "Daily Situations",
    vaniRole: "Server",
    userRole: "Diner",
    starterPrompt: "Good evening sir! Welcome to Sher-e-Punjab Dhaba. Are you looking to order lunch, or should I recommend our special Paneer Butter Masala today?"
  },
  {
    id: "doctor",
    title: "Talking with a Doctor",
    description: "Explain your physical health symptoms (fever, sore throat) and understand dosage instructions.",
    category: "Helpful Situations",
    vaniRole: "Doctor",
    userRole: "Patient",
    starterPrompt: "Hi, please come in and take a seat. What seems to be the problem today? Tell me how you are feeling."
  }
];

// 3 plans matching prices in prompt
export const SUBSCRIPTION_MODELS = [
  {
    id: "trial" as SubscriptionPlan,
    name: "Free Trial",
    price: "₹0",
    period: "3 Sessions",
    description: "Perfect to experience VANI's spoken coaching instantly.",
    features: [
      "3 Full Interactive Voice Sessions",
      "Beginner sound correction list access",
      "No full role-play scenario unlocks",
      "Spoken feedback formula enabled"
    ],
    bg: "border-slate-800 bg-slate-900/60 text-slate-100"
  },
  {
    id: "basic" as SubscriptionPlan,
    name: "Basic Plan",
    price: "₹99",
    period: "per Month",
    description: "Affordable pronunciation correction for beginners.",
    features: [
      "Daily Spoken Practice Sessions",
      "Pronunciation & Sentence Builder access",
      "2 Standard Role-play scenarios",
      "Progress analytics tracker"
    ],
    bg: "border-slate-800 bg-slate-900/80 text-secondary"
  },
  {
    id: "premium" as SubscriptionPlan,
    name: "Premium Plus",
    price: "₹249",
    period: "per Month",
    description: "Complete spoken mastery at high-value pricing.",
    features: [
      "Everything in Basic subscription",
      "All modules 100% permanently unlocked",
      "Unlimited voice duration sessions",
      "All 10 professional roleplay scenarios"
    ],
    bg: "border-gold-primary bg-amber-950/20 text-slate-100 shadow-[0_0_20px_rgba(201,168,76,0.1)]"
  },
  {
    id: "pro" as SubscriptionPlan,
    name: "Pro Coach",
    price: "₹449",
    period: "per Month",
    description: "Uncompromised preparation for careers & interviews.",
    features: [
      "Everything in Premium subscription",
      "Job Interview speaking preps & models",
      "Accent softening modules",
      "Weekly spoken progress email report"
    ],
    bg: "border-purple-600 bg-purple-950/20 text-slate-100 shadow-[0_0_20px_rgba(124,58,237,0.1)]"
  }
];

export const PLAYSTORE_COMPLIANCE_TIPS = [
  {
    title: "G2: Subscription Transparency",
    desc: "Google Play Store requires direct display of pricing, terms of service, and clear methods for cancellation on subscription pages."
  },
  {
    title: "G4: Microphones/Permissions",
    desc: "Apps must explain explicitly why microphone permission is requested before trigger, following clear privacy notices."
  },
  {
    title: "G8: Safe for Families",
    desc: "AI content must contain filtering. Easy English utilizes moderate temperature prompts and family-friendly filters to satisfy Google's guidelines."
  },
  {
    title: "G11: Clear Cancel Link",
    desc: "Always provide a visible cancel button in subscriptions to align with international regulatory frameworks."
  }
];
