import { useAuth } from "@/context/AuthContext";
import { useJourney } from "@/context/JourneyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut, User, Lock, Unlock, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const ProfilePage = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const { days } = useJourney();
  const navigate = useNavigate();
  const [editName, setEditName] = useState(profile?.display_name || "");

  const [isLockEnabled, setIsLockEnabled] = useState(() => localStorage.getItem("app-lock-enabled") === "true");
  const [lockPin, setLockPin] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);

  const completedDays = days.filter((d) => d.completed).length;
  const totalPhotos = days.reduce((acc, d) => acc + d.photos.length, 0);
  const totalWords = days.reduce((acc, d) => acc + (d.journalEntry?.split(/\s+/).filter(Boolean).length || 0), 0);
  const allDone = completedDays === days.length && days.length > 0;

  const handleSave = () => {
    updateProfile({ display_name: editName });
    toast.success("Profile updated!");
  };

  const handleToggleLock = () => {
    if (isLockEnabled) {
      localStorage.removeItem("app-lock-enabled");
      localStorage.removeItem("app-lock-pin");
      setIsLockEnabled(false);
      toast.success("App lock disabled");
    } else {
      setShowPinInput(true);
    }
  };

  const handleSetPin = () => {
    if (lockPin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }
    localStorage.setItem("app-lock-enabled", "true");
    localStorage.setItem("app-lock-pin", lockPin);
    setIsLockEnabled(true);
    setShowPinInput(false);
    setLockPin("");
    toast.success("App lock enabled! 🔒");
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-6">
      <div className="px-6 max-w-lg mx-auto">
        <h1 className="font-display text-3xl font-medium text-foreground mb-8">Profile</h1>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl text-foreground">{profile?.display_name || "Explorer"}</h2>
            <p className="font-body text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { value: days.length, label: "Goals" },
            { value: completedDays, label: "Done", highlight: true },
            { value: totalPhotos, label: "Photos" },
            { value: totalWords, label: "Words" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-3 text-center journal-shadow">
              <span className={`font-display text-xl block ${stat.highlight ? "text-primary" : "text-foreground"}`}>{stat.value}</span>
              <span className="font-sans-light text-[9px] tracking-widest uppercase text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {allDone && (
          <button
            onClick={() => navigate("/magazine")}
            className="w-full bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-5 journal-shadow mb-6 flex items-center gap-3 hover:scale-[1.01] transition-transform"
          >
            <Trophy className="w-6 h-6 text-primary" />
            <div className="text-left">
              <p className="font-display text-lg text-foreground">Your Magazine is Ready!</p>
              <p className="font-sans-light text-xs tracking-widest uppercase text-primary">View 30-day recap →</p>
            </div>
          </button>
        )}

        <div className="bg-card rounded-2xl p-5 journal-shadow mb-4">
          <label className="font-sans-light text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
            Display Name
          </label>
          <div className="flex gap-2">
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-muted/50 border-border flex-1" />
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">Save</Button>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 journal-shadow mb-4">
          <label className="font-sans-light text-xs tracking-widest uppercase text-muted-foreground mb-3 block">Appearance</label>
          <ThemeToggle inline />
        </div>

        <div className="bg-card rounded-2xl p-5 journal-shadow mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="font-sans-light text-xs tracking-widest uppercase text-muted-foreground">App Lock</label>
            {isLockEnabled ? <Lock className="w-4 h-4 text-primary" /> : <Unlock className="w-4 h-4 text-muted-foreground" />}
          </div>
          {showPinInput ? (
            <div className="flex gap-2">
              <Input type="password" value={lockPin} onChange={(e) => setLockPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter 4-6 digit PIN" className="bg-muted/50 border-border flex-1" />
              <Button onClick={handleSetPin} className="bg-primary text-primary-foreground">Set</Button>
              <Button onClick={() => { setShowPinInput(false); setLockPin(""); }} variant="outline">Cancel</Button>
            </div>
          ) : (
            <Button onClick={handleToggleLock} variant="outline" className="w-full">
              {isLockEnabled ? "Disable Lock" : "Enable PIN Lock"}
            </Button>
          )}
        </div>

        <Button onClick={signOut} variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
