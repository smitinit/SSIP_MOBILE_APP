import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NHeader } from "@/ui/header";
import { NCard } from "@/ui/card";
import { NProgress } from "@/ui/progress";
import { palette, spacing, typography } from "@/design/tokens";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <NHeader title="Dashboard" subtitle="Overview of today’s metrics" />

      {/* Macros */}
      <NCard style={{ gap: spacing.md, alignSelf: "stretch" }}>
        <Text style={styles.sectionTitle}>Macros</Text>
        <View style={styles.row}>
          <Metric
            label="Calories"
            value="1,240 / 2,000"
            icon="flame"
            progress={62}
          />
          <Metric label="Protein" value="58 / 90g" icon="leaf" progress={64} />
        </View>
        <View style={styles.row}>
          <Metric label="Carbs" value="140 / 250g" icon="pizza" progress={56} />
          <Metric label="Fats" value="40 / 70g" icon="water" progress={57} />
        </View>
      </NCard>

      {/* Activity - stacked full width */}
      <NCard style={{ gap: spacing.sm, alignSelf: "stretch" }}>
        <Text style={styles.sectionTitle}>Hydration</Text>
        <Text style={styles.kpi}>4/8 cups</Text>
        <NProgress value={50} />
      </NCard>
      <NCard style={{ gap: spacing.sm, alignSelf: "stretch" }}>
        <Text style={styles.sectionTitle}>Steps</Text>
        <Text style={styles.kpi}>6,432</Text>
        <NProgress value={64} />
      </NCard>

      {/* Sleep */}
      <NCard style={{ gap: spacing.sm, alignSelf: "stretch" }}>
        <Text style={styles.sectionTitle}>Sleep</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="moon" size={18} color={palette.primary} />
          <Text style={{ color: palette.text }}>7h 12m</Text>
        </View>
        <NProgress value={72} />
      </NCard>
    </ScrollView>
  );
}

function Metric({
  label,
  value,
  icon,
  progress,
}: {
  label: string;
  value: string;
  icon: any;
  progress: number;
}) {
  return (
    <View style={styles.metric}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Ionicons name={icon} size={16} color={palette.primary} />
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <NProgress value={progress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: spacing.xl,
    backgroundColor: palette.bg,
    gap: spacing.lg,
    alignItems: "stretch",
  },
  sectionTitle: { ...typography.subtitle, color: palette.text },
  row: { flexDirection: "row", gap: spacing.sm },
  metric: {
    flex: 1,
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
  },
  metricLabel: { color: palette.textMuted, fontSize: 12 },
  metricValue: { color: palette.text, fontWeight: "700" },
  kpi: { fontSize: 22, fontWeight: "700", color: palette.text },
});
