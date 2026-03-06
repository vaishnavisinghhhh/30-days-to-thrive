import { useJourney } from "@/context/JourneyContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PlanSection {
  title: string;
  icon: string;
  items: string[];
}

interface DayBreakdownProps {
  dayIndex: number;
}

const generateMockPlan = (goal: string): PlanSection[] => [
  {
    title: "Morning Preparation",
    icon: "🌅",
    items: [
      `Research "${goal}" — gather inspiration and resources`,
      "Set your intention and visualize success",
      "Prepare any materials or tools you'll need",
    ],
  },
  {
    title: "Action Steps",
    icon: "⚡",
    items: [
      `Take the first concrete step toward "${goal}"`,
      "Document your progress with photos or notes",
      "Push through any resistance — momentum is key",
    ],
  },
  {
    title: "Reflection & Growth",
    icon: "🌱",
    items: [
      "What did you learn today?",
      "What surprised you about this experience?",
      "How has this changed your perspective?",
    ],
  },
  {
    title: "Evening Wind-Down",
    icon: "🌙",
    items: [
      "Write in your journal about today's experience",
      "Share a highlight with someone you care about",
      "Rest well — tomorrow brings new adventures",
    ],
  },
];

const DayBreakdown = ({ dayIndex }: DayBreakdownProps) => {
  const { days } = useJourney();
  const day = days[dayIndex];
  const [sections, setSections] = useState<PlanSection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!day?.goal) return;
    setLoading(true);
    // Simulate loading delay
    const timer = setTimeout(() => {
      setSections(generateMockPlan(day.goal));
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [day?.goal]);

  if (!day) return null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-secondary mb-3">Your Mission Today</p>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mb-4 italic">"{day.goal}"</h2>
          <div className="w-16 h-px bg-primary mx-auto" />
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="font-body text-muted-foreground italic animate-pulse">Crafting your personalized plan...</p>
          </div>
        )}

        <AnimatePresence>
          {!loading && sections.length > 0 && (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {sections.map((section, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.15 }} className="bg-card rounded-lg p-8 journal-shadow hover:-translate-y-1 hover:shadow-2xl transition-all duration-700">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">{section.icon}</span>
                    <h3 className="font-display text-lg font-medium text-foreground">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 font-body text-sm text-muted-foreground leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DayBreakdown;
