import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AnalysisResult } from "./Step4";
// Updated interface to match the backend data structure

const Step5 = ({ analysisResult }: { analysisResult: AnalysisResult }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [expandedSections, setExpandedSections] = useState({
    followUp: false,
    riskFactors: false,
    diseases: false,
    preventive: false,
    dos: false,
    donts: false,
    diet: false,
    exercise: false,
    ayurvedic: false,
  });

  const tabs = ["Overview", "Details", "Report Analysis"];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const getUrgencyInfo = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return { color: "#EF4444", bgColor: "#FEF2F2", icon: "alert-circle" };
      case "moderate":
      case "medium":
        return { color: "#F59E0B", bgColor: "#FEF3C7", icon: "warning" };
      case "low":
        return {
          color: "#10B981",
          bgColor: "#ECFDF5",
          icon: "checkmark-circle",
        };
      default:
        return {
          color: "#6B7280",
          bgColor: "#F9FAFB",
          icon: "information-circle",
        };
    }
  };

  const TabBar = () => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const UrgencyBadge = () => {
    const urgencyInfo = getUrgencyInfo(analysisResult.urgency);
    return (
      <View style={styles.urgencyContainer}>
        <View
          style={[
            styles.urgencyBadge,
            { backgroundColor: urgencyInfo.bgColor },
          ]}
        >
          <Ionicons
            name={urgencyInfo.icon as any}
            size={16}
            color={urgencyInfo.color}
          />
          <Text style={[styles.urgencyText, { color: urgencyInfo.color }]}>
            {analysisResult.urgency} Urgency
          </Text>
        </View>
      </View>
    );
  };

  const AdviceCard = () => (
    <View style={styles.adviceCard}>
      <View style={styles.adviceHeader}>
        <Ionicons name="medical" size={20} color="#3B82F6" />
        <Text style={styles.adviceTitle}>Medical Advice</Text>
      </View>
      <Text style={styles.adviceText}>{analysisResult.advice}</Text>
    </View>
  );

  const ConditionsCard = () => (
    <View style={styles.conditionsCard}>
      <Text style={styles.conditionsTitle}>Possible Conditions</Text>
      <View style={styles.conditionsContainer}>
        {(analysisResult.possibleconditions || []).map((condition, index) => (
          <View key={index} style={styles.conditionTag}>
            <Text style={styles.conditionText}>{condition}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const ExpandableSection = ({
    title,
    icon,
    sectionKey,
    children,
    iconColor = "#6B7280",
  }: {
    title: string;
    icon: string;
    sectionKey: string;
    children: React.ReactNode;
    iconColor?: string;
  }) => (
    <View style={styles.expandableCard}>
      <TouchableOpacity
        style={styles.expandableHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <View style={styles.expandableHeaderLeft}>
          <Ionicons name={icon as any} size={20} color={iconColor} />
          <Text style={styles.expandableTitle}>{title}</Text>
        </View>
        <Ionicons
          name={
            expandedSections[sectionKey as keyof typeof expandedSections]
              ? "chevron-up"
              : "chevron-down"
          }
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
      {expandedSections[sectionKey as keyof typeof expandedSections] && (
        <View style={styles.expandableContent}>{children}</View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <TabBar />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Symptom Analysis Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Symptom Analysis</Text>
          <UrgencyBadge />
        </View>

        <Text style={styles.subtitle}>Based on your symptoms</Text>

        <AdviceCard />
        <ConditionsCard />

        <ExpandableSection
          title="Follow-up Actions"
          icon="checkmark-circle-outline"
          sectionKey="followUp"
          iconColor="#10B981"
        >
          {(analysisResult.followUpActions || []).map((action, index) => (
            <View key={index} style={styles.actionItem}>
              <Ionicons name="checkmark" size={16} color="#10B981" />
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
        </ExpandableSection>

        <ExpandableSection
          title="Risk Factors"
          icon="warning-outline"
          sectionKey="riskFactors"
          iconColor="#F59E0B"
        >
          {(analysisResult.riskFactors || []).map((risk, index) => (
            <View key={index} style={styles.actionItem}>
              <Ionicons name="alert-circle" size={16} color="#F59E0B" />
              <Text style={styles.actionText}>{risk}</Text>
            </View>
          ))}
        </ExpandableSection>

        <ExpandableSection
          title="Possible Diseases"
          icon="medical-outline"
          sectionKey="diseases"
          iconColor="#8B5CF6"
        >
          {(analysisResult.possibleDiseases || []).map((disease, index) => (
            <View key={index} style={styles.actionItem}>
              <Ionicons name="medical" size={16} color="#8B5CF6" />
              <Text style={styles.actionText}>{disease}</Text>
            </View>
          ))}
        </ExpandableSection>

        <ExpandableSection
          title="Preventive Measures"
          icon="shield-checkmark-outline"
          sectionKey="preventive"
          iconColor="#06B6D4"
        >
          {(analysisResult.preventiveMeasures || []).map((measure, index) => (
            <View key={index} style={styles.actionItem}>
              <Ionicons name="shield-checkmark" size={16} color="#06B6D4" />
              <Text style={styles.actionText}>{measure}</Text>
            </View>
          ))}
        </ExpandableSection>

        <ExpandableSection
          title="Do's"
          icon="checkmark-circle"
          sectionKey="dos"
          iconColor="#10B981"
        >
          {(analysisResult.doList || []).map((item, index) => (
            <View key={index} style={styles.actionItem}>
              <Ionicons name="checkmark" size={16} color="#10B981" />
              <Text style={styles.actionText}>{item}</Text>
            </View>
          ))}
        </ExpandableSection>

        <ExpandableSection
          title="Don'ts"
          icon="close-circle"
          sectionKey="donts"
          iconColor="#EF4444"
        >
          {(analysisResult.dontList || []).map((item, index) => (
            <View key={index} style={styles.actionItem}>
              <Ionicons name="close" size={16} color="#EF4444" />
              <Text style={styles.actionText}>{item}</Text>
            </View>
          ))}
        </ExpandableSection>

        <ExpandableSection
          title="Diet Recommendations"
          icon="restaurant-outline"
          sectionKey="diet"
          iconColor="#F97316"
        >
          <View style={styles.dietSection}>
            <Text style={styles.dietMealTitle}>Breakfast</Text>
            {(analysisResult.dietRecommendations?.breakfast || []).map(
              (item, index) => (
                <Text key={index} style={styles.dietItem}>
                  • {item}
                </Text>
              )
            )}

            <Text style={styles.dietMealTitle}>Lunch</Text>
            {(analysisResult.dietRecommendations?.lunch || []).map(
              (item, index) => (
                <Text key={index} style={styles.dietItem}>
                  • {item}
                </Text>
              )
            )}

            <Text style={styles.dietMealTitle}>Dinner</Text>
            {(analysisResult.dietRecommendations?.dinner || []).map(
              (item, index) => (
                <Text key={index} style={styles.dietItem}>
                  • {item}
                </Text>
              )
            )}

            <Text style={styles.dietMealTitle}>Snacks</Text>
            {(analysisResult.dietRecommendations?.snacks || []).map(
              (item, index) => (
                <Text key={index} style={styles.dietItem}>
                  • {item}
                </Text>
              )
            )}
          </View>
        </ExpandableSection>

        <ExpandableSection
          title="Exercise Plan"
          icon="fitness-outline"
          sectionKey="exercise"
          iconColor="#8B5CF6"
        >
          {(analysisResult.exercisePlan || []).map((exercise, index) => (
            <View key={index} style={styles.actionItem}>
              <Ionicons name="fitness" size={16} color="#8B5CF6" />
              <Text style={styles.actionText}>{exercise}</Text>
            </View>
          ))}
        </ExpandableSection>

        <ExpandableSection
          title="Ayurvedic Medications"
          icon="leaf-outline"
          sectionKey="ayurvedic"
          iconColor="#059669"
        >
          {(analysisResult.ayurvedicMedications || []).map(
            (medication, index) => (
              <View key={index} style={styles.actionItem}>
                <Ionicons name="leaf" size={16} color="#059669" />
                <Text style={styles.actionText}>{medication}</Text>
              </View>
            )
          )}
        </ExpandableSection>

        {/* Download Button */}
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <Text style={styles.downloadButtonText}>
            Download Overview Report
          </Text>
        </TouchableOpacity>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
          <Text style={styles.disclaimerText}>
            This analysis is for informational purposes only and does not
            constitute medical advice. Always consult with a qualified
            healthcare provider for diagnosis and treatment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Step5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  menuButton: {
    padding: 4,
  },
  tabContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    alignContent: "space-between",
  },
  activeTabText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  urgencyContainer: {
    alignItems: "flex-end",
  },
  urgencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  adviceCard: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  adviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    marginLeft: 8,
  },
  adviceText: {
    fontSize: 14,
    color: "#1E3A8A",
    lineHeight: 20,
  },
  conditionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  conditionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  conditionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  conditionTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  conditionText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  expandableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  expandableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  expandableHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expandableTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 12,
  },
  expandableContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  dietSection: {
    paddingVertical: 8,
  },
  dietMealTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 12,
    marginBottom: 8,
  },
  dietItem: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
    lineHeight: 20,
  },
  downloadButton: {
    backgroundColor: "#1F2937",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  disclaimer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
});
