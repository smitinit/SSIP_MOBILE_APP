"use client";

import { useMemo, useState } from "react";
import { View, Text, StyleSheet, type LayoutChangeEvent } from "react-native";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

type Props = {
  step?: number; // 1-indexed
  total?: number;
  showLabel?: boolean;
  animate?: boolean;
};

export function Progress({
  step = 1,
  total = 4,
  showLabel = true,
  animate = true,
}: Props) {
  const ratio = Math.max(0, Math.min(1, step / total));
  const percent = Math.round(ratio * 100);
  const [trackWidth, setTrackWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) =>
    setTrackWidth(e.nativeEvent.layout.width);

  const targetWidth = useMemo(
    () => (trackWidth > 0 ? trackWidth * ratio : 0),
    [trackWidth, ratio]
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.track} onLayout={onLayout} />
      {animate && trackWidth > 0 ? (
        <MotiView
          style={[styles.bar, { width: targetWidth }]}
          from={{ width: 0 }}
          animate={{ width: targetWidth }}
          transition={{
            type: "timing",
            duration: 500,
            easing: Easing.out(Easing.cubic),
          }}
        />
      ) : (
        <View style={[styles.bar, { width: `${percent}%` }]} />
      )}
      {showLabel && (
        <Text style={styles.text}>
          {"Progress Step "}
          {step}
          {" of "}
          {total}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 12, marginBottom: 12 },
  track: { height: 6, backgroundColor: "#EEF2FF", borderRadius: 999 },
  bar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 6,
    backgroundColor: "#111827",
    borderRadius: 999,
  },
  text: { marginTop: 6, fontSize: 12, color: "#111827" },
});
