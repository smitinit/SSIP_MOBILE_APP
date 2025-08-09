import { Pressable, StyleSheet, Text, View } from "react-native"
import { palette, radii, spacing } from "@/design/tokens"
import { Ionicons } from "@expo/vector-icons"

interface Props {
  label: string
  value: boolean
  onChange: (next: boolean) => void
}

export function NCheckbox({ label, value, onChange }: Props) {
  return (
    <Pressable onPress={() => onChange(!value)} style={styles.row}>
      <View style={[styles.box, value && styles.boxChecked]}>
        {value ? <Ionicons name="checkmark" size={18} color="#fff" /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingVertical: spacing.xs },
  box: {
    width: 24,
    height: 24,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  boxChecked: { backgroundColor: palette.primary, borderColor: palette.primary },
  label: { color: palette.text, fontSize: 16 },
})
