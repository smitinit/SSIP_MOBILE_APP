// import React from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   Pressable,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { useSignUp } from "@clerk/clerk-expo";
// import { Link, useRouter } from "expo-router";
// import { NButton } from "@/ui/button";
// import { spacing } from "@/design/tokens";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// function getClerkErrorMessage(err: unknown) {
//   const e = err as any;
//   if (e?.errors && Array.isArray(e.errors)) {
//     return e.errors
//       .map((x: any) => x?.longMessage || x?.message)
//       .filter(Boolean)
//       .join("\n");
//   }
//   return e?.message || "Something went wrong. Please try again.";
// }

// export default function SignUpScreen() {
//   const { isLoaded, signUp, setActive } = useSignUp();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [confirm, setConfirm] = React.useState("");
//   const [showPw, setShowPw] = React.useState(false);
//   const [pendingVerification, setPendingVerification] = React.useState(false);
//   const [code, setCode] = React.useState("");
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);

//   const onSignUpPress = async () => {
//     if (!isLoaded) return;
//     setError(null);
//     setLoading(true);
//     try {
//       await signUp.create({ emailAddress: emailAddress.trim(), password });
//       await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
//       setPendingVerification(true);
//     } catch (err) {
//       setError(getClerkErrorMessage(err));
//       console.error("Sign-up error:", JSON.stringify(err, null, 2));
//     } finally {
//       setLoading(false);
//       await AsyncStorage.setItem("onboardingComplete", "true");
//     }
//   };

