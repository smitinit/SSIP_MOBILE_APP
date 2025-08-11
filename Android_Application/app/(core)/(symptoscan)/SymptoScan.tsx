import React from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { MotiView } from "moti";
import { FeatureItem } from "@/components/Feature-Item";
import { Easing } from "react-native-reanimated";
import { router } from "expo-router";

const SymptoScan = () => {
  const features = [
    {
      id: "ai",
      icon: "🤖",
      title: "AI-Powered Analysis",
      description:
        "Our advanced AI analyzes your symptoms using the latest medical knowledge.",
      color: "#EEF2FF",
    },
    {
      id: "accurate",
      icon: "✅",
      title: "Accurate Results",
      description:
        "Get reliable insights based on medical databases and AI learning.",
      color: "#ECFDF5",
    },
    {
      id: "guidance",
      icon: "🩺",
      title: "Healthcare Guidance",
      description:
        "Receive recommendations on next steps and potential treatments.",
      color: "#F5F3FF",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <MotiView
          from={{ opacity: 0, translateY: 12, scale: 0.98 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{
            type: "timing",
            duration: 450,
            easing: Easing.out(Easing.cubic),
          }}
          style={styles.card}
        >
          <Text style={styles.title}>Introducing SymptomScan</Text>
          <Text style={styles.lead}>
            Our core technology that analyzes your symptoms and provides
            accurate health insights.
          </Text>

          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionHeader}>How SymptomScan Works</Text>
          </View>

          <View style={styles.features}>
            {features.map((f, i) => (
              <FeatureItem
                key={f.id}
                index={i}
                icon={f.icon}
                title={f.title}
                description={f.description}
                bubbleColor={f.color}
              />
            ))}
          </View>

          <Pressable
            onPress={() => router.push("/(core)/(symptoscan)/steps/Step1")}
            accessibilityRole="button"
            accessibilityLabel="Try SymptomScan"
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
          >
            <Text style={styles.ctaText}>Try SymptomScan</Text>
          </Pressable>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SymptoScan;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  container: {
    padding: 16,
    paddingTop: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#0F172A",
  },
  lead: {
    marginTop: 10,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    lineHeight: 22,
  },
  sectionHeaderWrap: {
    marginTop: 22,
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  features: {
    marginTop: 2,
  },
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
