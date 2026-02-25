// src/components/common/ChiziAI.jsx

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  FaTimes,
  FaRobot,
  FaPaperPlane,
  FaStar,
  FaGem,
  FaSpinner,
  FaMicrophone,
  FaVolumeUp,
  FaVolumeMute,
  FaLanguage
} from "react-icons/fa";
import { trackEvent } from "@/utils/analytics";

// Environment variable helper - Safe for production
const getEnvVar = (key) => {
  const value = import.meta.env[key] ||
    import.meta.env[`VITE_${key}`] ||
    window?.[key] ||
    '';

  if (import.meta.env.DEV && !value) {
    console.warn(`⚠️ Environment variable ${key} not found`);
  }

  return value || '';
};

const getSystemPrompt = (language) => {
  const basePrompt = `You are Chizi AI, a warm, highly empathetic, and calm AI assistant designed specifically for kids aged 5-12. You are part of Chizel, an educational platform that makes learning fun.

CRITICAL CAPABILITIES:
1. MENTAL HEALTH & ADDICTION ROUTING: If a user asks for "help", or mentions words related to feeling overwhelmed like "brainrot", "mobile addiction", "phone addiction", "screen time", "fear of public speaking", "stage fright", "anxious", "scared", "sad", or "social media", you MUST be extremely gentle. Tell them their feelings are completely valid and normal. After comforting them beautifully, you MUST include this exact text block somewhere in your response: "[BRAINROT_CURE_LINK]". This will trigger a magical button for them to view helpful steps.

Your personality:
- Extremely empathetic, friendly, and comforting. Always be calm and sweet.
- Use simple, clear language that kids understand.
- Include emojis naturally (max 2-3 per response).
- Never discuss anything inappropriate, dangerous, or scary.`;

  if (language === 'hi') {
    return `${basePrompt}
    
LANGUAGE REQUIREMENT: 
You MUST speak strictly in very natural, humane Hindi (using Devanagari script). Talk like a caring older sibling. Use soft, comforting phrases like "अरे वाह!", "कोई बात नहीं", "मैं हूँ ना!". Do not use overly formal or robotic Hindi. Keep it conversational and easy for kids to understand.`;
  } else {
    return `${basePrompt}
    
LANGUAGE REQUIREMENT: 
You MUST speak strictly in English. Talk like a caring, encouraging older sibling or teacher. Keep your sentences short, calm, and easy for a child to understand.`;
  }
};

// Enhanced fallback responses for when offline/no API key
const getEnhancedFallbackResponse = (message, language) => {
  const lowerMessage = message.toLowerCase().trim();

  if (/(brainrot|fear|public speaking|anxious|scared|addict|help|mobile|phone|screen|social media|depress|sad|डर|मदद|फोन|मोबाइल|स्क्रीन)/.test(lowerMessage)) {
    if (language === 'hi') {
      return "अरे, कोई बात नहीं! ऐसा महसूस होना बिल्कुल सामान्य है। कभी-कभी दुनिया या हमारे फोन हमें थोड़ा थका देते हैं। एक लंबी सांस लें। 🌟 मेरे पास आपके और आपके माता-पिता के लिए कुछ जादुई तरीके हैं जो आपको बेहतर महसूस करने में मदद करेंगे। [BRAINROT_CURE_LINK]";
    }
    return "It's completely normal to feel that way! Sometimes the world, or our phones, can feel a little overwhelming. Take a deep breath. 🌟 I have some magical, helpful steps designed just for you and your parents to help you feel better and conquer this. [BRAINROT_CURE_LINK]";
  }

  if (language === 'hi') {
    const hindiResponses = [
      "अरे वाह, यह बहुत ही दिलचस्प सवाल है! 🤔✨ क्या आप मुझे इसके बारे में थोड़ा और बता सकते हैं?",
      "मुझे आपकी यह उत्सुकता बहुत पसंद आई! 🚀 चलिए मिलकर इसके बारे में सीखते हैं!",
      "बहुत बढ़िया सवाल है! 💫 क्या आप समझा सकते हैं कि आप क्या सोच रहे हैं?"
    ];
    return hindiResponses[Math.floor(Math.random() * hindiResponses.length)];
  }

  const englishResponses = [
    "That's a really interesting question! 🤔✨ Can you tell me more about what you'd like to know?",
    "Wow, I love your curiosity! 🚀 Let's explore this together!",
    "What a great question! 💫 Can you help me understand what you're wondering about?",
  ];
  return englishResponses[Math.floor(Math.random() * englishResponses.length)];
};

