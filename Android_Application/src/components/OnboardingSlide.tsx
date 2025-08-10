import type React from "react";

import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import { palette, spacing, typography } from "@/design/tokens";

type Props = {
  image: ImageSourcePropType;
  headline: string;
  body?: string;
  index: number;
  total: number;
  nextHref?: string;
  skipHref?: string;
  children?: React.ReactNode; // For custom CTA on the last slide
};

export default function OnboardingSlide({
  image,
  headline,
  body,
  index,
  total,
  nextHref,
  skipHref,
  children,
}: Props) {
  const router = useRouter();
  const dots = Array.from({ length: total }, (_, i) => i);

  return (
    <View style={styles.root}>
      {/* Brand header */}
      <View style={styles.header}>
        <Text style={styles.brand}>
          {"Nutri"}
          <Text style={styles.brandAccent}>{"zy"}</Text>
        </Text>
      </View>

      {/* Illustration */}
      <Image source={image} resizeMode="cover" style={styles.hero} />

      {/* Copy */}
      <View style={styles.copy}>
        <Text style={styles.headline}>{headline}</Text>
        {body ? <Text style={styles.body}>{body}</Text> : null}
      </View>

      {/* Pager + actions */}
      <View style={styles.footer}>
        {/* Skip */}
        {skipHref ? (
          <Pressable
            onPress={() => router.replace(skipHref as RelativePathString)}
            hitSlop={8}
          >
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        ) : (
          <View />
        )}

        {/* Dots */}
        <View style={styles.dots}>
          {dots.map((d) => {
            const active = d === index;
            return (
              <View key={d} style={[styles.dot, active && styles.dotActive]} />
            );
          })}
        </View>

        {/* Next or custom children */}
        {children ? (
          <View style={{ width: 70 }} /> // spacer to balance layout when using custom CTAs below
        ) : nextHref ? (
          <Pressable
            onPress={() => router.replace(nextHref as RelativePathString)}
            style={styles.nextBtn}
            hitSlop={8}
          >
            <Text style={styles.nextText}>Next</Text>
          </Pressable>
        ) : (
          <View style={{ width: 70 }} />
        )}
      </View>

      {/* Custom CTA area (e.g., last slide) */}
      {children ? <View style={styles.customCta}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  brand: { fontWeight: "800", fontSize: 20, color: "#111827" },
  brandAccent: { color: palette.primary },
  hero: { width: "100%", height: 280, backgroundColor: "#F1F5F9" },
  copy: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  headline: { ...typography.title, color: palette.text, marginBottom: 6 },
  body: { color: "#475569", fontSize: 14 },
  footer: {
    marginTop: "auto",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skip: { color: "#6B7280", fontSize: 14 },
  dots: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#E2E8F0" },
  dotActive: { backgroundColor: palette.primary },
  nextBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  nextText: { color: "#fff", fontWeight: "700" },
  customCta: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
});
