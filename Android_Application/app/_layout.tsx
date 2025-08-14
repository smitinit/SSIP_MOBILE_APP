import { useFonts } from "expo-font";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useColorScheme } from "react-native";
import { palette } from "@/design/tokens";
import * as SecureStore from "expo-secure-store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const colorScheme = useColorScheme();
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
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SafeAreaView style={styles.container} edges={["top"]}>
            <Slot />
          </SafeAreaView>
        </ThemeProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.text, // match your theme
    paddingTop: 6, // extra breathing room on top
  },
});
