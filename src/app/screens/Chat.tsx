// import { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   Send,
//   ArrowLeft,
//   Mic,
//   MicOff,
//   Sparkles,
//   RefreshCw,
//   Copy,
//   Share2,
//   ChevronRight,
//   Bot,
//   User,
//   Lightbulb,
//   Leaf,
//   CloudSun,
//   FileText,
//   HelpCircle,
//   X,
//   Check,
//   Volume2,
//   VolumeX,
//   MoreVertical,
//   Trash2,
//   Download,
//   Play,
// } from 'lucide-react';
// import { useNavigate } from 'react-router';
// import { motion, AnimatePresence } from 'motion/react';
// import { BottomNav } from '../components/BottomNav';
// import { useLanguage } from '../../context/LanguageContext';
// import { useUser } from '../../context/UserContext';

// // ─── Interfaces ─────────────────────────────────────────────────
// interface Scheme {
//   id: string;
//   name: string;
//   nameHi: string;
//   benefit: string;
//   benefitHi: string;
//   eligible: boolean;
// }

// interface Message {
//   id: string;
//   type: 'user' | 'bot';
//   text: string;
//   textHi?: string;
//   timestamp: Date;
//   schemes?: Scheme[];
//   isError?: boolean;
// }

// interface QuickAction {
//   icon: React.ReactNode;
//   label: string;
//   labelHi: string;
//   query: string;
//   queryHi: string;
// }

// // ─── Wave Loader Component ──────────────────────────────────────
// function WaveLoader() {
//   return (
//     <div className="flex items-center justify-center gap-1 h-8">
//       {[0, 1, 2, 3, 4].map((i) => (
//         <div
//           key={i}
//           className="w-1 rounded-full bg-white"
//           style={{
//             animation: `wave 1s ease-in-out ${i * 0.1}s infinite`,
//             height: '8px',
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// // ─── Quick Actions ──────────────────────────────────────────────
// const quickActions: QuickAction[] = [
//   {
//     icon: <Leaf className="w-4 h-4" />,
//     label: 'Crop Disease',
//     labelHi: 'फसल रोग',
//     query: 'My wheat crop has yellow spots on leaves. What could be the problem?',
//     queryHi: 'मेरी गेहूं की फसल की पत्तियों पर पीले धब्बे हैं। क्या समस्या हो सकती है?',
//   },
//   {
//     icon: <CloudSun className="w-4 h-4" />,
//     label: 'Weather Tips',
//     labelHi: 'मौसम सुझाव',
//     query: 'What precautions should I take for my crops in upcoming rain?',
//     queryHi: 'आने वाली बारिश में मुझे अपनी फसलों के लिए क्या सावधानियां बरतनी चाहिए?',
//   },
//   {
//     icon: <FileText className="w-4 h-4" />,
//     label: 'Schemes',
//     labelHi: 'योजनाएं',
//     query: 'Which government schemes am I eligible for as a small farmer?',
//     queryHi: 'एक छोटे किसान के रूप में मैं किन सरकारी योजनाओं के लिए पात्र हूं?',
//   },
//   {
//     icon: <HelpCircle className="w-4 h-4" />,
//     label: 'Soil Health',
//     labelHi: 'मृदा स्वास्थ्य',
//     query: 'How can I improve the soil health of my farm?',
//     queryHi: 'मैं अपने खेत की मिट्टी की सेहत कैसे सुधार सकता हूं?',
//   },
// ];

// // ─── Component ──────────────────────────────────────────────────
// export default function Chat(): JSX.Element {
//   const navigate = useNavigate();
//   const { language } = useLanguage();
//   const { userData } = useUser();
//   const isHindi = language === 'hi';

//   // ─── State ──────────────────────────────────────────────────
//   const [inputText, setInputText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [copiedId, setCopiedId] = useState<string | null>(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showQuickActions, setShowQuickActions] = useState(true);
//   const [ttsEnabled, setTtsEnabled] = useState(false);
//   const [voicesLoaded, setVoicesLoaded] = useState(false);

//   /* NEW STATE */
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       type: 'bot',
//       text: `Hello ${userData.name || 'Farmer'}! 👋\n\nI'm Krishi Mitra AI, your agricultural assistant.\n\nYou can ask me about:\n• Crop diseases & solutions\n• Weather-based farming tips\n• Government schemes\n• Soil health & fertilizers\n• Market prices`,
//       textHi: `नमस्ते ${userData.name || 'किसान भाई'}! 👋\n\nमैं कृषि मित्र AI हूँ, आपका कृषि सहायक।\n\nआप मुझसे पूछ सकते हैं:\n• फसल रोग और समाधान\n• मौसम आधारित खेती सुझाव\n• सरकारी योजनाएं\n• मृदा स्वास्थ्य और उर्वरक\n• बाज़ार भाव`,
//       timestamp: new Date(),
//     },
//   ]);

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const recognitionRef = useRef<any>(null);
//   const speechVoicesRef = useRef<SpeechSynthesisVoice[] | null>(null);
//   const abortControllerRef = useRef<AbortController | null>(null);

//   // Auto scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Hide quick actions after first user message
//   useEffect(() => {
//     if (messages.some((m) => m.type === 'user')) {
//       setShowQuickActions(false);
//     }
//   }, [messages]);

//   // Load available voices (for TTS)
//   useEffect(() => {
//     if (!('speechSynthesis' in window)) return;
//     const load = () => {
//       const vs = window.speechSynthesis.getVoices();
//       if (vs && vs.length > 0) {
//         speechVoicesRef.current = vs;
//         setVoicesLoaded(true);
//       }
//     };
//     load();
//     window.speechSynthesis.onvoiceschanged = load;
//     return () => {
//       try { window.speechSynthesis.onvoiceschanged = null; } catch { }
//     };
//   }, []);

//   // Stop speaking when TTS is turned off
//   useEffect(() => {
//     if (!ttsEnabled && 'speechSynthesis' in window) {
//       try {
//         window.speechSynthesis.cancel();
//         setIsSpeaking(false);
//       } catch { }
//     }
//   }, [ttsEnabled]);

