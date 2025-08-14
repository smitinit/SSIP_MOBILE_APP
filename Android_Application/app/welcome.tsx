import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { palette, spacing } from "@/design/tokens";
import { NButton } from "@/ui/button";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  USERS_DETAILS_COLLECTION_ID,
  databases,
  DB_ID,
} from "../appwriteConfig";
import { ID, Query } from "react-native-appwrite";

export default function WelcomeScreen() {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function runCheck() {
      // mark onboarding completed for the user
      AsyncStorage.setItem("hasCompletedOnboarding", "true");

      if (!authLoaded || !userLoaded) return; // Wait for Clerk
      if (!isSignedIn || !user) return setLoading(false); // Not signed in → just show welcome

      try {
        // Get or create user doc in Appwrite
        const res = await databases.listDocuments(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          [Query.equal("userId", user.id)]
        );

        let userDoc = res.documents[0];
        if (!userDoc) {
          userDoc = await databases.createDocument(
            DB_ID,
            USERS_DETAILS_COLLECTION_ID,
            ID.unique(),
            {
              userId: user.id,
              email: user.primaryEmailAddress?.emailAddress || "",
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              age: 0,
              onboardingComplete: false,
              gender: null,
            }
          );
        }

        if (!isActive) return;

        // Routing logic
        if (!userDoc.onboardingComplete) {
          router.replace("/(onboarding)/user-details");
          return;
        }

        const storedTime = await AsyncStorage.getItem(
          "dailyQuestionsOnboardingTime"
        );
        const needsDailyQuestions =
          !storedTime ||
          isNaN(new Date(storedTime).getTime()) ||
          (Date.now() - new Date(storedTime).getTime()) / (1000 * 60 * 60) > 24;

        if (needsDailyQuestions) {
          router.replace("/(onboarding)/(daily-questions)/q-1");
        } else {
          router.replace("/home");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    runCheck();

    return () => {
      isActive = false;
    };
  }, [authLoaded, userLoaded, isSignedIn, user, router]);

  if (loading || !authLoaded || !userLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  // Show Welcome UI only if not signed in
  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.brand}>
            Nutri<Text style={styles.brandAccent}>zy</Text>
          </Text>
          <Image
            source={require("../assets/images/download.png")}
            resizeMode="contain"
            style={styles.illustration}
          />
        </View>
        <View style={styles.sheet}>
          <Image
            source={require("../assets/images/nutrizy-logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome to Nutrizy</Text>
          <Text style={styles.subtitle}>
            The best App for doctor&apos;s to{"\n"}manage their practice.
          </Text>
          <View style={styles.divider} />
          <NButton
            title="Sign In"
            fullWidth
            style={{ backgroundColor: "#4F6EF7", borderRadius: 999 }}
            onPress={() => router.push("/(auth)/sign-in")}
          />
          <NButton
            title="Register with Us"
            fullWidth
            variant="secondary"
            style={{ borderRadius: 999 }}
            onPress={() => router.push("/(auth)/sign-up")}
          />
        </View>
      </View>
    );
  }

  return null; // If signed in, routing will already happen
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F8FF",
  },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: spacing.xl,
  },
  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: spacing.lg,
  },
  brandAccent: { color: "#34C759" },
  illustration: {
    width: "88%",
    height: 220,
  },
  sheet: {
    backgroundColor: "#fff",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 8,
    gap: spacing.sm,
  },
  logo: { width: 36, height: 36, borderRadius: 8, marginBottom: spacing.sm },
  title: { fontSize: 20, fontWeight: "800", color: palette.text },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.textMuted,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginBottom: spacing.md },
});
