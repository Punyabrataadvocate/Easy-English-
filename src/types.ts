export type StudentLevel = 'foundation' | 'everyday' | 'fluency' | 'professional' | 'mastery';

export type ActiveModule = 'pronunciation' | 'sentence-builder' | 'role-play' | 'fluency' | 'confidence';

export type SubscriptionPlan = 'locked' | 'trial_rs7' | 'trial' | 'basic' | 'premium' | 'pro';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  // Extracted values simulated for spoken evaluation
  stats?: {
    accuracy: number; // 0-100%
    fluency: number; // WPM or scale 1-10
    wordChoice: string; // Good, Needs work, Excellent
    corrections?: string; // gentle voice guide
  };
}

export interface PracticeScenario {
  id: string;
  title: string;
  description: string;
  category: string;
  vaniRole: string;
  userRole: string;
  starterPrompt: string;
}

export interface PronunciationCard {
  word: string;
  phonetic: string;
  focusArea: string;
  bengaliTip: string;
}

export interface SentenceCard {
  wrong: string;
  correct: string;
  concept: string;
}
