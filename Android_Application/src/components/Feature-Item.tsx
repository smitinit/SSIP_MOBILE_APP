import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView } from "moti";

type Props = {
  index?: number;
  icon?: string;
  title?: string;
  description?: string;
  bubbleColor?: string;
};

export function FeatureItem({
  index = 0,
  icon = "✨",
  title = "Feature title",
  description = "Feature description",
  bubbleColor = "#F1F5F9",
}: Props) {
  const delay = 150 + index * 120;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400, delay }}
      style={styles.row}
    >
      <View style={[styles.iconWrap, { backgroundColor: bubbleColor }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
  },
  textCol: {
    flex: 1,
  },
  title: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  desc: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 13.5,
    lineHeight: 18,
  },
});
