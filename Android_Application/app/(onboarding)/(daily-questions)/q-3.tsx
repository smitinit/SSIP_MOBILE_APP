import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { NButton } from "@/ui/button";
import { spacing } from "@/design/tokens";
import { useWizard } from "../../context/onboarding-questions";
import { StepHeader } from "@/components/StepHeader";

export default function Step3() {
  const router = useRouter();
  const { answers, setAnswers, setStep } = useWizard();
  const [weight, setWeight] = useState(answers.weightKg || "");
  const [height, setHeight] = useState(answers.heightCm || "");
  const [errors, setErrors] = useState({ weight: "", height: "" });

  const validate = () => {
    let valid = true;
    let newErrors = { weight: "", height: "" };

    if (!weight.trim()) {
      newErrors.weight = "Please enter your weight.";
      valid = false;
    }
    if (!height.trim()) {
      newErrors.height = "Please enter your height.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (!validate()) return;
    setAnswers((s) => ({
      ...s,
      weightKg: weight.trim(),
      heightCm: height.trim(),
    }));
    setStep(4);
    router.push("/(onboarding)/(daily-questions)/q-4");
  };

  return (
    <View style={styles.root}>
      <StepHeader
        icon={<Ionicons name="medkit-outline" size={22} color="#991B1B" />}
        barColor="#EF4444"
        step={3}
        total={4}
        title="Do you think you are overweight?"
      />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>
        Your weight in Kilograms
      </Text>
      <View style={styles.inputLineWrap}>
        <TextInput
          placeholder="e.g. 67"
          placeholderTextColor="#9CA3AF"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={(t) => {
            setWeight(t);
            if (t.trim()) setErrors((e) => ({ ...e, weight: "" }));
          }}
          style={styles.underlineInput}
        />
      </View>
      {errors.weight ? <Text style={styles.error}>{errors.weight}</Text> : null}

      <Text style={[styles.label, { marginTop: spacing.lg }]}>
        Your Height in Centimeters
      </Text>
      <View style={styles.inputLineWrap}>
        <TextInput
          placeholder="e.g. 170"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={height}
          onChangeText={(t) => {
            setHeight(t);
            if (t.trim()) setErrors((e) => ({ ...e, height: "" }));
          }}
          style={styles.underlineInput}
        />
      </View>
      {errors.height ? <Text style={styles.error}>{errors.height}</Text> : null}

      <NButton
        title="Next"
        fullWidth
        variant="secondary"
        style={
          !weight.trim() || !height.trim()
            ? { ...styles.next, ...styles.disabledNext }
            : styles.next
        }
        onPress={handleNext}
        disabled={!weight.trim() || !height.trim()}
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
    fontSize: 14,
    marginTop: spacing.sm,
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
