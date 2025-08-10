import {
  ActivityIndicator,
  type GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from "react-native"
import { palette, radii, spacing } from "@/design/tokens"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "md" | "lg"

interface ButtonProps {
  title: string
  onPress?: (e: GestureResponderEvent) => void
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  style?: ViewStyle
}

export function NButton({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  disabled,
  loading,
  fullWidth,
  style,
}: ButtonProps) {
  const styles = getStyles({ variant, size, fullWidth, disabled })
  return (
    <TouchableOpacity disabled={disabled || loading} onPress={onPress} style={[styles.base, style]}>
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? palette.text : "#fff"} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

function getStyles({
  variant,
  size,
  fullWidth,
  disabled,
}: {
  variant: Variant
  size: Size
  fullWidth?: boolean
  disabled?: boolean
}) {
  const base: ViewStyle = {
    backgroundColor:
      variant === "primary"
        ? palette.primary
        : variant === "secondary"
          ? "#fff"
          : variant === "danger"
            ? palette.danger
            : "transparent",
    borderRadius: radii.lg,
    paddingVertical: size === "lg" ? spacing.md : spacing.sm,
    paddingHorizontal: spacing.xl,
    borderWidth: variant === "secondary" ? 1 : 0,
    borderColor: variant === "secondary" ? palette.border : "transparent",
    alignItems: "center",
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? "100%" : undefined,
  }
  const text = {
    color: variant === "secondary" ? palette.text : "#fff",
    fontSize: size === "lg" ? 16 : 14,
    fontWeight: "700" as const,
  }
  return StyleSheet.create({ base, text })
}
