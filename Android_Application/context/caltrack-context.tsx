import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CaltrackContextValue = {
  userInput: string;
  setUserInput: (input: string) => void;
  photo: any;
  setPhoto: (photo: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  responsePoints: string[];
  setResponsePoints: (points: string[]) => void;
};

const CaltrackContext = createContext<CaltrackContextValue | null>(null);

export function CaltrackProvider({ children }: { children: ReactNode }) {
  const [userInput, setUserInput] = useState("");
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [responsePoints, setResponsePoints] = useState<string[]>([]);

  const value: CaltrackContextValue = useMemo(
    () => ({
      userInput,
      setUserInput,
      photo,
      setPhoto,
      loading,
      setLoading,
      responsePoints,
      setResponsePoints,
    }),
    [userInput, photo, loading, responsePoints]
  );

  return (
    <CaltrackContext.Provider value={value}>
      {children}
    </CaltrackContext.Provider>
  );
}

export function useCaltrack() {
  const ctx = useContext(CaltrackContext);
  if (!ctx) throw new Error("useCaltrack must be used within CaltrackProvider");
  return ctx;
}