//   const onVerifyPress = async () => {
//     if (!isLoaded) return;
//     setError(null);
//     setLoading(true);
//     try {
//       const attempt = await signUp.attemptEmailAddressVerification({ code });
//       if (attempt.status === "complete") {
//         await setActive({ session: attempt.createdSessionId });
//         router.replace("/onboarding-check");
//       } else {
//         setError("Additional steps are required to complete sign-up.");
//       }
//     } catch (err) {
//       setError(getClerkErrorMessage(err));
//       console.error("Verify error:", JSON.stringify(err, null, 2));
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (pendingVerification) {
//     return (
//       <View style={vStyles.screen}>
//         <View style={vStyles.header}>
//           <Pressable
//             onPress={() => router.back()}
//             hitSlop={10}
//             style={vStyles.backBtn}
//           >
//             <Ionicons name="chevron-back" size={22} color="#111827" />
//           </Pressable>
//           <Text style={vStyles.brand}>
//             {"Nutr"}
//             <Text style={vStyles.brandAccent}>{"izy"}</Text>
//           </Text>
//           <View style={{ width: 36 }} />
//         </View>

//         <View style={vStyles.panel}>
//           <Text style={vStyles.subtitle}>{"Email verification"}</Text>
//           <Text style={vStyles.title}>{"Enter the 6‑digit code"}</Text>

//           {error ? <Text style={styles.errorText}>{error}</Text> : null}

//           <TextInput
//             placeholder="123456"
//             keyboardType="number-pad"
//             value={code}
//             onChangeText={setCode}
//             maxLength={8}
//             style={vStyles.underlineInput}
//             placeholderTextColor="#9CA3AF"
//           />

//           <NButton
//             title={loading ? "Verifying..." : "Verify"}
//             fullWidth
//             onPress={onVerifyPress}
//             loading={loading}
//             style={vStyles.primaryCta}
//           />

//           <View style={styles.footerRow}>
//             <Text style={styles.footerText}>{"Made a mistake?"}</Text>
//             <Link href="/(auth)/sign-in" style={styles.footerLink}>
//               Back to sign in
//             </Link>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   const isEmailValid = /\S+@\S+\.\S+/.test(emailAddress.trim());

//   return (
//     <View style={styles.screen}>
//       {/* Light header with back and brand */}
//       <View style={styles.header}>
//         <Pressable
//           onPress={() => router.back()}
//           hitSlop={10}
//           style={styles.backBtn}
//         >
//           <Ionicons name="chevron-back" size={22} color="#111827" />
//         </Pressable>
//         <Text style={styles.brand}>
//           {"Nutr"}
//           <Text style={styles.brandAccent}>{"izy"}</Text>
//         </Text>
//         <View style={{ width: 36 }} />
//       </View>

//       {/* Rounded white panel */}
//       <View style={styles.panel}>
//         <Text style={styles.subtitle}>{"Let’s create your account"}</Text>
//         <Text style={styles.title}>{"You have been Missed!"}</Text>

//         {error ? <Text style={styles.errorText}>{error}</Text> : null}

//         {/* Email with underline and check */}
//         <View style={styles.fieldRow}>
//           <Text style={styles.fieldLabel}>Your Email / Username</Text>
//           <View style={styles.trailingSpace} />
//         </View>
//         <View style={styles.inputLineWrap}>
//           <Ionicons
//             name="mail-outline"
//             size={18}
//             color="#111827"
//             style={styles.leadingIcon}
//           />
//           <TextInput
//             placeholder="Email"
//             placeholderTextColor="#9CA3AF"
//             autoCapitalize="none"
//             keyboardType="email-address"
//             value={emailAddress}
//             onChangeText={setEmailAddress}
//             style={[styles.underlineInput, { paddingLeft: 36 }]}
//           />
//           {isEmailValid ? (
//             <View style={styles.successBadge}>
//               <Ionicons name="checkmark" size={16} color="#fff" />
//             </View>
//           ) : null}
//         </View>

//         {/* Password with eye */}
//         <View style={styles.fieldRow}>
//           <Text style={styles.fieldLabel}>Your Password</Text>
//           <View />
//         </View>
//         <View style={styles.inputLineWrap}>
//           <Ionicons
//             name="lock-closed-outline"
//             size={18}
//             color="#111827"
//             style={styles.leadingIcon}
//           />
//           <TextInput
//             placeholder="Password"
//             placeholderTextColor="#9CA3AF"
//             secureTextEntry={!showPw}
//             value={password}
//             onChangeText={setPassword}
//             style={[styles.underlineInput, { paddingLeft: 36 }]}
//           />
//           <Pressable
//             onPress={() => setShowPw((s) => !s)}
//             style={styles.eyeChip}
//             hitSlop={10}
//           >
//             <Ionicons
//               name={showPw ? "eye-off-outline" : "eye-outline"}
//               size={18}
//               color="#111827"
//             />
//           </Pressable>
//         </View>

//         {/* Confirm password (UI only) */}
//         <View style={styles.fieldRow}>
//           <Text style={styles.fieldLabel}>Confirm Password</Text>
//           <View />
//         </View>
//         <View style={styles.inputLineWrap}>
//           <Ionicons
//             name="lock-closed-outline"
//             size={18}
//             color="#111827"
//             style={styles.leadingIcon}
//           />
//           <TextInput
//             placeholder="Re-enter password"
//             placeholderTextColor="#9CA3AF"
//             secureTextEntry
//             value={confirm}
//             onChangeText={setConfirm}
//             style={[styles.underlineInput, { paddingLeft: 36 }]}
//           />
//         </View>

//         {/* Forgot password (kept as UI only) */}
//         <Pressable onPress={() => {}} style={styles.forgotRow} hitSlop={8}>
//           <Text style={styles.forgot}>Forget Password?</Text>
//         </Pressable>

//         {/* Primary CTA */}
//         <NButton
//           title={loading ? "Creating..." : "Sign Up"}
//           fullWidth
//           onPress={onSignUpPress}
//           loading={loading}
//           style={styles.primaryCta}
//         />

//         {/* Social buttons */}
//         <View style={styles.socialRow}>
//           <TouchableOpacity
//             style={[styles.socialBtn]}
//             activeOpacity={0.9}
//             onPress={() => {}}
//           >
//             <Ionicons name="logo-google" size={18} color="#E94235" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.socialBtn]}
//             activeOpacity={0.9}
//             onPress={() => {}}
//           >
//             <Ionicons name="logo-facebook" size={18} color="#1877F2" />
//           </TouchableOpacity>
//         </View>

//         {/* Switch auth */}
//         <View style={styles.switchRow}>
//           <Text style={styles.switchText}>Already have an account? </Text>
//           <Link href="/(auth)/sign-in" style={styles.switchLink}>
//             Sign In
//           </Link>
//         </View>

//         {/* Legal */}
//         <View style={styles.divider} />
//         <Text style={styles.legal}>
//           By continuing you agree Nutrizy’s{" "}
//           <Text style={styles.legalBold}>Terms of Services</Text> &{" "}
//           <Text style={styles.legalBold}>Privacy Policy</Text>
//         </Text>
//       </View>
//     </View>
//   );
// }

// const GREEN = "#34C759";

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: "#F6F8FF" },

