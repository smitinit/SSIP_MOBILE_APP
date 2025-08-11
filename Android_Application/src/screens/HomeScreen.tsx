import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { palette, spacing, typography } from "@/design/tokens";
import { NCard } from "@/ui/card";
import { NProgress } from "@/ui/progress";
import { Segmented } from "@/ui/segmented";
import { Tile } from "@/ui/tile";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  USERS_DETAILS_COLLECTION_ID,
  databases,
  DB_ID,
} from "../../appwriteConfig";
import { Query } from "react-native-appwrite";
import { router } from "expo-router";

export default function HomeScreen() {
  const { user } = useUser();
  const [userName, setUserName] = useState({
    age: "",
    fullName: "",
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
      {/* Greeting */}
      <Text style={styles.greet}>
        {`Hey, ${userName.fullName.split(" ")[0]} 👋`}
      </Text>
      <Pressable onPress={() => router.push("/(core)/(symptoscan)/SymptoScan")}>
        <Text style={styles.symptoscan}>{"SymptoScan"}</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/(core)/(caltrack)/Caltrack")}>
        <Text style={styles.symptoscan}>{"Caltrack"}</Text>
      </Pressable>
      <Text style={styles.headline}>{"Personalize your Consultation"}</Text>

      {/* Tabs selector */}
      <View style={{ marginTop: spacing.md }}>
        <Segmented segments={["Appointment", "Analytics"]} />
      </View>

      {/* Appointment card */}
      <NCard style={styles.appointment}>
        <View style={styles.row}>
          <Image
            source={require("../../assets/images/favicon.jpeg")}
            style={styles.patientAvatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>
              {user?.fullName ?? "Your Client"}
            </Text>
            <Text style={styles.patientMeta}>
              32 Years | Dietetics / Nutrition
            </Text>
          </View>
          <View style={styles.circleSolid}>
            <Ionicons name="videocam" size={16} color="#fff" />
          </View>
        </View>

        <View style={styles.timePill}>
          <Ionicons name="calendar" size={14} color="#fff" />
          <Text style={styles.timePillText}>
            Sun, Jan 19, 08:00am - 10:00am
          </Text>
        </View>
      </NCard>

      {/* Quick tiles */}
      <View style={styles.tiles}>
        <Tile icon="people" title="Patients" subtitle="16 New Patients" />
        <Tile icon="card" title="Billing" subtitle="3 Payment Done" />
      </View>
      <View style={styles.tiles}>
        <Tile icon="folder" title="Records" subtitle="Labs & Reports" />
        <Tile icon="notifications" title="Alerts" subtitle="2 Pending" />
      </View>

      {/* Progress widgets */}
      <View style={styles.grid2}>
        <NCard style={{ gap: spacing.sm }}>
          <Text style={styles.sectionTitle}>Today’s Completion</Text>
          <NProgress value={68} />
          <Text style={styles.caption}>68% completed</Text>
        </NCard>
        <NCard style={{ gap: spacing.sm }}>
          <Text style={styles.sectionTitle}>Active Plans</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="fitness" size={16} color={palette.primary} />
            <Text style={{ color: palette.text }}>3 nutrition plans</Text>
          </View>
        </NCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: spacing.xl, backgroundColor: palette.bg, gap: spacing.md },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  symptoscan: {
    marginTop: spacing.lg,
    color: palette.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  topTitle: { fontWeight: "700", fontSize: 18, color: palette.text },
  topActions: { flexDirection: "row", gap: 10, alignItems: "center" },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  greet: {
    marginTop: spacing.lg,
    color: palette.textMuted,
    fontSize: 16,
  },
  circleSolid: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.primary,
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  headline: { marginTop: 4, fontSize: 26, fontWeight: "800", color: "#2E1065" }, // deep purple headline
  appointment: {
    gap: spacing.md,
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  }, // indigo card
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  patientAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 2 },
  patientName: { color: "#fff", fontWeight: "800", fontSize: 16 },
  patientMeta: { color: "rgba(255,255,255,0.9)" },
  timePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  timePillText: { color: "#fff", fontWeight: "600" },
  tiles: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  sectionTitle: { ...typography.subtitle, color: palette.text },
  caption: { fontSize: 12, color: palette.textMuted },
  grid2: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
});
