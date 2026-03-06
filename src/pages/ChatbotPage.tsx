import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MOCK_RESPONSES = [
  "That's a great question! 🐺 I think you should trust your instincts on this one. What does your gut tell you?",
  "Hmm, let me think about that... *tilts head* I'd say go for it! Life's too short to overthink. 🐾",
  "Woof! That sounds exciting! Here's what I think: break it down into smaller steps and tackle them one by one.",
  "You know what? Sometimes the best decision is the one that scares you a little. Embrace the adventure! 🌟",
  "I've seen many adventurers face this kind of choice. The ones who took the leap never regretted it. What's holding you back?",
  "Let me put on my wise husky hat 🎩 — consider what you'll regret NOT doing. That usually points to the answer.",
  "*wags tail enthusiastically* That's the spirit! Keep that energy and channel it into action!",
];

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const goal = searchParams.get("goal") || "";
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hey there! 🐺 I'm Koda, your adventure companion. ${goal ? `I see you're working on: "${goal}". ` : ""}What's on your mind? Need help making a decision?` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const responseIndex = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response with delay
    setTimeout(() => {
      const response = MOCK_RESPONSES[responseIndex.current % MOCK_RESPONSES.length];
      responseIndex.current++;
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setLoading(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐺</span>
          <div>
            <h1 className="font-display text-lg font-medium text-foreground">Koda</h1>
            <p className="font-sans-light text-[10px] tracking-widest uppercase text-muted-foreground">Your Decision Buddy • Demo</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card text-card-foreground journal-shadow rounded-bl-md"}`}>
                <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card rounded-2xl px-4 py-3 journal-shadow rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3 safe-area-bottom">
        <div className="flex gap-2 max-w-lg mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Koda anything..."
            className="flex-1 bg-muted/50 rounded-xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button onClick={sendMessage} disabled={!input.trim() || loading} className="p-3 bg-primary text-primary-foreground rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
