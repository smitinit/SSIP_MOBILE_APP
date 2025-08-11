import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WelcomeScreen from "@/screens/WelcomeScreen";
import { useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
// Redirect the app entry to the new Splash in (intro)
export default function AppIndex() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { signOut } = useAuth();
  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem("onboardingComplete");
      if (value === "true") {
        setHasOnboarded(true);
      }
      setLoading(false);
    })();
  }, [router]);
  if (loading) return null;

  if (hasOnboarded) {
    return <WelcomeScreen />;
  } else {
    return router.replace("/(intro)/onb-1");
  }
}
