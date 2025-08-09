import { Platform } from "react-native";

export const palette = {
  primary: "#34C759",
  primaryDark: "#2FAA4A",
  accent: "#FF8A34",
  bg: "#F6F8FA",
  card: "#FFFFFF",
  text: "#0F172A",
  textMuted: "#64748B",
  border: "#E2E8F0",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  pill: 999,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
};

export const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  default: { elevation: 6 },
});

export const typography = {
  title: { fontSize: 28, fontWeight: "700" as const, color: palette.text },
  subtitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: palette.textMuted,
  },
  body: { fontSize: 16, color: palette.text },
  caption: { fontSize: 12, color: palette.textMuted },
};
