import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { spacing } from "@/design/tokens";
import { useWizard } from "../../../context/onboarding-questions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChoosePlan() {
  const router = useRouter();
  const { answers, setPlan, setDuration, questionsAndAnswers } = useWizard();

  const onFinish = async () => {
    // Hand off the answers array here
    console.log("questionsAndAnswers:", questionsAndAnswers);
    // Alert.alert(
    //   "Collected Answers",
    //   JSON.stringify(questionsAndAnswers, null, 2)
    // );
    await AsyncStorage.setItem(
      "dailyQuestionsOnboardingTime",
      new Date().toISOString()
    );

    router.replace("/(tabs)/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      {/* Tiers */}
      <Pressable
        onPress={() => setPlan("gold")}
        style={[
          styles.tier,
          answers.planTier === "gold" && styles.tierActiveGold,
        ]}
      >
        <View>
          <Text style={styles.tierTitle}>Gold Package</Text>
          <Text style={styles.tierPrice}>15,000 UAD</Text>
        </View>
        <Radio selected={answers.planTier === "gold"} />
      </Pressable>

      <Pressable
        onPress={() => setPlan("platinum")}
        style={[
          styles.tier,
          answers.planTier === "platinum" && styles.tierActivePlat,
        ]}
      >
        <View>
          <Text style={styles.tierTitle}>Platinum Package</Text>
          <Text style={styles.tierPrice}>10,000 UAD</Text>
        </View>
        <Radio selected={answers.planTier === "platinum"} />
      </Pressable>

      {/* Duration */}
      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
        Duration
      </Text>
      <Text style={styles.sectionSub}>Select Plan Durations</Text>
      <View style={styles.row}>
        <Chip
          label="1 Month"
          active={answers.duration === 1}
          onPress={() => setDuration(1)}
        />
        <Chip
          label="3 Month"
          active={answers.duration === 3}
          onPress={() => setDuration(3)}
        />
        <Chip
          label="6 Month"
          active={answers.duration === 6}
          onPress={() => setDuration(6)}
        />
      </View>

      {/* Description */}
      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
        Plan Description
      </Text>
      <Text style={styles.desc}>
        Discover everything you need to know to transform your life once and for
        all: learn the truth about calorie intake and the secret to consuming
        the desired...
      </Text>

      {/* Answers preview box */}
      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>Answers Preview</Text>
        {questionsAndAnswers.map((qa) => (
          <View key={qa.id} style={{ marginBottom: 6 }}>
            <Text style={styles.qaQ}>{qa.question}</Text>
            {Array.isArray(qa.answer) ? (
              <Text style={styles.qaA}>{qa.answer.join(" | ")}</Text>
            ) : (
              <Text style={styles.qaA}>{qa.answer}</Text>
            )}
          </View>
        ))}
      </View>

      <Pressable onPress={onFinish} style={styles.buyBtn}>
        <Text style={styles.buyText}>15,000 UAD Buy Now</Text>
      </Pressable>
    </ScrollView>
  );
}

function Chip({
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
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radio, selected && styles.radioSelected]}>
      {selected ? <View style={styles.dot} /> : null}
    </View>
  );
}

const GREEN = "#22C55E";

const styles = StyleSheet.create({
  root: { padding: spacing.xl, backgroundColor: "#fff", gap: spacing.md },
  header: { fontSize: 18, fontWeight: "800", color: "#111827" },
  sub: { color: "#6B7280" },

  tier: {
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tierActiveGold: { backgroundColor: "#FEF3C7", borderColor: "#FDE68A" },
  tierActivePlat: { backgroundColor: "#E0E7FF", borderColor: "#C7D2FE" },
  tierTitle: { color: "#111827", fontWeight: "700" },
  tierPrice: { color: "#0F172A" },

  sectionTitle: { fontWeight: "800", color: "#111827" },
  sectionSub: { color: "#6B7280", marginBottom: 8 },
  row: { flexDirection: "row", gap: 8 },

  chip: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { borderColor: GREEN, backgroundColor: "#F0FFF5" },
  chipText: { color: "#111827", fontWeight: "700" },
  chipTextActive: { color: "#111827" },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: GREEN },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: GREEN },

  desc: { color: "#475569" },

  previewBox: {
    marginTop: spacing.lg,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: spacing.md,
  },
  previewTitle: { fontWeight: "800", color: "#111827", marginBottom: 6 },
  qaQ: { color: "#0F172A", fontWeight: "700" },
  qaA: { color: "#475569" },

  buyBtn: {
    marginTop: spacing.md,
    backgroundColor: GREEN,
    borderRadius: 999,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  buyText: { color: "#fff", fontWeight: "800" },
});
