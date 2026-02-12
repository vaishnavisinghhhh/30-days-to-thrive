import { useJourney } from "@/context/JourneyContext";

const generatePlan = (goal: string) => {
  const lower = goal.toLowerCase();

  const steps = [
    {
      title: "Getting Started",
      icon: "✦",
      items: [
        `Research everything about "${goal}"`,
        "Create a detailed timeline for the day",
        "Set a clear intention and visualize success",
      ],
    },
    {
      title: "Logistics & Planning",
      icon: "◈",
      items: [
        lower.includes("hik") || lower.includes("travel") || lower.includes("visit")
          ? "Book transportation — flights, trains, or buses"
          : "Gather all necessary materials and resources",
        lower.includes("hik") || lower.includes("travel") || lower.includes("visit")
          ? "Find accommodation — hotels, hostels, or Airbnb"
          : "Set up your environment for focus",
        "Budget estimation and financial planning",
      ],
    },
    {
      title: "Execution Guide",
      icon: "◇",
      items: [
        `Step-by-step approach to "${goal}"`,
        "Key milestones to hit throughout the day",
        "Backup plan if things don't go as expected",
      ],
    },
    {
      title: "Inspiration & Tips",
      icon: "❋",
      items: [
        "Connect with others who've done something similar",
        "Document everything — photos, notes, feelings",
        "Be present. This day won't come again.",
      ],
    },
  ];

  return steps;
};

interface DayBreakdownProps {
  dayIndex: number;
}

const DayBreakdown = ({ dayIndex }: DayBreakdownProps) => {
  const { days } = useJourney();
  const day = days[dayIndex];
  if (!day) return null;

  const plan = generatePlan(day.goal);

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-secondary mb-3">
            Your Mission Today
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground mb-4 italic">
            "{day.goal}"
          </h2>
          <div className="w-16 h-px bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plan.map((section, i) => (
            <div
              key={i}
              className="bg-card rounded-lg p-8 journal-shadow hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{section.icon}</span>
                <h3 className="font-display text-lg font-medium text-foreground">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 font-body text-sm text-muted-foreground leading-relaxed"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DayBreakdown;
