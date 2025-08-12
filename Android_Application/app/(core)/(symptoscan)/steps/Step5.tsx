import { Progress } from "@/components/Progress";
import { MotiView, ScrollView } from "moti";
import React from "react";
import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Easing } from "react-native-reanimated";

import { useRouter } from "expo-router";
import { AnalysisResult } from "./Step4";
import { useSymptoms } from "../../../context/symptom-context";
import { NButton } from "@/ui/button";
import { palette } from "@/design/tokens";

type Urgency = "low" | "moderate" | "high";

const Step5 = ({ anaylsisResult }: { anaylsisResult: AnalysisResult }) => {
  const { resetAll } = useSymptoms();
  const router = useRouter();
  console.log("analysisResult", anaylsisResult);

  const urgencyStyles: Record<Urgency, object> = {
    low: styles.urgencyLow,
    moderate: styles.urgencyModerate,
    high: styles.urgencyHigh,
  };
  const urgencyKey = anaylsisResult.urgency.toLowerCase() as Urgency;
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "timing",
        duration: 400,
        easing: Easing.out(Easing.cubic),
      }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Analysis Results</Text>

        <View style={styles.section}>
          <View style={[styles.urgencyBadge, urgencyStyles[urgencyKey]]}>
            <Text style={styles.urgencyText}>
              {anaylsisResult.urgency.toUpperCase()} URGENCY
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Possible Conditions</Text>
          {anaylsisResult.possibleConditions.map((condition, index) => (
            <View key={index} style={styles.conditionItem}>
              <View style={styles.conditionBadge}>
                <Text style={styles.conditionNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.conditionText}>{condition}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Advice</Text>
          <Text style={styles.adviceText}>{anaylsisResult.advice}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Next Steps</Text>
          {anaylsisResult.recommendedNextSteps.map((step, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diet Recommendations</Text>
          {anaylsisResult.dietRecommendations.map((diet, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>🍎</Text>
              <Text style={styles.listText}>{diet}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercise Plan</Text>
          {anaylsisResult.exercisePlan.map((exercise, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>💪</Text>
              <Text style={styles.listText}>{exercise}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <NButton
          title="Start New Analysis"
          variant="primary"
          onPress={() => {
            resetAll();
            router.push("/(core)/(symptoscan)/SymptoScan");
          }}
        />
      </View>
    </MotiView>
  );
};

export default Step5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },

  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },

  urgencyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  urgencyLow: {
    backgroundColor: "#dcfce7",
  },
  urgencyModerate: {
    backgroundColor: "#fef3c7",
  },
  urgencyHigh: {
    backgroundColor: "#fee2e2",
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: "#0284c7",
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 20,
  },

  actions: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: palette.bg,
    marginBottom: 15, // subtle background
  },

  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#0284c7",
  },
  conditionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0284c7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  conditionNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  adviceText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#0284c7",
  },
  conditionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
});
