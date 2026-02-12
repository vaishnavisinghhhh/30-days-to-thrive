import { useJourney } from "@/context/JourneyContext";

interface JournalEntryProps {
  dayIndex: number;
}

const JournalEntry = ({ dayIndex }: JournalEntryProps) => {
  const { days, setDays } = useJourney();
  const entry = days[dayIndex]?.journalEntry || "";

  const handleChange = (value: string) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], journalEntry: value };
      return updated;
    });
  };

  return (
    <section className="py-20 px-6 bg-gradient-editorial">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-secondary mb-3">
            Reflect & Remember
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-2">
            Your Journal
          </h2>
          <p className="font-body text-sm text-muted-foreground italic">
            Pour your heart onto these pages. No judgment, only truth.
          </p>
        </div>

        <div className="bg-card rounded-lg journal-shadow p-8 md:p-12">
          {/* Journal header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <span className="font-display text-lg text-foreground">
              Day {dayIndex + 1}
            </span>
            <span className="font-sans-light text-xs text-muted-foreground tracking-wide">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Writing area */}
          <textarea
            value={entry}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Dear diary, today I..."
            className="w-full min-h-[300px] bg-transparent font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none text-base leading-[2] resize-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 31px, hsl(var(--border) / 0.3) 31px, hsl(var(--border) / 0.3) 32px)",
              backgroundAttachment: "local",
            }}
          />

          {/* Word count */}
          <div className="mt-4 text-right">
            <span className="font-sans-light text-xs text-muted-foreground">
              {entry.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JournalEntry;
