import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { NButton } from "@/ui/button";
import { spacing } from "@/design/tokens";
import { StepHeader } from "@/components/StepHeader";
import { useWizard } from "../../../context/onboarding-questions";

export default function Step2() {
  const router = useRouter();
  const { answers, setAnswers, setStep } = useWizard();
  const [value, setValue] = useState(answers.favoriteFood || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!value.trim()) {
      setError("Please enter what you ate today.");
      return;
    }
    setError("");
    setAnswers((s) => ({ ...s, favoriteFood: value.trim() }));
    setStep(3);
    router.push("/(onboarding)/(daily-questions)/q-3");
  };

  return (
    <View style={styles.root}>
      <StepHeader
        icon={<Ionicons name="restaurant-outline" size={22} color="#166534" />}
        barColor="#22C55E"
        step={2}
        total={4}
        title="How many calories does your favourite food have?"
      />

      <Text style={styles.label}>What do you eat today?</Text>
      <View style={styles.inputLineWrap}>
        <TextInput
          placeholder="e.g. Paneer wrap ~ 450 kcal"
          placeholderTextColor="#9CA3AF"
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
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