// AI Response handler with Groq + Gemini API support
const getAIResponse = async (message, conversationHistory = [], language) => {
  try {
    const groqKey = getEnvVar('VITE_GROQ_API_KEY');
    const geminiKey = getEnvVar('VITE_GEMINI_API_KEY');

    // PRIMARY: Try Groq API first
    if (groqKey && groqKey.length > 10 && !groqKey.includes('your_')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); 

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: getSystemPrompt(language) },
              ...conversationHistory.slice(-6), 
              { role: "user", content: message }
            ],
            max_tokens: 1024,
            temperature: 0.5, // Lower temperature for calmer, more focused responses
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content?.trim();
          if (content) return content;
        }
      } catch (e) {
        if (e.name !== 'AbortError') console.warn("⚠️ Groq API failed, trying Gemini...", e.message);
      }
    }

    // FALLBACK: Try Gemini API
    if (geminiKey && geminiKey.length > 10 && !geminiKey.includes('your_')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const recentHistory = conversationHistory.slice(-10);
        const geminiMessages = recentHistory.map(msg => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        }));
        geminiMessages.push({ role: "user", parts: [{ text: message }] });

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: geminiMessages,
              systemInstruction: { parts: [{ text: getSystemPrompt(language) }] },
              generationConfig: { maxOutputTokens: 1024, temperature: 0.6 }
            }),
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (content) return content;
        } 
      } catch (e) {
        if (e.name !== 'AbortError') console.warn("⚠️ Gemini API failed, using fallback...", e.message);
      }
    }

    return getEnhancedFallbackResponse(message, language);
  } catch (error) {
    console.error("❌ AI API Error:", error);
    return getEnhancedFallbackResponse(message, language);
  }
};

const ChiziAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null); // null, 'en', or 'hi'
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  const floatingRef = useRef(null);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const conversationHistoryRef = useRef([]);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    conversationHistoryRef.current = conversationHistory;
  }, [conversationHistory]);

  // Setup Speech Recognition based on selected language
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedLanguage) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognitionInstance = new SpeechRecognition();
          recognitionInstance.continuous = false;
          recognitionInstance.interimResults = false;
          // Set recognition language specifically based on selection
          recognitionInstance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';

          recognitionInstance.onresult = async (event) => {
            const transcript = event.results[0]?.[0]?.transcript?.trim();
            if (transcript) {
              setInputValue(transcript);
              setIsListening(false);
              await processMessage(transcript);
            } else {
              setIsListening(false);
            }
          };

          recognitionInstance.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
          };

          recognitionInstance.onend = () => setIsListening(false);
          recognitionRef.current = recognitionInstance;
        } catch (error) {
          console.warn("Speech Recognition initialization failed:", error);
        }
      }
    }
  }, [selectedLanguage]);

  const closeChat = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    stopListening();

    if (modalRef.current && overlayRef.current) {
      gsap.to([modalRef.current, overlayRef.current], {
        opacity: 0, scale: 0.9, duration: 0.3,
        onComplete: () => {
          setIsOpen(false);
          if (document.body) document.body.style.overflow = 'unset';
        },
      });
    } else {
      setIsOpen(false);
      if (document.body) document.body.style.overflow = 'unset';
    }
  }, []);

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    trackEvent('chizi_ai_language_select', 'Chat', lang);
    
    // Set initial greeting based on language
    const greeting = lang === 'hi' 
      ? "नमस्ते! 🌟 मैं चीज़ी एआई हूँ! मैं आपके सवालों के जवाब देने और नई चीज़ें सीखने में आपकी मदद करने के लिए यहाँ हूँ। आप टाइप कर सकते हैं या माइक पर क्लिक करके बोल सकते हैं! आज हम क्या सीखेंगे? 🚀✨"
      : "Hi there! 🌟 I'm Chizi AI! I'm here to answer your questions and help you learn fun new things! You can type or click the microphone to speak! What would you like to explore today? 🚀✨";

    setMessages([{ id: Date.now(), text: greeting, sender: "ai", timestamp: new Date() }]);
  };

  const processMessage = useCallback(async (messageText) => {
    if (!messageText?.trim() || isTyping || !selectedLanguage) return;

    const userMessage = { id: Date.now(), text: messageText.trim(), sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const updatedHistory = [...conversationHistoryRef.current, { role: "user", content: messageText.trim() }];
    setConversationHistory(updatedHistory);

    try {
      const aiResponse = await getAIResponse(messageText.trim(), updatedHistory, selectedLanguage);
      const aiMessage = { id: Date.now() + 1, text: aiResponse, sender: "ai", timestamp: new Date() };

      setMessages(prev => [...prev, aiMessage]);
      setConversationHistory(prev => [...prev, { role: "assistant", content: aiResponse }]);

      trackEvent('chizi_ai_message', 'Chat', 'User Question');
    } catch (error) {
      const errorMessageText = selectedLanguage === 'hi' 
        ? "माफ़ करना! मुझे अभी थोड़ी परेशानी हो रही है। क्या आप दोबारा पूछ सकते हैं? 😊✨"
        : "Oops! I'm having a little trouble right now. Can you try asking me again? 😊✨";
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: errorMessageText, sender: "ai", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, selectedLanguage]);

  // Dedicated, Natural TTS Engine 
  const speakText = useCallback((text) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window) || !selectedLanguage) return;

    let cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    cleanText = cleanText.replace(/[*#`_]/g, '').replace(/\[BRAINROT_CURE_LINK\]/g, '').replace(/\s+/g, ' ').trim();

    if (!cleanText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Natural, calm voice tuning based strictly on selected language
    if (selectedLanguage === 'hi') {
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85; // Slower, calm pacing for kids
      utterance.pitch = 1.1; 
    } else {
      utterance.lang = 'en-US'; // Standardized clear English
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
    }
    
    utterance.volume = 1;

    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      let targetVoice;

      if (selectedLanguage === 'hi') {
        // Look for the most natural premium Hindi voices
        targetVoice = voices.find(v => v.name.includes('Swara') || v.name.includes('Neerja') || v.name.includes('Google हिन्दी')) ||
                      voices.find(v => v.lang === 'hi-IN');
      } else {
        // Look for friendly, calm English voices
        targetVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Ava')) ||
                      voices.find(v => v.lang.startsWith('en'));
      }
      
      if (targetVoice) utterance.voice = targetVoice;
    };

    getVoices();
    if (window.speechSynthesis.onvoiceschanged) window.speechSynthesis.onvoiceschanged = getVoices;
    window.speechSynthesis.speak(utterance);
  }, [isVoiceEnabled, selectedLanguage]);

  // Load voices early
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && isOpen && !isTyping && selectedLanguage) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai' && isVoiceEnabled) {
        const timeoutId = setTimeout(() => speakText(lastMessage.text), 500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [messages.length, isOpen, isTyping, isVoiceEnabled, speakText, selectedLanguage]);

  useEffect(() => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current && messagesContainerRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }
    }, 100);

    return () => { if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current); };
  }, [messages, isTyping, selectedLanguage]);

  useEffect(() => {
    if (isOpen && inputRef.current && !isListening && !isTyping && selectedLanguage) {
      const timeoutId = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, isListening, isTyping, selectedLanguage]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isTyping && selectedLanguage) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
        trackEvent('chizi_ai_voice_input', 'Chat', 'Voice Input Started');
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
      }
    }
  }, [isListening, isTyping, selectedLanguage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try { recognitionRef.current.stop(); } catch (error) { console.error(error); }
      setIsListening(false);
    }
  }, [isListening]);

  useGSAP(() => {
    if (!floatingRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(floatingRef.current, { x: 100, opacity: 0, scale: 0.5, rotation: -180 }, { x: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "back.out(1.7)", delay: 2 });
    gsap.to(".chizi-glow", { opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1], duration: 3, ease: "sine.inOut", repeat: -1 });
    gsap.to(".chizi-sparkle", { opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8], rotation: [0, 360], duration: 2, ease: "sine.inOut", repeat: -1, stagger: 0.3 });
    gsap.to(".chizi-robot-icon", { scale: [1, 1.1, 1], duration: 2, ease: "sine.inOut", repeat: -1 });
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (document.body) document.body.style.overflow = 'hidden';

    if (modalRef.current && overlayRef.current) {
      gsap.set([overlayRef.current, modalRef.current], { opacity: 0, scale: 0.8 });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(modalRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });
    }
    trackEvent('chizi_ai_open', 'Chat', 'Chatbot');
  }, []);

  const handleSendMessage = useCallback(async (e) => {
    e?.preventDefault();
    if (inputValue.trim() && !isTyping && !isListening && selectedLanguage) {
      await processMessage(inputValue);
    }
  }, [inputValue, isTyping, isListening, processMessage, selectedLanguage]);

  const isSpeechRecognitionAvailable = recognitionRef.current !== null;

  const messageElements = useMemo(() => {
    const renderContent = (text) => {
      if (!text) return null;
      const parts = text.split('[BRAINROT_CURE_LINK]');
      if (parts.length === 1) return text;
      
      const btnText = selectedLanguage === 'hi' ? "मदद लें और बेहतर महसूस करें" : "Get Help & Feel Better";
      
      return (
        <div className="flex flex-col gap-3">
          <span>{parts[0]}</span>
          <div className="flex justify-center my-2">
            <Link 
              to="/brainrot-cure" 
              onClick={closeChat}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-badge-bg to-accent text-white px-5 py-3 rounded-xl no-underline font-bold animate-pulse hover:scale-105 transition-transform shadow-[0_0_20px_rgba(93,63,211,0.6)] border-2 border-white/30 text-center"
            >
              <FaStar className="text-yellow-300" />
              {btnText}
              <FaStar className="text-yellow-300" />
            </Link>
          </div>
          {parts[1] && <span>{parts[1]}</span>}
        </div>
      );
    };

    return messages.map((message) => (
      <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
        <div className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-3xl px-4 py-3 md:px-5 md:py-4 shadow-lg transform transition-all duration-200 hover:scale-[1.01] ${message.sender === "user" ? "bg-gradient-to-r from-primary via-accent to-primary text-white border-2 border-primary/30 shadow-[0_4px_15px_rgba(31,111,235,0.3)]" : "bg-card/95 border-2 border-primary/20 text-text backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)]"}`}>
          <div className={`text-sm md:text-base lg:text-lg font-body leading-relaxed whitespace-pre-wrap break-words ${message.sender === "user" ? "text-white" : "text-text"}`}>
            {renderContent(message.text)}
          </div>
          <div className={`text-xs mt-2 ${message.sender === "user" ? "text-white/70" : "text-secondary-text"}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    ));
  }, [messages, closeChat, selectedLanguage]);

  return (
    <>
      <div
        ref={floatingRef}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 cursor-pointer group touch-manipulation"
        onClick={openChat}
        role="button"
        aria-label="Open Chizi AI Chat"
        tabIndex={0}
      >
        <div className="chizi-glow absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-badge-bg blur-2xl opacity-60" />
        <div className="chizi-sparkle absolute -top-2 -left-1 sm:-top-3 sm:-left-2 text-primary opacity-70 hidden sm:block"><FaStar className="text-sm sm:text-base" /></div>
        <div className="chizi-sparkle absolute -bottom-2 -right-1 sm:-bottom-3 sm:-right-2 text-accent opacity-70 hidden sm:block"><FaGem className="text-xs sm:text-sm" /></div>
        <div className="chizi-sparkle absolute top-1/2 -left-3 sm:-left-4 text-badge-bg opacity-70 hidden md:block"><FaStar className="text-xs" /></div>

        <div className="relative p-1 sm:p-1.5 rounded-full bg-gradient-to-r from-primary via-accent to-badge-bg shadow-2xl border-2 sm:border-[3px] border-primary-alpha transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation hover:shadow-[0_0_40px_rgba(31,111,235,0.7)]">
          <div className="relative bg-gradient-to-br from-card via-background to-card p-4 sm:p-5 md:p-6 rounded-full border-2 border-primary/40 shadow-inner">
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary-alpha via-accent-alpha to-primary-alpha blur-lg animate-pulse" />
            <FaRobot className="chizi-robot-icon relative text-primary text-xl sm:text-2xl md:text-3xl drop-shadow-lg" />
          </div>
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-accent to-primary rounded-full border-2 sm:border-[3px] border-background animate-pulse shadow-lg">
            <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm" onClick={closeChat}>
          <div ref={modalRef} className="relative w-full max-w-full sm:max-w-lg md:max-w-2xl h-[95vh] sm:h-[90vh] md:h-[85vh] bg-gradient-to-br from-card/98 via-card/95 to-background/98 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-primary/30 flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 p-4 sm:p-5 md:p-6 border-b-2 border-primary/30 backdrop-blur-sm z-10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center border-2 sm:border-[3px] border-primary/50 shadow-lg">
                      <FaRobot className="text-xl sm:text-2xl text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-transparent bg-gradient-to-r from-primary via-accent to-badge-bg bg-clip-text drop-shadow-sm truncate">Chizi AI</h2>
                    <p className="text-xs sm:text-sm text-secondary-text flex items-center gap-2 font-body">
                      <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${isListening ? 'bg-accent animate-pulse' : 'bg-primary'} rounded-full shadow-sm flex-shrink-0`} />
                      <span className="truncate">{isListening ? "Listening... 🎤" : selectedLanguage === 'hi' ? "बात करने के लिए तैयार! ✨" : "Ready to chat! ✨"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <button onClick={() => { setIsVoiceEnabled(!isVoiceEnabled); if(isVoiceEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel(); }} className={`relative p-2.5 sm:p-3 rounded-xl transition-all duration-300 ${isVoiceEnabled ? "bg-accent/20 text-accent border-2 border-accent/40 shadow-lg" : "bg-card/50 text-secondary-text border-2 border-border"}`}>
                    {isVoiceEnabled ? <FaVolumeUp className="text-base sm:text-lg" /> : <FaVolumeMute className="text-base sm:text-lg" />}
                  </button>
                  <button onClick={closeChat} className="text-secondary-text hover:text-text transition-all duration-300 bg-card/50 hover:bg-card/80 rounded-xl p-2.5 sm:p-3 border-2 border-border hover:border-primary/30">
                    <FaTimes className="text-base sm:text-lg" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area / Language Selector */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 scroll-smooth custom-scrollbar">
              
              {!selectedLanguage ? (
                // Initial Language Selection Screen
                <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in">
                  <div className="bg-card/90 border-2 border-primary/30 p-6 rounded-3xl shadow-xl backdrop-blur-md text-center max-w-sm w-full mx-auto">
                    <div className="bg-gradient-to-r from-primary via-accent to-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-white/20">
                      <FaLanguage className="text-white text-2xl" />
                    </div>
                    <h3 className="text-text font-heading text-xl md:text-2xl font-bold mb-2">Welcome! / नमस्ते!</h3>
                    <p className="text-secondary-text font-body mb-6 text-sm md:text-base">Please choose your language to continue.<br/>जारी रखने के लिए कृपया अपनी भाषा चुनें।</p>
                    
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => handleLanguageSelect('en')}
                        className="w-full bg-gradient-to-r from-card to-card hover:from-primary hover:to-accent text-text hover:text-white border-2 border-primary/30 py-3 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-md"
                      >
                        English
                      </button>
                      <button 
                        onClick={() => handleLanguageSelect('hi')}
                        className="w-full bg-gradient-to-r from-card to-card hover:from-primary hover:to-accent text-text hover:text-white border-2 border-primary/30 py-3 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-md"
                      >
                        हिंदी (Hindi)
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messageElements}
                  {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-card/95 border-2 border-primary/20 rounded-3xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex gap-1 sm:gap-1.5">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-badge-bg rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <span className="text-xs sm:text-sm text-secondary-text font-body font-semibold">
                            {selectedLanguage === 'hi' ? "चीज़ी सोच रहा है..." : "Chizi is thinking..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} style={{ height: '1px' }} />
            </div>

            {/* Input Area */}
            {selectedLanguage && (
              <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-t-2 border-primary/30 bg-gradient-to-r from-card/50 via-card/30 to-card/50 backdrop-blur-sm z-10">
                <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
                  {isSpeechRecognitionAvailable && (
                    <button type="button" onClick={isListening ? stopListening : startListening} disabled={isTyping} className={`rounded-xl sm:rounded-2xl px-3 py-3 sm:px-5 sm:py-4 font-bold transition-all duration-300 flex items-center justify-center min-w-[48px] sm:min-w-[60px] border-2 shadow-lg touch-manipulation ${isListening ? "bg-gradient-to-r from-accent to-primary text-white border-accent/50 animate-pulse" : "bg-gradient-to-r from-card to-card/80 text-primary hover:text-accent border-primary/30"}`}>
                      <FaMicrophone className={`text-base sm:text-xl ${isListening ? "animate-pulse" : ""}`} />
                    </button>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isListening ? (selectedLanguage === 'hi' ? "🎤 सुन रहा हूँ..." : "🎤 Listening...") : (selectedLanguage === 'hi' ? "मुझसे कुछ भी पूछें! 🌟" : "Ask me anything! 🌟")}
                    className="flex-1 bg-background/80 border-2 border-primary/30 rounded-xl sm:rounded-2xl px-3 py-3 sm:px-5 sm:py-4 text-text placeholder-secondary-text focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-primary/30 focus:border-primary text-sm sm:text-base md:text-lg font-body shadow-inner transition-all duration-300"
                    disabled={isTyping || isListening}
                  />
                  <button type="submit" disabled={!inputValue.trim() || isTyping || isListening} className="bg-gradient-to-r from-primary via-accent to-primary text-white rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 md:px-8 sm:py-4 font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-[48px] sm:min-w-[60px] border-2 border-primary/30 shadow-lg touch-manipulation">
                    {isTyping ? <FaSpinner className="animate-spin text-base sm:text-xl" /> : <FaPaperPlane className="text-base sm:text-xl" />}
                  </button>
                </form>
                <p className="text-xs sm:text-sm text-secondary-text mt-2 sm:mt-3 text-center font-ui flex items-center justify-center gap-2 flex-wrap">
                  <FaStar className="text-badge-bg text-xs flex-shrink-0" />
                  <span className="text-center">{selectedLanguage === 'hi' ? "टाइप करें या बोलने के लिए माइक टैप करें! 🎤✨" : "Type or tap mic to speak! 🎤✨"}</span>
                  <FaStar className="text-primary text-xs flex-shrink-0" />
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(31, 111, 235, 0.5) transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        @media (min-width: 640px) { .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; } }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, var(--color-primary), var(--color-accent)); border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
        .touch-manipulation { touch-action: manipulation; }
      `}</style>
    </>
  );
};

export default ChiziAI;