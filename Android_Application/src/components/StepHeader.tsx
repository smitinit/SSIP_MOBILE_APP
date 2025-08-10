import { radii, spacing } from "@/design/tokens";
import type React from "react";
import { StyleSheet, Text, View } from "react-native";

export function StepHeader({
  icon,
  barColor = "#3B82F6",
  step = 1,
  total = 4,
  title,
}: {
  icon: React.ReactNode;
  barColor?: string;
  step?: number;
  total?: number;
  title: string;
}) {
  return (
    <View>
      {/* Thin progress, subtle track */}
      <View style={styles.track}>
        <View
          style={[
            styles.bar,
            { width: `${(step / total) * 100}%`, backgroundColor: barColor },
          ]}
        />
      </View>

      {/* Icon + step counter */}
      <View style={styles.row}>
        <View style={styles.iconChip}>{icon}</View>
        <Text
          style={{ color: barColor, fontWeight: "800", fontSize: 18 }}
        >{`${step}/${total}`}</Text>
      </View>

      {/* Question heading */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: "#E9EEF5",
    overflow: "hidden",
    marginTop: 8,
    marginBottom: spacing.lg,
  },
  bar: {
    height: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24, // increased space between progress bar and row
    marginBottom: 6, // increased space between progress bar and row
  },
  iconChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    fontWeight: "800",
    fontSize: 40, // slightly larger to match mockup
  },
  title: {
    marginTop: 16, // extra gap between icon row and title
    fontSize: 20, // larger text for better hierarchy
    fontWeight: "800",
    color: "#111827",
    lineHeight: 28, // improves readability
  },
});
