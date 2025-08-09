import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import {
  USERS_DETAILS_COLLECTION_ID,
  databases,
  DB_ID,
} from "../../appwriteConfig"; // your Appwrite client config
import { ID, Query } from "react-native-appwrite";
import { NHeader } from "@/ui/header";
import { NInput } from "@/ui/input";
import { NButton } from "@/ui/button";
import { NCard } from "@/ui/card";
import { palette, spacing } from "@/design/tokens";

export default function UserDetailsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  const onSaveDetails = async () => {
    if (!user) return;
    try {
      setLoading(true);

      // Find the user's document in Appwrite
      const res = await databases.listDocuments(
        DB_ID,
        USERS_DETAILS_COLLECTION_ID,
        [Query.equal("userId", user.id)]
      );

      if (res.documents.length > 0) {
        // Update existing document
        await databases.updateDocument(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          res.documents[0].$id,
          {
            firstName,
            lastName,
            age: parseInt(age) || 0,
            email: user.primaryEmailAddress?.emailAddress,
            onboardingComplete: true,
          }
        );
      } else {
        // Create a new one if it somehow doesn’t exist
        await databases.createDocument(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          ID.unique(),
          {
            userId: user.id,
            firstName,
            lastName,
            age: parseInt(age) || 0,
            email: user.primaryEmailAddress?.emailAddress,
            onboardingComplete: true,
          }
        );
      }

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving user details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <NHeader
        title="Tell us about you"
        subtitle="We’ll personalize your assistant"
      />
      <NCard style={{ gap: spacing.md }}>
        <NInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <NInput label="Last Name" value={lastName} onChangeText={setLastName} />
        <NInput
          label="Age"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
        />
        <NButton
          title="Continue"
          fullWidth
          onPress={onSaveDetails}
          loading={loading}
        />
      </NCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg, padding: spacing.xl },
});