//   // ─── Speech-to-Text: single persistent ref, recreated only when lang changes
//   useEffect(() => {
//     const isSecure =
//       window.location.hostname === 'localhost' || window.location.protocol === 'https:';
//     if (!isSecure) return;

//     const SpeechRecognition =
//       (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
//     if (!SpeechRecognition) return;

//     if (recognitionRef.current) {
//       try { recognitionRef.current.stop(); } catch { }
//       recognitionRef.current = null;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = isHindi ? 'hi-IN' : 'en-IN';
//     recognition.continuous = false;
//     recognition.interimResults = true;

//     recognition.onstart = () => setIsListening(true);
//     recognition.onend = () => setIsListening(false);
//     recognition.onerror = (e: any) => {
//       if (e.error === 'aborted') return;
//       console.error('Speech recognition error:', e.error);
//       setIsListening(false);
//     };
//     recognition.onresult = (event: any) => {
//       let transcript = '';
//       for (let i = 0; i < event.results.length; i++) {
//         transcript += event.results[i][0].transcript;
//       }
//       setInputText(transcript);
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       try { recognition.abort(); } catch { }
//       recognitionRef.current = null;
//     };
//   }, [isHindi]);

//   // ─── Helpers ────────────────────────────────────────────────
//   const formatTime = (date: Date) =>
//     date.toLocaleTimeString(isHindi ? 'hi-IN' : 'en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//     });

//   const detectLanguageFromText = (text: string) => {
//     const devanagari = /[\u0900-\u097F]/;
//     return devanagari.test(text) ? 'hi-IN' : 'en-US';
//   };

//   const pickVoiceForLang = (lang: string) => {
//     const vs = speechVoicesRef.current;
//     if (!vs || vs.length === 0) return null;
//     const exact = vs.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
//     if (exact) return exact;
//     const prefix = lang.split('-')[0];
//     const loose = vs.find((v) => v.lang.toLowerCase().startsWith(prefix));
//     if (loose) return loose;
//     return vs[0];
//   };

//   // ─── speakText (with isSpeaking indicator) ──────────────────
//   const speakText = (text: string) => {
//     if (!ttsEnabled) return;
//     if (!('speechSynthesis' in window)) return;

//     try { window.speechSynthesis.cancel(); } catch { }

//     const utter = new SpeechSynthesisUtterance(text);
//     const lang = detectLanguageFromText(text);
//     const voice = pickVoiceForLang(lang);

//     utter.lang = lang;
//     if (voice) utter.voice = voice;
//     utter.rate = 1;
//     utter.pitch = 1;

//     utter.onstart = () => setIsSpeaking(true);
//     utter.onend = () => setIsSpeaking(false);
//     utter.onerror = () => setIsSpeaking(false);

//     window.speechSynthesis.speak(utter);
//   };

//   // ─── Voice input handler ────────────────────────────────────
//   const handleVoiceInput = useCallback(() => {
//     const isSecure =
//       window.location.hostname === 'localhost' || window.location.protocol === 'https:';
//     if (!isSecure) {
//       alert(isHindi
//         ? 'वॉइस इनपुट के लिए HTTPS या localhost आवश्यक है।'
//         : 'Voice input requires HTTPS or localhost.');
//       return;
//     }

//     const SpeechRecognition =
//       (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
//     if (!SpeechRecognition) {
//       alert(isHindi
//         ? 'आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता। कृपया Chrome उपयोग करें।'
//         : 'Your browser does not support voice input. Please use Chrome.');
//       return;
//     }

//     const recognition = recognitionRef.current;
//     if (!recognition) return;

//     if (isListening) {
//       try { recognition.stop(); } catch { }
//     } else {
//       setInputText('');
//       try {
//         recognition.start();
//       } catch (e: any) {
//         if (e.name === 'InvalidStateError') {
//           try { recognition.stop(); } catch { }
//         } else {
//           console.error('voice start error:', e);
//         }
//       }
//     }
//   }, [isHindi, isListening]);

//   // ─── Replay single bot message (TTS) ────────────────────────
//   const replayMessage = (text: string) => {
//     if (!('speechSynthesis' in window)) return;
//     try { window.speechSynthesis.cancel(); } catch { }

//     const utter = new SpeechSynthesisUtterance(text);
//     const lang = detectLanguageFromText(text);
//     const voice = pickVoiceForLang(lang);
//     utter.lang = lang;
//     if (voice) utter.voice = voice;
//     utter.rate = 1;
//     utter.pitch = 1;
//     utter.onstart = () => setIsSpeaking(true);
//     utter.onend = () => setIsSpeaking(false);
//     utter.onerror = () => setIsSpeaking(false);
//     window.speechSynthesis.speak(utter);
//   };

//   // ─── Send message ────────────────────────────────────────────
//   const handleSend = useCallback(
//     async (customText?: string) => {
//       const textToSend = customText ?? inputText;
//       if (!textToSend.trim() || isLoading) return;

//       const userMessage: Message = {
//         id: Date.now().toString(),
//         type: 'user',
//         text: textToSend,
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, userMessage]);
//       setInputText('');
//       setIsLoading(true);
//       setShowQuickActions(false);

//       try { abortControllerRef.current?.abort(); } catch { }
//       const ac = new AbortController();
//       abortControllerRef.current = ac;

//       try {
//         const payloadMessages = [
//           {
//             role: 'system',
//             content: `You are Krishi Mitra AI, an agriculture assistant helping Indian farmers.
// User Info:
// - Name: ${userData.name || 'Unknown'}
// - Location: ${userData.district || 'Unknown'}, ${userData.state || 'Unknown'}
// - Land: ${userData.landSize} ${userData.landUnit} (${userData.landOwnership})
// - Crops: ${userData.selectedCrops.join(', ') || 'None specified'}
// - Irrigation: ${userData.irrigation.join(', ') || 'None specified'}

