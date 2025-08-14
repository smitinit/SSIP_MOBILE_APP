import { Stack } from "expo-router";
import { WizardProvider } from "../../../context/onboarding-questions";

export default function FlowLayout() {
  return (
    <WizardProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="q-1" />
        <Stack.Screen name="q-2" />
        <Stack.Screen name="q-3" />
        <Stack.Screen name="q-4" />
        <Stack.Screen name="choose-plan" />
      </Stack>
    </WizardProvider>
  );
}
