import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { IconProps } from "@expo/vector-icons/build/createIconSet";
import type { ComponentProps } from "react";

// Medium size icons for the tab bar
export function TabBarIcon({
  style,
  ...rest
}: IconProps<ComponentProps<typeof MaterialCommunityIcons>["name"]>) {
  return (
    <MaterialCommunityIcons
      size={24}
      style={[{ marginBottom: -2 }, style]}
      {...rest}
    />
  );
}
