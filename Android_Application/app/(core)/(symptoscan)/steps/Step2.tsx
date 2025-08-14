import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { useSymptoms } from "../../../../context/symptom-context"; 
import { GENDER_OPTIONS, MEDICAL_CONDITIONS } from "./data/options";

const Step2 = () => {
  const router = useRouter();
  const { demographics, updateDemographics, toggleCondition } = useSymptoms();

  const selectedCount = demographics.conditions.length;

  return (
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
          <View style={[styles.progressBar, { width: "50%" }]} />
          <Text style={styles.progressText}>Progress Step 2 of 4</Text>
        </View>

        <View style={styles.grid2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              value={demographics.age}
              onChangeText={(t) =>
                updateDemographics("age", t.replace(/[^0-9]/g, ""))
              }
              keyboardType="numeric"
              placeholder="Enter your age"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.rowWrap}>
              {GENDER_OPTIONS.map((g) => {
                const active = demographics.gender === g;
                return (
                  <Pressable
                    key={g}
                    onPress={() => updateDemographics("gender", g)}
                    style={({ pressed }) => [
                      styles.chip,
                      active && styles.chipActive,
                      pressed && { opacity: 0.9 },
                    ]}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {g}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.grid2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              value={demographics.heightCm}
              onChangeText={(t) =>
                updateDemographics("heightCm", t.replace(/[^0-9]/g, ""))
              }
              keyboardType="numeric"
              placeholder="Enter your height in cm"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              value={demographics.weightKg}
              onChangeText={(t) =>
                updateDemographics("weightKg", t.replace(/[^0-9.]/g, ""))
              }
              keyboardType="numeric"
              placeholder="Enter your weight in kg"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>
        </View>

        <View style={{ marginTop: 12 }}>
          <View style={styles.conditionsHeader}>
            <Text style={styles.sectionTitle}>Common Medical Conditions</Text>
            <Text style={styles.counterText}>{selectedCount}/3 selected</Text>
          </View>
          <View style={styles.chipGrid}>
            {MEDICAL_CONDITIONS.map((c) => {
              const active = demographics.conditions.includes(c);
              const atLimit = !active && selectedCount >= 3;
              return (
                <Pressable
                  key={c}
                  onPress={() => toggleCondition(c)}
                  disabled={atLimit}
                  style={({ pressed }) => [
                    styles.choice,
                    active && styles.choiceActive,
                    atLimit && { opacity: 0.5 },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      active && styles.choiceTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.label}>Additional Medical History</Text>
          <TextInput
            multiline
            value={demographics.medicalHistory}
            onChangeText={(t) => updateDemographics("medicalHistory", t)}
            placeholder="Describe any other medical conditions, surgeries, hospitalizations..."
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.textarea]}
          />
          <Text style={styles.helpText}>
            This information helps provide a more accurate analysis of your
            symptoms.
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.label}>Current Medications</Text>
          <TextInput
            multiline
            value={demographics.currentMedications}
            onChangeText={(t) => updateDemographics("currentMedications", t)}
            placeholder="List any medications you are currently taking..."
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.textarea]}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.label}>Allergies</Text>
          <TextInput
            multiline
            value={demographics.allergies}
            onChangeText={(t) => updateDemographics("allergies", t)}
            placeholder="List any allergies you have..."
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.textarea]}
          />
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.btnGhost,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.btnGhostText}>← Back</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(core)/(symptoscan)/steps/Step3")}
            style={({ pressed }) => [
              styles.btnPrimary,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.btnPrimaryText}>Next →</Text>
          </Pressable>
        </View>
      </MotiView>
    </ScrollView>
  );
};

export default Step2;

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 10, backgroundColor: "transparent" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    // borderWidth: 1,
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
  grid2: { flexDirection: "row", gap: 16, marginTop: 8 },
  label: { color: "#0F172A", fontWeight: "700", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },
  textarea: { minHeight: 96, textAlignVertical: "top" },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
  },
  chipActive: { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" },
  chipText: { color: "#111827", fontWeight: "600" },
  chipTextActive: { color: "#0B1324" },
  conditionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  counterText: { color: "#6B7280", fontSize: 12 },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  choice: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  helpText: { marginTop: 6, color: "#6B7280", fontSize: 12 },
  choiceActive: { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" },
  choiceText: { color: "#111827", fontWeight: "600" },
  choiceTextActive: { color: "#0B1324" },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnGhost: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  btnGhostText: { color: "#0F172A", fontWeight: "700" },
  btnPrimary: {
    backgroundColor: "#0B1324",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  btnPrimaryText: { color: "#FFFFFF", fontWeight: "700" },
});
