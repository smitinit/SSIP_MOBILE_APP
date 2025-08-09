import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native"
import { palette, radii, spacing, typography } from "@/design/tokens"

interface NInputProps extends TextInputProps {
  label?: string
  error?: string
}

export function NInput({ label, error, style, ...props }: NInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput placeholderTextColor={palette.textMuted} style={[styles.input, style]} {...props} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  label: { ...typography.caption, marginBottom: spacing.xs },
  input: {
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    color: palette.text,
  },
  error: { color: palette.danger, fontSize: 12, marginTop: spacing.xs },
})