// Respond in ${isHindi ? 'Hindi' : 'English'} unless user uses another language.
// Keep answers practical, simple, and actionable. Use bullet points for lists.`,
//           },
//           ...messages.map((msg) => ({
//             role: msg.type === 'user' ? 'user' : 'assistant',
//             content: msg.text,
//           })),
//           { role: 'user', content: textToSend },
//         ];

//         const res = await fetch('http://localhost:5000/chat', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ messages: payloadMessages }),
//           signal: ac.signal,
//         });

//         if (!res.ok) {
//           const text = await res.text().catch(() => '');
//           throw new Error(`Server error ${res.status} ${text}`);
//         }

//         const data = await res.json();
//         const botReply =
//           data?.choices?.[0]?.message?.content ??
//           (isHindi
//             ? 'माफ़ करें, उत्तर देने में समस्या आ रही है।'
//             : 'Sorry, there was a problem responding.');

//         let schemes: Scheme[] | undefined = undefined;
//         if (
//           botReply.toLowerCase().includes('योजना') ||
//           botReply.toLowerCase().includes('scheme') ||
//           botReply.toLowerCase().includes('pm-kisan')
//         ) {
//           schemes = [
//             {
//               id: 'pm-kisan',
//               name: 'PM-Kisan Samman Nidhi',
//               nameHi: 'पीएम-किसान सम्मान निधि',
//               benefit: '₹6,000/year direct transfer',
//               benefitHi: '₹6,000/वर्ष सीधे खाते में',
//               eligible: true,
//             },
//             {
//               id: 'pmfby',
//               name: 'PM Fasal Bima Yojana',
//               nameHi: 'पीएम फसल बीमा योजना',
//               benefit: 'Crop insurance at minimal premium',
//               benefitHi: 'न्यूनतम प्रीमियम पर फसल बीमा',
//               eligible: true,
//             },
//           ];
//         }

//         const botMessage: Message = {
//           id: `${Date.now()}_bot`,
//           type: 'bot',
//           text: botReply,
//           textHi: undefined,
//           timestamp: new Date(),
//           schemes,
//         };

//         setMessages((prev) => [...prev, botMessage]);
//         setTimeout(() => speakText(botReply), 120);
//       } catch (err: any) {
//         console.error('chat error:', err);
//         if (err.name === 'AbortError') {
//           // ignored
//         } else {
//           const errMsg: Message = {
//             id: `${Date.now()}_error`,
//             type: 'bot',
//             text: isHindi
//               ? 'सर्वर से कनेक्शन में समस्या है। कृपया बाद में पुनः प्रयास करें।'
//               : 'Connection problem with server. Please try again later.',
//             timestamp: new Date(),
//             isError: true,
//           };
//           setMessages((prev) => [...prev, errMsg]);
//           setTimeout(() => speakText(errMsg.text), 120);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [inputText, isLoading, messages, isHindi],
//   );

//   // ─── Quick action handler ────────────────────────────────────
//   const handleQuickAction = useCallback(
//     (action: QuickAction) => {
//       const query = isHindi ? action.queryHi : action.query;
//       handleSend(query);
//     },
//     [handleSend, isHindi],
//   );

//   // ─── Copy / Share / Clear ────────────────────────────────────
//   const handleCopy = useCallback((text: string, id: string) => {
//     navigator.clipboard?.writeText(text);
//     setCopiedId(id);
//     setTimeout(() => setCopiedId(null), 2000);
//   }, []);

//   const handleShare = useCallback((text: string) => {
//     if (navigator.share) {
//       navigator.share({ title: 'Krishi Mitra AI', text });
//     } else {
//       navigator.clipboard?.writeText(text);
//     }
//   }, []);

//   const handleClearChat = useCallback(() => {
//     setMessages([
//       {
//         id: '1',
//         type: 'bot',
//         text: `Hello ${userData.name || 'Farmer'}! 👋\n\nI'm Krishi Mitra AI, your agricultural assistant.\n\nYou can ask me about:\n• Crop diseases & solutions\n• Weather-based farming tips\n• Government schemes\n• Soil health & fertilizers\n• Market prices`,
//         textHi: `नमस्ते ${userData.name || 'किसान भाई'}! 👋\n\nमैं कृषि मित्र AI हूँ, आपका कृषि सहायक।\n\nआप मुझसे पूछ सकते हैं:\n• फसल रोग और समाधान\n• मौसम आधारित खेती सुझाव\n• सरकारी योजनाएं\n• मृदा स्वास्थ्य और उर्वरक\n• बाज़ार भाव`,
//         timestamp: new Date(),
//       },
//     ]);
//     setShowQuickActions(true);
//     setShowMenu(false);
//   }, [userData.name]);

//   // ─── UI ──────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-[#F7F3EE] flex flex-col">

//       {/* Header */}
//       <div className="bg-gradient-to-b from-[#1A3C1A] to-[#2D6A2D] pt-10 pb-4 px-4 sticky top-0 z-20">
//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5 text-white" />
//           </button>

//           <div className="flex items-center gap-2">
//             <div className="w-9 h-9 bg-[#F5A623] rounded-full flex items-center justify-center">
//               <img
//                 src="/logo.png"
//                 alt="Krishi Mitra Logo"
//                 className="w-full h-full object-cover rounded-full"
//                 onError={(e) => {
//                   e.currentTarget.style.display = 'none';
//                   const parent = e.currentTarget.parentElement;
//                   if (parent) parent.innerHTML = '<span class="text-5xl">🌾</span>';
//                 }}
//               />
//             </div>
//             <div>
//               <h1 className="font-bold text-white text-[15px] leading-tight">
//                 {isHindi ? 'कृषि मित्र AI' : 'Krishi Mitra AI'}
//               </h1>
//               <p className="text-[10px] text-white/60 flex items-center gap-1">
//                 <span className="w-1.5 h-1.5 bg-[#97BC62] rounded-full animate-pulse" />
//                 {isHindi ? 'ऑनलाइन' : 'Online'}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <motion.button
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setTtsEnabled((prev) => !prev)}
//               className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${ttsEnabled
//                 ? 'bg-[#F5A623] shadow-lg shadow-[#F5A623]/40'
//                 : 'bg-white/10 hover:bg-white/20'
//                 }`}
//               title={ttsEnabled
//                 ? (isHindi ? 'ध्वनि बंद करें' : 'Mute voice')
//                 : (isHindi ? 'ध्वनि चालू करें' : 'Enable voice')}
//             >
//               {ttsEnabled
//                 ? <Volume2 className="w-5 h-5 text-white" />
//                 : <VolumeX className="w-5 h-5 text-white/70" />
//               }
//             </motion.button>

