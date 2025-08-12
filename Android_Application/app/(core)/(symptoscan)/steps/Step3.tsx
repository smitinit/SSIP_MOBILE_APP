import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  type LayoutChangeEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { useSymptoms } from "../../../context/symptom-context";
import { DIET_OPTIONS, EXERCISE_OPTIONS, SLEEP_OPTIONS } from "./data/options";

export default function Lifestyle() {
  const router = useRouter();
  const { lifestyle, updateLifestyle, demographics, updateDemographics } =
    useSymptoms();

  // Simple slider measurements
  const trackWidth = useRef(1);
  const [dragX, setDragX] = useState<number | null>(null);

  const setStressByX = (x: number) => {
    const val = Math.max(0, Math.min(1, x / trackWidth.current));
    updateLifestyle("stress", Math.round(val * 100));
  };

  const onTrackLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  const knobLeft = `${lifestyle.stress}%`;

  const cycle = (arr: string[], current: string | null) => {
    if (!current) return arr[0];
    const idx = arr.findIndex((x) => x === current);
    return arr[(idx + 1) % arr.length];
  };

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
          <View style={[styles.progressBar, { width: "75%" }]} />
          <Text style={styles.progressText}>Progress Step 3 of 4</Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 6 }]}>
          Lifestyle Factors
        </Text>

        <View style={styles.grid2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Exercise Frequency</Text>
            <Pressable
              onPress={() =>
                updateLifestyle(
                  "exerciseFrequency",
                  cycle(EXERCISE_OPTIONS, lifestyle.exerciseFrequency)
                )
              }
              style={({ pressed }) => [
                styles.selector,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Text style={styles.selectorText}>
                {lifestyle.exerciseFrequency ?? "Select exercise frequency"}
              </Text>
              <Text style={styles.selectorChevron}>▾</Text>
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Sleep Quality</Text>
            <Pressable
              onPress={() =>
                updateLifestyle(
                  "sleepQuality",
                  cycle(SLEEP_OPTIONS, lifestyle.sleepQuality)
                )
              }
              style={({ pressed }) => [
                styles.selector,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Text style={styles.selectorText}>
                {lifestyle.sleepQuality ?? "Select sleep quality"}
              </Text>
              <Text style={styles.selectorChevron}>▾</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Stress Level</Text>
          <View
            style={styles.track}
            onLayout={onTrackLayout}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => {
              setDragX(e.nativeEvent.locationX);
              setStressByX(e.nativeEvent.locationX);
            }}
            onResponderMove={(e) => {
              setDragX(e.nativeEvent.locationX);
              setStressByX(e.nativeEvent.locationX);
            }}
            onResponderRelease={() => setDragX(null)}
          >
            <View style={[styles.knob, { left: knobLeft }]} />
          </View>
          <View style={styles.trackLabels}>
            <Text style={styles.trackLabelText}>Low</Text>
            <Text style={styles.trackLabelText}>Moderate</Text>
            <Text style={styles.trackLabelText}>High</Text>
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          <Text style={styles.label}>Diet</Text>
          <Pressable
            onPress={() =>
              updateLifestyle("diet", cycle(DIET_OPTIONS, lifestyle.diet))
            }
            style={({ pressed }) => [
              styles.selector,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.selectorText}>
              {lifestyle.diet ?? "Select a diet"}
            </Text>
            <Text style={styles.selectorChevron}>▾</Text>
          </Pressable>
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
          <Text style={styles.label}>Recent Life Changes</Text>
          <TextInput
            multiline
            value={lifestyle.recentChanges}
            onChangeText={(t) => updateLifestyle("recentChanges", t)}
            placeholder="Describe any recent changes (e.g., travel, new job, moved homes)..."
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
            onPress={() => {
              router.push("/(core)/(symptoscan)/steps/Step4");
            }}
            style={({ pressed }) => [
              styles.btnPrimary,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.btnPrimaryText}>Analyze Symptoms</Text>
          </Pressable>
        </View>
      </MotiView>
    </ScrollView>
  );
}

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
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  label: { color: "#0F172A", fontWeight: "700", marginBottom: 6 },
  selector: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: { color: "#111827", fontWeight: "600", flexShrink: 1 },
  selectorChevron: { color: "#6B7280", fontSize: 16, marginLeft: 12 },
  grid2: { flexDirection: "row", gap: 16, marginTop: 8 },
  track: {
    height: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  knob: {
    position: "absolute",
    top: -6,
    marginLeft: -10, // center the knob
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#6D28D9",
  },
  trackLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  trackLabelText: { color: "#6B7280", fontSize: 12 },
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
