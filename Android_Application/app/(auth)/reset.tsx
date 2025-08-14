import { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "@/design/tokens";
const GREEN = "#34C759";

export default function PwReset() {
  const { signIn } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onRequestReset = async () => {
    setLoading(true);
    try {
      await signIn!.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    setLoading(true);
    try {
      await signIn!.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      alert("Password reset successfully");
      router.replace("/(auth)/sign-in");
      // await setActive!({ session: result.createdSessionId }); don't do this here
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>
        <Text style={styles.brand}>
          Nutr<Text style={styles.brandAccent}>izy</Text>
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.subtitle}>
          {!successfulCreation ? "Reset your password" : "Set a new password"}
        </Text>
        <Text style={styles.title}>
          {!successfulCreation
            ? "We'll send you a reset link"
            : "Enter your code and new password"}
        </Text>

        {!successfulCreation ? (
          <>
            {/* Email Input */}
            <View style={styles.inputLineWrap}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#111827"
                style={styles.leadingIcon}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
                value={emailAddress}
                onChangeText={setEmailAddress}
                style={[styles.underlineInput, { paddingLeft: 36 }]}
              />
            </View>

            {/* Send Button */}
            <Pressable
              onPress={onRequestReset}
              style={styles.primaryCta}
              disabled={loading}
            >
              <Text style={styles.ctaText}>
                {loading ? "Sending..." : "Send Reset Email"}
              </Text>
            </Pressable>

            {/* Back to Sign-in */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Remembered your password? </Text>
              <Link href="/(auth)/sign-in" style={styles.switchLink}>
                Sign In
              </Link>
            </View>
          </>
        ) : (
          <>
            {/* Code Input */}
            <View style={styles.inputLineWrap}>
              <Ionicons
                name="key-outline"
                size={18}
                color="#111827"
                style={styles.leadingIcon}
              />
              <TextInput
                value={code}
                placeholder="Verification code"
                placeholderTextColor="#9CA3AF"
                onChangeText={setCode}
                style={[styles.underlineInput, { paddingLeft: 36 }]}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputLineWrap}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#111827"
                style={styles.leadingIcon}
              />
              <TextInput
                placeholder="New password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={[styles.underlineInput, { paddingLeft: 36 }]}
              />
              <Pressable
                onPress={() => setShowPassword((s) => !s)}
                style={styles.eyeChip}
                hitSlop={10}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#111827"
                />
              </Pressable>
            </View>

            {/* Reset Button */}
            <Pressable
              onPress={onReset}
              style={styles.primaryCta}
              disabled={loading}
            >
              <Text style={styles.ctaText}>
                {loading ? "Updating..." : "Set New Password"}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F8FF" },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { fontWeight: "800", fontSize: 22, color: "#111827" },
  brandAccent: { color: GREEN },
  panel: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  subtitle: { color: "#6B7280", fontSize: 16, marginBottom: 6 },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: spacing.lg,
  },
  inputLineWrap: {
    position: "relative",
    marginTop: 4,
    marginBottom: 12,
    minHeight: 44,
    justifyContent: "center",
  },
  leadingIcon: { position: "absolute", left: 4, top: 12 },
  underlineInput: {
    height: 44,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
    color: "#111827",
    fontSize: 16,
    paddingRight: 44,
  },
  eyeChip: {
    position: "absolute",
    right: 4,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  primaryCta: {
    backgroundColor: GREEN,
    borderRadius: 999,
    paddingVertical: 16,
    marginTop: spacing.lg,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  switchText: { color: "#6B7280" },
  switchLink: { color: "#111827", fontWeight: "800" },
});
