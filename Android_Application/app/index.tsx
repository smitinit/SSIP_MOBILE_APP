import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppIndex() {
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    async function checkFlow() {
      try {
        if (!isActive) return;

        // Get onboarding flag from storage
        const hasCompletedOnboarding = JSON.parse(
          (await AsyncStorage.getItem("hasCompletedOnboarding")) as string
        );

        if (!isActive) return;

        if (!hasCompletedOnboarding) {
          router.replace("/(intro)/splash");
        } else {
          // Everything is fine → go to Welcome screen
          router.replace("/welcome");
        }
      } catch (err) {
        console.error("Error during onboarding check:", err);
      }
    }

    checkFlow();
    return () => {
      isActive = false;
    };
  }, [router]);

  return null; // redirecting
}
