import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { palette, spacing } from "@/design/tokens";
import { NButton } from "@/ui/button";

export default function WelcomeScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <View style={styles.container}>
      {/* Top brand and illustration section */}
      <View style={styles.top}>
        <Text style={styles.brand}>
          {"Nutri"}
          <Text style={styles.brandAccent}>{"zy"}</Text>
        </Text>

        <Image
          source={require("../../assets/images/download.png")}
          resizeMode="contain"
          style={styles.illustration}
        />
      </View>

      {/* Bottom sheet card */}
      <View style={styles.sheet}>
        <Image
          source={require("../../assets/images/nutrizy-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>{"Welcome to Nutrizy"}</Text>
        <Text style={styles.subtitle}>
          {"The best App for doctor's to\nmanage their practice."}
        </Text>

        <View style={styles.divider} />

        {!isLoaded ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <ActivityIndicator color={palette.primary} />
          </View>
        ) : isSignedIn ? (
          <NButton
            title="Get Started"
            fullWidth
            style={{ backgroundColor: "#4F6EF7", borderRadius: 999 }}
            onPress={() => router.push("/onboarding-check")}
          />
        ) : (
          <>
            <NButton
              title="Sign In"
              fullWidth
              style={{ backgroundColor: "#4F6EF7", borderRadius: 999 }}
              onPress={() => router.push("/(auth)/sign-in")}
            />
            <NButton
              title="Register with Us"
              fullWidth
              variant="secondary"
              style={{ borderRadius: 999 }}
              onPress={() => router.push("/(auth)/sign-up")}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FF",
  },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: spacing.xl,
  },
  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.2,
    marginBottom: spacing.lg,
  },
  brandAccent: {
    color: "#34C759",
  },
  illustration: {
    width: "88%",
    height: 220,
  },

  sheet: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
    gap: spacing.sm,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: palette.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: palette.textMuted,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: spacing.md,
  },
});
