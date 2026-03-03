import { useParams, useNavigate } from "react-router-dom";
import { useJourney } from "@/context/JourneyContext";
import DayBreakdown from "@/components/DayBreakdown";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useEffect } from "react";

const DayPage = () => {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { days } = useJourney();
  const dayNum = parseInt(dayNumber || "1", 10);
  const dayIndex = dayNum - 1;
  const totalDays = days.length;

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
        {days[dayIndex].completed && (
          <span className="inline-block mt-3 font-sans-light text-xs tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
            ✓ Completed
          </span>
        )}
      </header>

      {/* Day breakdown (logistics) */}
      <DayBreakdown dayIndex={dayIndex} />

      {/* Navigation */}
      <section className="py-16 px-6 text-center">
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => navigate(`/day/${dayNum}/journal`)}
            className="font-sans-light text-sm tracking-widest uppercase px-12 py-4 bg-primary text-primary-foreground rounded-xl journal-shadow hover:-translate-y-0.5 transition-all duration-500"
          >
            {days[dayIndex].completed ? "View Journal" : "Write Journal & Complete"} →
          </button>

          {dayNum < totalDays && (
            <button
              onClick={goToNextDay}
              className="font-sans-light text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip to Day {dayNum + 1} →
            </button>
          )}

          {dayNum >= totalDays && days.every(d => d.completed) && (
            <button
              onClick={() => navigate("/magazine")}
              className="font-sans-light text-sm tracking-widest uppercase px-12 py-4 border border-primary text-primary rounded-xl hover:-translate-y-0.5 transition-all duration-500 mt-4"
            >
              View Your Magazine 📖
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default DayPage;
