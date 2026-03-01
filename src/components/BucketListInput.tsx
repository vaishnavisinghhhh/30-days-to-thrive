import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useJourney } from "@/context/JourneyContext";

const BucketListInput = () => {
  const [items, setItems] = useState<string[]>(Array(30).fill(""));
  const navigate = useNavigate();
  const { setBucketList } = useJourney();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const filledCount = items.filter((i) => i.trim()).length;

  const handleChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter" && index < 29) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleContinue = () => {
    const filled = items.map((i) => i.trim()).filter(Boolean);
    if (filled.length < 1) return;
    setBucketList(filled);
    navigate("/day/1");
  };

  return (
    <section id="bucket-list" className="min-h-screen bg-gradient-editorial py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans-light text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
            Your Personal Manifesto
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-4">
            The Bucket List
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Thirty days. Thirty dreams. Write down everything you'd do if time were
            the most precious currency you had.
          </p>
          {/* Progress */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="font-sans-light text-sm text-muted-foreground">
              {filledCount} / 30
            </span>
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(filledCount / 30) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pinterest-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className={`group relative journal-shadow rounded-lg p-5 transition-all duration-300 hover:-translate-y-1 ${
                item.trim()
                  ? "bg-card"
                  : "bg-card/50 border border-dashed border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="font-display text-2xl font-medium text-accent leading-none mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={item}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder="What would you do?"
                  className="flex-1 bg-transparent font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none text-sm leading-relaxed"
                />
              </div>
              {item.trim() && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-sage" />
              )}
            </div>
          ))}
        </div>

        {/* Continue button */}
        <div className="text-center mt-16">
          <button
            onClick={handleContinue}
            disabled={filledCount < 1}
            className={`font-sans-light text-sm tracking-[0.2em] uppercase px-12 py-4 rounded-lg transition-all duration-700 ${
              filledCount >= 1
                ? "bg-primary text-primary-foreground journal-shadow hover:-translate-y-1 hover:shadow-2xl"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Begin the {filledCount} {filledCount === 1 ? "Day" : "Days"} →
          </button>
          {filledCount < 1 && (
            <p className="font-body text-xs text-muted-foreground mt-3 italic">
              Enter at least one dream to continue
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BucketListInput;
