import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import OnboardingSlide from "@/components/OnboardingSlide";
import { palette } from "@/design/tokens";

export default function Onboarding4() {
  const router = useRouter();
  return (
    <OnboardingSlide
      image={require("../../assets/images/download.png")}
      headline="Simple steps to a healthier, newer you."
      index={3}
      total={4}
      skipHref="/(auth)/sign-up"
    >
      {/* Two pill buttons per mock */}
      <Pressable
        onPress={() => router.replace("/(auth)/sign-up")}
        style={[styles.primary, styles.pill]}
        android_ripple={{ color: "rgba(255,255,255,0.12)" }}
      >
        <Text style={styles.primaryText}>I am a Nutritionist</Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/(auth)/sign-up")}
        style={[styles.secondary, styles.pill]}
        android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      >
        <Text style={styles.secondaryText}>I am Searching for Doctor</Text>
      </Pressable>
    </OnboardingSlide>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: palette.primary,
  },
  primaryText: { color: "#fff", fontWeight: "700" },
  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryText: { color: "#111827", fontWeight: "700" },
});
