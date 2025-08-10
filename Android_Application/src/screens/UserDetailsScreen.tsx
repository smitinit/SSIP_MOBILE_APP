import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { ID, Query } from "react-native-appwrite";
import { Ionicons } from "@expo/vector-icons";
import { NButton } from "@/ui/button";
import { palette, spacing } from "@/design/tokens";

// ✅ Use your exact config import style
import {
  USERS_DETAILS_COLLECTION_ID,
  databases,
  DB_ID,
} from "../../appwriteConfig";

export default function UserDetailsScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(true);

  // ✅ Derived states for validation UI
  const isValidName = fullName.trim().length > 1;
  const isValidAge = /^\d+$/.test(age) && parseInt(age) > 0;

  const canContinue = useMemo(() => {
    return isValidName && isValidAge && gender !== null;
  }, [isValidName, isValidAge, gender]);

  // Prefill from Appwrite if data exists
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.id) return;
      try {
        const res = await databases.listDocuments(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          [Query.equal("userId", user.id), Query.limit(1)]
        );
        const doc = res.documents?.[0];
        if (doc && !cancelled) {
          const fname = String(doc.firstName ?? "").trim();
          const lname = String(doc.lastName ?? "").trim();
          const nm = [fname, lname].filter(Boolean).join(" ");
          if (nm) setFullName(nm);
          if (doc.age) setAge(String(doc.age));
          if (doc.gender === "male" || doc.gender === "female")
            setGender(doc.gender);
        }
      } catch (err) {
        console.error("Prefill error:", err);
      } finally {
        if (!cancelled) setPrefilling(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  function splitName(name: string) {
    const parts = name.trim().split(/\s+/);
    return {
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" "),
    };
  }

  const onSaveDetails = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { firstName, lastName } = splitName(fullName);

      const userData = {
        userId: user.id,
        firstName,
        lastName,
        age: parseInt(age) || 0,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        gender,
        onboardingComplete: true,
      };

      const res = await databases.listDocuments(
        DB_ID,
        USERS_DETAILS_COLLECTION_ID,
        [Query.equal("userId", user.id)]
      );

      if (res.documents.length > 0) {
        await databases.updateDocument(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          res.documents[0].$id,
          userData
        );
      } else {
        await databases.createDocument(
          DB_ID,
          USERS_DETAILS_COLLECTION_ID,
          ID.unique(),
          userData
        );
      }

      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Error saving user details:", error);
      Alert.alert("Save failed", error?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.helper}>
          Fill in your basic details to get started.
        </Text>

        <View style={{ width: 36 }} />
      </View>

      {/* Full name (underline) */}
      <Text style={styles.label}>Enter Full name</Text>
      <View style={styles.inputLineWrap}>
        <Ionicons
          name="person-outline"
          size={18}
          color="#111827"
          style={styles.leadingIcon}
        />
        <TextInput
          placeholder="John Appleseed"
          placeholderTextColor="#9CA3AF"
          value={fullName}
          onChangeText={setFullName}
          style={[styles.underlineInput, { paddingLeft: 36 }]}
        />
        {isValidName ? (
          <View style={styles.successBadge}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        ) : null}
      </View>

      {/* Gender chips */}
      <View style={styles.genderRow}>
        <GenderChip
          label="Male"
          active={gender === "male"}
          onPress={() => setGender("male")}
        />
        <GenderChip
          label="Female"
          active={gender === "female"}
          onPress={() => setGender("female")}
        />
      </View>

      {/* Age (underline) */}
      <Text style={[styles.label, { marginTop: spacing.lg }]}>Age</Text>
      <View style={styles.inputLineWrap}>
        <Ionicons
          name="calendar-outline"
          size={18}
          color="#111827"
          style={styles.leadingIcon}
        />
        <TextInput
          placeholder="Your age"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          style={[styles.underlineInput, { paddingLeft: 36 }]}
        />
        {isValidAge ? (
          <View style={styles.successBadge}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        ) : null}
      </View>

      {/* Continue */}
      <NButton
        title={loading ? "Saving..." : "Continue"}
        fullWidth
        onPress={onSaveDetails}
        loading={loading || prefilling}
        disabled={!canContinue || prefilling}
        style={styles.cta}
      />
    </View>
  );
}

function GenderChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[chipStyles.chip, active && chipStyles.chipActive]}
      android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
    >
      <Text style={[chipStyles.chipText, active && chipStyles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const GREEN = "#34C759";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
    padding: spacing.xl,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    textAlign: "center",
  },
  helper: {
    color: "#111827",
    fontSize: 16,
    marginBottom: spacing.md,
  },

  label: {
    color: "#6B7280",
    fontWeight: "700",
  },

  inputLineWrap: {
    position: "relative",
    marginTop: 4,
    minHeight: 44,
    justifyContent: "center",
    marginBottom: 6,
  },
  leadingIcon: { position: "absolute", left: 4, top: 12 },

  underlineInput: {
    height: 44,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
    color: "#111827",
    fontSize: 16,
    paddingRight: 44,
    backgroundColor: "transparent",
  },

  successBadge: {
    position: "absolute",
    right: 4,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  genderRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },

  cta: {
    marginTop: spacing.xl,
    borderRadius: 999,
    backgroundColor: GREEN,
    paddingVertical: 16,
  },
});

const chipStyles = StyleSheet.create({
  chip: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    borderColor: GREEN,
    backgroundColor: "#F0FFF5",
  },
  chipText: { color: "#111827", fontWeight: "700" },
  chipTextActive: { color: "#111827" },
});
