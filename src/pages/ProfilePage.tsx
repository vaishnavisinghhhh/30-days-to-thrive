import { useAuth } from "@/context/AuthContext";
import { useJourney } from "@/context/JourneyContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut, User, Moon, Sun } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const ProfilePage = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { days } = useJourney();
  const [editName, setEditName] = useState(profile?.display_name || "");
  const [saving, setSaving] = useState(false);

  const completedDays = days.filter((d) => d.completed).length;

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: editName, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      await refreshProfile();
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-6">
      <div className="px-6 max-w-lg mx-auto">
        <h1 className="font-display text-3xl font-medium text-foreground mb-8">Profile</h1>

        {/* Avatar area */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl text-foreground">
              {profile?.display_name || "Explorer"}
            </h2>
            <p className="font-body text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card rounded-xl p-4 text-center journal-shadow">
            <span className="font-display text-2xl text-foreground block">{days.length}</span>
            <span className="font-sans-light text-[10px] tracking-widest uppercase text-muted-foreground">Goals</span>
          </div>
          <div className="bg-card rounded-xl p-4 text-center journal-shadow">
            <span className="font-display text-2xl text-primary block">{completedDays}</span>
            <span className="font-sans-light text-[10px] tracking-widest uppercase text-muted-foreground">Done</span>
          </div>
          <div className="bg-card rounded-xl p-4 text-center journal-shadow">
            <span className="font-display text-2xl text-foreground block">
              {days.length ? Math.round((completedDays / days.length) * 100) : 0}%
            </span>
            <span className="font-sans-light text-[10px] tracking-widest uppercase text-muted-foreground">Progress</span>
          </div>
        </div>

        {/* Edit name */}
        <div className="bg-card rounded-2xl p-5 journal-shadow mb-6">
          <label className="font-sans-light text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
            Display Name
          </label>
          <div className="flex gap-2">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-muted/50 border-border flex-1"
            />
            <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
              {saving ? "..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Theme toggle */}
        <div className="bg-card rounded-2xl p-5 journal-shadow mb-6">
          <label className="font-sans-light text-xs tracking-widest uppercase text-muted-foreground mb-3 block">
            Appearance
          </label>
          <ThemeToggle inline />
        </div>

        {/* Sign out */}
        <Button
          onClick={signOut}
          variant="outline"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
