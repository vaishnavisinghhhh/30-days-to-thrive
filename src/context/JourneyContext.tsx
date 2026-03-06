import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export interface DayData {
  id?: string;
  goal: string;
  completed: boolean;
  photos: string[];
  journalEntry: string;
}

interface JourneyContextType {
  bucketList: string[];
  setBucketList: (list: string[]) => void;
  days: DayData[];
  setDays: React.Dispatch<React.SetStateAction<DayData[]>>;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  journeyId: string | null;
  loading: boolean;
  saveDayJournal: (dayIndex: number, entry: string) => Promise<void>;
  saveDayCompletion: (dayIndex: number, completed: boolean) => Promise<void>;
  uploadPhoto: (dayIndex: number, file: File) => Promise<string | null>;
  deletePhoto: (dayIndex: number, photoUrl: string) => Promise<void>;
  addMoreDays: (newGoals: string[]) => Promise<void>;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

const JOURNEY_KEY = "demo-journey";

const saveToStorage = (data: any) => {
  localStorage.setItem(JOURNEY_KEY, JSON.stringify(data));
};

const loadFromStorage = () => {
  const saved = localStorage.getItem(JOURNEY_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const JourneyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [bucketList, setBucketListState] = useState<string[]>([]);
  const [days, setDays] = useState<DayData[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    if (!user) {
      setDays([]);
      setBucketListState([]);
      setJourneyId(null);
      setLoading(false);
      return;
    }

    const saved = loadFromStorage();
    if (saved) {
      setJourneyId(saved.journeyId || "demo-journey");
      setStartDate(saved.startDate ? new Date(saved.startDate) : null);
      setBucketListState(saved.bucketList || []);
      setDays(saved.days || []);
    }
    setLoading(false);
  }, [user]);

  // Persist to localStorage on changes
  useEffect(() => {
    if (!user || loading) return;
    if (days.length > 0 || bucketList.length > 0) {
      saveToStorage({ journeyId, startDate, bucketList, days });
    }
  }, [days, bucketList, journeyId, startDate, user, loading]);

  const setBucketList = useCallback((list: string[]) => {
    if (!user) return;
    const now = new Date();
    setStartDate(now);
    const id = "journey-" + Date.now();
    setJourneyId(id);
    setBucketListState(list);
    setDays(list.map((goal, i) => ({
      id: `day-${i}-${Date.now()}`,
      goal,
      completed: false,
      photos: [],
      journalEntry: "",
    })));
  }, [user]);

  const saveDayJournal = useCallback(async (dayIndex: number, entry: string) => {
    setDays(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], journalEntry: entry };
      return updated;
    });
  }, []);

  const saveDayCompletion = useCallback(async (dayIndex: number, completed: boolean) => {
    setDays(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], completed };
      return updated;
    });
  }, []);

  const uploadPhoto = useCallback(async (dayIndex: number, file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setDays(prev => {
          const updated = [...prev];
          updated[dayIndex] = {
            ...updated[dayIndex],
            photos: [...updated[dayIndex].photos, dataUrl],
          };
          return updated;
        });
        resolve(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const deletePhoto = useCallback(async (dayIndex: number, photoUrl: string) => {
    setDays(prev => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        photos: updated[dayIndex].photos.filter(p => p !== photoUrl),
      };
      return updated;
    });
  }, []);

  const addMoreDays = useCallback(async (newGoals: string[]) => {
    if (!user || newGoals.length === 0) return;
    const currentCount = days.length;
    if (currentCount >= 30) return;
    const goalsToAdd = newGoals.slice(0, 30 - currentCount);

    const newDayData = goalsToAdd.map((goal, i) => ({
      id: `day-${currentCount + i}-${Date.now()}`,
      goal,
      completed: false,
      photos: [],
      journalEntry: "",
    }));

    setDays(prev => [...prev, ...newDayData]);
    setBucketListState(prev => [...prev, ...goalsToAdd]);
  }, [user, days.length]);

  return (
    <JourneyContext.Provider
      value={{
        bucketList, setBucketList, days, setDays, currentDay, setCurrentDay,
        startDate, setStartDate, journeyId, loading,
        saveDayJournal, saveDayCompletion, uploadPhoto, deletePhoto, addMoreDays,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (!context) throw new Error("useJourney must be used within JourneyProvider");
  return context;
};
