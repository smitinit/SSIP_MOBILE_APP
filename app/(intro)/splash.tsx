import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { spacing } from "@/design/tokens";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/(intro)/onb-1");
    }, 4200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.root}>
      <View style={styles.logoWrap}>
        <Image
          source={require("../../assets/images/nutrizy-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.brand}>
          {"Nutri"}
          <Text style={styles.brandAccent}>{"zy"}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: { alignItems: "center", gap: spacing.sm },
  logo: { width: 72, height: 72, borderRadius: 16 },
  brand: { fontSize: 28, fontWeight: "800", color: "#111827" },
  brandAccent: { color: "#34C759" },
});
