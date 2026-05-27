import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, MicOff, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { ROLEPLAY_SCENARIOS, LessonItem } from '../data';
import VANIAvatar from '../components/VANIAvatar';
import WaveformVisualizer from '../components/WaveformVisualizer';

interface RolePlayScreenProps {
  scenarioId: string;
  onBack: () => void;
  speakVani: (text: string) => void;
  voiceEnabled: boolean;
}

interface ThreadMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export default function RolePlayScreen({
  scenarioId,
  onBack,
  speakVani,
  voiceEnabled
}: RolePlayScreenProps) {
  const scenario = ROLEPLAY_SCENARIOS.find(s => s.id === scenarioId) || ROLEPLAY_SCENARIOS[0];
  
  // Custom script paths based on scenario
  const getScriptRepliesForUserText = (userText: string) => {
    const text = userText.toLowerCase();
    if (scenario.id === 'shopkeeper') {
      if (text.includes('much') || text.includes('price') || text.includes('koto')) {
        return "Ah, organic tomatoes are just ₹80 per kilogram, and fresh chillies are ₹40 per 100 grams. Because you are from Bengal, I give you a special discount! How many kilograms would you like?";
      }
      if (text.includes('discount') || text.includes('bargain') || text.includes('less')) {
        return "Thik ache, I will give you tomatoes at ₹70 per kilogram. This is my absolute best price for native students. Ready to pack them up?";
      }
      return "Excellent choice sir! Our vegetables are harvested fresh from local fields this morning. Shall we write down the billing on your digital cart?";
    } else if (scenario.id === 'interview') {
      if (text.includes('name') || text.includes('graduate') || text.includes('myself')) {
        return "That is a very clean background. Spoken articulation was robust. Can you explain your past software engineering or mechanical project accomplishments in detail?";
      }
      if (text.includes('strength') || text.includes('confidence') || text.includes('hard')) {
        return "Impressive. VANI indicates standard syntax structures used! Our team requires close collaboration. Do you have any questions about Easy English services or the engineering desk?";
      }
      return "Fantastic. Thank you for this vocal practice response. We will review your oral confidence index and notify you within 24 hours. Have a wonderful day!";
    } else if (scenario.id === 'restaurant') {
      if (text.includes('menu') || text.includes('special') || text.includes('order')) {
        return "I highly recommend our rich Butter Chicken paired with hot tandoori roti and fresh green salad. Shall I place the kitchen order for that?";
      }
      return "Thik ache! Your kitchen ticket is created. It will take only 10 minutes to arrive piping hot. Can I get you some cold lassi while you wait?";
    } else {
      // doctor
      if (text.includes('fever') || text.includes('cough') || text.includes('ill') || text.includes('sick')) {
        return "I see. Let me check your temperature. Yes, it looks like a seasonal throat flu. Take these mild paracetamol pills twice daily after meals, and rest for 2 days.";
      }
      return "Perfect. Drinking plenty of warm water is highly helpful to soothe the vocals. Do you have any other physical concerns today?";
    }
  };

  const [thread, setThread] = useState<ThreadMessage[]>([
    {
      id: 'init-rp',
      role: 'assistant',
      text: scenario.starterPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [stageNumber, setStageNumber] = useState(0);
  const [recognizer, setRecognizer] = useState<any>(null);
  const [listeningState, setListeningState] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [userSpeechDraft, setUserSpeechDraft] = useState('');
  const [systemPace, setSystemPace] = useState<'idle' | 'evaluating'>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let intervalId: any;
    if (listeningState) {
      setTimeLeft(60);
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            // Auto stop recording when 1-minute is up!
            toggleMicRolePlay();
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
  }, [listeningState]);
  
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    scrollerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  // Read starter prompt when screen opens
  useEffect(() => {
    setTimeout(() => {
      speakVani(scenario.starterPrompt);
    }, 400);
  }, [scenario]);

  useEffect(() => {
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let rec: any;
    if (SpeechAPI) {
      rec = new SpeechAPI();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN';

      rec.onstart = () => {
        setListeningState(true);
        setSpeechError(null);
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      };
      
      rec.onend = () => {
        setListeningState(false);
      };

      rec.onerror = (e: any) => {
        setListeningState(false);
        console.error("RolePlay Speech recognition error:", e.error);
        if (e.error === 'not-allowed') {
          setSpeechError("Microphone not allowed. Use the handy simulator quick text boxes below!");
        } else {
          setSpeechError(`Acoustic analyst skipped: "${e.error}". Use our quick reply simulator buttons below to talk.`);
        }
      };

      rec.onresult = (event: any) => {
        const txt = event.results[0][0].transcript;
        if (txt) {
          handlePostUserReply(txt);
        }
      };
      setRecognizer(rec);
    }

    return () => {
      if (rec) {
        try {
          rec.abort();
        } catch (e) {
          console.warn("Clean up RolePlay Speech Recognition:", e);
        }
      }
    };
  }, []);

  const toggleMicRolePlay = () => {
    if (!recognizer) {
      setSpeechError("SpeechRecognition HTML5 is unavailable in your browser. Practice using spelling simulator options!");
      return;
    }
    if (listeningState) {
      recognizer.stop();
    } else {
      setSpeechError(null);
      try {
        recognizer.start();
      } catch (err: any) {
        console.error("RP start error:", err);
        if (err.message?.includes('already started') || err.name === 'InvalidStateError') {
          setListeningState(true);
        } else {
          setSpeechError("Mic captured elsewhere. Click the spelling simulator shortcuts below!");
        }
      }
    }
  };

  const handlePostUserReply = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user bubble
    const userMsg: ThreadMessage = {
      id: `user-rp-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedThread = [...thread, userMsg];
    setThread(updatedThread);
    setSystemPace('evaluating');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          history: thread.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            text: msg.text
          })),
          level: 'INTERMEDIATE',
          currentModule: 'roleplay',
          scenario: scenario.title,
          step: stageNumber
        })
      });

      if (!response.ok) {
        throw new Error('Fallback to static response');
      }

      const data = await response.json();
      const vaniReplyText = data.text;

      const assistantMsg: ThreadMessage = {
        id: `vani-rp-${Date.now()}`,
        role: 'assistant',
        text: vaniReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThread(prev => [...prev, assistantMsg]);
      setStageNumber(prev => prev + 1);
      setSystemPace('idle');
      speakVani(vaniReplyText);

    } catch (err) {
      console.warn("API conversational dispatch failed in RolePlay screen. Falling back to offline path:", err);
      setTimeout(() => {
        const vaniReplyText = getScriptRepliesForUserText(text);
        const assistantMsg: ThreadMessage = {
          id: `vani-rp-${Date.now()}`,
          role: 'assistant',
          text: vaniReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setThread(prev => [...prev, assistantMsg]);
        setStageNumber(prev => prev + 1);
        setSystemPace('idle');
        speakVani(vaniReplyText);
      }, 700);
    }
  };

  const resetRolePlay = () => {
    setStageNumber(0);
    setThread([
      {
        id: `init-rp-${Date.now()}`,
        role: 'assistant',
        text: scenario.starterPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    speakVani(scenario.starterPrompt);
  };

  // Helper scenario cues based on scenario
  const getPreFilledReplies = () => {
    if (scenario.id === 'shopkeeper') {
      return [
        "How much is the organic tomato per kilo?",
        "Please give me some discount on green chillies.",
        "That is too expensive, can you make it less?",
        "Okay, pack 1 kilogram of tomatoes for me."
      ];
    } else if (scenario.id === 'interview') {
      return [
        "Hello Vani! I graduated in Computer Application from Kolkata.",
        "My strengths are continuous speaking practice and verbal confidence.",
        "Yes, what are the working hours for native coaches?",
        "Thank you so much for this wonderful opportunity today."
      ];
    } else if (scenario.id === 'restaurant') {
      return [
        "Please show me the menu specials.",
        "Is the butter chicken very spicy?",
        "I would like to order one Paneer Butter Masala.",
        "No, please get me one cold sweet lassi instead."
      ];
    } else {
      return [
        "Hello Doctor, I have high fever and a painful cough since yesterday.",
        "Do I need to take these flu pills before or after meals?",
        "Yes, I feel very weak today.",
        "Thank you Doctor, I will drink hot warm water directly."
      ];
    }
  };

  const difficulties = {
    shopkeeper: 'Easy Accent',
    interview: 'Expert Native',
    restaurant: 'Medium Fluency',
    doctor: 'Intermediate'
  };

  return (
    <div className="space-y-5 pt-1 text-left flex flex-col h-[calc(100vh-130px)]" id="roleplay-session-subscreen">
      
      {/* HEADER: Back arrow | Name | Diff */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle/10" id="roleplay-detail-header">
        <button 
          onClick={onBack}
          className="p-1 px-3 bg-bg-card border border-border-subtle hover:border-gold-primary text-gold-primary rounded-xl flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <div className="text-center max-w-[200px]">
          <h3 className="text-[10px] font-mono text-gold-primary uppercase tracking-widest leading-none font-bold">Dynamic Role-play</h3>
          <span className="text-sm font-sans text-text-primary font-bold block pt-1 truncate">{scenario.title}</span>
        </div>

        <span className="text-[10px] uppercase font-mono bg-gold-primary/15 text-gold-primary border border-gold-primary/30 px-2.5 py-1 rounded-full font-bold select-none">
          {difficulties[scenario.id as keyof typeof difficulties] || 'Intermediate'}
        </span>
      </div>

      {/* SCENE SETTER CARD */}
      <div className="bg-bg-surface border border-border-subtle rounded-2xl p-4 flex gap-3.5 items-center shadow-sm select-none" id="role-play-scene">
        <div className="text-3xl shrink-0">🎭</div>
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-gold-primary uppercase tracking-wider block font-bold">Scene Setter context:</span>
          <p className="text-xs text-text-primary font-medium leading-relaxed">
            VANI acts as the <strong className="text-gold-primary">{scenario.vaniRole}</strong>. Answer in English directly!
          </p>
        </div>
      </div>

      {/* CONVERSATION SCROLL AREA */}
      <div className="flex-1 bg-white border border-border-subtle p-4 rounded-2xl overflow-y-auto space-y-4 shadow-inner" id="role-play-talk-box">
        {thread.map((msg) => {
          const isVani = msg.role === 'assistant';
          return (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${isVani ? 'self-start mr-auto items-start' : 'self-end ml-auto items-end'}`}
            >
              <div className="flex items-center gap-1 mb-1">
                {isVani && <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-ping" />}
                <span className="text-[8px] font-mono text-text-muted uppercase tracking-wider block">
                  {isVani ? `🕉️ VANI (${scenario.vaniRole})` : '👤 YOU (CUSTOMER)'}
                </span>
              </div>
              
              <div className={`p-3 rounded-2xl text-xs leading-normal ${
                isVani 
                  ? 'bg-bg-surface border border-gold-primary/20 text-text-primary rounded-tl-none shadow-sm font-medium' 
                  : 'bg-gradient-to-tr from-gold-primary to-gold-light text-white font-bold rounded-tr-none shadow shadow-gold-primary/10'
              }`}>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}
        {systemPace === 'evaluating' && (
          <div className="flex gap-2 items-center text-[10px] text-text-secondary italic">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-ping" />
            <span>VANI is listening & preparing accent replies...</span>
          </div>
        )}
        <div ref={scrollerRef} />
      </div>

      {/* FIXED SPEECH CAPTURING CONTROLS */}
      <div className="bg-bg-card border border-border-subtle p-3 rounded-2xl space-y-3 shadow-md" id="role-play-inputs-container">
        
        <div className="flex justify-between items-center text-[10px] px-1">
          <span className="font-mono text-text-secondary uppercase select-none">Muted Speech Simulator Cues</span>
          <button 
            onClick={resetRolePlay}
            title="Reset simulation"
            className="text-text-secondary hover:text-gold-primary flex items-center gap-1 font-mono hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Quick simulation pills scroll of phrases */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" id="preset-replies-rack">
          {getPreFilledReplies().map((phrase) => (
            <button
              key={phrase}
              onClick={() => handlePostUserReply(phrase)}
              className="bg-bg-surface hover:bg-bg-surface/65 text-text-primary px-3 py-1.5 rounded-xl text-[10px] font-sans font-bold border border-border-subtle hover:border-gold-primary/30 whitespace-nowrap transition-colors cursor-pointer"
            >
              "{phrase}"
            </button>
          ))}
        </div>

        {/* Mic Toggle buttons */}
        <div className="flex pt-1 items-center justify-center flex-col space-y-2">
          <div className="relative">
            {listeningState && (
              <div className="absolute -inset-4 rounded-full bg-red-500/30 animate-ping z-0" />
            )}
            <button
              onClick={toggleMicRolePlay}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all z-10 relative cursor-pointer border-4 ${
                listeningState 
                  ? 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white scale-102 ring-8 ring-red-500/25 border-red-400' 
                  : 'bg-gradient-to-tr from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white min-shadow hover:scale-105 active:scale-95 ring-8 ring-violet-500/10 border-violet-500/40'
              }`}
            >
              {listeningState ? (
                <MicOff className="w-10 h-10 stroke-[2.5] mb-1 animate-pulse" />
              ) : (
                <Mic className="w-10 h-10 stroke-[2.5] mb-1" />
              )}
              <span className="text-[9px] font-mono font-black tracking-wider text-white uppercase select-none">
                {listeningState ? "TAP TO STOP" : "TAP & ANSWER"}
              </span>
            </button>
          </div>
          <span className="text-[9px] font-mono text-text-secondary uppercase select-none font-bold">
            {listeningState ? "🔴 SPEAK NOW - ACTIVE CAPTURE" : "🎤 Tap big button to answer vocally"}
          </span>

          {listeningState && (
            <div className="text-center font-mono text-white text-xs font-black animate-pulse flex flex-col items-center gap-0.5 bg-red-600 px-3.5 py-1.5 rounded-xl border border-red-500 z-15 shadow-[0_4px_12px_rgba(239,68,68,0.3)]">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span className="tracking-wider text-[9px] uppercase">🔴 1-MIN VOICE RECORDING</span>
              </div>
              <span className="text-xs font-black font-mono tracking-wider">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {speechError && (
          <div className="flex gap-1.5 p-2 bg-error-red/5 border border-error-red/15 text-error-red rounded-xl text-[9px] leading-relaxed">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p>{speechError}</p>
          </div>
        )}

      </div>

    </div>
  );
}
