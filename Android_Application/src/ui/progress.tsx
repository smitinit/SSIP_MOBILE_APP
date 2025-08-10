import { StyleSheet, View } from "react-native"
import { palette, radii } from "@/design/tokens"

export function NProgress({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <View style={styles.track}>
      <View style={[styles.bar, { width: `${clamped}%` }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: radii.pill, backgroundColor: "#EEF2F7", overflow: "hidden" },
  bar: { height: "100%", backgroundColor: palette.primary },
})
