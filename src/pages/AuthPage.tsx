import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AuthPage = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email");
      return;
    }
    signIn(email.trim(), displayName.trim() || undefined);
    toast.success("Welcome! 🎉");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-medium text-foreground mb-2">
            30 Days
          </h1>
          <p className="font-body text-sm text-muted-foreground italic">
            Your journey awaits
          </p>
          <p className="font-sans-light text-xs text-primary mt-2 tracking-widest uppercase">
            Demo Mode — No account needed
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 journal-shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-sans-light text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                Your Name
              </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Explorer"
                className="bg-muted/50 border-border"
              />
            </div>
            <div>
              <label className="font-sans-light text-xs tracking-widest uppercase text-muted-foreground mb-1 block">
                Email (any email works)
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                required
                className="bg-muted/50 border-border"
              />
            </div>
            <Button
              type="submit"
              className="w-full font-sans-light tracking-widest uppercase py-6 bg-primary text-primary-foreground"
            >
              Start My Journey
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
