import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { palette, radii } from "@/design/tokens";

export function Segmented({
  segments = ["Left", "Right"],
  onChange,
}: {
  segments?: string[];
  onChange?: (i: number) => void;
}) {
  const [index, setIndex] = useState(0);
  return (
    <View style={styles.wrap}>
      {segments.map((s, i) => {
        const active = i === index;
        return (
          <Pressable
            key={s}
            onPress={() => {
              setIndex(i);
              onChange?.(i);
            }}
            style={[styles.item, active && styles.itemActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {s}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    padding: 4,
    borderRadius: radii.pill,
    alignSelf: "flex-start",
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
  },
  itemActive: { backgroundColor: "#fff" },
  label: { color: "#475569", fontWeight: "600" },
  labelActive: { color: palette.text, fontWeight: "700" },
});
