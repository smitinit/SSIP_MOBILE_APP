// import React from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   Pressable,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { useSignIn } from "@clerk/clerk-expo";
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

// export default function SignInScreen() {
//   const { signIn, setActive, isLoaded } = useSignIn();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [showPassword, setShowPassword] = React.useState(false);
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);

//   const onSignInPress = async () => {
//     if (!isLoaded) return;
//     setError(null);
//     setLoading(true);
//     try {
//       const attempt = await signIn.create({
//         identifier: emailAddress.trim(),
//         password,
//       });
//       if (attempt.status === "complete") {
//         await setActive({ session: attempt.createdSessionId });
//         router.replace("/onboarding-check");
//       } else {
//         setError("Additional steps are required to complete sign-in.");
//       }
//     } catch (err) {
//       setError(getClerkErrorMessage(err));
//       console.error("Sign-in error:", JSON.stringify(err, null, 2));
//     } finally {
//       setLoading(false);
//       await AsyncStorage.setItem("onboardingComplete", "true");
//     }
//   };

//   const isEmailValid = /\S+@\S+\.\S+/.test(emailAddress.trim());

//   return (
//     <View style={styles.screen}>
//       {/* Header with back + brand */}
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
//         <Text style={styles.subtitle}>{"Let’s Sign you In"}</Text>
//         <Text style={styles.title}>{"You have been Missed!"}</Text>

//         {error ? <Text style={styles.errorText}>{error}</Text> : null}

//         {/* Email with underline and check */}
//         <View style={styles.fieldRow}>
//           <Text style={styles.fieldLabel}>Your Email </Text>
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
//             secureTextEntry={!showPassword}
//             value={password}
//             onChangeText={setPassword}
//             style={[styles.underlineInput, { paddingLeft: 36 }]}
//           />
//           <Pressable
//             onPress={() => setShowPassword((s) => !s)}
//             style={styles.eyeChip}
//             hitSlop={10}
//           >
//             <Ionicons
//               name={showPassword ? "eye-off-outline" : "eye-outline"}
//               size={18}
//               color="#111827"
//             />
//           </Pressable>
//         </View>

//         {/* Forgot password (UI only) */}
//         <Pressable onPress={() => {}} style={styles.forgotRow} hitSlop={8}>
//           <Text style={styles.forgot}>Forget Password?</Text>
//         </Pressable>

//         {/* Primary CTA */}
//         <NButton
//           title={loading ? "Signing in..." : "Sign In"}
//           fullWidth
//           onPress={onSignInPress}
//           loading={loading}
//           style={styles.primaryCta}
//         />

//         {/* Social buttons (outlined) */}
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
//           <Text style={styles.switchText}>Don’t have a Account? </Text>
//           <Link href="/(auth)/sign-up" style={styles.switchLink}>
//             Sign Up
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
// });

import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  Alert,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

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

      <Button onPress={onSignInPress} title="Login" color={"#6c47ff"}></Button>

      <Link href="/reset" asChild>
        <Pressable style={styles.button}>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href="/sign-up" asChild>
        <Pressable style={styles.button}>
          <Text>Create Account</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default Login;

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
