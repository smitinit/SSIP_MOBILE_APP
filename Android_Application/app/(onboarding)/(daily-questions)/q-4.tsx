import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "@/design/tokens";
import { StepHeader } from "@/components/StepHeader";
import { useWizard } from "../../../context/onboarding-questions";

const OPTIONS = [
  "Loose Weight",
  "Improve Eating Habits",
  "Individualized meal plans",
  "Improve Digestive Issues",
];

export default function Step4() {
  const router = useRouter();
  const { answers, toggleGoal } = useWizard();

  // Validate that user has selected at least one goal
  const validate = () => {
    if (answers.goals.length === 0) {
      Alert.alert(
        "Validation Error",
        "Please select at least one goal to continue."
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    router.push("/(onboarding)/(daily-questions)/choose-plan");
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <StepHeader
        icon={<Ionicons name="ribbon-outline" size={22} color="#92400E" />}
        barColor="#F59E0B"
        step={4}
        total={4}
        title="What is your Goal?"
      />

      <View style={{ gap: 12 }}>
        {OPTIONS.map((opt) => {
          const active = answers.goals.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => toggleGoal(opt)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text
                style={[styles.optionText, active && styles.optionTextActive]}
              >
                {opt}
              </Text>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={handleNext}
        style={[
          styles.startBtn,
          answers.goals.length === 0 && styles.startBtnDisabled,
        ]}
        disabled={answers.goals.length === 0}
      >
        <Text style={styles.startText}>Get Started</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    backgroundColor: "#FFFFFF",
    gap: spacing.lg,
    flexGrow: 1,
  },
  option: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionActive: {
    backgroundColor: "#E5EDFF",
    borderColor: "#C7D2FE",
  },
  optionText: {
    color: "#111827",
    fontSize: 14,
  },
  optionTextActive: {
    color: "#111827",
    fontWeight: "700",
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  radioActive: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  startBtn: {
    marginTop: "auto",
    marginBottom: spacing.xl,
    backgroundColor: "#22C55E",
    borderRadius: 999,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  startBtnDisabled: {
    backgroundColor: "#94D3A2",
  },
  startText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
