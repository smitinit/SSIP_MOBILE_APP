import { Pressable, StyleSheet, View, Modal, Text } from "react-native";
import { AnimatePresence, MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { palette, spacing } from "@/design/tokens";

interface ActionModalProps {
  show: boolean;
  handleClose: () => void;
}

export default function ActionModal({ show, handleClose }: ActionModalProps) {
  return (
    <Modal transparent visible={show} animationType="none">
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <AnimatePresence>
          {show && (
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 30 }}
              transition={{ type: "timing", duration: 300 }}
              style={styles.modalContent}
            >
              <Pressable
                style={{ flex: 1 }}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.content}>
                  <Text style={styles.subtitle}>Choose what to do</Text>
                  <View style={styles.grid}>
                    {[
                      ["person-add-outline", "New Client"],
                      ["calendar-outline", "New Appointment"],
                      ["receipt-outline", "Create Invoice"],
                      ["fast-food-outline", "Log Meal"],
                      ["water-outline", "Log Water"],
                      ["moon-outline", "Log Sleep"],
                    ].map(([icon, label], idx) => (
                      <Action
                        key={idx}
                        icon={icon as keyof typeof Ionicons.glyphMap}
                        label={label}
                        onPress={handleClose}
                      />
                    ))}
                  </View>
                </View>
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </Pressable>
    </Modal>
  );
}

function Action({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.action}
      android_ripple={{ color: "rgba(0,0,0,0.06)" }}
    >
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={20} color={palette.primary} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#fff",
    padding: 20,
  },
  content: {
    paddingBottom: spacing.md,
  },
  subtitle: {
    color: "#475569",
    marginBottom: spacing.md,
    fontSize: 16,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  action: {
    width: "48%",
    height: 82,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: "center",
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionLabel: {
    color: palette.text,
    fontWeight: "700",
    fontSize: 12,
  },
});
