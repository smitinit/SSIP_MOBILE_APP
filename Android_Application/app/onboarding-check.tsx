import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import {
  USERS_DETAILS_COLLECTION_ID,
  databases,
  DB_ID,
} from "../appwriteConfig";
import { ID, Query } from "react-native-appwrite";
import { palette } from "@/design/tokens";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnboardingCheck() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    let isActive = true; // Prevent running after unmount

    async function run() {
      if (!isLoaded) return;
      if (!user) {
        router.replace("/(auth)/sign-in");
        return;
      }

      try {
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

        if (!isActive) return; // stop if unmounted

        if (!userDoc.onboardingComplete) {
          router.replace("/(onboarding)/user-details");
          return;
        }

        const storedTime = await AsyncStorage.getItem(
          "dailyQuestionsOnboardingTime"
        );

        if (storedTime) {
          const storedDate = new Date(storedTime);
          if (isNaN(storedDate.getTime())) {
            // If invalid date, treat as needing daily questions
            router.replace("/(onboarding)/(daily-questions)/q-1");
            return;
          }
          const hoursDiff =
            (Date.now() - storedDate.getTime()) / (1000 * 60 * 60);

          if (hoursDiff > 24) {
            console.log("daily question => didnot hit");
            router.replace("/(onboarding)/(daily-questions)/q-1");
          } else {
            console.log("daily question => hit");
            router.replace("/(tabs)/home");
          }
        } else {
          console.log("daily question => time doesnot exist Error case");
          router.replace("/(onboarding)/(daily-questions)/q-1");
        }
      } catch (err) {
        console.error("Error checking onboarding:", err);
      }
    }

    run();

    return () => {
      isActive = false; // cleanup on unmount
    };
  }, [isLoaded, user, router]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator color={palette.primary} />
    </View>
  );
}
