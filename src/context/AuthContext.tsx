import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

interface DemoUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: DemoUser | null;
  session: any;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, displayName?: string) => void;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "demo-auth";
const PROFILE_KEY = "demo-profile";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const signIn = useCallback((email: string, displayName?: string) => {
    const demoUser: DemoUser = { id: "demo-user-" + Date.now(), email };
    const demoProfile: Profile = {
      id: "profile-" + Date.now(),
      user_id: demoUser.id,
      username: null,
      display_name: displayName || email,
      avatar_url: null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    localStorage.setItem(PROFILE_KEY, JSON.stringify(demoProfile));
    setUser(demoUser);
    setProfile(demoProfile);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem("demo-journey");
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, session: user ? {} : null, profile, loading: false, signIn, signOut, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
