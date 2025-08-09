import type { PropsWithChildren } from "react"
import { StyleSheet, View, type ViewProps } from "react-native"
import { palette, radii, spacing, shadow } from "@/design/tokens"

export function NCard({ style, children, ...rest }: PropsWithChildren<ViewProps>) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderColor: palette.border,
    borderWidth: 1,
    ...shadow,
  },
})
