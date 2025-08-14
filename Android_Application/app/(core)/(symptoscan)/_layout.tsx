import React from "react";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SymptomProvider } from "../../../context/symptom-context";

export default function CoreLayout() {
  return (
    <SafeAreaProvider>
      <SymptomProvider>
        <Slot />
      </SymptomProvider>
    </SafeAreaProvider>
  );
}
