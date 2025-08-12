import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { useSymptoms } from "../../../../app/context/symptom-context";
import { router } from "expo-router";

export default function SymptoScan() {
  const {
    bodyAreas,
    currentAreaId,
    setCurrentArea,
    selectedSymptoms,
    maxSelected,
    toggleSymptom,
    addCustomSymptom,
    removeSymptom,
  } = useSymptoms();
  const [custom, setCustom] = useState("");

  const currentArea = useMemo(
    () => bodyAreas.find((a) => a.id === currentAreaId) ?? null,
    [bodyAreas, currentAreaId]
  );

  const handleAddCustom = () => {
    if (!custom.trim()) return;
    addCustomSymptom(custom);
    setCustom("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
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
          <Text style={styles.title}>SymptomScan Pro</Text>
          <Text style={styles.lead}>
            Our comprehensive AI-powered health analysis tool. Get detailed
            insights and personalized recommendations. Fill every input for more
            accurate results.
          </Text>

          <View style={styles.progressWrap}>
            <View style={styles.progressTrack} />
            <View style={[styles.progressBar, { width: "25%" }]} />
            <Text style={styles.progressText}>Progress Step 1 of 4</Text>
          </View>

          <View style={styles.columns}>
            <View style={styles.colLeft}>
              <Text style={styles.sectionTitle}>Body Areas</Text>
              {bodyAreas.map((area) => {
                const active = area.id === currentAreaId;
                return (
                  <Pressable
                    key={area.id}
                    onPress={() => setCurrentArea(area.id)}
                    style={({ pressed }) => [
                      styles.areaBtn,
                      active && styles.areaBtnActive,
                      pressed && { opacity: 0.9 },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${area.name}`}
                  >
                    <Text
                      style={[
                        styles.areaBtnText,
                        active && styles.areaBtnTextActive,
                      ]}
                    >
                      {area.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.colRight}>
              <Text style={styles.sectionTitle}>Select a body area</Text>
              <View style={styles.panel}>
                {!currentArea ? (
                  <Text style={styles.panelEmpty}>
                    Please select a body area to see related symptoms
                  </Text>
                ) : (
                  <View style={{ gap: 8 }}>
                    {currentArea.symptoms.map((sym) => {
                      const selected = selectedSymptoms.some(
                        (s) => s.id === sym.id
                      );
                      const disabled =
                        !selected && selectedSymptoms.length >= maxSelected;
                      return (
                        <Pressable
                          key={sym.id}
                          onPress={() => toggleSymptom(sym)}
                          style={({ pressed }) => [
                            styles.symptomRow,
                            selected && styles.symptomRowActive,
                            disabled && { opacity: 0.5 },
                            pressed && { opacity: 0.85 },
                          ]}
                          disabled={disabled}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          accessibilityLabel={sym.label}
                        >
                          <View
                            style={[
                              styles.check,
                              selected && styles.checkActive,
                            ]}
                          />
                          <Text
                            style={[
                              styles.symptomText,
                              selected && styles.symptomTextActive,
                            ]}
                          >
                            {sym.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.selectedWrap}>
            <View style={styles.selectedHeader}>
              <Text style={styles.sectionTitle}>Selected Symptoms</Text>
              <Text style={styles.counterText}>
                {selectedSymptoms.length}/{maxSelected} symptoms
              </Text>
            </View>

            <View style={styles.selectedPanel}>
              {selectedSymptoms.length === 0 ? (
                <Text style={styles.panelEmpty}>
                  No symptoms selected. Select from the list above or add custom
                  symptoms.
                </Text>
              ) : (
                <View style={styles.pillsWrap}>
                  {selectedSymptoms.map((s) => (
                    <View key={s.id} style={styles.pill}>
                      <Text style={styles.pillText}>{s.label}</Text>
                      <Pressable
                        onPress={() => removeSymptom(s.id)}
                        hitSlop={8}
                      >
                        <Text style={styles.pillClose}>×</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.customRow}>
              <TextInput
                placeholder="Add a custom symptom..."
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={custom}
                onChangeText={setCustom}
                onSubmitEditing={handleAddCustom}
                returnKeyType="done"
              />
              <Pressable
                onPress={handleAddCustom}
                style={({ pressed }) => [
                  styles.addBtn,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={styles.addBtnText}>Add</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              onPress={() => {
                router.push("/(core)/(symptoscan)/steps/Step2");
              }}
              style={({ pressed }) => [
                styles.nextBtn,
                pressed && { opacity: 0.9 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Next"
            >
              <Text style={styles.nextText}>Next →</Text>
            </Pressable>
          </View>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 10, backgroundColor: "transparent" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
    paddingVertical: 20,
    paddingHorizontal: 16,
    // borderWidth: 0,
    // borderColor: "#E5E7EB",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    // elevation: 3,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#0F172A" },
  lead: { marginTop: 6, color: "#6B7280", fontSize: 14.5, lineHeight: 20 },
  progressWrap: { marginTop: 12, marginBottom: 12 },
  progressTrack: { height: 6, backgroundColor: "#EEF2FF", borderRadius: 999 },
  progressBar: {
    height: 6,
    backgroundColor: "#111827",
    borderRadius: 999,
    position: "absolute",
    left: 0,
    top: 0,
  },
  progressText: { marginTop: 6, fontSize: 12, color: "#111827" },
  columns: { flexDirection: "row", gap: 16, marginTop: 8 },
  colLeft: { flex: 1 },
  colRight: { flex: 1.4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  areaBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
  },
  areaBtnActive: { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" },
  areaBtnText: { color: "#111827", fontWeight: "600" },
  areaBtnTextActive: { color: "#0B1324" },
  panel: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    minHeight: 140,
    justifyContent: "center",
  },
  panelEmpty: { color: "#6B7280", textAlign: "center" },
  symptomRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  symptomRowActive: { borderColor: "#C7D2FE", backgroundColor: "#EEF2FF" },
  check: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 10,
  },
  checkActive: { borderColor: "#4F46E5", backgroundColor: "#4F46E5" },
  symptomText: { color: "#111827", fontWeight: "600" },
  symptomTextActive: { color: "#0B1324" },
  selectedWrap: { marginTop: 16 },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  counterText: { color: "#6B7280", fontSize: 12 },
  selectedPanel: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    minHeight: 84,
    padding: 12,
    justifyContent: "center",
  },
  pillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  pillText: { color: "#111827", fontWeight: "600" },
  pillClose: { color: "#6B7280", fontSize: 16, marginTop: -2 },
  customRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },
  addBtn: {
    backgroundColor: "#6B7280",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addBtnText: { color: "#FFFFFF", fontWeight: "700" },
  footer: { marginTop: 12, alignItems: "flex-end" },
  nextBtn: {
    backgroundColor: "#0B1324",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  nextText: { color: "#FFFFFF", fontWeight: "700" },
});
