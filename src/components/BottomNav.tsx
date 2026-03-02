import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, User, Map } from "lucide-react";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/journey", icon: Map, label: "Journey" },
  { path: "/journal", icon: BookOpen, label: "Journal" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`} />
              <span className="font-sans-light text-[10px] tracking-widest uppercase">
                {tab.label}
              </span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
