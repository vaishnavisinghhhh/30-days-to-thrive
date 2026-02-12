import { useJourney } from "@/context/JourneyContext";

interface ProgressTrackerProps {
  dayIndex: number;
}

const ProgressTracker = ({ dayIndex }: ProgressTrackerProps) => {
  const { days, setDays } = useJourney();
  const completedCount = days.filter((d) => d.completed).length;
  const progress = ((completedCount) / 30) * 100;

  const toggleComplete = () => {
    setDays((prev) => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], completed: !updated[dayIndex].completed };
      return updated;
    });
  };

  return (
    <section className="py-20 px-6 bg-gradient-warm">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
          Your Journey So Far
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-12">
          Progress Tracker
        </h2>

        {/* Moon phase visualization */}
        <div className="flex justify-center mb-12">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-muted" />
            <div
              className="absolute inset-0 rounded-full bg-primary transition-all duration-1000"
              style={{
                clipPath: `inset(0 ${100 - progress}% 0 0)`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-medium text-foreground">
                {completedCount}/30
              </span>
            </div>
          </div>
        </div>

        {/* Day dots */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-md mx-auto">
          {days.map((day, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                day.completed
                  ? "bg-primary"
                  : i === dayIndex
                  ? "bg-secondary ring-2 ring-secondary/30"
                  : "bg-muted"
              }`}
              title={`Day ${i + 1}: ${day.goal}`}
            />
          ))}
        </div>

        {/* Complete toggle */}
        <button
          onClick={toggleComplete}
          className={`font-sans-light text-sm tracking-[0.2em] uppercase px-8 py-3 rounded-lg transition-all duration-500 ${
            days[dayIndex]?.completed
              ? "bg-sage text-foreground"
              : "bg-primary text-primary-foreground journal-shadow hover:-translate-y-0.5"
          }`}
        >
          {days[dayIndex]?.completed ? "✓ Day Completed" : "Mark Day as Complete"}
        </button>
      </div>
    </section>
  );
};

export default ProgressTracker;
