import { useState } from "react";
import { useJourney } from "@/context/JourneyContext";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AIDecision {
  decision: string;
  reasoning: string;
  actionStep: string;
  confidence: number;
}

interface DualPersonalityProps {
  dayIndex: number;
}

const generateMockDecision = (goal: string, logical: string, emotional: string): AIDecision => {
  const confidence = 70 + Math.floor(Math.random() * 25);
  return {
    decision: `Go for "${goal}" — your heart and mind align more than you think!`,
    reasoning: `Your logical side raises valid points about planning and preparation, while your emotional side shows genuine passion. The best decisions come when both perspectives are acknowledged. Based on your input, the emotional drive here is strong enough to sustain you through the practical challenges.`,
    actionStep: `Start with the smallest possible version of "${goal}" today. Take one concrete action in the next hour.`,
    confidence,
  };
};

const DualPersonality = ({ dayIndex }: DualPersonalityProps) => {
  const { days } = useJourney();
  const day = days[dayIndex];

  const [logicalThought, setLogicalThought] = useState("");
  const [emotionalThought, setEmotionalThought] = useState("");
  const [aiDecision, setAiDecision] = useState<AIDecision | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!day) return null;

  const handleDecide = () => {
    if (!logicalThought.trim() || !emotionalThought.trim()) {
      toast.error("Please fill in both your logical and emotional perspectives.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setAiDecision(generateMockDecision(day.goal, logicalThought, emotionalThought));
      setIsLoading(false);
    }, 1500);
  };

  const slideLeft = { hidden: { opacity: 0, x: -80 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } } };
  const slideRight = { hidden: { opacity: 0, x: 80 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } } };
  const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
          <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-secondary mb-3">Two Perspectives, One Decision</p>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mb-4">The Dual You</h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">Share what you're thinking logically and feeling emotionally about "{day.goal}" — and let AI make the call.</p>
          <div className="w-16 h-px bg-primary mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-lg overflow-hidden journal-shadow">
          <motion.div className="bg-card p-8 md:p-10 border-b md:border-b-0 md:border-r border-border" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={slideLeft}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🧠</span>
              <h3 className="font-display text-xl font-medium text-foreground tracking-wide">Logical You</h3>
            </div>
            <p className="font-sans-light text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">The strategist within</p>
            <Textarea placeholder="What does your logical side think about this goal?" value={logicalThought} onChange={(e) => setLogicalThought(e.target.value)} className="min-h-[160px] bg-muted/30 border-border font-body text-sm resize-none focus:ring-primary/30" />
          </motion.div>

          <motion.div className="bg-accent/20 p-8 md:p-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={slideRight}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">❤️</span>
              <h3 className="font-display text-xl font-medium text-foreground tracking-wide">Emotional You</h3>
            </div>
            <p className="font-sans-light text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">The dreamer within</p>
            <Textarea placeholder="What does your heart say? How does this goal make you feel?" value={emotionalThought} onChange={(e) => setEmotionalThought(e.target.value)} className="min-h-[160px] bg-primary/5 border-primary/20 font-body text-sm resize-none focus:ring-primary/30" />
          </motion.div>
        </div>

        <motion.div className="text-center mt-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}>
          <Button onClick={handleDecide} disabled={isLoading || !logicalThought.trim() || !emotionalThought.trim()} className="font-sans-light text-sm tracking-[0.2em] uppercase px-12 py-6 bg-primary text-primary-foreground rounded-lg journal-shadow hover:-translate-y-0.5 transition-all duration-500">
            {isLoading ? "Thinking..." : "Make the Decision for Me ✨"}
          </Button>
        </motion.div>

        {aiDecision && (
          <motion.div className="mt-12 rounded-lg journal-shadow overflow-hidden" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <div className="bg-gradient-warm p-8 md:p-10 text-center border-b border-border">
              <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3">The Verdict</p>
              <h3 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-2">{aiDecision.decision}</h3>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                  <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${aiDecision.confidence}%` }} transition={{ duration: 1, delay: 0.3 }} />
                </div>
                <span className="font-body text-xs text-muted-foreground">{aiDecision.confidence}% confident</span>
              </div>
            </div>
            <div className="bg-card p-8 md:p-10 space-y-6">
              <div>
                <p className="font-sans-light text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Why this decision</p>
                <p className="font-body text-sm text-foreground/80 leading-relaxed italic">"{aiDecision.reasoning}"</p>
              </div>
              <div className="border-t border-border pt-5">
                <p className="font-sans-light text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Your next step</p>
                <p className="font-display text-base text-foreground">→ {aiDecision.actionStep}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DualPersonality;