//             <div className="relative">
//               <button
//                 onClick={() => setShowMenu(!showMenu)}
//                 className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
//               >
//                 <MoreVertical className="w-5 h-5 text-white" />
//               </button>

//               <AnimatePresence>
//                 {showMenu && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.9, y: -10 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.9, y: -10 }}
//                     className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-48 z-30"
//                   >
//                     <button
//                       onClick={handleClearChat}
//                       className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left"
//                     >
//                       <Trash2 className="w-4 h-4 text-[#F87171]" />
//                       <span className="text-[13px] text-[#1C1C1E]">
//                         {isHindi ? 'चैट साफ़ करें' : 'Clear Chat'}
//                       </span>
//                     </button>
//                     <button
//                       onClick={() => { navigate('/dashboard'); setShowMenu(false); }}
//                       className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left border-t border-gray-50"
//                     >
//                       <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
//                       <span className="text-[13px] text-[#1C1C1E]">
//                         {isHindi ? 'होम जाएं' : 'Go to Home'}
//                       </span>
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
//         {messages.map((message, index) => (
//           <motion.div
//             key={message.id}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.03 }}
//             className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div className={`flex items-end gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'bg-[#2D6A2D]' : 'bg-[#F5A623]'}`}>
//                 {message.type === 'user'
//                   ? <User className="w-4 h-4 text-white" />
//                   : <Bot className="w-4 h-4 text-white" />
//                 }
//               </div>

//               <div className={`rounded-2xl px-4 py-3 ${message.type === 'user'
//                 ? 'bg-[#2D6A2D] text-white rounded-br-md'
//                 : message.isError
//                   ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] rounded-bl-md'
//                   : 'bg-white shadow-sm border border-gray-100 rounded-bl-md'
//                 }`}>
//                 <p className={`text-[14px] leading-relaxed whitespace-pre-wrap ${message.type === 'user' ? 'text-white' : 'text-[#1C1C1E]'}`}>
//                   {message.type === 'bot' && message.textHi && isHindi
//                     ? message.textHi
//                     : message.text}
//                 </p>

//                 {/* Scheme Cards */}
//                 {message.schemes && message.schemes.length > 0 && (
//                   <div className="mt-3 space-y-2">
//                     {message.schemes.map((scheme) => (
//                       <motion.div
//                         key={scheme.id}
//                         initial={{ opacity: 0, y: 5 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="bg-[#F0FDF4] border border-[#97BC62]/30 rounded-xl p-3"
//                       >
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <p className="font-semibold text-[13px] text-[#2D6A2D]">
//                               {isHindi ? scheme.nameHi : scheme.name}
//                             </p>
//                             <p className="text-[11px] text-[#6B7280] mt-0.5">
//                               🎁 {isHindi ? scheme.benefitHi : scheme.benefit}
//                             </p>
//                           </div>
//                           {scheme.eligible && (
//                             <span className="text-[10px] bg-[#97BC62] text-white px-2 py-0.5 rounded-full font-medium">
//                               ✓ {isHindi ? 'पात्र' : 'Eligible'}
//                             </span>
//                           )}
//                         </div>
//                         <button
//                           onClick={() => navigate('/schemes')}
//                           className="mt-2 text-[11px] text-[#F5A623] font-semibold flex items-center gap-1"
//                         >
//                           {isHindi ? 'विवरण देखें' : 'View Details'}
//                           <ChevronRight className="w-3 h-3" />
//                         </button>
//                       </motion.div>
//                     ))}
//                   </div>
//                 )}

//                 <div className={`flex items-center gap-2 mt-2 ${message.type === 'user' ? 'justify-end' : 'justify-between'}`}>
//                   <span className={`text-[10px] ${message.type === 'user' ? 'text-white/60' : 'text-[#9CA3AF]'}`}>
//                     {formatTime(message.timestamp)}
//                   </span>

//                   {message.type === 'bot' && !message.isError && (
//                     <div className="flex items-center gap-1">
//                       <button
//                         onClick={() => handleCopy(message.text, message.id)}
//                         className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//                       >
//                         {copiedId === message.id
//                           ? <Check className="w-3 h-3 text-[#97BC62]" />
//                           : <Copy className="w-3 h-3 text-[#9CA3AF]" />
//                         }
//                       </button>
//                       <button
//                         onClick={() => handleShare(message.text)}
//                         className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//                       >
//                         <Share2 className="w-3 h-3 text-[#9CA3AF]" />
//                       </button>
//                       <button
//                         onClick={() => replayMessage(
//                           message.textHi && isHindi ? message.textHi : message.text
//                         )}
//                         className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//                       >
//                         <Play className="w-3 h-3 text-[#9CA3AF]" />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         ))}

