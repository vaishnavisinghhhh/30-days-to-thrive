import { useJourney } from "@/context/JourneyContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { BookOpen, Plus, X } from "lucide-react";
import { toast } from "sonner";

const chapters = [
  { name: "Awakening", emoji: "🌅", desc: "The first sparks of courage" },
  { name: "Discovery", emoji: "🧭", desc: "Venturing into the unknown" },
  { name: "Challenge", emoji: "⚡", desc: "Pushing past your limits" },
  { name: "Transformation", emoji: "🦋", desc: "Becoming who you're meant to be" },
  { name: "Mastery", emoji: "👑", desc: "Owning your story" },
];

const JourneyPage = () => {
  const { days, loading, addMoreDays } = useJourney();
  const navigate = useNavigate();
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newItems, setNewItems] = useState<string[]>(Array(5).fill(""));
  const [saving, setSaving] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!days.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center px-6">
          <h1 className="font-display text-3xl text-foreground mb-4">No Journey Yet</h1>
          <p className="font-body text-muted-foreground mb-6 italic">
            Start your 30-day adventure from the home screen.
          </p>
          <button
            onClick={() => navigate("/")}
            className="font-sans-light text-sm tracking-widest uppercase px-8 py-3 bg-primary text-primary-foreground rounded-lg"
          >
            Begin Journey
          </button>
        </div>
      </div>
    );
  }

  const completed = days.filter(d => d.completed).length;
  const allDone = completed === days.length && days.length > 0;

  return (
    <div className="min-h-screen bg-background pb-24 pt-6">
      <div className="px-6 max-w-lg mx-auto">
        <h1 className="font-display text-3xl font-medium text-foreground mb-1">Your Journey</h1>
        <p className="font-body text-sm text-muted-foreground italic mb-8">
          {completed} of {days.length} days completed
        </p>

        {allDone && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => navigate("/magazine")}
            className="w-full bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-5 journal-shadow mb-6 text-center hover:scale-[1.01] transition-transform"
          >
            <p className="font-display text-lg text-foreground mb-1">🎉 Journey Complete!</p>
            <p className="font-sans-light text-xs tracking-widest uppercase text-primary">View Your Magazine →</p>
          </motion.button>
        )}

        <div className="space-y-6">
          {chapters.map((chapter, ci) => {
            const start = ci * 6;
            const chapterDays = days.slice(start, start + 6);
            if (!chapterDays.length) return null;
            const chCompleted = chapterDays.filter(d => d.completed).length;

            return (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.1 }}
                className="bg-card rounded-2xl p-5 journal-shadow"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{chapter.emoji}</span>
                  <div>
                    <h2 className="font-display text-lg font-medium text-foreground">
                      Ch. {ci + 1}: {chapter.name}
                    </h2>
                    <p className="font-body text-xs text-muted-foreground italic">{chapter.desc}</p>
                  </div>
                </div>
                <p className="font-sans-light text-[10px] text-muted-foreground tracking-widest uppercase mb-3 ml-10">
                  {chCompleted}/{chapterDays.length} complete
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {chapterDays.map((day, di) => {
                    const dayNum = start + di + 1;
                    return (
                      <button
                        key={di}
                        onClick={() => navigate(`/day/${dayNum}`)}
                        className={`relative p-3 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] ${
                          day.completed
                            ? "bg-primary/15 border border-primary/30"
                            : "bg-muted/50 border border-border"
                        }`}
                      >
                        <span className="font-display text-lg font-medium text-foreground block">
                          {String(dayNum).padStart(2, "0")}
                        </span>
                        <span className="font-body text-[10px] text-muted-foreground line-clamp-1">
                          {day.goal}
                        </span>
                        {day.completed && (
                          <span className="absolute top-2 right-2 text-xs">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add More Dreams */}
        {days.length < 30 && (
          <>
            {!showAddPanel ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAddPanel(true)}
                className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-border bg-card/50 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="font-sans-light text-sm tracking-widest uppercase">
                  Add More Dreams ({days.length}/30)
                </span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-card rounded-2xl p-5 journal-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg text-foreground">Add Dreams</h3>
                  <button onClick={() => setShowAddPanel(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="font-body text-xs text-muted-foreground mb-4 italic">
                  You can add up to {30 - days.length} more {30 - days.length === 1 ? "dream" : "dreams"}.
                </p>
                <div className="space-y-2">
                  {newItems.slice(0, 30 - days.length).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="font-display text-lg font-medium text-accent w-6 text-right">
                        {String(days.length + i + 1).padStart(2, "0")}
                      </span>
                      <input
                        ref={el => (inputRefs.current[i] = el)}
                        type="text"
                        value={item}
                        onChange={e => {
                          const updated = [...newItems];
                          updated[i] = e.target.value;
                          setNewItems(updated);
                        }}
                        onKeyDown={e => {
                          if (e.key === "Enter" && i < Math.min(newItems.length, 30 - days.length) - 1) {
                            inputRefs.current[i + 1]?.focus();
                          }
                        }}
                        placeholder="What would you do?"
                        className="flex-1 bg-muted/50 rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={async () => {
                    const filled = newItems.map(i => i.trim()).filter(Boolean);
                    if (!filled.length) return;
                    setSaving(true);
                    try {
                      await addMoreDays(filled);
                      toast.success(`Added ${filled.length} new ${filled.length === 1 ? "dream" : "dreams"}!`);
                      setNewItems(Array(5).fill(""));
                      setShowAddPanel(false);
                    } catch {
                      toast.error("Failed to add dreams");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={!newItems.some(i => i.trim()) || saving}
                  className={`mt-4 w-full py-3 rounded-xl font-sans-light text-sm tracking-widest uppercase transition-all ${
                    newItems.some(i => i.trim()) && !saving
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {saving ? "Adding..." : "Add Dreams"}
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JourneyPage;
