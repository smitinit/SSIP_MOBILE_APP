import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NHeader } from "@/ui/header";
import { NCard } from "@/ui/card";
import { palette, spacing } from "@/design/tokens";
import { Ionicons } from "@expo/vector-icons";

type Notice = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

const DATA: Notice[] = [
  {
    id: "1",
    title: "Meal logged",
    body: "You added Breakfast: Oatmeal and Berries.",
    time: "2m ago",
    unread: true,
    icon: "fast-food",
  },
  {
    id: "2",
    title: "Goal reminder",
    body: "Drink 2 more cups of water today.",
    time: "1h ago",
    icon: "water",
  },
  {
    id: "3",
    title: "Coach message",
    body: "Your plan was updated for next week.",
    time: "Yesterday",
    icon: "chatbubbles",
  },
];

export default function NotificationsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <NHeader
        title="Notifications"
        subtitle="Latest activity from your assistant"
      />
      <NCard style={{ padding: 0, alignSelf: "stretch" }}>
        {DATA.map((n, idx) => (
          <View
            key={n.id}
            style={[styles.item, idx !== DATA.length - 1 && styles.itemBorder]}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={n.icon} size={16} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, n.unread && styles.unread]}>
                {n.title}
              </Text>
              <Text style={styles.body}>{n.body}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>
            {n.unread ? <View style={styles.dot} /> : null}
          </View>
        ))}
      </NCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: spacing.xl,
    backgroundColor: palette.bg,
    gap: spacing.md,
    alignItems: "stretch",
    flex: 1,
  },
  item: {
    flexDirection: "row",
    gap: 12,
    padding: spacing.md,
    alignItems: "flex-start",
  },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: "#EEF2F7" },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontWeight: "700", color: palette.text },
  unread: { color: "#111827" },
  body: { color: "#475569", marginTop: 2 },
  time: { color: "#94A3B8", fontSize: 12, marginTop: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.accent,
    marginLeft: 8,
    marginTop: 6,
  },
});
