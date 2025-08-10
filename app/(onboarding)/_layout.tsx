import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

// Onboarding stack: requires authentication to proceed.
export default function OnboardingLayout() {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="user-details" />
    </Stack>
  );
}
