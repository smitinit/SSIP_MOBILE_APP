import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useSymptoms } from "../../../../context/symptom-context";
import { Progress } from "@/components/Progress";
import { BACKEND_URL } from "@/chat/config";
import Step5 from "./Step5";

export type AnalysisResult = {
  possibleConditions: string[];
  advice: string;
  urgency: string;
  recommendedNextSteps: string[];
  dietRecommendations: string[];
  exercisePlan: string[];
};

const Step4 = () => {
  const router = useRouter();
  const { selectedSymptoms, demographics, lifestyle, bodyAreas } =
    useSymptoms();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const createAnalysisPayload = () => {
    return {
      symptoms: selectedSymptoms.map((s) => ({
        id: s.id,
        label: s.label,
        areaId: s.areaId,
        isCustom: s.isCustom || false,
      })),
      demographics: {
        age: Number.parseInt(demographics.age) || null,
        gender: demographics.gender,
        heightCm: Number.parseFloat(demographics.heightCm) || null,
        weightKg: Number.parseFloat(demographics.weightKg) || null,
        bmi:
          demographics.heightCm && demographics.weightKg
            ? (
                Number.parseFloat(demographics.weightKg) /
                Math.pow(Number.parseFloat(demographics.heightCm) / 100, 2)
              ).toFixed(1)
            : null,
        conditions: demographics.conditions,
        medicalHistory: demographics.medicalHistory,
        currentMedications: demographics.currentMedications,
        allergies: demographics.allergies,
      },
      lifestyle: {
        exerciseFrequency: lifestyle.exerciseFrequency,
        sleepQuality: lifestyle.sleepQuality,
        stressLevel: lifestyle.stress,
        diet: lifestyle.diet,
        recentChanges: lifestyle.recentChanges,
      },
      timestamp: new Date().toISOString(),
    };
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert(
        "No Symptoms",
        "Please select at least one symptom to analyze."
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const payload = createAnalysisPayload();

      console.log("payload", payload);

      const response = await fetch(`${BACKEND_URL}/api/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText} - Error Message: ${response.body}`
        );
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      Alert.alert(
        "Analysis Failed",
        "Unable to connect to analysis service. Please check your connection and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAffectedAreas = () => {
    const areaIds = new Set(
      selectedSymptoms.map((s) => s.areaId).filter(Boolean)
    );
    return bodyAreas
      .filter((area) => areaIds.has(area.id))
      .map((area) => area.name);
  };

  if (isAnalyzing) {
    return (
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Analyzing your symptoms...</Text>
          <Text style={styles.loadingSubtext}>This may take a few moments</Text>
        </View>
      </MotiView>
    );
  }

  if (analysisResult && !isAnalyzing) {
    return <Step5 anaylsisResult={analysisResult} />;
  }

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
      <Progress step={4} total={4} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Review & Analyze</Text>
        <Text style={styles.subtitle}>
          Review your information below, then tap &dapos;Analyze Symptoms&dapos;
          for personalized insights.
        </Text>

        {/* Selected Symptoms Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Selected Symptoms ({selectedSymptoms.length}/7)
          </Text>
          <View style={styles.pillContainer}>
            {selectedSymptoms.map((symptom) => (
              <View key={symptom.id} style={styles.symptomPill}>
                <Text style={styles.pillText}>{symptom.label}</Text>
              </View>
            ))}
          </View>
          {getAffectedAreas().length > 0 && (
            <Text style={styles.affectedAreas}>
              Affected areas: {getAffectedAreas().join(", ")}
            </Text>
          )}
        </View>

        {/* Demographics Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Demographics</Text>
          <View style={styles.summaryGrid}>
            {demographics.age && (
              <Text style={styles.summaryItem}>Age: {demographics.age}</Text>
            )}
            {demographics.gender && (
              <Text style={styles.summaryItem}>
                Gender: {demographics.gender}
              </Text>
            )}
            {demographics.heightCm && demographics.weightKg && (
              <Text style={styles.summaryItem}>
                BMI:{" "}
                {(
                  Number.parseFloat(demographics.weightKg) /
                  Math.pow(Number.parseFloat(demographics.heightCm) / 100, 2)
                ).toFixed(1)}
              </Text>
            )}
            {demographics.conditions.length > 0 && (
              <Text style={styles.summaryItem}>
                Conditions: {demographics.conditions.join(", ")}
              </Text>
            )}
          </View>
        </View>

        {/* Lifestyle Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle</Text>
          <View style={styles.summaryGrid}>
            {lifestyle.exerciseFrequency && (
              <Text style={styles.summaryItem}>
                Exercise: {lifestyle.exerciseFrequency}
              </Text>
            )}
            {lifestyle.sleepQuality && (
              <Text style={styles.summaryItem}>
                Sleep: {lifestyle.sleepQuality}
              </Text>
            )}
            <Text style={styles.summaryItem}>
              Stress Level: {lifestyle.stress}/100
            </Text>
            {lifestyle.diet && (
              <Text style={styles.summaryItem}>Diet: {lifestyle.diet}</Text>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </Pressable>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              console.log(
                "Analyze Symptoms :",
                selectedSymptoms,
                demographics,
                lifestyle
              );

              analyzeSymptoms();
            }}
          >
            <Text style={styles.primaryButtonText}>Analyze Symptoms</Text>
          </Pressable>
        </View>
      </ScrollView>
    </MotiView>
  );
};

export default Step4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 40,
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
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
    lineHeight: 22,
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
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  symptomPill: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#0284c7",
  },
  pillText: {
    fontSize: 14,
    color: "#0284c7",
    fontWeight: "500",
  },
  affectedAreas: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    fontStyle: "italic",
  },
  summaryGrid: {
    gap: 8,
  },
  summaryItem: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 20,
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
  guidanceText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
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
  conditionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
});
