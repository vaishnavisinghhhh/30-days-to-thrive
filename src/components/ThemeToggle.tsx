import { Moon, Sun, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ThemeToggle = ({ inline }: { inline?: boolean }) => {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (inline) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-sans-light tracking-widest transition-all ${
            theme === "light" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Sun className="w-4 h-4" /> Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-sans-light tracking-widest transition-all ${
            theme === "dark" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Moon className="w-4 h-4" /> Dark
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-border/50 bg-card/80 backdrop-blur-md hover:bg-card shadow-lg"
          >
            <Settings className="h-4 w-4 text-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setTheme("light")} className={theme === "light" ? "bg-accent/30" : ""}>
            <Sun className="mr-2 h-4 w-4" /> Light Mode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className={theme === "dark" ? "bg-accent/30" : ""}>
            <Moon className="mr-2 h-4 w-4" /> Dark Mode
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeToggle;