//         {/* Typing Indicator */}
//         <AnimatePresence>
//           {isLoading && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="flex items-end gap-2"
//             >
//               <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center flex-shrink-0">
//                 <Bot className="w-4 h-4 text-white" />
//               </div>
//               <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
//                 <div className="flex items-center gap-1">
//                   <motion.span
//                     animate={{ opacity: [0.4, 1, 0.4] }}
//                     transition={{ repeat: Infinity, duration: 1, delay: 0 }}
//                     className="w-2 h-2 bg-[#2D6A2D] rounded-full"
//                   />
//                   <motion.span
//                     animate={{ opacity: [0.4, 1, 0.4] }}
//                     transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
//                     className="w-2 h-2 bg-[#2D6A2D] rounded-full"
//                   />
//                   <motion.span
//                     animate={{ opacity: [0.4, 1, 0.4] }}
//                     transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
//                     className="w-2 h-2 bg-[#2D6A2D] rounded-full"
//                   />
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Quick Actions */}
//       <AnimatePresence>
//         {showQuickActions && messages.length <= 1 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             className="px-4 pb-2"
//           >
//             <p className="text-[12px] text-[#6B7280] mb-2 flex items-center gap-1">
//               <Lightbulb className="w-3 h-3" />
//               {isHindi ? 'जल्दी पूछें:' : 'Quick questions:'}
//             </p>
//             <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
//               {quickActions.map((action, idx) => (
//                 <motion.button
//                   key={idx}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: idx * 0.06 }}
//                   onClick={() => handleQuickAction(action)}
//                   className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-gray-200 shadow-sm whitespace-nowrap hover:border-[#F5A623] hover:bg-[#F5A623]/5 transition-all active:scale-95"
//                 >
//                   <span className="text-[#2D6A2D]">{action.icon}</span>
//                   <span className="text-[12px] font-medium text-[#1C1C1E]">
//                     {isHindi ? action.labelHi : action.label}
//                   </span>
//                 </motion.button>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Input Area */}
//       <div className="bg-white border-t border-gray-100 px-4 py-3 pb-20">
//         <div className="flex items-center gap-2">
//           <motion.button
//             whileTap={{ scale: 0.9 }}
//             onClick={handleVoiceInput}
//             className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isListening
//               ? 'bg-[#F87171] text-white shadow-lg shadow-red-300'
//               : 'bg-[#F7F3EE] text-[#6B7280] hover:bg-[#EDE8E0]'
//               }`}
//           >
//             {isListening
//               ? <MicOff className="w-5 h-5 text-white" />
//               : <Mic className="w-5 h-5" />
//             }
//           </motion.button>

//           <div className="flex-1 relative">
//             <input
//               ref={inputRef}
//               type="text"
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
//               placeholder={isHindi ? 'अपना प्रश्न लिखें...' : 'Type your question...'}
//               disabled={isLoading}
//               className="w-full px-4 py-3 bg-[#F7F3EE] rounded-2xl text-[14px] outline-none focus:ring-2 focus:ring-[#F5A623]/30 border-2 border-transparent focus:border-[#F5A623] placeholder:text-[#9CA3AF] disabled:opacity-50 transition-all"
//             />
//           </div>

//           <motion.button
//             whileTap={inputText.trim() && !isLoading ? { scale: 0.9 } : {}}
//             onClick={() => handleSend()}
//             disabled={!inputText.trim() || isLoading}
//             className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${inputText.trim() && !isLoading
//               ? 'bg-[#2D6A2D] text-white shadow-lg shadow-[#2D6A2D]/30'
//               : 'bg-gray-200 text-gray-400'
//               }`}
//           >
//             <Send className="w-5 h-5" />
//           </motion.button>
//         </div>

//         <AnimatePresence>
//           {isListening && (
//             <motion.div
//               initial={{ opacity: 0, y: -5 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className="flex items-center justify-center gap-2 mt-2"
//             >
//               <div className="flex items-end gap-0.5 h-4">
//                 {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => (
//                   <motion.span
//                     key={i}
//                     animate={{ scaleY: [0.4, 1, 0.4] }}
//                     transition={{ repeat: Infinity, duration: 0.7, delay }}
//                     className="w-1 bg-[#F5A623] rounded-full origin-bottom"
//                     style={{ height: '100%' }}
//                   />
//                 ))}
//               </div>
//               <p className="text-[12px] text-[#F5A623] font-medium">
//                 {isHindi ? 'सुन रहा हूँ...' : 'Listening...'}
//               </p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <BottomNav />

//       {/* AI Speaking Indicator - Wave Loader */}
//       <AnimatePresence>
//         {isSpeaking && (
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0, opacity: 0 }}
//             className="fixed bottom-36 right-5 z-40"
//           >
//             <div className="bg-[#F5A623] rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
//               <WaveLoader />
//               <span className="text-white text-[12px] font-medium">
//                 {isHindi ? 'बोल रहा हूँ...' : 'Speaking...'}
//               </span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {showMenu && (
//         <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
//       )}

//       <style>{`
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

//         @keyframes wave {
//           0%, 100% { height: 8px; opacity: 0.5; }
//           50% { height: 24px; opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  ArrowLeft,
  Mic,
  MicOff,
  Sparkles,
  RefreshCw,
  Copy,
  Share2,
  ChevronRight,
  Bot,
  User,
  Lightbulb,
  Leaf,
  CloudSun,
  FileText,
  HelpCircle,
  X,
  Check,
  Volume2,
  VolumeX,
  MoreVertical,
  Trash2,
  Download,
  Play,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from '../components/BottomNav';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';

// ─── Interfaces ─────────────────────────────────────────────────
interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  benefit: string;
  benefitHi: string;
  eligible: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  textHi?: string;
  timestamp: Date;
  schemes?: Scheme[];
  isError?: boolean;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  labelHi: string;
  query: string;
  queryHi: string;
}

// ─── Wave Loader Component (for speaking) ───────────────────────
function WaveLoader() {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-white"
          style={{
            animation: `wave 1s ease-in-out ${i * 0.1}s infinite`,
            height: '8px',
          }}
        />
      ))}
    </div>
  );
}

// ─── Pulse Loader Component (for thinking/generating) ───────────
function PulseLoader() {
  return (
    <div className="relative flex items-center justify-center h-10 w-10">
      <div className="absolute h-3 w-3 rounded-full bg-[#2D6A2D]" />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border-2 border-[#2D6A2D]"
          style={{
            animation: `pulse 2s ease-out ${i * 0.5}s infinite`,
            width: '12px',
            height: '12px',
          }}
        />
      ))}
    </div>
  );
}

