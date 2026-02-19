import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  benefit: string;
  eligible: boolean;
}

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: string;
  schemes?: Scheme[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "नमस्ते किसान भाई 👋\n\nमैं Krishi Mitra AI हूँ।\nआप फसल, मौसम, योजना या किसी भी कृषि समस्या के बारे में पूछ सकते हैं।",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are Krishi Mitra AI, an agriculture assistant helping Indian farmers. Respond in Hindi unless user uses English. Keep answers practical and simple.",
            },
            ...messages.map((msg) => ({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            {
              role: "user",
              content: inputText,
            },
          ],
        }),
      });

      const data = await response.json();

      const botReply =
        data?.choices?.[0]?.message?.content ||
        "माफ़ करें, अभी उत्तर देने में समस्या आ रही है।";

      // Optional scheme detection logic
      let schemes: Scheme[] | undefined = undefined;

      if (
        botReply.toLowerCase().includes("योजना") ||
        botReply.toLowerCase().includes("scheme")
      ) {
        schemes = [
          {
            id: "pm-pranam",
            name: "PM Pranam Yojana",
            nameHi: "उर्वरक सब्सिडी • केंद्र सरकार",
            benefit: "50% subsidy on DAP/Urea",
            eligible: true,
          },
        ];
      }

      const botMessage: Message = {
        id: Date.now().toString() + "_bot",
        type: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString(),
        schemes,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        id: Date.now().toString() + "_error",
        type: "bot",
        text: "सर्वर से कनेक्शन में समस्या है। कृपया बाद में प्रयास करें।",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F4F6F9]">
      {/* Header */}
      <div className="bg-[#2D6A2D] text-white p-4 font-semibold text-lg shadow">
        🌾 Krishi Mitra AI
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap ${
                message.type === "user"
                  ? "bg-[#DCF8C6] text-black"
                  : "bg-white text-black shadow-sm"
              }`}
            >
              {message.text}

              {/* Scheme Cards */}
              {message.schemes &&
                message.schemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="mt-3 p-3 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7]"
                  >
                    <div className="font-semibold text-sm">
                      {scheme.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {scheme.nameHi}
                    </div>
                    <div className="text-xs mt-1">
                      🎁 {scheme.benefit}
                    </div>
                    <div className="text-xs mt-1">
                      {scheme.eligible ? "✅ Eligible" : "❌ Not Eligible"}
                    </div>
                  </div>
                ))}

              <div className="text-[10px] text-gray-500 mt-1 text-right">
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-2xl shadow animate-pulse">
              Krishi Mitra AI typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          placeholder="अपना प्रश्न लिखें..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-[#2D6A2D] text-white p-2 rounded-full"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
