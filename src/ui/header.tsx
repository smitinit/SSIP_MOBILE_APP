import { StyleSheet, Text, View, type ViewProps } from "react-native"
import { palette, spacing, typography } from "@/design/tokens"

interface Props extends ViewProps {
  title: string
  subtitle?: string
  center?: boolean
}

export function NHeader({ title, subtitle, center, style, ...rest }: Props) {
  return (
    <View style={[styles.container, center && { alignItems: "center" }, style]} {...rest}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs, marginBottom: spacing.lg },
  title: { ...typography.title },
  subtitle: { ...typography.subtitle, color: palette.textMuted },
})