// ─── Quick Actions ──────────────────────────────────────────────
const quickActions: QuickAction[] = [
  {
    icon: <Leaf className="w-4 h-4" />,
    label: 'Crop Disease',
    labelHi: 'फसल रोग',
    query: 'My wheat crop has yellow spots on leaves. What could be the problem?',
    queryHi: 'मेरी गेहूं की फसल की पत्तियों पर पीले धब्बे हैं। क्या समस्या हो सकती है?',
  },
  {
    icon: <CloudSun className="w-4 h-4" />,
    label: 'Weather Tips',
    labelHi: 'मौसम सुझाव',
    query: 'What precautions should I take for my crops in upcoming rain?',
    queryHi: 'आने वाली बारिश में मुझे अपनी फसलों के लिए क्या सावधानियां बरतनी चाहिए?',
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: 'Schemes',
    labelHi: 'योजनाएं',
    query: 'Which government schemes am I eligible for as a small farmer?',
    queryHi: 'एक छोटे किसान के रूप में मैं किन सरकारी योजनाओं के लिए पात्र हूं?',
  },
  {
    icon: <HelpCircle className="w-4 h-4" />,
    label: 'Soil Health',
    labelHi: 'मृदा स्वास्थ्य',
    query: 'How can I improve the soil health of my farm?',
    queryHi: 'मैं अपने खेत की मिट्टी की सेहत कैसे सुधार सकता हूं?',
  },
];

