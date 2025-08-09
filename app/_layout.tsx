import { useFonts } from "expo-font";
import "react-native-reanimated";

import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  );
}
