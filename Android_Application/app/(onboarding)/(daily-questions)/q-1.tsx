import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWizard } from "../../../context/onboarding-questions";
import { StepHeader } from "@/components/StepHeader";
import { NButton } from "@/ui/button";
import { palette, spacing } from "@/design/tokens";

export default function Step1() {
  const router = useRouter();
  const { answers, setAnswers, setStep } = useWizard();
  const [value, setValue] = useState(answers.waterLiters || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!value.trim()) {
      setError("Please enter your daily water intake.");
      return;
    }
    setError("");
    setAnswers((s) => ({ ...s, waterLiters: value.trim() }));
    setStep(2);
    router.push("/(onboarding)/(daily-questions)/q-2");
  };
  return (
    <View style={styles.root}>
      <StepHeader
        icon={<Ionicons name="water-outline" size={22} color="#1E40AF" />}
        barColor="#3B82F6"
        step={1}
        total={4}
        title="How much water does your body need daily?"
      />

      <Text style={styles.label}>Daily water intake in Liters</Text>
      <View style={styles.inputLineWrap}>
        <TextInput
          placeholder="e.g. 2.5"
          placeholderTextColor="#9CA3AF"
          keyboardType="decimal-pad"
          value={value}
          onChangeText={(text) => {
            setValue(text);
            if (text.trim()) setError("");
          }}
          style={styles.underlineInput}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <NButton
        title="Next"
        fullWidth
        variant="secondary"
        style={
          !value.trim()
            ? { ...styles.next, ...styles.disabledNext }
            : styles.next
        }
        onPress={handleNext}
        disabled={!value.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl, // space above progress bar
  },
  label: {
    color: "#6B7280",
    fontSize: 18,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  inputLineWrap: {
    borderBottomWidth: 1.25,
    borderBottomColor: "#D1D5DB",
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  underlineInput: {
    height: 44,
    color: "#111827",
    fontSize: 16,
    paddingHorizontal: 0,
  },
  error: {
    color: "red",
    marginTop: spacing.sm,
    fontSize: 14,
  },
  next: {
    alignSelf: "center",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#111827",
    marginTop: "auto",
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    width: "100%",
  },
  disabledNext: {
    opacity: 0.5,
  },
});
