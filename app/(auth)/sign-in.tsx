import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { NInput } from "@/ui/input";
import { NButton } from "@/ui/button";
import { NCard } from "@/ui/card";
import { spacing } from "@/design/tokens";
import { Ionicons } from "@expo/vector-icons";

function getClerkErrorMessage(err: unknown) {
  const e = err as any;
  if (e?.errors && Array.isArray(e.errors)) {
    return e.errors
      .map((x: any) => x?.longMessage || x?.message)
      .filter(Boolean)
      .join("\n");
  }
  return e?.message || "Something went wrong. Please try again.";
}

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError(null);
    setLoading(true);
    try {
      const attempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/onboarding-check");
      } else {
        setError("Additional steps are required to complete sign-in.");
      }
    } catch (err) {
      setError(getClerkErrorMessage(err));
      console.error("Sign-in error:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Background decorative blobs */}
      <View style={[styles.blob, styles.blobTopRight]} />
      <View style={[styles.blob, styles.blobBottomLeft]} />

      <View style={styles.container}>
        <Text style={styles.bigTitle}>LOGIN</Text>

        <NCard style={styles.card}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Email */}
          <View style={styles.inputWrap}>
            <Ionicons
              name="mail-outline"
              size={18}
              color="#111827"
              style={styles.leadingIcon}
            />
            <NInput
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              onChangeText={setEmailAddress}
              style={styles.input}
            />
          </View>

          {/* Password with eye toggle */}
          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#111827"
              style={styles.leadingIcon}
            />
            <NInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              style={styles.trailingIconBtn}
              hitSlop={10}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#111827"
              />
            </Pressable>
          </View>

          {/* Primary CTA */}
          <NButton
            title={loading ? "Signing in..." : "LOGIN"}
            fullWidth
            onPress={onSignInPress}
            loading={loading}
            style={styles.primaryCta}
          />

          {/* Google button (UI only) */}
          {/* <TouchableOpacity
            style={styles.googleBtn}
            activeOpacity={0.9}
            onPress={() => {}}
          >
            <Ionicons
              name="logo-google"
              size={16}
              color="#111827"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.googleText}>Sign in with Google</Text>
          </TouchableOpacity> */}

          {/* Footer link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Not registered yet?</Text>
            <Link href="/(auth)/sign-up" style={styles.footerLink}>
              Create an Account
            </Link>
          </View>
        </NCard>
      </View>
    </View>
  );
}

const INPUT_BG = "#F1F3F5";
const ORANGE = "#FFB84D"; // CTA color from mock
const BLUE = "#2D7CE8";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F8FF" },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    justifyContent: "flex-start",
  },
  bigTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: BLUE,
    alignSelf: "center",
    marginVertical: spacing.lg,
    letterSpacing: 0.5,
  },
  card: {
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: 24,
    // backgroundColor: "transparent",
    borderWidth: 0,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.06,
    // shadowRadius: 12,
    // elevation: 6,
  },
  inputWrap: { position: "relative" },
  input: {
    backgroundColor: INPUT_BG,
    borderColor: "transparent",
    height: 52,
    borderRadius: 16,
    paddingLeft: 44, // space for icon
  },
  leadingIcon: { position: "absolute", left: 14, top: 16 },
  trailingIconBtn: {
    position: "absolute",
    right: 14,
    top: 14,
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryCta: {
    backgroundColor: ORANGE,
    borderRadius: 999,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginTop: spacing.sm,
  },

  googleBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  googleText: { color: "#111827", fontWeight: "600" },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.sm,
  },
  footerText: { color: "#6B7280" },
  footerLink: { color: BLUE, fontWeight: "700" },

  errorText: {
    color: "#B91C1C",
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },

  // decorative blobs
  blob: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#D6E4FF",
  },
  blobTopRight: { top: -60, right: -60, transform: [{ scaleX: 1.2 }] },
  blobBottomLeft: {
    bottom: -60,
    left: -60,
    backgroundColor: "#BFD3FF",
    transform: [{ scale: 1.1 }],
  },
});
