import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { NHeader } from "@/ui/header";
import { NInput } from "@/ui/input";
import { NButton } from "@/ui/button";
import { NCard } from "@/ui/card";
import { palette, spacing } from "@/design/tokens";

export default function HealthOnboardingScreen() {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepHours, setSleepHours] = useState("");

  const onNext = () => router.push("./mental-onboarding");
  const onSkip = () => router.push("./mental-onboarding");

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <NHeader
        title="Health profile"
        subtitle="Tell us about your body and sleep"
      />
      <NCard style={styles.card}>
        <View style={styles.section}>
          <NInput
            label="Weight (kg)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <NInput
            label="Height (cm)"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
          <NInput
            label="Age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>
        <View style={styles.section}>
          <NInput
            label="Usual Bed Time"
            placeholder="22:30"
            value={bedTime}
            onChangeText={setBedTime}
          />
          <NInput
            label="Usual Wake Time"
            placeholder="06:30"
            value={wakeTime}
            onChangeText={setWakeTime}
          />
          <NInput
            label="Daily Sleep Aim (hours)"
            keyboardType="numeric"
            value={sleepHours}
            onChangeText={setSleepHours}
          />
        </View>
        <NButton title="Next" fullWidth onPress={onNext} />
        <NButton title="Skip" fullWidth variant="secondary" onPress={onSkip} />
      </NCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: spacing.xl, backgroundColor: palette.bg },
  card: { gap: spacing.md },
  section: { gap: spacing.md, marginBottom: spacing.md },
});
