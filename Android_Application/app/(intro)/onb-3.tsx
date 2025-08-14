import { Pressable, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";
import OnboardingSlide from "@/components/OnboardingSlide";
import { palette } from "@/design/tokens";

export default function Onboarding4() {
  return (
    <OnboardingSlide
      image={require("../../assets/images/download.png")}
      headline="Simple steps to a healthier, newer you."
      index={2}
      total={3}
      skipHref="/welcome"
    >
      {/* Two pill buttons per mock */}
      <Link href="/welcome" asChild>
        <Pressable
          style={[styles.secondary, styles.pill]}
          android_ripple={{ color: "rgba(0,0,0,0.06)" }}
        >
          <Text style={styles.secondaryText}>Get Started</Text>
        </Pressable>
      </Link>
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
