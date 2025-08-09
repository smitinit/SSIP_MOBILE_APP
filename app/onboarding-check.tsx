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

export default function OnboardingCheck() {
  const router = useRouter();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    async function run() {
      if (!isLoaded) return;
      if (!user) {
        router.replace("/(auth)/sign-in");
        return;
      }

      try {
        // Try fetching existing doc
        const res = await databases.listDocuments(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          [Query.equal("userId", user.id)]
        );

        let userDoc = res.documents[0];

        // Create doc if doesn't exist
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
            }
          );
        }

        if (userDoc.onboardingComplete) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(onboarding)/user-details");
        }
      } catch (err) {
        console.error("Error checking onboarding:", err);
      }
    }

    run();
  }, [isLoaded, user]);

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
