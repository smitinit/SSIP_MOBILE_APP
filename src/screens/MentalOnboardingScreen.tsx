import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { NHeader } from "@/ui/header";
import { NButton } from "@/ui/button";
import { NCard } from "@/ui/card";
import { NCheckbox } from "@/ui/checkbox";
import { palette, spacing } from "@/design/tokens";

export default function MentalOnboardingScreen() {
  const router = useRouter();
  const [triggers, setTriggers] = useState({
    Criticism: false,
    Failure: false,
    Conflict: false,
    Abandonment: false,
    "Overwork or burnout": false,
  });
  const toggle = (key: keyof typeof triggers) =>
    setTriggers((s) => ({ ...s, [key]: !s[key] }));
  const onNext = () => router.push("./finance-onboarding");
  const onSkip = () => router.push("./finance-onboarding");

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <NHeader
        title="Mind & mood"
        subtitle="Identify triggers and coping patterns"
      />
      <NCard style={{ gap: spacing.sm }}>
        {Object.keys(triggers).map((k) => (
          <NCheckbox
            key={k}
            label={k}
            value={(triggers as any)[k]}
            onChange={() => toggle(k as any)}
          />
        ))}
        <NButton title="Next" fullWidth onPress={onNext} />
        <NButton title="Skip" fullWidth variant="secondary" onPress={onSkip} />
      </NCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: spacing.xl, backgroundColor: palette.bg },
});
