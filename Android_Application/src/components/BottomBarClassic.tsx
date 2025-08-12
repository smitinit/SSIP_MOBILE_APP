"use client";

import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { palette } from "@/design/tokens";
import ActionModal from "@/components/ActionModal";

const CENTER_BLUE = "#4F46E5";

export default function BottomBarClassic({
  state,
  descriptors,
  navigation,
}: any) {
  const routes: any[] = state.routes ?? [];
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!open) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const left = routes.slice(0, 2);
  const right = routes.slice(2);

  const renderItem = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === routes.indexOf(route);

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = () => {
      navigation.emit({ type: "tabLongPress", target: route.key });
    };

    const ACTIVE = palette.primary;
    const INACTIVE = "#9CA3AF";
    const color = isFocused ? ACTIVE : INACTIVE;

    const icon =
      typeof options.tabBarIcon === "function"
        ? options.tabBarIcon({ focused: isFocused, color, size: 22 })
        : defaultIconForRoute(route.name, color);

    const showGreenDot = index === routes.length - 1;

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.item}
        android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: true }}
      >
        <View style={styles.iconWrap}>
          {icon}
          {showGreenDot ? <View style={styles.dot} /> : null}
        </View>
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {/* Left items */}
        <View style={styles.sideGroup}>
          {left.map((r, i) => renderItem(r, i))}
        </View>

        {/* Center "+" button */}
        <Pressable
          // onPress={handleOpen}
          style={({ pressed }) => [
            styles.centerBtn,
            pressed &&
              Platform.select({
                android: { opacity: 0.85 },
                default: { transform: [{ scale: 0.96 }] },
              }),
          ]}
        >
          <View style={styles.centerHalo} />
          <View style={styles.centerInner}>
            <Ionicons name="add" size={22} color={CENTER_BLUE} />
          </View>
        </Pressable>

        {/* Right items */}
        <View style={styles.sideGroup}>
          {right.map((r, i) => renderItem(r, left.length + i))}
        </View>
      </View>

      {/* Action Modal */}
      <ActionModal show={open} handleClose={handleClose} />
    </>
  );
}

function defaultIconForRoute(name: string, color: string) {
  const lower = name.toLowerCase();
  if (
    lower.includes("home") ||
    lower === "index" ||
    lower.includes("assistant")
  ) {
    return <Ionicons name="home-outline" size={22} color={color} />;
  }
  if (lower.includes("dashboard") || lower.includes("analytics")) {
    return <Ionicons name="stats-chart-outline" size={22} color={color} />;
  }
  if (lower.includes("notifications")) {
    return <Ionicons name="notifications-outline" size={22} color={color} />;
  }
  if (lower.includes("settings")) {
    return <Ionicons name="settings-outline" size={22} color={color} />;
  }
  return <Ionicons name="ellipse-outline" size={22} color={color} />;
}

const BAR_BG = "#FFFFFF";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: BAR_BG,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    paddingBottom: 10 + (Platform.OS === "ios" ? 8 : 0),
  },
  sideGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "space-evenly",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    gap: 2,
  },
  iconWrap: {
    position: "relative",
    height: 24,
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
  },
  centerBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  centerHalo: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(79, 70, 229, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.25)",
  },
  centerInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: CENTER_BLUE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dot: {
    position: "absolute",
    right: -4,
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.primary,
  },
});
