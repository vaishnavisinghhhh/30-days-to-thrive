import { useJourney } from "@/context/JourneyContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Camera } from "lucide-react";

const JournalPage = () => {
  const { days } = useJourney();
  const navigate = useNavigate();

  if (!days.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center px-6">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl text-foreground mb-2">No Entries Yet</h1>
          <p className="font-body text-sm text-muted-foreground italic">
            Start your journey to begin writing.
          </p>
        </div>
      </div>
    );
  }

  const entriesWithContent = days
    .map((day, i) => ({ ...day, dayNum: i + 1 }))
    .filter((d) => d.journalEntry || d.photos.length > 0);

  return (
    <div className="min-h-screen bg-background pb-24 pt-6">
      <div className="px-6 max-w-lg mx-auto">
        <h1 className="font-display text-3xl font-medium text-foreground mb-1">Journal & Memories</h1>
        <p className="font-body text-sm text-muted-foreground italic mb-8">
          {entriesWithContent.length} entries so far
        </p>

        {entriesWithContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground italic">
              Complete a day and write your reflections to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entriesWithContent.map((day, i) => (
              <motion.button
                key={day.dayNum}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/day/${day.dayNum}/journal`)}
                className="w-full bg-card rounded-2xl p-5 journal-shadow text-left hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-display text-lg font-medium text-foreground">
                      Day {String(day.dayNum).padStart(2, "0")}
                    </span>
                    <p className="font-body text-xs text-muted-foreground italic line-clamp-1">
                      {day.goal}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {day.journalEntry && <BookOpen className="w-4 h-4 text-primary" />}
                    {day.photos.length > 0 && <Camera className="w-4 h-4 text-accent" />}
                  </div>
                </div>
                {day.journalEntry && (
                  <p className="font-body text-sm text-muted-foreground line-clamp-2 mt-2">
                    {day.journalEntry}
                  </p>
                )}
                {day.photos.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {day.photos.slice(0, 3).map((photo, j) => (
                      <div key={j} className="w-12 h-12 rounded-lg overflow-hidden">
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {day.photos.length > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <span className="font-sans-light text-xs text-muted-foreground">
                          +{day.photos.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
