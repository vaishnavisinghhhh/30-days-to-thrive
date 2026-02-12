import { useJourney } from "@/context/JourneyContext";

const getLogicalPerspective = (goal: string) => {
  const lower = goal.toLowerCase();
  const isTravel = lower.includes("hik") || lower.includes("travel") || lower.includes("visit") || lower.includes("trek");
  const isLearn = lower.includes("learn") || lower.includes("study") || lower.includes("read") || lower.includes("course");
  const isCreate = lower.includes("write") || lower.includes("build") || lower.includes("create") || lower.includes("paint") || lower.includes("cook");

  if (isTravel) return {
    verdict: "Feasible with planning",
    points: [
      "Research optimal routes, weather conditions, and peak seasons before committing.",
      "Calculate total cost: transport, accommodation, gear, food, and emergency buffer.",
      "Break it into phases — preparation, execution, and recovery time.",
    ],
    advice: "Start with logistics. A well-planned trip is a successful trip.",
  };
  if (isLearn) return {
    verdict: "Achievable with structure",
    points: [
      "Define measurable milestones — what does 'done' look like?",
      "Allocate focused time blocks. Consistency beats intensity.",
      "Find the best resources: books, courses, mentors. Don't reinvent the wheel.",
    ],
    advice: "Set a schedule and track your progress objectively.",
  };
  if (isCreate) return {
    verdict: "Requires discipline",
    points: [
      "Set a clear deliverable. Vague goals produce vague results.",
      "Eliminate distractions during creative work blocks.",
      "Iterate — first drafts aren't final. Plan for revision cycles.",
    ],
    advice: "Treat it like a project. Deadlines create momentum.",
  };
  return {
    verdict: "Worth pursuing strategically",
    points: [
      `Define what success looks like for "${goal}" in concrete terms.`,
      "Identify the biggest obstacle and address it first.",
      "Set up accountability — tell someone, track progress, review daily.",
    ],
    advice: "Be methodical. Emotions fade; systems endure.",
  };
};

const getEmotionalPerspective = (goal: string) => {
  const lower = goal.toLowerCase();
  const isTravel = lower.includes("hik") || lower.includes("travel") || lower.includes("visit") || lower.includes("trek");
  const isLearn = lower.includes("learn") || lower.includes("study") || lower.includes("read") || lower.includes("course");
  const isCreate = lower.includes("write") || lower.includes("build") || lower.includes("create") || lower.includes("paint") || lower.includes("cook");

  if (isTravel) return {
    verdict: "Your soul needs this",
    points: [
      "Imagine standing there — the wind, the light, the vastness. You deserve that moment.",
      "Travel isn't about the destination. It's about who you become on the way.",
      "The discomfort of the journey is what makes the memory unforgettable.",
    ],
    advice: "Don't overthink it. Some of the best trips start with a leap of faith.",
  };
  if (isLearn) return {
    verdict: "This will change you",
    points: [
      "There's a version of you on the other side of this who thinks differently.",
      "The frustration of not understanding is the feeling of growing.",
      "You're not just learning a skill — you're expanding who you are.",
    ],
    advice: "Fall in love with the process, not just the outcome.",
  };
  if (isCreate) return {
    verdict: "This is calling you",
    points: [
      "Something inside you needs to express this. Honor that impulse.",
      "Perfection is the enemy of creation. Let it be messy, let it be real.",
      "What you create will outlast this moment. That's a kind of immortality.",
    ],
    advice: "Create from the heart. The world needs your authentic voice.",
  };
  return {
    verdict: "Life is asking you to try",
    points: [
      `"${goal}" — just saying it out loud makes your heart beat faster. That means something.`,
      "Fear and excitement feel the same. Choose to call it excitement.",
      "You'll regret the things you didn't do far more than the ones you did.",
    ],
    advice: "Trust yourself. You're more ready than you think.",
  };
};

interface DualPersonalityProps {
  dayIndex: number;
}

const DualPersonality = ({ dayIndex }: DualPersonalityProps) => {
  const { days } = useJourney();
  const day = days[dayIndex];
  if (!day) return null;

  const logical = getLogicalPerspective(day.goal);
  const emotional = getEmotionalPerspective(day.goal);

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-secondary mb-3">
            Two Perspectives, One Decision
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mb-4">
            The Dual You
          </h2>
          <div className="w-16 h-px bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 rounded-lg overflow-hidden journal-shadow">
          {/* Logical Side */}
          <div className="bg-card p-8 md:p-10 border-b md:border-b-0 md:border-r border-border">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🧠</span>
              <h3 className="font-display text-xl font-medium text-foreground tracking-wide">
                Logical You
              </h3>
            </div>
            <p className="font-sans-light text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
              The strategist within
            </p>

            <div className="mb-6 px-4 py-3 rounded-md bg-muted/50 border border-border">
              <p className="font-display text-sm italic text-foreground">
                Verdict: {logical.verdict}
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {logical.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-display text-xs text-muted-foreground mt-1">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>

            <div className="border-t border-border pt-5">
              <p className="font-body text-sm italic text-foreground/80">
                "{logical.advice}"
              </p>
            </div>
          </div>

          {/* Emotional Side */}
          <div className="bg-accent/20 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">❤️</span>
              <h3 className="font-display text-xl font-medium text-foreground tracking-wide">
                Emotional You
              </h3>
            </div>
            <p className="font-sans-light text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
              The dreamer within
            </p>

            <div className="mb-6 px-4 py-3 rounded-md bg-primary/10 border border-primary/20">
              <p className="font-display text-sm italic text-foreground">
                Verdict: {emotional.verdict}
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {emotional.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-display text-xs text-muted-foreground mt-1">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>

            <div className="border-t border-border pt-5">
              <p className="font-body text-sm italic text-foreground/80">
                "{emotional.advice}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualPersonality;
