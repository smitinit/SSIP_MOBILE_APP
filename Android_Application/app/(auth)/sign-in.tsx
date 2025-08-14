import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "@/design/tokens";

const GREEN = "#34C759";

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = /\S+@\S+\.\S+/.test(emailAddress.trim());

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
      // router.replace("/home");
    } catch (err: any) {
      alert(err.errors[0].message);
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
        <Text style={styles.subtitle}>{"Let’s Sign you In"}</Text>
        <Text style={styles.title}>{"You have been Missed!"}</Text>

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
            onChangeText={setEmailAddress}
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
            <Text style={styles.forgot}>Forget Password?</Text>
          </Pressable>
        </Link>

        {/* Sign In button */}
        <Pressable
          onPress={onSignInPress}
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
              style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}
            >
              Sign In
            </Text>
          )}
        </Pressable>

        {/* Switch auth */}
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Don’t have an Account? </Text>
          <Link href="/sign-up" style={styles.switchLink}>
            Sign Up
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Login;

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
  forgotRow: { alignSelf: "flex-end", marginTop: 8 },
  forgot: { color: "#111827", fontWeight: "700" },
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
