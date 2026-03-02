import { useParams, useNavigate } from "react-router-dom";
import { useJourney } from "@/context/JourneyContext";
import DayBreakdown from "@/components/DayBreakdown";
import DualPersonality from "@/components/DualPersonality";
import ProgressTracker from "@/components/ProgressTracker";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useEffect } from "react";

const DayPage = () => {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { days } = useJourney();
  const dayNum = parseInt(dayNumber || "1", 10);
  const dayIndex = dayNum - 1;
  const totalDays = days.length;

  // Fix: scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [dayNum]);

  if (!days.length || dayIndex < 0 || dayIndex >= totalDays) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">No journey started yet</h1>
          <button onClick={() => navigate("/")} className="font-sans-light text-sm tracking-widest uppercase text-primary hover:underline">
            ← Start Your Journey
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = totalDays - dayNum;

  const goToNextDay = () => {
    if (dayNum < totalDays) navigate(`/day/${dayNum + 1}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/journey")} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="text-center">
          <h1 className="font-display text-lg font-medium text-foreground">Day {String(dayNum).padStart(2, "0")}</h1>
          <p className="font-sans-light text-[10px] tracking-widest uppercase text-muted-foreground">
            {daysRemaining} remaining
          </p>
        </div>
        <button
          onClick={() => navigate(`/day/${dayNum}/journal`)}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <BookOpen className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Goal header */}
      <header className="py-12 px-6 text-center bg-gradient-warm">
        <p className="font-body text-muted-foreground italic text-lg">"{days[dayIndex].goal}"</p>
      </header>

      {/* Day breakdown (logistics) */}
      <DayBreakdown dayIndex={dayIndex} />

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <div className="w-1 h-1 rounded-full bg-accent" />
        <div className="w-24 h-px bg-border mx-4" />
        <div className="w-1 h-1 rounded-full bg-accent" />
      </div>

      {/* Decision AI */}
      <DualPersonality dayIndex={dayIndex} />

      {/* Progress tracker */}
      <div className="flex items-center justify-center py-8">
        <div className="w-1 h-1 rounded-full bg-accent" />
        <div className="w-24 h-px bg-border mx-4" />
        <div className="w-1 h-1 rounded-full bg-accent" />
      </div>

      <ProgressTracker dayIndex={dayIndex} />

      {/* Next day */}
      <section className="py-16 px-6 text-center">
        {dayNum < totalDays ? (
          <button
            onClick={goToNextDay}
            className="font-sans-light text-sm tracking-widest uppercase px-12 py-4 bg-primary text-primary-foreground rounded-xl journal-shadow hover:-translate-y-0.5 transition-all duration-500"
          >
            Day {dayNum + 1} →
          </button>
        ) : (
          <div>
            <h2 className="font-display text-4xl text-foreground mb-4">Journey Complete 🎉</h2>
            <p className="font-body text-muted-foreground italic">You lived. You dreamed. You became.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DayPage;
