import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = ({ onScrollDown }: { onScrollDown: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Misty mountains"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p
          className="font-sans-light text-sm tracking-[0.4em] uppercase text-muted-foreground mb-8 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          A philosophical journey
        </p>
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] tracking-tight text-foreground mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          If You Had Only{" "}
          <span className="text-gradient-warm italic">30 Days</span>
        </h1>
        <p
          className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.9s" }}
        >
          What would you do? Where would you go? Who would you become?
          <br />
          <span className="italic">This is your canvas. These are your days.</span>
        </p>
        <button
          onClick={onScrollDown}
          className="opacity-0 animate-fade-in-up group"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="font-sans-light text-xs tracking-[0.3em] uppercase text-primary">
              Begin Your Journey
            </span>
            <div className="w-px h-12 bg-primary/40 group-hover:h-16 transition-all duration-500" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