//   header: {
//     paddingTop: spacing.lg,
//     paddingBottom: spacing.md,
//     paddingHorizontal: spacing.xl,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   backBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   brand: { fontWeight: "800", fontSize: 22, color: "#111827" },
//   brandAccent: { color: GREEN },

//   panel: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: spacing.xl,
//     paddingTop: spacing.xl,
//   },

//   subtitle: { color: "#6B7280", fontSize: 16, marginBottom: 6 },
//   title: {
//     color: "#111827",
//     fontSize: 28,
//     fontWeight: "800",
//     marginBottom: spacing.lg,
//   },

//   errorText: {
//     color: "#B91C1C",
//     backgroundColor: "#FEE2E2",
//     borderColor: "#FCA5A5",
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: spacing.md,
//   },

//   fieldRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: spacing.md,
//   },
//   fieldLabel: { color: "#6B7280", fontWeight: "700" },
//   trailingSpace: { width: 28 },

//   inputLineWrap: {
//     position: "relative",
//     marginTop: 4,
//     marginBottom: 2,
//     minHeight: 44,
//     justifyContent: "center",
//   },
//   leadingIcon: { position: "absolute", left: 4, top: 12 },
//   underlineInput: {
//     height: 44,
//     borderBottomWidth: 2,
//     borderBottomColor: "#E5E7EB",
//     color: "#111827",
//     fontSize: 16,
//     paddingRight: 44,
//   },
//   successBadge: {
//     position: "absolute",
//     right: 4,
//     top: 8,
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: GREEN,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   eyeChip: {
//     position: "absolute",
//     right: 4,
//     top: 8,
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: "#F1F5F9",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },

//   forgotRow: { alignSelf: "flex-end", marginTop: 8 },
//   forgot: { color: "#111827", fontWeight: "700" },

//   primaryCta: {
//     backgroundColor: GREEN,
//     borderRadius: 999,
//     paddingVertical: 16,
//     marginTop: spacing.lg,
//   },

//   socialRow: {
//     marginTop: spacing.lg,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: spacing.md,
//   },
//   socialBtn: {
//     flex: 1,
//     height: 52,
//     borderRadius: 999,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   switchRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: spacing.lg,
//   },
//   switchText: { color: "#6B7280" },
//   switchLink: { color: "#111827", fontWeight: "800" },

//   divider: { height: 1, backgroundColor: "#E5E7EB", marginTop: spacing.lg },
//   legal: {
//     color: "#6B7280",
//     textAlign: "center",
//     marginTop: spacing.md,
//   },
//   legalBold: { color: "#111827", fontWeight: "800" },
//   footerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: spacing.md,
//   },
//   footerText: { color: "#6B7280", marginRight: 4 },
//   footerLink: { color: "#111827", fontWeight: "800" },
// });

// const vStyles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: "#F6F8FF" },
//   header: {
//     paddingTop: spacing.lg,
//     paddingBottom: spacing.md,
//     paddingHorizontal: spacing.xl,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   backBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   brand: { fontWeight: "800", fontSize: 22, color: "#111827" },
//   brandAccent: { color: GREEN },

//   panel: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: spacing.xl,
//     paddingTop: spacing.xl,
//   },

//   subtitle: { color: "#6B7280", fontSize: 16, marginBottom: 6 },
//   title: {
//     color: "#111827",
//     fontSize: 24,
//     fontWeight: "800",
//     marginBottom: spacing.lg,
//   },

//   underlineInput: {
//     height: 48,
//     borderBottomWidth: 2,
//     borderBottomColor: "#E5E7EB",
//     color: "#111827",
//     fontSize: 18,
//   },

//   primaryCta: {
//     backgroundColor: GREEN,
//     borderRadius: 999,
//     paddingVertical: 16,
//     marginTop: spacing.lg,
//   },
// });

import { Button, TextInput, View, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { useState } from "react";
import { Stack } from "expo-router";

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />

      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize="none"
            placeholder="simon@galaxies.dev"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />
          <TextInput
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputField}
          />

          <Button
            onPress={onSignUpPress}
            title="Sign up"
            color={"#6c47ff"}
          ></Button>
        </>
      )}

      {pendingVerification && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              style={styles.inputField}
              onChangeText={setCode}
            />
          </View>
          <Button
            onPress={onPressVerify}
            title="Verify Email"
            color={"#6c47ff"}
          ></Button>
        </>
      )}
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});
