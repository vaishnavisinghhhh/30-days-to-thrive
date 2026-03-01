import { useJourney } from "@/context/JourneyContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface PlanSection {
  title: string;
  icon: string;
  items: string[];
}

interface DayBreakdownProps {
  dayIndex: number;
}

const DayBreakdown = ({ dayIndex }: DayBreakdownProps) => {
  const { days } = useJourney();
  const day = days[dayIndex];
  const [sections, setSections] = useState<PlanSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!day?.goal) return;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      setSections([]);

      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "generate-day-plan",
          { body: { goal: day.goal } }
        );

        if (fnError) throw fnError;

        if (data?.error) {
          setError(data.error);
        } else if (data?.sections) {
          setSections(data.sections);
        }
      } catch (e: any) {
        console.error("Failed to generate plan:", e);
        setError("Failed to generate your plan. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [day?.goal]);

  if (!day) return null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-secondary mb-3">
            Your Mission Today
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mb-4 italic">
            "{day.goal}"
          </h2>
          <div className="w-16 h-px bg-primary mx-auto" />
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
            <p className="font-body text-muted-foreground italic animate-pulse">
              Crafting your personalized plan...
            </p>
            <p className="font-sans-light text-xs tracking-[0.2em] uppercase text-muted-foreground/60">
              Researching logistics, hotspots & insider tips
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="font-body text-destructive mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                supabase.functions
                  .invoke("generate-day-plan", { body: { goal: day.goal } })
                  .then(({ data }) => {
                    if (data?.sections) setSections(data.sections);
                    else setError("Failed to generate plan.");
                  })
                  .catch(() => setError("Failed to generate plan."))
                  .finally(() => setLoading(false));
              }}
              className="font-sans-light text-sm tracking-[0.2em] uppercase px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:-translate-y-0.5 transition-all duration-500"
            >
              Try Again
            </button>
          </div>
        )}

        <AnimatePresence>
          {!loading && !error && sections.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="bg-card rounded-lg p-8 journal-shadow hover:-translate-y-1 hover:shadow-2xl transition-all duration-700"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">{section.icon}</span>
                    <h3 className="font-display text-lg font-medium text-foreground">
                      {section.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 font-body text-sm text-muted-foreground leading-relaxed"
                      >
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
