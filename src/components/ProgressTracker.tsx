import { useJourney } from "@/context/JourneyContext";

interface ProgressTrackerProps {
  dayIndex: number;
}

const ProgressTracker = ({ dayIndex }: ProgressTrackerProps) => {
  const { days } = useJourney();
  if (!days.length) return null;

  const completedCount = days.filter((d) => d.completed).length;
  const progress = (completedCount / days.length) * 100;

  return (
    <section className="py-12 px-6">
      <div className="max-w-lg mx-auto text-center">
        <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6">
          Journey Progress
        </p>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
          <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <p className="font-display text-2xl text-foreground mb-1">{completedCount} / {days.length}</p>
        <p className="font-body text-sm text-muted-foreground italic">{Math.round(progress)}% of your journey complete</p>
        <div className="flex flex-wrap justify-center gap-1.5 mt-6">
          {days.map((d, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                d.completed ? "bg-primary" : i === dayIndex ? "bg-accent ring-2 ring-accent/30" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgressTracker;
