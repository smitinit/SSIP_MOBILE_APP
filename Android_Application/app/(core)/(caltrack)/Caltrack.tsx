import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Caltrack() {
  return (
    <View>
      <Text>Caltrack </Text>
      <Pressable
        onPress={() => router.push("/(tabs)/home")}
        accessibilityRole="button"
        accessibilityLabel="Try SymptomScan"
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.ctaText}>Go to home</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  cta: {
    alignSelf: "center",
    marginTop: 22,
    backgroundColor: "#0B1324",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  ctaText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
