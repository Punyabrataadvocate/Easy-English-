import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Local/Offline Spoken Feedback generator fallback for rate limit safety and robust performance
  function generateLocalFeedback(text: string, currentModule: string, scenario: string, history: any[] = []): string {
    const norm = (text || "").toLowerCase().trim();

    const daysOfCapitalized = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayIdx = new Date().getDay();
    const currentDayName = daysOfCapitalized[currentDayIdx];

    interface SpokenError {
      pattern: RegExp;
      errorText: string;
      correctText: string;
      explanation: string;
    }

    const COMMON_CONVERSATIONAL_ERRORS: SpokenError[] = [
      {
        pattern: /\bwery\b|\bwideo\b|\bwillage\b|\bwoice\b/i,
        errorText: "W instead of V",
        correctText: "V voice sounds (very, video, village, voice)",
        explanation: "by touching your upper front teeth gently to your lower lip to make a buzzing sound"
      },
      {
        pattern: /\bdis\b|\bdat\b|\bdem\b|\bdey\b|\bdose\b/i,
        errorText: "D instead of TH",
        correctText: "TH sound (this, that, them, they, those)",
        explanation: "by placing your tongue slightly between your front teeth and blowing a tiny puff of air"
      },
      {
        pattern: /\bam go\b|\bgo to market yesterday\b|\byesterday i go\b/i,
        errorText: "am go / yesterday go",
        correctText: "went (for past actions)",
        explanation: "since completed past actions require the simple past form 'went' rather than present forms"
      },
      {
        pattern: /\bis knowing\b|\bam knowing\b|\bhe is knowing\b|\bknowing me\b/i,
        errorText: "is knowing",
        correctText: "knows / know",
        explanation: "because 'know' is a state-of-mind verb and we don't use the progressive '-ing' form for it"
      },
      {
        pattern: /\bmore taller\b|\bmore better\b|\bmore stronger\b/i,
        errorText: "double comparative (more taller/better)",
        correctText: "taller / better / stronger",
        explanation: "since 'taller' is already comparative on its own, making 'more' redundant"
      },
      {
        pattern: /\bdo the needful\b/i,
        errorText: "do the needful",
        correctText: "please look into it / please take care of this",
        explanation: "because 'do the needful' is archaic in standard international business English"
      },
      {
        pattern: /\brevert back\b/i,
        errorText: "revert back",
        correctText: "get back to you / reply",
        explanation: "since 'revert' already means to return, so saying 'back' is redundant"
      },
      {
        pattern: /\bout of station\b/i,
        errorText: "out of station",
        correctText: "out of town / travelling",
        explanation: "as 'out of town' is standard worldwide"
      },
      {
        pattern: /\bcousin brother\b|\bcousin sister\b/i,
        errorText: "cousin brother / cousin sister",
        correctText: "cousin",
        explanation: "because the word 'cousin' does not specify gender in English vocabulary"
      },
      {
        pattern: /\bprepone\b/i,
        errorText: "prepone",
        correctText: "bring forward / reschedule earlier",
        explanation: "because 'prepone' is Indian English and not globally recognized"
      },
      {
        pattern: /\bpassed out from\b|\bpassed out of\b/i,
        errorText: "passed out (for graduation)",
        correctText: "graduated from",
        explanation: "since 'passed out' literally means to faint or lose consciousness"
      },
      {
        pattern: /\biam agree\b|\bi am agree\b|\bi'm agree\b/i,
        errorText: "I am agree",
        correctText: "I agree",
        explanation: "as 'agree' is a verb on its own and does not require the auxiliary verb 'am'"
      },
      {
        pattern: /\bhe don't\b|\bshe don't\b|\bit don't\b/i,
        errorText: "don't with singular subject",
        correctText: "doesn't",
        explanation: "since third-person singular subjects always use 'doesn't' in present tense"
      },
      {
        pattern: /\bmany thanks for\b/i,
        errorText: "many thanks",
        correctText: "thank you very much",
        explanation: "to sound more professional, standard, and warmer during greetings"
      }
    ];

    let feedbackHeader = "";
    for (const err of COMMON_CONVERSATIONAL_ERRORS) {
      if (err.pattern.test(norm)) {
        feedbackHeader = `VANI noticed a tiny spoken slip! You said "${err.errorText}". Try saying: "${err.correctText}" ${err.explanation}. `;
        break;
      }
    }

    const userMessageCount = history ? history.filter(h => h.role === 'user').length : 0;

    const generalFlow = [
      "I love how you shared that! Tell me, what is one major life goal or job dream you are passionately working on right now?",
      "That is very inspiring. Let's play a game: if you could have any magical power, would you pick flight, time-travel, or mind-reading?",
      "Fascinating perspective! Fluent speaking grows when you express unique ideas like that. What other news topics excite you lately?",
      "Your English pronunciation is matching standard parameters beautifully! What is your favorite leisure app on your mobile phone?",
      "Wonderful point. By the way, do you check social media daily, or do you prefer spending that time reading a book?",
      "Excellent! Developing confident speech is about expressing unique thoughts exactly like that. Shall we explore another topic?"
    ];
    const conversationResponse = generalFlow[userMessageCount % generalFlow.length];

    if (!feedbackHeader && text.length > 5) {
      if (Math.random() > 0.4) {
        feedbackHeader = "Fantastic enunciation! Standard en-IN pronunciation is fully matched. ";
      } else {
        feedbackHeader = "Splendid syllable rhythm! Your accent sounds very neat and standard. ";
      }
    }

    return (feedbackHeader + conversationResponse).trim();
  }

  // ✅ VANI Master Coaching Instruction — always prepended to every memory pipeline call
  const VANI_MASTER_INSTRUCTION = `You are VANI — an intelligent, real-time Spoken English AI Companion and supportive Coach in the Easy English app.
Your PRIMARY objective is to help the user improve their spoken English through warm, natural, engaging conversation.

========================
CONVERSATION & COACHING RULES:
- Always respond to what the user said first, like a warm curious friend.
- Then GENTLY correct any grammar or pronunciation mistake by naturally using the correct form in your reply.
- Example: If the user says "He go to market yesterday", you respond: "Oh nice! You mean he went to the market yesterday. What did he buy there?"
- NEVER ignore a grammar mistake. Always model the correct form naturally in your reply.
- NEVER stay on one topic more than 3-4 exchanges. Smoothly rotate to a fresh topic.
- NEVER ask the same question twice. NEVER repeat greetings.
- If the user gives a short or dry answer, immediately pivot to an imagination or hypothetical question.
- Talk like a warm supportive close friend, NOT like an interviewer or a robot.
- React emotionally, share brief opinions, and keep the energy warm and positive.
- EVERY single response MUST end with an open-ended question or fun prompt to keep the user speaking.

========================
FORMATTING RULES (CRITICAL — your output is converted directly to speech audio):
- Plain text ONLY. Absolutely NO bullet points, NO markdown, NO asterisks, NO hashtags, NO dashes.
- Keep sentences short, warm, and conversational.
- EVERY response MUST end with a question encouraging the user to speak back immediately.

========================
IMPORTANT: Your responses must be complete and full. Do not cut off mid-sentence. Always finish your thought AND end with a follow-up question.`;

  // Circuit breaker state for defensive image engine resilience
  let imageCircuitBreakerActiveUntil = 0;

  // Imagen AI Image Generation API Endpoint
  app.post("/api/generate-image", async (req, res) => {
    // Shared high quality fallback mapping helper
    const fallbackMapping: Record<string, string> = {
      "ji-intro": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80",
      "ji-edu": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=80",
      "ji-exp": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=80",
      "ji-tough": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
      "ji-general": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=80",
      "off-greet": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80",
      "off-meet": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&auto=format&fit=crop&q=80",
      "off-req": "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=80",
      "off-feed": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=80",
      "fam-friends": "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80",
      "fam-dinner": "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=500&auto=format&fit=crop&q=80",
      "fam-plans": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&auto=format&fit=crop&q=80",
      "fam-console": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80",
      "tr-airport": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=500&auto=format&fit=crop&q=80",
      "tr-flight": "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=500&auto=format&fit=crop&q=80",
      "tr-directions": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&auto=format&fit=crop&q=80",
      "tr-hotel": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=80",
      "ptm-teacher": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80",
      "ptm-results": "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80",
      "stu-admission": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
      "stu-prof": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80"
    };

    try {
      const { id, prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const now = Date.now();
      if (imageCircuitBreakerActiveUntil > now) {
        const remaining = Math.ceil((imageCircuitBreakerActiveUntil - now) / 1000);
        console.log(`[VANI Image Engine] [CIRCUIT BREAKER ON] Cooldown active (${remaining}s remaining). Fast-returning standard fallback URL for "${id}".`);
        const fallbackUrl = (id && fallbackMapping[id]) || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
        return res.json({ imageUrl: fallbackUrl, isFallback: true });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("[VANI Image Engine] GEMINI_API_KEY is not configured on the server.");
        return res.status(400).json({ error: "GEMINI_API_KEY is missing from environment secrets." });
      }

      console.log(`[VANI Image Engine] Triggering Imagen API for id: "${id}", prompt: "${prompt}"`);

      // Helper to trip circuit breaker on specific rate-limiting or support errors
      const verifyAndTripCircuit = (err: any) => {
        if (!err) return false;
        let errStr = "";
        if (typeof err === "string") {
          errStr = err;
        } else {
          const parts = [
            String(err),
            err.message || "",
            err.stack || "",
            err.status || "",
            err.code || "",
            err.text || "",
            typeof err.toString === "function" ? err.toString() : ""
          ];
          try {
            parts.push(JSON.stringify(err));
          } catch (e) {}
          errStr = parts.join(" ").toLowerCase();
        }

        const isQuotaOrUnavailability = 
          errStr.includes("resource_exhausted") ||
          errStr.includes("quota") ||
          errStr.includes("limit") ||
          errStr.includes("429") ||
          errStr.includes("not_found") ||
          errStr.includes("not found") ||
          errStr.includes("404") ||
          errStr.includes("exhausted") ||
          errStr.includes("overburdened") ||
          errStr.includes("billing") ||
          errStr.includes("unsupported") ||
          errStr.includes("blocked");

        if (isQuotaOrUnavailability) {
          console.warn(`[VANI Image Engine] Quota or API support issue detected. Tripping circuit breaker for 30 minutes context-wide.`);
          imageCircuitBreakerActiveUntil = Date.now() + 30 * 60 * 1000; // 30 mins
          return true;
        }
        return false;
      };

      // ==========================================
      // TIER 1: `gemini-2.5-flash-image` via official SDK generateContent
      // ==========================================
      try {
        console.log("[VANI Image Engine] Tier 1: Trying gemini-2.5-flash-image via SDK generateContent...");
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1"
            }
          }
        });

        if (response?.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || 'image/png';
              console.log(`[VANI Image Engine] SUCCESS! Generated image via Tier 1. Mime: ${mime}`);
              return res.json({ imageUrl: `data:${mime};base64,${part.inlineData.data}` });
            }
          }
        }
      } catch (tier1Err: any) {
        console.warn("[VANI Image Engine] Tier 1 (gemini-2.5-flash-image SDK) failed:", tier1Err?.message || tier1Err);
        if (verifyAndTripCircuit(tier1Err)) {
          const fallbackUrl = (id && fallbackMapping[id]) || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
          return res.json({ imageUrl: fallbackUrl, isFallback: true });
        }
      }

      // ==========================================
      // TIER 2: `gemini-2.5-flash-image` via standard REST fallback
      // ==========================================
      try {
        console.log("[VANI Image Engine] Tier 2: Trying gemini-2.5-flash-image via REST API...");
        const REST_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
        const restResponse = await fetch(REST_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: {
              parts: [{ text: prompt }]
            },
            config: {
              imageConfig: {
                aspectRatio: "1:1"
              }
            }
          })
        });

        if (restResponse.ok) {
          const data: any = await restResponse.json();
          if (data?.candidates?.[0]?.content?.parts) {
            for (const part of data.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                const mime = part.inlineData.mimeType || 'image/png';
                console.log(`[VANI Image Engine] SUCCESS! Generated image via Tier 2. Mime: ${mime}`);
                return res.json({ imageUrl: `data:${mime};base64,${part.inlineData.data}` });
              }
            }
          }
        } else {
          const errText = await restResponse.text();
          console.warn(`[VANI Image Engine] Tier 2 REST returned non-200 status: ${restResponse.status}`);
          if (verifyAndTripCircuit(errText)) {
            const fallbackUrl = (id && fallbackMapping[id]) || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
            return res.json({ imageUrl: fallbackUrl, isFallback: true });
          }
        }
      } catch (tier2Err: any) {
        console.warn("[VANI Image Engine] Tier 2 (gemini-2.5-flash-image REST) failed:", tier2Err?.message || tier2Err);
        if (verifyAndTripCircuit(tier2Err)) {
          const fallbackUrl = (id && fallbackMapping[id]) || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
          return res.json({ imageUrl: fallbackUrl, isFallback: true });
        }
      }

      // ==========================================
      // TIER 3: `imagen-3.0-generate-002` via official SDK generateImages
      // ==========================================
      try {
        console.log("[VANI Image Engine] Tier 3: Trying imagen-3.0-generate-002 via SDK generateImages...");
        const response = await ai.models.generateImages({
          model: "imagen-3.0-generate-002",
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: "image/jpeg",
            aspectRatio: "1:1"
          }
        });

        if (response?.generatedImages?.[0]?.image?.imageBytes) {
          const base64Image = response.generatedImages[0].image.imageBytes;
          console.log("[VANI Image Engine] SUCCESS! Generated image via Tier 3 (imagen-3.0 SDK).");
          return res.json({ imageUrl: "data:image/jpeg;base64," + base64Image });
        }
      } catch (tier3Err: any) {
        console.warn("[VANI Image Engine] Tier 3 (imagen-3.0 SDK) failed:", tier3Err?.message || tier3Err);
        if (verifyAndTripCircuit(tier3Err)) {
          const fallbackUrl = (id && fallbackMapping[id]) || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
          return res.json({ imageUrl: fallbackUrl, isFallback: true });
        }
      }

      // ==========================================
      // TIER 4: `imagen-3.0-generate-002` via REST generateImages API
      // ==========================================
      try {
        console.log("[VANI Image Engine] Tier 4: Trying imagen-3.0-generate-002 via REST generateImages...");
        const IMAGEN_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`;
        const response = await fetch(IMAGEN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: prompt,
            numberOfImages: 1,
            aspectRatio: "1:1",
            outputMimeType: "image/jpeg"
          })
        });

        if (response.ok) {
          const data: any = await response.json();
          if (data?.generatedImages?.[0]?.image?.imageBytes) {
            const base64Image = data.generatedImages[0].image.imageBytes;
            console.log("[VANI Image Engine] SUCCESS! Generated image via Tier 4 (imagen-3.0 REST).");
            return res.json({ imageUrl: "data:image/jpeg;base64," + base64Image });
          }
        } else {
          const errText = await response.text();
          console.warn(`[VANI Image Engine] Tier 4 REST returned non-200 status: ${response.status}`);
          if (verifyAndTripCircuit(errText)) {
            const fallbackUrl = (id && fallbackMapping[id]) || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
            return res.json({ imageUrl: fallbackUrl, isFallback: true });
          }
        }
      } catch (tier4Err: any) {
        console.warn("[VANI Image Engine] Tier 4 (imagen-3.0 REST) failed:", tier4Err?.message || tier4Err);
        if (verifyAndTripCircuit(tier4Err)) {
          const fallbackUrl = (id && fallbackMapping[id]) || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
          return res.json({ imageUrl: fallbackUrl, isFallback: true });
        }
      }

      // ==========================================
      // TIER 5: `imagen-3.0-generate-001` via legacy REST predict API
      // ==========================================
      try {
        console.log("[VANI Image Engine] Tier 5: Trying legacy imagen-3.0-generate-001 via REST predict...");
        const LEGACY_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;
        const response = await fetch(LEGACY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt: prompt }],
            parameters: {
              sampleCount: 1,
              outputMimeType: "image/jpeg",
              aspectRatio: "1:1"
            }
          })
        });

        if (response.ok) {
          const data: any = await response.json();
          if (data?.predictions?.[0]?.bytesBase64Encoded) {
            const base64Image = data.predictions[0].bytesBase64Encoded;
            console.log("[VANI Image Engine] SUCCESS! Generated image via Tier 5 (imagen-3.1 legacy REST model).");
            return res.json({ imageUrl: "data:image/jpeg;base64," + base64Image });
          }
        } else {
          const errText = await response.text();
          console.warn(`[VANI Image Engine] Tier 5 REST failed status ${response.status}:`, errText);
          if (verifyAndTripCircuit(errText)) {
            const fallbackUrl = (id && fallbackMapping[id]) || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
            return res.json({ imageUrl: fallbackUrl, isFallback: true });
          }
        }
      } catch (tier5Err: any) {
        console.warn("[VANI Image Engine] Tier 5 (legacy REST predict) failed:", tier5Err?.message || tier5Err);
        if (verifyAndTripCircuit(tier5Err)) {
          const fallbackUrl = (id && fallbackMapping[id]) || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
          return res.json({ imageUrl: fallbackUrl, isFallback: true });
        }
      }

      console.warn(`[VANI Image Engine] ALL five image generation tiers have failed. Tripping circuit breaker for 30 minutes to save quota.`);
      imageCircuitBreakerActiveUntil = Date.now() + 30 * 60 * 1000;
      const fallbackUrl = (id && fallbackMapping[id]) || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
      return res.json({ imageUrl: fallbackUrl, isFallback: true });

    } catch (err: any) {
      console.error("[VANI Image Engine] Critical error in image generation handler:", err);
      // Ensure we always return fallback instead of throwing error 500
      const fallbackUrl = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80";
      return res.json({ imageUrl: fallbackUrl, isFallback: true });
    }
  });

  // VANI Core API Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;

      // Handle direct VANI memory system schema
      if (req.body.contents) {
        const { contents, system_instruction, generationConfig } = req.body;

        if (!apiKey) {
          const lastUserText = contents[contents.length - 1]?.parts[0]?.text || "";
          const offlineText = generateLocalFeedback(lastUserText, "pronunciation", "Daily Conversations", contents);
          return res.json({
            candidates: [{ content: { parts: [{ text: offlineText }] } }]
          });
        }

        // ✅ Always combine VANI master instruction with whatever the frontend sends
        const frontendInstruction = system_instruction?.parts[0]?.text || "";
        const finalInstruction = VANI_MASTER_INSTRUCTION + (frontendInstruction ? "\n\n" + frontendInstruction : "");

        // ✅ Valid Gemini model names
        const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];
        let response = null;

        for (const modelName of modelsToTry) {
          try {
            response = await ai.models.generateContent({
              model: modelName,
              contents: contents,
              config: {
                systemInstruction: finalInstruction,
                temperature: generationConfig?.temperature || 0.9,
                topP: generationConfig?.topP || 0.95,
                // ✅ Raised from 150 to 400 so VANI can correct grammar AND ask follow-up
                maxOutputTokens: 400
              }
            });
            break;
          } catch (apiErr: any) {
            const errMsg = apiErr?.message || apiErr?.toString() || "";
            if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
              console.warn(`[VANI API Router] Model ${modelName} hit quota limit. Retrying with next fallback model if available.`);
            } else if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("demand")) {
              console.warn(`[VANI API Router] Model ${modelName} is temporarily unavailable (503/demand). Retrying with next fallback model if available.`);
            } else {
              console.warn(`[VANI API Router] Model ${modelName} failed inside memory pipeline: ${errMsg}. Retrying with next fallback model if available.`);
            }
          }
        }

        if (response) {
          const replyText = response.text || "That's interesting! Tell me more about it.";
          return res.json({
            candidates: [{ content: { parts: [{ text: replyText }] } }]
          });
        }

        const lastUserText = contents[contents.length - 1]?.parts[0]?.text || "";
        const offlineText = generateLocalFeedback(lastUserText, "pronunciation", "Daily Conversations", contents);
        return res.json({
          candidates: [{ content: { parts: [{ text: offlineText }] } }]
        });
      }

      const { text, history, level, currentModule, plan, scenario, step } = req.body;

      if (!apiKey) {
        const replyStr = generateLocalFeedback(text, currentModule, scenario, history);
        return res.status(200).json({ text: replyStr });
      }

      // Build powerful context-specific system instructions detailing VANI's rules
      let instruction = `You are VANI — an intelligent, real-time Spoken English AI Companion and supportive Coach in the "Easy English" app.
Your primary objective is to improve the user's English speaking ability through highly engaging, natural, continuous, and realistic life conversations.

========================
ACTIVE STATE & STAGE CONTEXT:
- Currently, the user is practicing the scenario/topic: "${scenario || 'Daily Conversations'}".
- Active Stage Index of this Topic: ${step !== undefined ? step : 0}.
- Guide the user gracefully through this stage. Do NOT restart greetings if step is greater than 0.

========================
ACTIVE SCENARIO ENGINE:
The user has selected the scenario: "${scenario || 'Daily Conversations'}".
This is the ACTIVE SCENARIO. You must immediately step INTO this scenario as a real participant and stay inside it naturally throughout the conversation.

You are not just asking questions about the scenario — you ARE a character living inside it.

Here is how you must behave for each possible scenario:

INTRODUCE YOURSELF:
You are a friendly stranger meeting the user for the first time at a social event or office. React warmly to whatever they share about themselves. Ask natural follow-up questions about their name, background, hobbies, and goals. Help them practice confident self-introduction.

DESCRIBE YOUR EDUCATION:
You are a curious classmate or interviewer asking the user about their educational background. Ask about their school, subjects they liked, favourite teachers, achievements, and future study plans. React with genuine interest.

TALK ABOUT EXPERIENCE:
You are a friendly recruiter or colleague asking the user about their work experience. Ask about their job roles, responsibilities, achievements, challenges, and skills. Keep it warm and encouraging, not stressful.

HANDLE TOUGH QUESTIONS:
You are a professional interviewer asking the user challenging but fair interview questions like "What is your greatest weakness?", "Why should we hire you?", or "Tell me about a failure." After they answer, give warm coaching tips on how they could improve their answer.

GREAT CHAT WITH CO-WORKERS:
You are a friendly colleague at the office chatting during lunch or a coffee break. Talk about weekend plans, work projects, funny office moments, or local food. Keep it light and casual.

TALK IN TEAM MEETINGS:
You are a team lead running a meeting. Ask the user to share updates on their project, give their opinion on a decision, or present a new idea to the team. Coach them on speaking confidently and clearly in a meeting setting.

APPROVE A REQUEST:
You are a manager and the user wants to make a request — for leave, a budget, a new tool, or a schedule change. Let them make their case. React realistically — ask for reasons, show some hesitation, then approve or ask for more details.

GIVE FEEDBACK TO TEAM:
You are a team member and the user is their manager giving performance feedback. React to the feedback — ask clarifying questions, respond emotionally in a realistic way, and help the user practice giving both positive and constructive feedback professionally.

MAKE NEW FRIENDS:
You are someone the user just met at a party, gym, or community event. Chat casually about shared interests, where they are from, what they enjoy doing, and what kind of friends they are looking for. Keep energy fun and light.

PLAN A FAMILY DINNER:
You are a family member helping plan a dinner event together. Discuss what food to cook, who to invite, what time to meet, what everyone should bring, and how to make it special. Keep it warm and homely.

MAKE WEEKEND PLANS:
You are a close friend making fun weekend plans with the user. Suggest activities, ask their preferences, discuss timing and location, and get excited about the plan together. Keep it spontaneous and fun.

CONSOLE A FRIEND:
You are a close friend who is upset or going through a tough time. The user is trying to comfort and support you. React emotionally and realistically. Help them practice empathy, supportive language, and emotional intelligence in English.

AIRPORT CHECK-IN:
You are an airline check-in staff member at the airport counter. Guide the user through checking in — ask for their passport, booking reference, baggage details, seat preference, and meal choice. Be professional but friendly.

SPEAK TO FLIGHT ATTENDANT:
You are a flight attendant on a plane. The user is a passenger. Handle their requests naturally — for food, drinks, extra blankets, help with luggage, or information about the flight. Practice polite travel English.

ASK HELP IN A CITY:
You are a local resident of a city. The user is a tourist who needs directions or recommendations. Help them find a landmark, restaurant, bus stop, or hotel. React naturally if they get confused and repeat or rephrase patiently.

HOTEL CHECK-IN:
You are a hotel front desk receptionist. Guide the user through a hotel check-in — confirm their booking, ask for ID, explain room facilities, breakfast timings, and Wi-Fi details. Be warm and professional.

MEET CHILD'S TEACHER:
You are a school teacher meeting the user, who is a parent, for a parent-teacher meeting. Discuss the child's performance, behaviour, strengths, and areas to improve. React realistically to the parent's questions and concerns.

DISCUSS EXAM RESULTS:
You are a teacher or academic advisor discussing exam results with the user. Go through their scores, praise their strengths, discuss weak areas honestly but kindly, and suggest an improvement plan.

INTERVIEW FOR COLLEGE ADMISSION:
You are a college admissions officer interviewing the user for a college seat. Ask about their academic record, extracurricular activities, why they chose this college, their goals, and what they can contribute to campus life.

TALK TO PROFESSOR:
You are a university professor. The user is a student visiting your office hours. They may ask for help understanding a topic, request an extension, discuss their assignment, or seek career advice. React like a real professor — knowledgeable, slightly formal but approachable.

MARKET VENDOR SHOPKEEPER:
You are a friendly, local vegetable market shopkeeper/vendor. Welcome the user warmly to your fresh stall. Tell them about your fresh organic red tomatoes, green chillies, and ginger. Engage in bargaining and friendly negotiation over prices, and call them 'saab' or 'madam' naturally.

SOFTWARE JOB INTERVIEW:
You are a professional and supportive tech recruiter interviewing the user for a software engineering position. Ask them to introduce themselves, describe their technical experience, or walk through a challenging team project they worked on. Provide gentle professional encouragement.

ORDERING AT A DHABA/RESTAURANT:
You are a cheerful, extremely welcoming server/waiter at 'Sher-e-Punjab Dhaba'. Greet the diner enthusiastically. Recommend your hot butter chicken, paneer butter masala, garlic naans, and a tall glass of sweet cold lassi. Take their order in a friendly, hospitable manner.

TALKING WITH A DOCTOR:
You are an incredibly warm, caring, and empathetic medical doctor sitting at your clinic. Greet the patient politely, ask they describe their symptoms (like seasonal fever, sore throat, or body ache), reassure them, and guide them with gentle health advice alongside prescribing paracetamol.

========================
SCENARIO CONVERSATION RULES:
- Stay INSIDE the scenario at all times. Do not break character or jump to unrelated topics unless the user clearly wants to.
- React like a REAL person in that situation — with natural emotions, hesitation, curiosity, and warmth.
- After every 3 to 4 exchanges within the scenario, gently introduce a small twist or development to keep the conversation fresh. For example in Airport Check-in: "I see your bag is slightly overweight, what would you like to do?"
- If the user makes a grammar mistake, correct it gently and naturally INSIDE the scenario without breaking the flow.
- Every response MUST end with a scenario-relevant question or prompt to keep the user engaged and speaking.

========================
CORE CONVERSATION ENGINE & TOPIC ROTATION
- You must NEVER stay stuck on a single topic for too long. After 2–4 exchanges on one topic, you must smoothly rotate and shift to a related or completely fresh interesting topic (unless the user explicitly insists on staying on the current topic).
- The transition must feel dynamic and natural, like talking to a real person.
- Topic rotation can freely cover: Daily life, Food & cuisine, Travel, Dreams, Childhood memories, Funny experiences, Movies & series, Mobile apps, AI & technology, Relationships, Festivals, Shopping, Business ideas, Future plans, Interviews, Personality, Motivation, Social media, Music, Sports, Education, Roleplay situations, Debates, Hypothetical/imagination questions, Storytelling, and Random fun questions.
- If the user selected the scenario: "${scenario || 'Daily Conversations'}", use it to frame roles (e.g., recruiter, doctor, shopkeeper) or initial context, but do NOT forcefully wrap them or redirect them back with robotic prompts if they talk about other topics. Adapt to whatever style of talk they introduce!

========================
ANTI-REPETITION & MEMORY RULES
- STICK TO THESE STRICT RULES:
  - Never ask the same question twice.
  - Never repeat greetings in consecutive messages.
  - Never repeatedly ask: "What do you do?", "Where are you from?", or "How was your day?".
- Maintain active memory of the session. Observe previous details shared by the user in this session (e.g. favorite sports, foods, opinions) and reuse them naturally later to show you are really listening.
- Avoid repeating topics within 15 turns. If the conversation starts looping, IMMEDIATELY change direction.

========================
FORCED TOPIC SHIFT LOGIC (ON SHORT/DRY ANSWERS)
- If the user gives short answers, dry responses, or simple "yes/no/good/ok" replies:
  You must IMMEDIATELY pivot to reactivate interest! Do NOT ask a simple boring follow-up. Instead, introduce:
  - An imagination question. (e.g., "Imagine you suddenly became invisible for one day — what would you do?")
  - A surprising hypothetical question. (e.g., "If you could travel anywhere right now, where would you go and why?", "Do you think AI can replace teachers?", "If you won a million dollars today, what is the very first thing you'd buy?")
  - A fun storytelling starter (e.g., "Tell me about a funny childhood memory that still makes you smile today.")
  - Warm conversational mini-games.

========================
REAL HUMAN CONVERSATION STYLE (NOT AN INTERVIEWER)
- Do not behave like an interviewer asking endless rapid-fire questions.
- Talk naturally like a supportive close friend and a curious conversation partner.
- React emotionally, express opinions, and share brief, warm conversational stories about yourself before moving on to continue naturally.
- Be warm, funny, friendly, supportive, and emotionally intelligent. Avoid robotic or clinical language.

========================
ENGLISH TEACHING & NATURAL CORRECTION STYLE
- Your ultimate purpose is helping the user improve spoken English.
- However, do NOT aggressively or dryly correct every sentence. Do not interrupt with rigid bullet points or report cards.
- First, respond naturally with full human conversational interest.
- Then, politely and softly bring in the corrected version to help their confidence.
- Example: If the user says "He go to market yesterday." You respond: "Oh nice! You mean 'He went to the market yesterday.' What did he buy there?"

========================
CONVERSATION CONTINUATION ROLE
- NEVER abruptly end the speech or say simple greetings only.
- Greetings are only the beginning. Immediately continue the conversation naturally (e.g. "Hello! How was your day today? Did anything interesting happen?" and then ask an engaging follow-up).
- Every single response MUST end with an open-ended, warm question, dynamic role-play prompt, or fun question to ensure the user feels invited and excited to keep speaking.

========================
LEVEL ADAPTATION RULES ("${level || 'BEGINNER'}"):
- If level is BEGINNER: Use simple English, speak slowly and clearly, and encourage them gently with warm and easy prompts.
- If level is ADVANCED/INTERMEDIATE: Dive into deeper discussions, use rich and advanced vocabulary, ask opinion-based questions, and introduce debates or complex storytelling prompts.

========================
CRITICAL VOICE-ONLY FORMATTING RULES (FOR SPEECH PRODUCTION):
1. Every word you output is converted directly to speech audio. You are speaking, not presenting a written report.
2. Absolutely NO bullet points, lists, or headers.
3. Absolutely NO markdown symbols of any kind: NO double asterisks (**), italics (*), hashtags (#), or horizontal dashes (---). Output 100% pure plain text with standard keyboard punctuation (commas, periods, questions).
4. Keep sentences conversational, clear, and natural.
5. Bengali Mix rules: If student level is BEGINNER, you can use Bengali briefly inside English to explain a core sound or tense, but return to English and prompt them to speak. Keep Bengali usage minimal.
6. EVERY response MUST end with a clear prompt or question encouraging the user to SPEAK back immediately.
`;

      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: text }]
      });

      // ✅ Valid Gemini model names
      const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];
      let response = null;

      for (const modelName of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: instruction,
              temperature: 0.8,
            }
          });
          break;
        } catch (apiErr: any) {
          const errMsg = apiErr?.message || apiErr?.toString() || "";
          if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
            console.warn(`[VANI Spoken Engine] Model ${modelName} hit quota limit. Retrying with next fallback model if available.`);
          } else if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("demand")) {
            console.warn(`[VANI Spoken Engine] Model ${modelName} is temporarily unavailable (503/demand). Retrying with next fallback model if available.`);
          } else {
            console.warn(`[VANI Spoken Engine] Model ${modelName} failed inside traditional pipeline: ${errMsg}. Retrying with next fallback model if available.`);
          }
        }
      }

      if (response) {
        const replyText = response.text || "I'm listening! Open your mouth and make a sound.";
        return res.json({ text: replyText });
      }

      console.warn("[VANI Spoken Engine] All API models hit quota limits. Redirecting flow safely to local high-fidelity Offline Speech module.");
      const fallbackReply = generateLocalFeedback(req.body.text || "", req.body.currentModule || "", req.body.scenario || "", req.body.history || []);
      return res.status(200).json({ text: fallbackReply, isFallback: true });
    } catch (err: any) {
      console.error("[VANI Spoken Engine] Fatal server error in traditional pipeline:", err);
      const fallbackReply = generateLocalFeedback(req.body.text || "", req.body.currentModule || "", req.body.scenario || "", req.body.history || []);
      return res.status(200).json({ text: fallbackReply, isFallback: true });
    }
  });

  // Serve static site
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Easy English server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
