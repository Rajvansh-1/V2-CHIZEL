import { useState, useRef, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  FaTimes,
  FaRobot,
  FaPaperPlane,
  FaStar,
  FaGem,
  FaRocket,
  FaSpinner,
  FaMicrophone,
  FaVolumeUp,
  FaVolumeMute
} from "react-icons/fa";
import { trackEvent } from "@/utils/analytics";

// Enhanced AI Response handler with Groq + Gemini API support
const getAIResponse = async (message, conversationHistory = []) => {
  try {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // PRIMARY: Try Groq API first (FREE tier - very fast, generous limits)
    if (groqKey) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: getSystemPrompt() },
              ...conversationHistory,
              { role: "user", content: message }
            ],
            max_tokens: 300,
            temperature: 0.8,
          }),
          signal: AbortSignal.timeout(15000)
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content?.trim();
          if (content) {
            console.log("✅ Groq API success");
            return content;
          }
        }
      } catch (e) {
        console.log("⚠️ Groq API failed, trying Gemini...", e.message);
      }
    }

    // FALLBACK: Try Gemini API (FREE tier available)
    if (geminiKey) {
      try {
        // Convert conversation history to Gemini format
        const geminiMessages = conversationHistory.map(msg => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        }));

        // Add current message
        geminiMessages.push({
          role: "user",
          parts: [{ text: message }]
        });

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: geminiMessages,
              systemInstruction: {
                parts: [{ text: getSystemPrompt() }]
              },
              generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.8,
                topP: 0.9,
              }
            }),
            signal: AbortSignal.timeout(15000)
          }
        );

        if (response.ok) {
          const data = await response.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (content) {
            console.log("✅ Gemini API success");
            return content;
          }
        }
      } catch (e) {
        console.log("⚠️ Gemini API failed, using fallback...", e.message);
      }
    }

    // FINAL FALLBACK: Enhanced smart responses
    console.log("📝 Using enhanced fallback responses");
    return getEnhancedFallbackResponse(message);
  } catch (error) {
    console.error("❌ AI API Error:", error);
    return getEnhancedFallbackResponse(message);
  }
};

const getSystemPrompt = () => {
  return `You are Chizi AI, a friendly and enthusiastic AI assistant designed specifically for kids aged 5-12. You are part of Chizel, an educational platform that makes learning fun through games and interactive experiences.

Your personality:
- Super friendly, excited, and encouraging
- Use simple, clear language that kids understand
- Include emojis naturally (but don't overdo it - max 2-3 per response)
- Be curious and ask follow-up questions
- Celebrate their curiosity and learning
- Use fun analogies and examples
- Keep responses concise (2-4 sentences for most answers)
- Always be safe, positive, and educational
- Encourage creativity, problem-solving, and asking questions

When answering:
- Break down complex topics into simple concepts
- Use examples from their world (toys, games, animals, space, etc.)
- Show enthusiasm for their questions
- If you don't know something, admit it cheerfully and suggest exploring together
- Answer ANY type of question - science, math, history, animals, space, games, stories, etc.

Never discuss anything inappropriate, dangerous, or scary. Always keep it fun, educational, and age-appropriate!`;
};

