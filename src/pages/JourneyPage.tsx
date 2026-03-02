import { useJourney } from "@/context/JourneyContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const JourneyPage = () => {
  const { days } = useJourney();
  const navigate = useNavigate();

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

  // Group days into 5 chapters of 6 days
  const chapters = [
    { name: "Awakening", emoji: "🌅", range: [0, 5] },
    { name: "Discovery", emoji: "🧭", range: [6, 11] },
    { name: "Challenge", emoji: "⚡", range: [12, 17] },
    { name: "Transformation", emoji: "🦋", range: [18, 23] },
    { name: "Mastery", emoji: "👑", range: [24, 29] },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 pt-6">
      <div className="px-6 max-w-lg mx-auto">
        <h1 className="font-display text-3xl font-medium text-foreground mb-1">Your Journey</h1>
        <p className="font-body text-sm text-muted-foreground italic mb-8">
          {days.filter((d) => d.completed).length} of {days.length} days completed
        </p>

        <div className="space-y-6">
          {chapters.map((chapter, ci) => {
            const chapterDays = days.slice(chapter.range[0], chapter.range[1] + 1);
            if (!chapterDays.length) return null;
            const completed = chapterDays.filter((d) => d.completed).length;

            return (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.1 }}
                className="bg-card rounded-2xl p-5 journal-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{chapter.emoji}</span>
                  <div>
                    <h2 className="font-display text-lg font-medium text-foreground">
                      Ch. {ci + 1}: {chapter.name}
                    </h2>
                    <p className="font-sans-light text-xs text-muted-foreground tracking-widest uppercase">
                      {completed}/{chapterDays.length} complete
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {chapterDays.map((day, di) => {
                    const dayNum = chapter.range[0] + di + 1;
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
      </div>
    </div>
  );
};

export default JourneyPage;
