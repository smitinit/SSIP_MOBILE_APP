import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { palette } from "@/design/tokens";
import { useGlobalModal } from "../../context/modal-provider";

type Route = {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap | string;
};

type BottomBarClassicProps = {
  state: {
    index: number;
    routes: Route[];
  };
  navigation: {
    navigate: (tabKey: string) => void;
  };
};

const CENTER_BLUE = "#4F46E5";

export default function BottomBarClassic({
  state,
  navigation,
}: BottomBarClassicProps) {
  const { index, routes } = state;
  const { open } = useGlobalModal();

  const left = routes.slice(0, 2);
  const right = routes.slice(2);

  const renderItem = (route: Route) => {
    const realIndex = routes.findIndex((r) => r.key === route.key);
    const isFocused = realIndex === index;
    const color = isFocused ? palette.primary : "#9CA3AF";

    const onPress = (e: GestureResponderEvent) => {
      e.preventDefault();
      navigation.navigate(route.key);
    };

    const showGreenDot = realIndex === routes.length - 1;

    // If focused, use the filled icon (remove "-outline")
    const iconName = isFocused
      ? (route.icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap)
      : (route.icon as keyof typeof Ionicons.glyphMap);

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        style={styles.item}
        android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: true }}
      >
        <View style={styles.iconWrap}>
          <Ionicons name={iconName} size={22} color={color} />
          {showGreenDot && <View style={styles.dot} />}
        </View>
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {route.title}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Left items */}
      <View style={styles.sideGroup}>{left.map(renderItem)}</View>

      {/* Center "+" button */}
      <Pressable
        onPress={open}
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
      <View style={styles.sideGroup}>{right.map(renderItem)}</View>
    </View>
  );
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
