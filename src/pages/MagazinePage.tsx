import { useJourney } from "@/context/JourneyContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const chapterNames = ["Awakening", "Discovery", "Challenge", "Transformation", "Mastery"];
const chapterColors = [
  "from-blue-400/20 to-cyan-300/20",
  "from-emerald-400/20 to-teal-300/20",
  "from-orange-400/20 to-amber-300/20",
  "from-purple-400/20 to-pink-300/20",
  "from-yellow-400/20 to-amber-200/20",
];

const MagazinePage = () => {
  const { days } = useJourney();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const completed = days.filter(d => d.completed).length;
  const totalPhotos = days.reduce((acc, d) => acc + d.photos.length, 0);
  const totalWords = days.reduce((acc, d) => acc + (d.journalEntry?.split(/\s+/).filter(Boolean).length || 0), 0);

  if (completed < days.length || days.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center px-6">
          <h1 className="font-display text-3xl text-foreground mb-4">Not Yet...</h1>
          <p className="font-body text-muted-foreground italic mb-6">
            Complete all {days.length} days to unlock your magazine.
          </p>
          <p className="font-display text-6xl mb-4">🐺</p>
          <p className="font-body text-sm text-muted-foreground">{completed}/{days.length} days done</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-display text-lg font-medium text-foreground">Your Magazine</h1>
      </div>

      {/* Cover */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 px-6 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="relative z-10">
          <p className="font-sans-light text-xs tracking-[0.5em] uppercase text-muted-foreground mb-4">The Journey Issue</p>
          <h1 className="font-display text-5xl md:text-7xl font-medium text-foreground italic mb-4">
            {profile?.display_name || "Explorer"}'s
          </h1>
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-8">30 Days of Living</h2>
          <div className="flex justify-center gap-8 text-center">
            <div>
              <span className="font-display text-3xl text-foreground block">{totalWords}</span>
              <span className="font-sans-light text-[10px] tracking-widest uppercase text-muted-foreground">Words Written</span>
            </div>
            <div>
              <span className="font-display text-3xl text-foreground block">{totalPhotos}</span>
              <span className="font-sans-light text-[10px] tracking-widest uppercase text-muted-foreground">Memories Captured</span>
            </div>
            <div>
              <span className="font-display text-3xl text-foreground block">{days.length}</span>
              <span className="font-sans-light text-[10px] tracking-widest uppercase text-muted-foreground">Dreams Lived</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Chapters */}
      <div className="px-6 max-w-3xl mx-auto space-y-12">
        {chapterNames.map((name, ci) => {
          const chapterDays = days.slice(ci * 6, (ci + 1) * 6);
          if (!chapterDays.length) return null;

          return (
            <motion.section
              key={ci}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={`rounded-2xl p-8 bg-gradient-to-br ${chapterColors[ci]} mb-6`}>
                <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-muted-foreground mb-2">
                  Chapter {ci + 1}
                </p>
                <h3 className="font-display text-3xl font-medium text-foreground">{name}</h3>
              </div>

              <div className="space-y-6">
                {chapterDays.map((day, di) => {
                  const dayNum = ci * 6 + di + 1;
                  if (!day.journalEntry && day.photos.length === 0) return null;

                  return (
                    <div key={di} className="bg-card rounded-2xl p-6 journal-shadow">
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="font-display text-2xl text-primary">{String(dayNum).padStart(2, "0")}</span>
                        <h4 className="font-display text-lg text-foreground italic">{day.goal}</h4>
                      </div>
                      {day.journalEntry && (
                        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                          "{day.journalEntry}"
                        </p>
                      )}
                      {day.photos.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {day.photos.slice(0, 4).map((photo, pi) => (
                            <div key={pi} className="aspect-square rounded-xl overflow-hidden">
                              <img src={photo} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Closing */}
      <section className="py-20 px-6 text-center">
        <p className="font-display text-4xl text-foreground italic mb-4">Fin. 🐺</p>
        <p className="font-body text-muted-foreground">You lived. You dreamed. You became.</p>
      </section>
    </div>
  );
};

export default MagazinePage;
