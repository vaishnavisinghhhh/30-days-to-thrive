import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface DayData {
  id?: string; // journey_day id from DB
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
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [bucketList, setBucketListState] = useState<string[]>([]);
  const [days, setDays] = useState<DayData[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load existing journey from DB on auth
  useEffect(() => {
    if (!user) {
      setDays([]);
      setBucketListState([]);
      setJourneyId(null);
      setLoading(false);
      return;
    }

    const loadJourney = async () => {
      setLoading(true);
      try {
        // Get the user's latest journey
        const { data: journeys } = await supabase
          .from("journeys")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (journeys && journeys.length > 0) {
          const journey = journeys[0];
          setJourneyId(journey.id);
          setStartDate(new Date(journey.start_date));

          // Load journey days
          const { data: journeyDays } = await supabase
            .from("journey_days")
            .select("*")
            .eq("journey_id", journey.id)
            .order("day_number", { ascending: true });

          if (journeyDays && journeyDays.length > 0) {
            setBucketListState(journeyDays.map(d => d.goal));

            // Load photos for all days
            const dayIds = journeyDays.map(d => d.id);
            const { data: photos } = await supabase
              .from("day_photos")
              .select("*")
              .in("journey_day_id", dayIds);

            const photosByDay: Record<string, string[]> = {};
            photos?.forEach(p => {
              if (!photosByDay[p.journey_day_id]) photosByDay[p.journey_day_id] = [];
              photosByDay[p.journey_day_id].push(p.photo_url);
            });

            setDays(journeyDays.map(d => ({
              id: d.id,
              goal: d.goal,
              completed: d.completed,
              photos: photosByDay[d.id] || [],
              journalEntry: d.journal_entry || "",
            })));
          }
        }
      } catch (e) {
        console.error("Failed to load journey:", e);
      } finally {
        setLoading(false);
      }
    };

    loadJourney();
  }, [user]);

  const setBucketList = useCallback(async (list: string[]) => {
    if (!user) return;
    setBucketListState(list);
    const now = new Date();
    setStartDate(now);

    try {
      // Create journey
      const { data: journey, error: jErr } = await supabase
        .from("journeys")
        .insert({ user_id: user.id, start_date: now.toISOString() })
        .select()
        .single();

      if (jErr || !journey) throw jErr;
      setJourneyId(journey.id);

      // Create journey days
      const dayRows = list.map((goal, i) => ({
        journey_id: journey.id,
        day_number: i + 1,
        goal,
      }));

      const { data: insertedDays, error: dErr } = await supabase
        .from("journey_days")
        .insert(dayRows)
        .select();

      if (dErr) throw dErr;

      setDays(
        (insertedDays || [])
          .sort((a, b) => a.day_number - b.day_number)
          .map(d => ({
            id: d.id,
            goal: d.goal,
            completed: false,
            photos: [],
            journalEntry: "",
          }))
      );
    } catch (e) {
      console.error("Failed to create journey:", e);
      // Fallback to local state
      setDays(list.map(goal => ({ goal, completed: false, photos: [], journalEntry: "" })));
    }
  }, [user]);

  const saveDayJournal = useCallback(async (dayIndex: number, entry: string) => {
    setDays(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], journalEntry: entry };
      return updated;
    });

    const dayId = days[dayIndex]?.id;
    if (dayId) {
      await supabase
        .from("journey_days")
        .update({ journal_entry: entry, updated_at: new Date().toISOString() })
        .eq("id", dayId);
    }
  }, [days]);

  const saveDayCompletion = useCallback(async (dayIndex: number, completed: boolean) => {
    setDays(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], completed };
      return updated;
    });

    const dayId = days[dayIndex]?.id;
    if (dayId) {
      await supabase
        .from("journey_days")
        .update({ completed, updated_at: new Date().toISOString() })
        .eq("id", dayId);
    }
  }, [days]);

  const uploadPhoto = useCallback(async (dayIndex: number, file: File): Promise<string | null> => {
    const dayId = days[dayIndex]?.id;
    if (!dayId || !user) return null;

    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/${dayId}/${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("journey-photos")
      .upload(filePath, file);

    if (uploadErr) {
      console.error("Upload error:", uploadErr);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("journey-photos")
      .getPublicUrl(filePath);

    const photoUrl = urlData.publicUrl;

    // Save to day_photos table
    await supabase.from("day_photos").insert({
      journey_day_id: dayId,
      photo_url: photoUrl,
    });

    setDays(prev => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        photos: [...updated[dayIndex].photos, photoUrl],
      };
      return updated;
    });

    return photoUrl;
  }, [days, user]);

  const deletePhoto = useCallback(async (dayIndex: number, photoUrl: string) => {
    setDays(prev => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        photos: updated[dayIndex].photos.filter(p => p !== photoUrl),
      };
      return updated;
    });

    await supabase.from("day_photos").delete().eq("photo_url", photoUrl);
  }, []);

  return (
    <JourneyContext.Provider
      value={{
        bucketList, setBucketList, days, setDays, currentDay, setCurrentDay,
        startDate, setStartDate, journeyId, loading,
        saveDayJournal, saveDayCompletion, uploadPhoto, deletePhoto,
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