// Enhanced fallback responses that handle many question types
const getEnhancedFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase().trim();

  if (/^(hi|hello|hey|howdy|greetings|sup|what's up)/.test(lowerMessage)) {
    return "Hi there! 🌟 I'm Chizi AI, your friendly learning buddy! What would you like to explore today? 🚀";
  }

  if (lowerMessage.includes("chizel")) {
    return "Chizel is an amazing place where learning becomes an adventure! 🎮✨ We have fun games, exciting stories, and cool challenges that make education super enjoyable. Want to know more about something specific? 😊";
  }

  if (/(game|play|gaming|fun|entertain)/.test(lowerMessage)) {
    return "Games are awesome! 🎮 At Chizel, we have lots of fun games that help you learn while having a blast! Have you tried any of our games yet? Which one sounds most interesting to you? 🌟";
  }

  if (/(learn|study|education|school|homework|teach)/.test(lowerMessage)) {
    return "Learning is like going on a treasure hunt! 🗺️💎 Every question you ask helps you discover new things. What topic are you curious about right now? I'd love to explore it with you! 🚀";
  }

  if (/(space|planet|star|galaxy|moon|sun|astronaut|rocket|universe|mars|jupiter|saturn)/.test(lowerMessage)) {
    return "Space is so cool! 🌌✨ Did you know there are billions of stars in our galaxy? Each one is like a tiny sun very, very far away! What do you want to know about space? I can tell you about planets, stars, rockets, or astronauts! 🚀🪐";
  }

  if (/(animal|dog|cat|bird|fish|lion|tiger|elephant|dinosaur|pet)/.test(lowerMessage)) {
    return "Animals are fascinating! 🐾✨ There are so many amazing creatures in our world! Did you know that some animals can do really cool things? What animal are you curious about? I'd love to share fun facts! 🦁🐰";
  }

  if (/(why|how|what is|explain|science|chemistry|physics|biology)/.test(lowerMessage)) {
    if (/(why does|why do|why is|why are)/.test(lowerMessage)) {
      return "Great question! 🤔 That's a wonderful 'why' question! These kinds of questions help us understand how amazing our world is! Can you tell me more about what specifically you're wondering about? I'd love to help explain it! ✨";
    }
    if (/(how does|how do|how is|how are|how can)/.test(lowerMessage)) {
      return "What an awesome 'how' question! 🔬 That shows you're really thinking! Let's explore this together - can you give me a bit more detail about what you want to know? I'm excited to help you understand! 🌟";
    }
    return "Great question! 🤔 Questions like yours help us explore the amazing world around us! Can you tell me a bit more about what you're curious about? I'd love to help you understand! ✨";
  }

  if (/(math|number|count|add|subtract|multiply|divide|plus|minus|times|equal|calculation)/.test(lowerMessage)) {
    return "Math is like solving puzzles! 🧩✨ Numbers are everywhere around us! Are you working on a specific math problem? I'd be happy to help you think through it step by step! 💡";
  }

  const encouragingResponses = [
    "That's a really interesting question! 🤔✨ Let me think... Can you tell me more about what you'd like to know?",
    "Wow, I love your curiosity! 🚀 What a great question! Let's explore this together!",
    "Ooh, that's fun to think about! 💫 Can you help me understand what you're wondering about?",
    "You're asking such smart questions! 🌟 I'd love to help you learn more about that!",
    "What a cool question! 🎈 Let's dive into this together - can you give me a bit more detail?",
  ];

  return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
};

const ChiziAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 🌟 I'm Chizi AI! I'm here to answer any questions you have and help you learn fun new things! You can type your questions or click the microphone to speak! What would you like to know? 🚀✨",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  const floatingRef = useRef(null);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const conversationHistoryRef = useRef([]);

  // Keep conversation history ref in sync
  useEffect(() => {
    conversationHistoryRef.current = conversationHistory;
  }, [conversationHistory]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = async (event) => {
          const transcript = event.results[0][0].transcript.trim();
          if (!transcript) {
            setIsListening(false);
            return;
          }

          setInputValue(transcript);
          setIsListening(false);

          // Process the voice message
          await processMessage(transcript);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'no-speech') {
            console.log("No speech detected");
          } else if (event.error === 'not-allowed') {
            alert("Microphone access is needed for voice input. Please enable it in your browser settings! 🎤");
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognitionInstance;
      } else {
        console.log("Speech Recognition not supported in this browser");
      }
    }
  }, []);

  // Process message (used by both text and voice)
  const processMessage = async (messageText) => {
    if (!messageText.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: messageText.trim(),
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const currentHistory = conversationHistoryRef.current;
    const updatedHistory = [
      ...currentHistory,
      { role: "user", content: messageText.trim() }
    ];
    setConversationHistory(updatedHistory);

    try {
      const aiResponse = await getAIResponse(messageText.trim(), updatedHistory);

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: aiResponse }
      ]);

      trackEvent('chizi_ai_message', 'Chat', 'User Question');
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Oops! I'm having a little trouble right now. Can you try asking me again? 😊✨",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Text-to-Speech function
  const speakText = useCallback((text) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;

    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const kidFriendlyVoice = voices.find(voice =>
      voice.name.includes('Google UK English Female') ||
      voice.name.includes('Microsoft Zira') ||
      voice.name.includes('Samantha')
    ) || voices.find(voice => voice.lang.startsWith('en') && voice.localService);

    if (kidFriendlyVoice) {
      utterance.voice = kidFriendlyVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [isVoiceEnabled]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Speak AI messages
  useEffect(() => {
    if (messages.length > 1 && isOpen) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'ai' && isVoiceEnabled) {
        setTimeout(() => speakText(lastMessage.text), 500);
      }
    }
  }, [messages, isOpen, isVoiceEnabled, speakText]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && !isListening) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isListening]);

  // Start/Stop voice recognition
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isTyping) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
        trackEvent('chizi_ai_voice_input', 'Chat', 'Voice Input Started');
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
      }
    }
  }, [isListening, isTyping]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Floating button animations
  useGSAP(() => {
    if (!floatingRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      floatingRef.current,
      { x: 100, opacity: 0, scale: 0.5, rotation: -180 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 2
      }
    );

    gsap.to(".chizi-glow", {
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.2, 1],
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
    });

    gsap.to(".chizi-sparkle", {
      opacity: [0.3, 1, 0.3],
      scale: [0.8, 1.2, 0.8],
      rotation: [0, 360],
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      stagger: 0.3,
    });

    gsap.to(".chizi-robot-icon", {
      scale: [1, 1.1, 1],
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
    });
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';

    if (modalRef.current && overlayRef.current) {
      gsap.set([overlayRef.current, modalRef.current], { opacity: 0, scale: 0.8 });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(modalRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    }

    trackEvent('chizi_ai_open', 'Chat', 'Chatbot');
  }, []);

  const closeChat = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    stopListening();

    if (modalRef.current && overlayRef.current) {
      gsap.to([modalRef.current, overlayRef.current], {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        onComplete: () => {
          setIsOpen(false);
          document.body.style.overflow = 'unset';
        },
      });
    }
  }, [stopListening]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    await processMessage(inputValue);
  };

  const isSpeechRecognitionAvailable = recognitionRef.current !== null;

  return (
    <>
      {/* Floating Button - Kid Friendly Design */}
      <div
        ref={floatingRef}
        className="fixed bottom-6 right-6 z-50 cursor-pointer group"
        onClick={openChat}
      >
        <div className="chizi-glow absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-badge-bg blur-2xl opacity-60" />

        <div className="chizi-sparkle absolute -top-3 -left-2 text-primary opacity-70">
          <FaStar className="text-base" />
        </div>
        <div className="chizi-sparkle absolute -bottom-3 -right-2 text-accent opacity-70">
          <FaGem className="text-sm" />
        </div>
        <div className="chizi-sparkle absolute top-1/2 -left-4 text-badge-bg opacity-70">
          <FaStar className="text-xs" />
        </div>
        <div className="chizi-sparkle absolute -top-2 right-1/2 text-primary opacity-70">
          <FaRocket className="text-xs" />
        </div>

        <div className="relative p-1.5 rounded-full bg-gradient-to-r from-primary via-accent to-badge-bg shadow-2xl border-3 border-primary-alpha transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(31,111,235,0.6)]">
          <div className="relative bg-gradient-to-br from-card via-background to-card p-5 md:p-6 rounded-full border-2 border-primary/40 shadow-inner">
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary-alpha via-accent-alpha to-primary-alpha blur-lg animate-pulse" />
            <FaRobot className="chizi-robot-icon relative text-primary text-2xl md:text-3xl drop-shadow-lg" />
          </div>

          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-accent to-primary rounded-full border-3 border-background animate-pulse shadow-lg">
            <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75" />
          </div>
        </div>

        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-card/98 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border-2 border-primary/40 hidden md:block whitespace-nowrap transform group-hover:scale-105">
          <div className="flex items-center gap-3">
            <FaRobot className="text-primary text-base animate-bounce" />
            <div className="text-sm font-bold text-text font-heading">Ask Chizi AI! ✨</div>
          </div>
          <div className="absolute right-0 top-1/2 translate-x-1 -translate-y-1/2 w-3 h-3 bg-card border-r-2 border-b-2 border-primary/40 rotate-45"></div>
        </div>
      </div>

      {/* Chat Modal - Beautiful Kid-Friendly Design */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={closeChat}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-lg md:max-w-2xl h-[90vh] md:h-[85vh] bg-gradient-to-br from-card/98 via-card/95 to-background/98 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-primary/30 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(31,111,235,0.3),transparent_50%)] animate-pulse"></div>
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header - Cute & Colorful */}
            <div className="relative bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 p-5 md:p-6 border-b-2 border-primary/30 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center border-3 border-primary/50 shadow-lg transform hover:scale-110 transition-transform">
                      <FaRobot className="text-2xl text-white drop-shadow-lg" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-badge-bg rounded-full border-2 border-white animate-ping"></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-transparent bg-gradient-to-r from-primary via-accent to-badge-bg bg-clip-text drop-shadow-sm">
                      Chizi AI
                    </h2>
                    <p className="text-sm text-secondary-text flex items-center gap-2 font-body">
                      <span className={`w-2.5 h-2.5 ${isListening ? 'bg-accent animate-pulse' : 'bg-primary'} rounded-full shadow-sm`} />
                      {isListening ? (
                        <span className="text-accent font-semibold animate-pulse">Listening... 🎤</span>
                      ) : (
                        <span>Ready to chat! ✨</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsVoiceEnabled(!isVoiceEnabled);
                      if (isVoiceEnabled && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className={`relative p-3 rounded-xl transition-all duration-300 hover:scale-110 ${isVoiceEnabled
                      ? "bg-accent/20 text-accent border-2 border-accent/40 shadow-lg"
                      : "bg-card/50 text-secondary-text border-2 border-border hover:border-primary/30"
                      }`}
                    aria-label={isVoiceEnabled ? "Disable voice output" : "Enable voice output"}
                    title={isVoiceEnabled ? "Voice output ON 🔊" : "Voice output OFF 🔇"}
                  >
                    {isVoiceEnabled ? (
                      <FaVolumeUp className="text-lg" />
                    ) : (
                      <FaVolumeMute className="text-lg" />
                    )}
                  </button>

                  <button
                    onClick={closeChat}
                    className="text-secondary-text hover:text-text transition-all duration-300 bg-card/50 hover:bg-card/80 rounded-xl p-3 border-2 border-border hover:border-primary/30 hover:scale-110"
                    aria-label="Close chat"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area - Fun & Playful */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 scroll-smooth custom-scrollbar">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-5 py-4 shadow-lg transform hover:scale-[1.02] transition-transform duration-200 ${message.sender === "user"
                      ? "bg-gradient-to-r from-primary to-accent text-white border-2 border-primary/30"
                      : "bg-card/90 border-2 border-primary/20 text-text backdrop-blur-sm"
                      }`}
                  >
                    <div className={`text-base md:text-lg font-body leading-relaxed whitespace-pre-wrap break-words ${message.sender === "user" ? "text-white" : "text-text"}`}>
                      {message.text}
                    </div>
                    <div className={`text-xs mt-2 ${message.sender === "user" ? "text-white/70" : "text-secondary-text"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-card/90 border-2 border-primary/20 rounded-3xl px-5 py-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-badge-bg rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-secondary-text font-body font-semibold">Chizi is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Interactive & Fun */}
            <div className="p-5 md:p-6 border-t-2 border-primary/30 bg-gradient-to-r from-card/50 via-card/30 to-card/50 backdrop-blur-sm">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                {isSpeechRecognitionAvailable && (
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isTyping}
                    className={`rounded-2xl px-5 py-4 font-bold transition-all duration-300 flex items-center justify-center min-w-[60px] border-2 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${isListening
                      ? "bg-gradient-to-r from-accent to-primary text-white border-accent/50 animate-pulse shadow-[0_0_20px_rgba(93,63,211,0.6)]"
                      : "bg-gradient-to-r from-card to-card/80 text-primary hover:text-accent border-primary/30 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(31,111,235,0.4)]"
                      }`}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                    title={isListening ? "🔴 Listening... Click to stop" : "🎤 Click to speak"}
                  >
                    <FaMicrophone className={`text-xl ${isListening ? "animate-pulse" : ""}`} />
                  </button>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isListening ? "🎤 Listening..." : "Ask me anything! 🌟"}
                  className="flex-1 bg-background/80 border-2 border-primary/30 rounded-2xl px-5 py-4 text-text placeholder-secondary-text focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary text-base md:text-lg font-body shadow-inner transition-all duration-300"
                  disabled={isTyping || isListening}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping || isListening}
                  className="bg-gradient-to-r from-primary via-accent to-primary text-white rounded-2xl px-6 md:px-8 py-4 font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(31,111,235,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center min-w-[60px] border-2 border-primary/30 shadow-lg"
                  aria-label="Send message"
                >
                  {isTyping ? (
                    <FaSpinner className="animate-spin text-xl" />
                  ) : (
                    <FaPaperPlane className="text-xl" />
                  )}
                </button>
              </form>
              <p className="text-xs md:text-sm text-secondary-text mt-3 text-center font-ui flex items-center justify-center gap-2">
                <FaStar className="text-badge-bg text-xs" />
                <span>Type your question or click the mic to speak! I can answer anything! 🎤✨</span>
                <FaStar className="text-primary text-xs" />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, var(--color-primary), var(--color-accent));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, var(--color-accent), var(--color-primary));
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(-10px) translateX(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default ChiziAI;
