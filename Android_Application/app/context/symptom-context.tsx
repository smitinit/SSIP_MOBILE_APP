"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BODY_AREAS,
  type BodyArea,
  type Symptom,
} from "../(core)/(symptoscan)/steps/data/body-area";
import { MEDICAL_CONDITIONS } from "../(core)/(symptoscan)/steps/data/options";

// Demographics and Lifestyle shapes
export type Demographics = {
  age: string;
  gender: "Male" | "Female" | "Other" | null;
  heightCm: string;
  weightKg: string;
  conditions: string[]; // values from MEDICAL_CONDITIONS
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
};

export type Lifestyle = {
  exerciseFrequency: string | null;
  sleepQuality: string | null;
  stress: number; // 0-100
  diet: string | null;
  recentChanges: string;
};

type SymptomContextValue = {
  // Static catalog
  bodyAreas: BodyArea[];
  medicalConditions: string[];

  // Step 1
  currentAreaId: string | null;
  setCurrentArea: (id: string) => void;
  selectedSymptoms: Symptom[];
  maxSelected: number;
  toggleSymptom: (symptom: Symptom) => void;
  addCustomSymptom: (label: string) => void;
  removeSymptom: (id: string) => void;
  clearSymptoms: () => void;

  // Step 2
  demographics: Demographics;
  updateDemographics: <K extends keyof Demographics>(
    key: K,
    value: Demographics[K]
  ) => void;
  toggleCondition: (condition: string) => void;

  // Step 3
  lifestyle: Lifestyle;
  updateLifestyle: <K extends keyof Lifestyle>(
    key: K,
    value: Lifestyle[K]
  ) => void;
};

const SymptomContext = createContext<SymptomContextValue | null>(null);

const DEFAULT_DEMOGRAPHICS: Demographics = {
  age: "",
  gender: null,
  heightCm: "",
  weightKg: "",
  conditions: [],
  medicalHistory: "",
  currentMedications: "",
  allergies: "",
};

const DEFAULT_LIFESTYLE: Lifestyle = {
  exerciseFrequency: null,
  sleepQuality: null,
  stress: 50,
  diet: null,
  recentChanges: "",
};

export function SymptomProvider({ children }: { children: ReactNode }) {
  // Step 1 state
  const [currentAreaId, setCurrentAreaId] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const maxSelected = 7;

  // Step 2 state
  const [demographics, setDemographics] =
    useState<Demographics>(DEFAULT_DEMOGRAPHICS);

  // Step 3 state
  const [lifestyle, setLifestyle] = useState<Lifestyle>(DEFAULT_LIFESTYLE);

  // Step 1 actions
  const setCurrentArea = (id: string) => setCurrentAreaId(id);

  const toggleSymptom = (symptom: Symptom) => {
    setSelectedSymptoms((prev) => {
      const exists = prev.some((s) => s.id === symptom.id);
      if (exists) return prev.filter((s) => s.id !== symptom.id);
      if (prev.length >= maxSelected) return prev;
      return [...prev, symptom];
    });
  };

  const addCustomSymptom = (label: string) => {
    const cleaned = label.trim();
    if (!cleaned) return;
    setSelectedSymptoms((prev) => {
      if (prev.length >= maxSelected) return prev;
      const id = `custom_${cleaned
        .toLowerCase()
        .replace(/\s+/g, "_")}_${Date.now()}`;
      return [...prev, { id, label: cleaned, isCustom: true }];
    });
  };

  const removeSymptom = (id: string) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s.id !== id));
  };

  const clearSymptoms = () => setSelectedSymptoms([]);

  // Step 2 actions
  const updateDemographics = <K extends keyof Demographics>(
    key: K,
    value: Demographics[K]
  ) => {
    setDemographics((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCondition = (condition: string) => {
    setDemographics((prev) => {
      const exists = prev.conditions.includes(condition);
      const conditions = exists
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition];
      return { ...prev, conditions };
    });
  };

  // Step 3 actions
  const updateLifestyle = <K extends keyof Lifestyle>(
    key: K,
    value: Lifestyle[K]
  ) => {
    setLifestyle((prev) => ({ ...prev, [key]: value }));
  };

  const value: SymptomContextValue = useMemo(
    () => ({
      bodyAreas: BODY_AREAS,
      medicalConditions: MEDICAL_CONDITIONS,

      currentAreaId,
      setCurrentArea,
      selectedSymptoms,
      maxSelected,
      toggleSymptom,
      addCustomSymptom,
      removeSymptom,
      clearSymptoms,

      demographics,
      updateDemographics,
      toggleCondition,

      lifestyle,
      updateLifestyle,
    }),
    [currentAreaId, selectedSymptoms, demographics, lifestyle]
  );

  return (
    <SymptomContext.Provider value={value}>{children}</SymptomContext.Provider>
  );
}

export function useSymptoms() {
  const ctx = useContext(SymptomContext);
  if (!ctx) throw new Error("useSymptoms must be used within SymptomProvider");
  return ctx;
}
