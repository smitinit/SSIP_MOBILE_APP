import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { NHeader } from "@/ui/header";
import { NCard } from "@/ui/card";
import { NButton } from "@/ui/button";
import { palette, spacing, typography } from "@/design/tokens";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  USERS_DETAILS_COLLECTION_ID,
  databases,
  DB_ID,
} from "../../appwriteConfig";
import { Query } from "react-native-appwrite";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const { toggleColorScheme, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [userName, setUserName] = useState({
    age: "",
    fullName: "",
    gender: "",
  });
  useEffect(() => {
    async function run() {
      try {
        // Try fetching existing doc
        const res = await databases.listDocuments(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          [Query.equal("userId", user!.id)]
        );

        let userDoc = res.documents[0];
        if (userDoc) {
          const fullName = userDoc.firstName + " " + userDoc.lastName;
          setUserName({
            age: userDoc.age,
            fullName,
            gender: userDoc.gender,
          });
        }
      } catch (err) {
        console.error("Error checking onboarding:", err);
      }
    }

    run();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <NHeader
        title="Settings"
        subtitle="Control preferences for your assistant"
      />

      <NCard style={styles.card}>
        <Text style={styles.label}>Account</Text>
        <Row label="Name" value={user?.fullName ?? userName.fullName ?? "—"} />
        <Row
          label="Email"
          value={user?.primaryEmailAddress?.emailAddress ?? "—"}
        />
        <Row label="Age" value={userName.age ?? "—"} />
        <Row label="Gender" value={userName.gender ?? "—"} />
      </NCard>

      <NCard style={styles.card}>
        <Text style={styles.label}>Notifications</Text>
        <ToggleRow
          label="Push notifications"
          value={true}
          onChange={() => {}}
        />
        <ToggleRow label="Email updates" value={true} onChange={() => {}} />
      </NCard>

      <NCard style={styles.card}>
        <Text style={styles.label}>Privacy</Text>
        <ToggleRow
          label="Share anonymous analytics"
          value={true}
          onChange={() => {}}
        />
      </NCard>

      <NCard style={styles.card}>
        <Text style={styles.label}>Appearance</Text>
        <ToggleRow
          label="Dark mode"
          value={isDark}
          onChange={toggleColorScheme}
        />
      </NCard>

      <NCard style={styles.card}>
        <Text style={styles.label}>Danger zone</Text>
        <NButton
          title="Log out"
          variant="danger"
          fullWidth
          onPress={async () => {
            try {
              await signOut();
              router.replace("/"); // back to Welcome screen (no tabs)
            } catch (e) {
              console.log(e);
              Alert.alert("Sign out failed", "Please try again.");
            }
          }}
        />
        <NButton
          title="Clear cache"
          variant="danger"
          fullWidth
          onPress={async () => {
            try {
              await AsyncStorage.clear();
              ToastAndroid.show("Cache cleared", ToastAndroid.SHORT);
            } catch (e) {
              console.log(e);
              Alert.alert("Cannot clear cache", "Please try again.");
            }
          }}
        />
      </NCard>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: spacing.xl,
    backgroundColor: palette.bg,
    gap: spacing.md,
    alignItems: "stretch",
  },
  card: { gap: spacing.sm, alignSelf: "stretch" },
  label: { ...typography.subtitle, color: palette.text },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },
  label: { color: palette.text, fontSize: 16 },
  value: { color: "#475569", fontSize: 16 },
});
