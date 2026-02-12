import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DayData {
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
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider = ({ children }: { children: ReactNode }) => {
  const [bucketList, setBucketListState] = useState<string[]>([]);
  const [days, setDays] = useState<DayData[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const setBucketList = (list: string[]) => {
    setBucketListState(list);
    setDays(
      list.map((goal) => ({
        goal,
        completed: false,
        photos: [],
        journalEntry: "",
      }))
    );
    setStartDate(new Date());
  };

  return (
    <JourneyContext.Provider
      value={{ bucketList, setBucketList, days, setDays, currentDay, setCurrentDay, startDate, setStartDate }}
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
