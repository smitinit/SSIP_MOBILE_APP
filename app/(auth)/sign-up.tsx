import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { NButton } from "@/ui/button";
import { NInput } from "@/ui/input";
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

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setError(null);
    setLoading(true);
    try {
      await signUp.create({ emailAddress: emailAddress.trim(), password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      setError(getClerkErrorMessage(err));
      console.error("Sign-up error:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setError(null);
    setLoading(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/onboarding-check");
      } else {
        setError("Additional steps are required to complete sign-up.");
      }
    } catch (err) {
      setError(getClerkErrorMessage(err));
      console.error("Verify error:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={vStyles.screen}>
        <View style={[vStyles.blob, vStyles.blobTopRight]} />
        <View style={[vStyles.blob, vStyles.blobBottomLeft]} />
        <View style={vStyles.container}>
          <Text style={vStyles.bigTitle}>VERIFY</Text>
          <NCard style={vStyles.card}>
            {error ? <Text style={sStyles.errorText}>{error}</Text> : null}
            <NInput
              label="Verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholder="123456"
              maxLength={8}
              style={sStyles.inputPlain}
            />
            <NButton
              title={loading ? "Verifying..." : "Verify"}
              fullWidth
              onPress={onVerifyPress}
              loading={loading}
              style={sStyles.primaryCta}
            />
            <View style={sStyles.footerRow}>
              <Text style={sStyles.footerText}>Made a mistake?</Text>
              <Link href="/(auth)/sign-in" style={sStyles.footerLink}>
                Back to sign in
              </Link>
            </View>
          </NCard>
        </View>
      </View>
    );
  }

  return (
    <View style={sStyles.screen}>
      {/* Background blobs */}
      <View style={[sStyles.blob, sStyles.blobTopRight]} />
      <View style={[sStyles.blob, sStyles.blobBottomLeft]} />

      <View style={sStyles.container}>
        <Text style={sStyles.bigTitle}>REGISTER</Text>
        <NCard style={sStyles.card}>
          {error ? <Text style={sStyles.errorText}>{error}</Text> : null}

          {/* Email */}
          <View style={sStyles.inputWrap}>
            <Ionicons
              name="mail-outline"
              size={18}
              color="#111827"
              style={sStyles.leadingIcon}
            />
            <NInput
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              onChangeText={setEmailAddress}
              style={sStyles.input}
            />
          </View>

          {/* Password */}
          <View style={sStyles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#111827"
              style={sStyles.leadingIcon}
            />
            <NInput
              placeholder="Password"
              secureTextEntry={!showPw}
              value={password}
              onChangeText={setPassword}
              style={sStyles.input}
            />
            <Pressable
              onPress={() => setShowPw((s) => !s)}
              style={sStyles.trailingIconBtn}
              hitSlop={10}
            >
              <Ionicons
                name={showPw ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#111827"
              />
            </Pressable>
          </View>

          {/* Confirm Password (UI only; logic unchanged) */}
          <View style={sStyles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#111827"
              style={sStyles.leadingIcon}
            />
            <NInput
              placeholder="Confirm Password"
              secureTextEntry={!showConfirm}
              value={confirm}
              onChangeText={setConfirm}
              style={sStyles.input}
            />
            <Pressable
              onPress={() => setShowConfirm((s) => !s)}
              style={sStyles.trailingIconBtn}
              hitSlop={10}
            >
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#111827"
              />
            </Pressable>
          </View>

          <NButton
            title={loading ? "Creating..." : "NEXT"}
            fullWidth
            onPress={onSignUpPress}
            loading={loading}
            style={sStyles.primaryCta}
          />

          <View style={sStyles.footerRow}>
            <Text style={sStyles.footerText}>Already have an account?</Text>
            <Link href="/(auth)/sign-in" style={sStyles.footerLink}>
              Sign in
            </Link>
          </View>
        </NCard>
      </View>
    </View>
  );
}

const INPUT_BG = "#F1F3F5";
const ORANGE = "#FFB84D";
const BLUE = "#2D7CE8";

const baseBlob = {
  position: "absolute" as const,
  width: 240,
  height: 240,
  borderRadius: 120,
  backgroundColor: "#D6E4FF",
};

const sStyles = StyleSheet.create({
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
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
  inputWrap: { position: "relative" },
  input: {
    backgroundColor: INPUT_BG,
    borderColor: "transparent",
    height: 52,
    borderRadius: 16,
    paddingLeft: 44,
  },
  inputPlain: {
    backgroundColor: INPUT_BG,
    borderColor: "transparent",
    height: 52,
    borderRadius: 16,
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
  blob: baseBlob as any,
  blobTopRight: { top: -60, right: -60, transform: [{ scaleX: 1.2 }] },
  blobBottomLeft: {
    bottom: -60,
    left: -60,
    backgroundColor: "#BFD3FF",
    transform: [{ scale: 1.1 }],
  },
});

const vStyles = sStyles;
