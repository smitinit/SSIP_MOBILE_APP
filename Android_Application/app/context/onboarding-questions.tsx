import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";

type Gender = "male" | "female" | null;
type Tier = "gold" | "platinum";
type Duration = 1 | 3 | 6;

export type WizardAnswers = {
  // Step 1
  waterLiters: string;
  // Step 2
  favoriteFood: string;
  // Step 3
  gender: Gender;
  weightKg: string;
  heightCm: string;
  // Step 4
  goals: string[];
  // Plan
  planTier: Tier;
  duration: Duration;
};

type WizardContextType = {
  step: number;
  setStep: (n: number) => void;
  answers: WizardAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<WizardAnswers>>;
  toggleGoal: (g: string) => void;
  setPlan: (tier: Tier) => void;
  setDuration: (d: Duration) => void;
  questionsAndAnswers: {
    id: string;
    question: string;
    answer: string | string[];
  }[];
};

const defaultAnswers: WizardAnswers = {
  waterLiters: "",
  favoriteFood: "",
  gender: null,
  weightKg: "",
  heightCm: "",
  goals: [],
  planTier: "gold",
  duration: 1,
};

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<WizardAnswers>(defaultAnswers);

  const toggleGoal = (g: string) =>
    setAnswers((s) => {
      const exists = s.goals.includes(g);
      return {
        ...s,
        goals: exists ? s.goals.filter((x) => x !== g) : [...s.goals, g],
      };
    });

  const setPlan = (tier: Tier) => setAnswers((s) => ({ ...s, planTier: tier }));
  const setDuration = (d: Duration) =>
    setAnswers((s) => ({ ...s, duration: d }));

  const questionsAndAnswers = useMemo(
    () => [
      {
        id: "q1",
        question: "How much water does your body need daily?",
        answer: answers.waterLiters,
      },
      {
        id: "q2",
        question:
          "How many calories does your favourite food have? What do you eat today?",
        answer: answers.favoriteFood,
      },
      {
        id: "q3",
        question: "Do you think you are overweight? Weight (kg), Height (cm)",
        answer: [
          // `Gender: ${answers.gender ?? ""}`,
          `Weight: ${answers.weightKg}`,
          `Height: ${answers.heightCm}`,
        ],
      },
      { id: "q4", question: "What is your Goal?", answer: answers.goals },
      {
        id: "plan",
        question: "Chosen Plan",
        answer: `${answers.planTier} (${answers.duration} month${
          answers.duration > 1 ? "s" : ""
        })`,
      },
    ],
    [answers]
  );

  const value: WizardContextType = {
    step,
    setStep,
    answers,
    setAnswers,
    toggleGoal,
    setPlan,
    setDuration,
    questionsAndAnswers,
  };

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
