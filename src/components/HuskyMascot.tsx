import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useJourney } from "@/context/JourneyContext";

const HuskyMascot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { days } = useJourney();
  const [showTooltip, setShowTooltip] = useState(false);

  // Don't show on chatbot page or auth page
  if (location.pathname === "/chatbot" || location.pathname === "/auth") return null;

  // Get contextual goal
  const dayMatch = location.pathname.match(/\/day\/(\d+)/);
  const currentGoal = dayMatch && days.length > 0
    ? days[parseInt(dayMatch[1]) - 1]?.goal || ""
    : "";

  const handleClick = () => {
    const params = currentGoal ? `?goal=${encodeURIComponent(currentGoal)}` : "";
    navigate(`/chatbot${params}`);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-2 bg-card rounded-xl px-3 py-2 journal-shadow whitespace-nowrap"
          >
            <p className="font-body text-xs text-foreground">Need help deciding? 🐾</p>
            <div className="absolute bottom-0 right-4 w-2 h-2 bg-card rotate-45 translate-y-1" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full bg-card journal-shadow flex items-center justify-center text-2xl hover:scale-110 transition-transform border-2 border-primary/20"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Chat with Koda"
      >
        🐺
      </motion.button>
    </div>
  );
};

export default HuskyMascot;
