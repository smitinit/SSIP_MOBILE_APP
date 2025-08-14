import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSignUp } from "@clerk/clerk-expo";
import { spacing } from "@/design/tokens";
const GREEN = "#34C759";
export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors?.[0]?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: result.createdSessionId });
    } catch (err: any) {
      alert(err.errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
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

      {/* Panel */}
      <View style={styles.panel}>
        {!pendingVerification ? (
          <>
            <Text style={styles.subtitle}>{"Create your account"}</Text>
            <Text style={styles.title}>{"Join us today!"}</Text>

            {/* Email Field */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Your Email </Text>
              <View style={styles.trailingSpace} />
            </View>
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
                onChangeText={(val) => {
                  setEmailAddress(val);
                  setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
                }}
                style={[styles.underlineInput, { paddingLeft: 36 }]}
              />
              {isEmailValid ? (
                <View style={styles.successBadge}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              ) : null}
            </View>

            {/* Password Field */}
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Your Password</Text>
              <View />
            </View>
            <View style={styles.inputLineWrap}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#111827"
                style={styles.leadingIcon}
              />
              <TextInput
                placeholder="Password"
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
            {/* Forgot password */}
            <Link href="/reset" asChild>
              <Pressable style={styles.forgotRow} hitSlop={8}>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </Pressable>
            </Link>
            {/* Sign Up button */}
            <Pressable
              onPress={onSignUpPress}
              style={styles.primaryCta}
              disabled={loading}
            >
              {loading ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    Signing in…
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Sign In
                </Text>
              )}
            </Pressable>

            {/* Switch auth */}
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already have an Account? </Text>
              <Link href="/sign-in" style={styles.switchLink}>
                Sign In
              </Link>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>{"Verify your email"}</Text>
            <Text style={styles.title}>{"Enter the code we sent"}</Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Verification Code</Text>
              <View />
            </View>
            <View style={styles.inputLineWrap}>
              <Ionicons
                name="key-outline"
                size={18}
                color="#111827"
                style={styles.leadingIcon}
              />
              <TextInput
                placeholder="Code"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                style={[styles.underlineInput, { paddingLeft: 36 }]}
              />
            </View>

            <Pressable
              onPress={onVerifyPress}
              style={styles.primaryCta}
              disabled={loading}
            >
              {loading ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    Verifying...
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Verify Email
                </Text>
              )}
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F8FF" },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
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
  brand: { fontWeight: "800", fontSize: 22, color: "#111827" },
  brandAccent: { color: GREEN },
  panel: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  fieldLabel: { color: "#6B7280", fontWeight: "700" },
  trailingSpace: { width: 28 },
  inputLineWrap: {
    position: "relative",
    marginTop: 4,
    marginBottom: 2,
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
  successBadge: {
    position: "absolute",
    right: 4,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotRow: { alignSelf: "flex-end", marginTop: 8 },
  forgot: { color: "#111827", fontWeight: "700" },
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  switchText: { color: "#6B7280" },
  switchLink: { color: "#111827", fontWeight: "800" },
});
