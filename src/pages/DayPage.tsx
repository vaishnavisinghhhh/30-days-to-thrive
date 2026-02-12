import { useParams, useNavigate } from "react-router-dom";
import { useJourney } from "@/context/JourneyContext";
import DayBreakdown from "@/components/DayBreakdown";
import ProgressTracker from "@/components/ProgressTracker";
import PhotoGallery from "@/components/PhotoGallery";
import JournalEntry from "@/components/JournalEntry";

const DayPage = () => {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { days, startDate } = useJourney();
  const dayNum = parseInt(dayNumber || "1", 10);
  const dayIndex = dayNum - 1;

  if (!days.length || dayIndex < 0 || dayIndex >= 30) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">
            No journey started yet
          </h1>
          <button
            onClick={() => navigate("/")}
            className="font-sans-light text-sm tracking-[0.2em] uppercase text-primary hover:underline"
          >
            ← Start Your Journey
          </button>
        </div>
      </div>
    );
  }

  // Calculate days remaining
  const daysRemaining = 30 - dayNum;

  const goToNextDay = () => {
    if (dayNum < 30) {
      navigate(`/day/${dayNum + 1}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Day header */}
      <header className="relative py-24 px-6 text-center bg-gradient-warm">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 font-sans-light text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>

        <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3">
          {daysRemaining} days remaining
        </p>
        <h1 className="font-display text-6xl md:text-8xl font-medium text-foreground mb-2">
          Day {String(dayNum).padStart(2, "0")}
        </h1>
        <div className="w-12 h-px bg-primary mx-auto mt-6 mb-4" />
        <p className="font-body text-muted-foreground italic text-lg">
          {days[dayIndex].goal}
        </p>
      </header>

      {/* Day breakdown */}
      <DayBreakdown dayIndex={dayIndex} />

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <div className="w-1 h-1 rounded-full bg-accent" />
        <div className="w-24 h-px bg-border mx-4" />
        <div className="w-1 h-1 rounded-full bg-accent" />
      </div>

      {/* Progress tracker */}
      <ProgressTracker dayIndex={dayIndex} />

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <div className="w-1 h-1 rounded-full bg-accent" />
        <div className="w-24 h-px bg-border mx-4" />
        <div className="w-1 h-1 rounded-full bg-accent" />
      </div>

      {/* Photo gallery */}
      <PhotoGallery dayIndex={dayIndex} />

      {/* Divider */}
      <div className="flex items-center justify-center py-8">
        <div className="w-1 h-1 rounded-full bg-accent" />
        <div className="w-24 h-px bg-border mx-4" />
        <div className="w-1 h-1 rounded-full bg-accent" />
      </div>

      {/* Journal */}
      <JournalEntry dayIndex={dayIndex} />

      {/* Next day button */}
      <section className="py-24 px-6 text-center">
        {dayNum < 30 ? (
          <button
            onClick={goToNextDay}
            className="group font-sans-light text-sm tracking-[0.2em] uppercase px-12 py-4 bg-primary text-primary-foreground rounded-lg journal-shadow hover:-translate-y-0.5 transition-all duration-500"
          >
            Go to Day {dayNum + 1} →
          </button>
        ) : (
          <div>
            <h2 className="font-display text-4xl text-foreground mb-4">
              Your 30 Days Are Complete
            </h2>
            <p className="font-body text-muted-foreground italic">
              You lived. You dreamed. You became.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DayPage;
