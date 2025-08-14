import { Text, Pressable, StyleSheet, View, Dimensions } from "react-native";
import { Modal } from "react-native-paper";
import { MotiView, MotiText } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

interface DialogOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

export default function Dialog({
  visible,
  onClose,
  title = "Choose an Option",
  subtitle = "Select one of the options below to continue",
  options = [],
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  options?: DialogOption[];
}) {
  const defaultOptions: DialogOption[] = [
    {
      id: "SymptoScan",
      title: "Symptom Checker",
      subtitle: "Scan & analyse symptoms with AI",
      icon: "medkit", // medical-style icon
      color: "#10B981",
      onPress: () => {
        router.replace("/(core)/(symptoscan)/SymptoScan");
        onClose();
      },
    },
    {
      id: "CalTrack",
      title: "Meal Calorie Tracker",
      subtitle: "Scan meals & get full nutrition info",
      icon: "fast-food", // food-style icon
      color: "#F59E0B",
      onPress: () => {
        router.push("/(core)/(caltrack)/Caltrack");
        onClose();
      },
    },
    {
      id: "document",
      title: "Upload Document",
      subtitle: "Select a file to upload",
      icon: "document-text",
      color: "#F59E0B",
      onPress: () => {
        console.log("Document selected");
        onClose();
      },
    },
    {
      id: "link",
      title: "Add Link",
      subtitle: "Paste or enter a URL",
      icon: "link",
      color: "#8B5CF6",
      onPress: () => {
        console.log("Link selected");
        onClose();
      },
    },
  ];

  const modalOptions = options.length > 0 ? options : defaultOptions;

  return (
    // <Portal>
    <Modal
      visible={visible}
      onDismiss={onClose}
      contentContainerStyle={styles.modalContainer}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <MotiView
          from={{
            opacity: 0,
            scale: 0.8,
            translateY: 50,
            shadowOpacity: 0,
            // elevation: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            translateY: 0,
            shadowOpacity: 0.25,
            // elevation: 10,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
          style={[
            styles.modal,
            {
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 10,
              },
              shadowRadius: 20,
            },
          ]}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 200 }}
            style={styles.closeButton}
          >
            <Pressable
              onPress={onClose}
              style={styles.closeButtonInner}
              android_ripple={{ color: "#EF444420", radius: 20 }}
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </Pressable>
          </MotiView>

          {/* Header */}
          <View style={styles.header}>
            <MotiText
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 100 }}
              style={styles.title}
            >
              {title}
            </MotiText>
            <MotiText
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 150 }}
              style={styles.subtitle}
            >
              {subtitle}
            </MotiText>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {modalOptions.map((option, index) => (
              <MotiView
                key={option.id}
                from={{ opacity: 0, translateX: -50 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{
                  delay: 200 + index * 50,
                  type: "spring",
                  damping: 15,
                  stiffness: 250,
                }}
              >
                <Pressable
                  style={[styles.option, { borderLeftColor: option.color }]}
                  onPress={option.onPress}
                  android_ripple={{ color: option.color + "20" }}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: option.color + "15" },
                    ]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={option.color}
                    />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    {option.subtitle && (
                      <Text style={styles.optionSubtitle}>
                        {option.subtitle}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </Pressable>
              </MotiView>
            ))}
          </View>
        </MotiView>
      </Pressable>
    </Modal>
    // </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: width - 40,
    maxWidth: 400,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  closeButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  optionsContainer: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
    backgroundColor: "transparent",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 16,
  },
});
