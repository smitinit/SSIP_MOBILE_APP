import { useFonts } from "expo-font";
import "react-native-reanimated";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { palette } from "@/design/tokens";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider tokenCache={tokenCache}>
        <SafeAreaView style={styles.container} edges={["top"]}>
          <Slot />
        </SafeAreaView>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.danger, // match your theme
    paddingTop: 8, // extra breathing room on top
  },
});
