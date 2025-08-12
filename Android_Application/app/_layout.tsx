import { useFonts } from "expo-font";
import "react-native-reanimated";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { palette } from "@/design/tokens";
import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  const tokenCache = {
    async getToken(key: string) {
      try {
        return SecureStore.getItemAsync(key);
      } catch (err) {
        console.log(err);
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        console.log(err);
        return;
      }
    },
  };

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
    backgroundColor: palette.card, // match your theme
    paddingTop: 6, // extra breathing room on top
  },
});