// ─── Component ──────────────────────────────────────────────────
export default function Chat(): JSX.Element {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { userData } = useUser();
  const isHindi = language === 'hi';

  // ─── State ──────────────────────────────────────────────────
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: `Hello ${userData.name || 'Farmer'}! 👋\n\nI'm Krishi Mitra AI, your agricultural assistant.\n\nYou can ask me about:\n• Crop diseases & solutions\n• Weather-based farming tips\n• Government schemes\n• Soil health & fertilizers\n• Market prices`,
      textHi: `नमस्ते ${userData.name || 'किसान भाई'}! 👋\n\nमैं कृषि मित्र AI हूँ, आपका कृषि सहायक।\n\nआप मुझसे पूछ सकते हैं:\n• फसल रोग और समाधान\n• मौसम आधारित खेती सुझाव\n• सरकारी योजनाएं\n• मृदा स्वास्थ्य और उर्वरक\n• बाज़ार भाव`,
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const speechVoicesRef = useRef<SpeechSynthesisVoice[] | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hide quick actions after first user message
  useEffect(() => {
    if (messages.some((m) => m.type === 'user')) {
      setShowQuickActions(false);
    }
  }, [messages]);

  // Load available voices (for TTS)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => {
      const vs = window.speechSynthesis.getVoices();
      if (vs && vs.length > 0) {
        speechVoicesRef.current = vs;
        setVoicesLoaded(true);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      try {
        window.speechSynthesis.onvoiceschanged = null;
      } catch { }
    };
  }, []);

  // Stop speaking when TTS is turned off
  useEffect(() => {
    if (!ttsEnabled && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } catch { }
    }
  }, [ttsEnabled]);

  // ─── Speech-to-Text: single persistent ref, recreated only when lang changes
  useEffect(() => {
    const isSecure =
      window.location.hostname === 'localhost' || window.location.protocol === 'https:';
    if (!isSecure) return;

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { }
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = isHindi ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e: any) => {
      if (e.error === 'aborted') return;
      console.error('Speech recognition error:', e.error);
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInputText(transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch { }
      recognitionRef.current = null;
    };
  }, [isHindi]);

  // ─── Helpers ────────────────────────────────────────────────
  const formatTime = (date: Date) =>
    date.toLocaleTimeString(isHindi ? 'hi-IN' : 'en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const detectLanguageFromText = (text: string) => {
    const devanagari = /[\u0900-\u097F]/;
    return devanagari.test(text) ? 'hi-IN' : 'en-US';
  };

  const pickVoiceForLang = (lang: string) => {
    const vs = speechVoicesRef.current;
    if (!vs || vs.length === 0) return null;
    const exact = vs.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    if (exact) return exact;
    const prefix = lang.split('-')[0];
    const loose = vs.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (loose) return loose;
    return vs[0];
  };

  // ─── speakText (with isSpeaking indicator) ──────────────────
  const speakText = (text: string) => {
    if (!ttsEnabled) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
    } catch { }

    const utter = new SpeechSynthesisUtterance(text);
    const lang = detectLanguageFromText(text);
    const voice = pickVoiceForLang(lang);

    utter.lang = lang;
    if (voice) utter.voice = voice;
    utter.rate = 1;
    utter.pitch = 1;

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utter);
  };

  // ─── Voice input handler ────────────────────────────────────
  const handleVoiceInput = useCallback(() => {
    const isSecure =
      window.location.hostname === 'localhost' || window.location.protocol === 'https:';
    if (!isSecure) {
      alert(
        isHindi
          ? 'वॉइस इनपुट के लिए HTTPS या localhost आवश्यक है।'
          : 'Voice input requires HTTPS or localhost.'
      );
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        isHindi
          ? 'आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता। कृपया Chrome उपयोग करें।'
          : 'Your browser does not support voice input. Please use Chrome.'
      );
      return;
    }

    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      try {
        recognition.stop();
      } catch { }
    } else {
      setInputText('');
      try {
        recognition.start();
      } catch (e: any) {
        if (e.name === 'InvalidStateError') {
          try {
            recognition.stop();
          } catch { }
        } else {
          console.error('voice start error:', e);
        }
      }
    }
  }, [isHindi, isListening]);

  // ─── Replay single bot message (TTS) ────────────────────────
  const replayMessage = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch { }

    const utter = new SpeechSynthesisUtterance(text);
    const lang = detectLanguageFromText(text);
    const voice = pickVoiceForLang(lang);
    utter.lang = lang;
    if (voice) utter.voice = voice;
    utter.rate = 1;
    utter.pitch = 1;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  // ─── Send message ────────────────────────────────────────────
  const handleSend = useCallback(
    async (customText?: string) => {
      const textToSend = customText ?? inputText;
      if (!textToSend.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: textToSend,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText('');
      setIsLoading(true);
      setShowQuickActions(false);

      try {
        abortControllerRef.current?.abort();
      } catch { }
      const ac = new AbortController();
      abortControllerRef.current = ac;

      try {
        const payloadMessages = [
          {
            role: 'system',
            content: `You are Krishi Mitra AI, an agriculture assistant helping Indian farmers.
User Info:
- Name: ${userData.name || 'Unknown'}
- Location: ${userData.district || 'Unknown'}, ${userData.state || 'Unknown'}
- Land: ${userData.landSize} ${userData.landUnit} (${userData.landOwnership})
- Crops: ${userData.selectedCrops.join(', ') || 'None specified'}
- Irrigation: ${userData.irrigation.join(', ') || 'None specified'}

Respond in ${isHindi ? 'Hindi' : 'English'} unless user uses another language.
Keep answers practical, simple, and actionable. Use bullet points for lists.`,
          },
          ...messages.map((msg) => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
          { role: 'user', content: textToSend },
        ];

        const res = await fetch('http://localhost:5000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payloadMessages }),
          signal: ac.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Server error ${res.status} ${text}`);
        }

        const data = await res.json();
        const botReply =
          data?.choices?.[0]?.message?.content ??
          (isHindi
            ? 'माफ़ करें, उत्तर देने में समस्या आ रही है।'
            : 'Sorry, there was a problem responding.');

        let schemes: Scheme[] | undefined = undefined;
        if (
          botReply.toLowerCase().includes('योजना') ||
          botReply.toLowerCase().includes('scheme') ||
          botReply.toLowerCase().includes('pm-kisan')
        ) {
          schemes = [
            {
              id: 'pm-kisan',
              name: 'PM-Kisan Samman Nidhi',
              nameHi: 'पीएम-किसान सम्मान निधि',
              benefit: '₹6,000/year direct transfer',
              benefitHi: '₹6,000/वर्ष सीधे खाते में',
              eligible: true,
            },
            {
              id: 'pmfby',
              name: 'PM Fasal Bima Yojana',
              nameHi: 'पीएम फसल बीमा योजना',
              benefit: 'Crop insurance at minimal premium',
              benefitHi: 'न्यूनतम प्रीमियम पर फसल बीमा',
              eligible: true,
            },
          ];
        }

        const botMessage: Message = {
          id: `${Date.now()}_bot`,
          type: 'bot',
          text: botReply,
          textHi: undefined,
          timestamp: new Date(),
          schemes,
        };

        setMessages((prev) => [...prev, botMessage]);
        setTimeout(() => speakText(botReply), 120);
      } catch (err: any) {
        console.error('chat error:', err);
        if (err.name === 'AbortError') {
          // ignored
        } else {
          const errMsg: Message = {
            id: `${Date.now()}_error`,
            type: 'bot',
            text: isHindi
              ? 'सर्वर से कनेक्शन में समस्या है। कृपया बाद में पुनः प्रयास करें।'
              : 'Connection problem with server. Please try again later.',
            timestamp: new Date(),
            isError: true,
          };
          setMessages((prev) => [...prev, errMsg]);
          setTimeout(() => speakText(errMsg.text), 120);
        }
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputText, isLoading, messages, isHindi]
  );

  // ─── Quick action handler ────────────────────────────────────
  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      const query = isHindi ? action.queryHi : action.query;
      handleSend(query);
    },
    [handleSend, isHindi]
  );

  // ─── Copy / Share / Clear ────────────────────────────────────
  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleShare = useCallback((text: string) => {
    if (navigator.share) {
      navigator.share({ title: 'Krishi Mitra AI', text });
    } else {
      navigator.clipboard?.writeText(text);
    }
  }, []);

  const handleClearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        text: `Hello ${userData.name || 'Farmer'}! 👋\n\nI'm Krishi Mitra AI, your agricultural assistant.\n\nYou can ask me about:\n• Crop diseases & solutions\n• Weather-based farming tips\n• Government schemes\n• Soil health & fertilizers\n• Market prices`,
        textHi: `नमस्ते ${userData.name || 'किसान भाई'}! 👋\n\nमैं कृषि मित्र AI हूँ, आपका कृषि सहायक।\n\nआप मुझसे पूछ सकते हैं:\n• फसल रोग और समाधान\n• मौसम आधारित खेती सुझाव\n• सरकारी योजनाएं\n• मृदा स्वास्थ्य और उर्वरक\n• बाज़ार भाव`,
        timestamp: new Date(),
      },
    ]);
    setShowQuickActions(true);
    setShowMenu(false);
  }, [userData.name]);

  // ─── UI ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F3EE] flex flex-col">
      {/* Header - PLAIN VERSION */}
      <div className="bg-[#2D6A2D] py-4 px-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#F5A623] rounded-full flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Krishi Mitra Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.innerHTML = '<span class="text-lg">🌾</span>';
                }}
              />
            </div>
            <div>
              <h1 className="font-bold text-white text-[15px] leading-tight">
                {isHindi ? 'कृषि मित्र AI' : 'Krishi Mitra AI'}
              </h1>
              <p className="text-[10px] text-white/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#97BC62] rounded-full" />
                {isHindi ? 'ऑनलाइन' : 'Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTtsEnabled((prev) => !prev)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${ttsEnabled ? 'bg-[#F5A623]' : 'bg-white/10 hover:bg-white/20'
                }`}
              title={
                ttsEnabled
                  ? isHindi
                    ? 'ध्वनि बंद करें'
                    : 'Mute voice'
                  : isHindi
                    ? 'ध्वनि चालू करें'
                    : 'Enable voice'
              }
            >
              {ttsEnabled ? (
                <Volume2 className="w-5 h-5 text-white" />
              ) : (
                <VolumeX className="w-5 h-5 text-white/70" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-white" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-48 z-30">
                  <button
                    onClick={handleClearChat}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left"
                  >
                    <Trash2 className="w-4 h-4 text-[#F87171]" />
                    <span className="text-[13px] text-[#1C1C1E]">
                      {isHindi ? 'चैट साफ़ करें' : 'Clear Chat'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left border-t border-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[13px] text-[#1C1C1E]">
                      {isHindi ? 'होम जाएं' : 'Go to Home'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-end gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'bg-[#2D6A2D]' : 'bg-[#F5A623]'
                  }`}
              >
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              <div
                className={`rounded-2xl px-4 py-3 ${message.type === 'user'
                  ? 'bg-[#2D6A2D] text-white rounded-br-md'
                  : message.isError
                    ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] rounded-bl-md'
                    : 'bg-white shadow-sm border border-gray-100 rounded-bl-md'
                  }`}
              >
                <p
                  className={`text-[14px] leading-relaxed whitespace-pre-wrap ${message.type === 'user' ? 'text-white' : 'text-[#1C1C1E]'
                    }`}
                >
                  {message.type === 'bot' && message.textHi && isHindi
                    ? message.textHi
                    : message.text}
                </p>

                {/* Scheme Cards */}
                {message.schemes && message.schemes.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.schemes.map((scheme) => (
                      <motion.div
                        key={scheme.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#F0FDF4] border border-[#97BC62]/30 rounded-xl p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-[13px] text-[#2D6A2D]">
                              {isHindi ? scheme.nameHi : scheme.name}
                            </p>
                            <p className="text-[11px] text-[#6B7280] mt-0.5">
                              🎁 {isHindi ? scheme.benefitHi : scheme.benefit}
                            </p>
                          </div>
                          {scheme.eligible && (
                            <span className="text-[10px] bg-[#97BC62] text-white px-2 py-0.5 rounded-full font-medium">
                              ✓ {isHindi ? 'पात्र' : 'Eligible'}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => navigate('/schemes')}
                          className="mt-2 text-[11px] text-[#F5A623] font-semibold flex items-center gap-1"
                        >
                          {isHindi ? 'विवरण देखें' : 'View Details'}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div
                  className={`flex items-center gap-2 mt-2 ${message.type === 'user' ? 'justify-end' : 'justify-between'
                    }`}
                >
                  <span
                    className={`text-[10px] ${message.type === 'user' ? 'text-white/60' : 'text-[#9CA3AF]'
                      }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>

                  {message.type === 'bot' && !message.isError && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(message.text, message.id)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-[#97BC62]" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#9CA3AF]" />
                        )}
                      </button>
                      <button
                        onClick={() => handleShare(message.text)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Share2 className="w-3 h-3 text-[#9CA3AF]" />
                      </button>
                      <button
                        onClick={() =>
                          replayMessage(
                            message.textHi && isHindi ? message.textHi : message.text
                          )
                        }
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Play className="w-3 h-3 text-[#9CA3AF]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Thinking/Loading Indicator with PulseLoader */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-end gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-3">
                  <PulseLoader />
                  <span className="text-[12px] text-[#6B7280] font-medium">
                    {isHindi ? 'सोच रहा हूँ...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <AnimatePresence>
        {showQuickActions && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 pb-2"
          >
            <p className="text-[12px] text-[#6B7280] mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              {isHindi ? 'जल्दी पूछें:' : 'Quick questions:'}
            </p>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {quickActions.map((action, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => handleQuickAction(action)}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-gray-200 shadow-sm whitespace-nowrap hover:border-[#F5A623] hover:bg-[#F5A623]/5 transition-all active:scale-95"
                >
                  <span className="text-[#2D6A2D]">{action.icon}</span>
                  <span className="text-[12px] font-medium text-[#1C1C1E]">
                    {isHindi ? action.labelHi : action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 pb-20">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleVoiceInput}
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isListening
              ? 'bg-[#F87171] text-white shadow-lg shadow-red-300'
              : 'bg-[#F7F3EE] text-[#6B7280] hover:bg-[#EDE8E0]'
              }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </motion.button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={isHindi ? 'अपना प्रश्न लिखें...' : 'Type your question...'}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#F7F3EE] rounded-2xl text-[14px] outline-none focus:ring-2 focus:ring-[#F5A623]/30 border-2 border-transparent focus:border-[#F5A623] placeholder:text-[#9CA3AF] disabled:opacity-50 transition-all"
            />
          </div>

          <motion.button
            whileTap={inputText.trim() && !isLoading ? { scale: 0.9 } : {}}
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${inputText.trim() && !isLoading
              ? 'bg-[#2D6A2D] text-white shadow-lg shadow-[#2D6A2D]/30'
              : 'bg-gray-200 text-gray-400'
              }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>

        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 mt-2"
            >
              <div className="flex items-end gap-0.5 h-4">
                {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => (
                  <motion.span
                    key={i}
                    animate={{ scaleY: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay }}
                    className="w-1 bg-[#F5A623] rounded-full origin-bottom"
                    style={{ height: '100%' }}
                  />
                ))}
              </div>
              <p className="text-[12px] text-[#F5A623] font-medium">
                {isHindi ? 'सुन रहा हूँ...' : 'Listening...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />

      {/* AI Speaking Indicator - Wave Loader */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-36 right-5 z-40"
          >
            <div className="bg-[#F5A623] rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <WaveLoader />
              <span className="text-white text-[12px] font-medium">
                {isHindi ? 'बोल रहा हूँ...' : 'Speaking...'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes wave {
          0%, 100% { height: 8px; opacity: 0.5; }
          50% { height: 24px; opacity: 1; }
        }
        
        @keyframes pulse {
          0% { width: 12px; height: 12px; opacity: 1; }
          100% { width: 40px; height: 40px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}