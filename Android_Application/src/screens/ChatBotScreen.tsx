// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//   FlatList,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { palette, spacing } from "@/design/tokens";
// import { useChat } from "@/hooks/use-chat";
// import { RestAdapter } from "@/chat/rest-adaptor";
// import type { ChatMessage } from "@/chat/types";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function ChatBotScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();

//   // Seed messages
//   const initialMessages = useMemo<ChatMessage[]>(
//     () => [
//       {
//         id: "m1",
//         role: "assistant",
//         content: {
//           response: "Hello there!",
//           question: "I am your health assistant. How can I help you today?",
//           type: "text",
//         },
//         createdAt: Date.now() - 600000,
//       },
//     ],
//     []
//   );

//   // Chat hook
//   const { messages, isSending, send } = useChat(new RestAdapter(), {
//     initialMessages,
//   });

//   const [input, setInput] = useState("");
//   const listRef = useRef<FlatList<ChatMessage>>(null);

//   useEffect(() => {
//     listRef.current?.scrollToEnd({ animated: true });
//   }, [messages.length]);

//   const onSend = async () => {
//     const text = input.trim();
//     if (!text || isSending) return;
//     setInput("");
//     await send(text);
//   };

//   const renderItem = ({ item }: { item: ChatMessage }) => {
//     const isUser = item.role === "user";
//     return (
//       <View
//         style={[
//           styles.bubbleWrap,
//           isUser ? styles.bubbleRight : styles.bubbleLeft,
//         ]}
//       >
//         <View
//           style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
//         >
//           <Text style={isUser ? styles.userText : styles.botText}>
//             Respose :{item.content.response}
//             {item.content.question
//               ? `Question :${item.content.question}`
//               : null}
//             {item.content.type}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.root}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.select({
//         ios: insets.top + 8,
//         android: insets.bottom + 10,
//         default: 0,
//       })}
//     >
//       {/* Header */}
//       <View style={styles.header}>
//         <Pressable
//           onPress={() => router.back()}
//           style={styles.backBtn}
//           hitSlop={10}
//           android_ripple={{ color: "rgba(0,0,0,0.06)" }}
//         >
//           <Ionicons name="chevron-back" size={22} color="#111827" />
//         </Pressable>

//         <View style={styles.titleWrap}>
//           <Image
//             source={require("../../assets/images/nutrizy-logo.png")}
//             style={styles.avatar}
//           />
//           <Text style={styles.title}>Rose Deckow</Text>
//         </View>

//         <View style={{ width: 36 }} />
//       </View>

//       {/* Thread */}
//       <FlatList
//         ref={listRef}
//         data={messages}
//         keyExtractor={(m) => m.id}
//         renderItem={renderItem}
//         contentContainerStyle={[
//           styles.listContent,
//           { paddingBottom: insets.bottom + 72 },
//         ]}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       />

//       {/* Composer */}
//       <View
//         style={[
//           styles.composer,
//           { paddingBottom: Math.max(spacing.md, insets.bottom) },
//         ]}
//       >
//         <View style={styles.composerInner}>
//           <View style={styles.leadingIcon}>
//             <Ionicons name="create-outline" size={18} color={palette.primary} />
//           </View>
//           <TextInput
//             style={styles.input}
//             placeholder="Write a message"
//             placeholderTextColor="#94A3B8"
//             value={input}
//             onChangeText={setInput}
//             editable={!isSending}
//             onSubmitEditing={onSend}
//             returnKeyType="send"
//           />
//           <Pressable
//             onPress={onSend}
//             disabled={isSending}
//             style={({ pressed }) => [
//               styles.sendBtn,
//               pressed &&
//                 Platform.select({
//                   ios: { opacity: 0.85 },
//                   default: { opacity: 0.9 },
//                 }),
//             ]}
//           >
//             <Ionicons name="send" size={18} color="#fff" />
//           </Pressable>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const BLUE = "#6EA8FE";

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: "#F5F7FB" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: spacing.xl,
//     paddingTop: spacing.lg,
//     paddingBottom: spacing.md,
//     backgroundColor: "#FFFFFF",
//     borderBottomColor: "#E7EBF3",
//     borderBottomWidth: 1,
//   },
//   backBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   titleWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
//   avatar: { width: 28, height: 28, borderRadius: 14 },
//   title: { fontSize: 16, fontWeight: "800", color: "#111827" },

//   listContent: {
//     paddingHorizontal: spacing.xl,
//     paddingVertical: spacing.md,
//     gap: 10,
//   },

//   bubbleWrap: { flexDirection: "row" },
//   bubbleLeft: { justifyContent: "flex-start" },
//   bubbleRight: { justifyContent: "flex-end" },
//   bubble: {
//     maxWidth: "78%",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 16,
//   },
//   botBubble: {
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#EEF2F7",
//     borderBottomLeftRadius: 8,
//   },
//   userBubble: {
//     backgroundColor: BLUE,
//     borderBottomRightRadius: 8,
//   },
//   botText: { color: "#111827" },
//   userText: { color: "#fff" },

//   composer: {
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: spacing.xl,
//     borderTopWidth: 1,
//     borderTopColor: "#E7EBF3",
//   },
//   composerInner: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 28,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     paddingLeft: 44,
//     paddingRight: 8,
//     height: 52,
//   },
//   leadingIcon: {
//     position: "absolute",
//     left: 10,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "rgba(79, 70, 229, 0.06)",
//     borderWidth: 1,
//     borderColor: "rgba(79, 70, 229, 0.25)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   input: {
//     flex: 1,
//     color: "#111827",
//   },
//   sendBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: palette.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { palette, spacing } from "@/design/tokens";
import { useChat } from "@/hooks/use-chat";
import { RestAdapter } from "@/chat/rest-adaptor";
import type { ChatMessage } from "@/chat/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatBotScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Seed messages
  const initialMessages = useMemo<ChatMessage[]>(
    () => [
      {
        id: "m1",
        role: "assistant",
        content: {
          response: "Hello there!",
          question: "I am your health assistant. How can I help you today?",
          type: "text",
        },
        createdAt: Date.now() - 600000,
      },
    ],
    []
  );

  // Chat hook
  const { messages, isSending, send } = useChat(new RestAdapter(), {
    initialMessages,
  });

  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const onSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    setInput("");
    await send(text);
  };

  // Normalize the type names we might receive
  const normalizeType = (t?: string) => {
    const type = (t || "").toLowerCase().trim();
    if (type === "yes/no" || type === "yes-no" || type === "boolean")
      return "yes-no";
    if (type === "4options" || type === "likert-4" || type === "agree-4")
      return "likert-4";
    return "text";
  };

  const markAnswered = (id: string) =>
    setAnsweredIds((prev) => new Set(prev).add(id));

  const handleQuickReply = async (messageId: string, value: string) => {
    if (isSending) return;
    markAnswered(messageId);
    await send(value);
  };

  const QuickReplies = ({ item }: { item: ChatMessage }) => {
    const t = normalizeType((item as any).content?.type);
    const isAssistant = item.role === "assistant";
    if (!isAssistant) return null;
    if (answeredIds.has(item.id)) return null;

    if (t === "yes-no") {
      const options = ["Yes", "No"];
      return (
        <View accessibilityRole="menu" style={styles.quickWrap}>
          {options.map((opt) => (
            <Pressable
              key={opt}
              accessibilityRole="button"
              accessibilityLabel={`Choose ${opt}`}
              onPress={() => handleQuickReply(item.id, opt)}
              disabled={isSending}
              android_ripple={{ color: "rgba(0,0,0,0.06)" }}
              style={({ pressed }) => [
                styles.chip,
                pressed &&
                  Platform.select({ ios: { opacity: 0.9 }, default: {} }),
              ]}
            >
              <Text style={styles.chipText}>{opt}</Text>
            </Pressable>
          ))}
        </View>
      );
    }

    if (t === "likert-4") {
      const options = [
        "Strongly agree",
        "Agree",
        "Disagree",
        "Strongly disagree",
      ];
      return (
        <View accessibilityRole="menu" style={styles.quickWrap}>
          {options.map((opt) => (
            <Pressable
              key={opt}
              accessibilityRole="button"
              accessibilityLabel={`Choose ${opt}`}
              onPress={() => handleQuickReply(item.id, opt)}
              disabled={isSending}
              android_ripple={{ color: "rgba(0,0,0,0.06)" }}
              style={({ pressed }) => [
                styles.chip,
                styles.chipWide,
                pressed &&
                  Platform.select({ ios: { opacity: 0.9 }, default: {} }),
              ]}
            >
              <Text numberOfLines={1} style={styles.chipText}>
                {opt}
              </Text>
            </Pressable>
          ))}
        </View>
      );
    }

    return null;
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    const content = (item as any).content ?? {};
    const typeBadge = normalizeType(content.type);

    return (
      <View
        style={[
          styles.bubbleWrap,
          isUser ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
        >
          {/* Improved content layout */}
          {!isUser && typeBadge !== "text" ? (
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {typeBadge === "yes-no"
                  ? "Yes / No"
                  : typeBadge === "likert-4"
                  ? "4-point scale"
                  : typeBadge}
              </Text>
            </View>
          ) : null}

          {content.response ? (
            <Text
              style={[
                isUser ? styles.userText : styles.botText,
                styles.responseText,
              ]}
            >
              {content.response}
            </Text>
          ) : null}

          {content.question ? (
            <Text
              style={[
                isUser ? styles.userText : styles.botText,
                styles.questionText,
              ]}
            >
              {content.question}
            </Text>
          ) : null}

          {/* Render quick replies below content for assistant messages */}
          {!isUser ? <QuickReplies item={item} /> : null}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({
        ios: insets.top + 8,
        android: insets.bottom + 10,
        default: 0,
      })}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={10}
          android_ripple={{ color: "rgba(0,0,0,0.06)" }}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>

        <View style={styles.titleWrap}>
          <Image
            source={require("../../assets/images/nutrizy-logo.png")}
            style={styles.avatar}
          />
          <Text style={styles.title}>Medi-Chat</Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      {/* Thread */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 72 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* Composer */}
      <View
        style={[
          styles.composer,
          { paddingBottom: Math.max(spacing.md, insets.bottom) },
        ]}
      >
        <View style={styles.composerInner}>
          <View style={styles.leadingIcon}>
            <Ionicons name="create-outline" size={18} color={palette.primary} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Write a message"
            placeholderTextColor="#94A3B8"
            value={input}
            onChangeText={setInput}
            editable={!isSending}
            onSubmitEditing={onSend}
            returnKeyType="send"
          />

          <Pressable
            onPress={onSend}
            disabled={isSending}
            style={({ pressed }) => [
              styles.sendBtn,
              pressed &&
                Platform.select({
                  ios: { opacity: 0.85 },
                  default: { opacity: 0.9 },
                }),
            ]}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const BLUE = "#6EA8FE";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F7FB" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E7EBF3",
    borderBottomWidth: 1,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  titleWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 28, height: 28, borderRadius: 14 },
  title: { fontSize: 16, fontWeight: "800", color: "#111827" },

  listContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: 10,
  },

  bubbleWrap: { flexDirection: "row" },
  bubbleLeft: { justifyContent: "flex-start" },
  bubbleRight: { justifyContent: "flex-end" },

  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 6,
  },

  botBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    borderBottomLeftRadius: 8,
  },

  userBubble: {
    backgroundColor: BLUE,
    borderBottomRightRadius: 8,
  },

  botText: { color: "#111827" },
  userText: { color: "#fff" },

  responseText: {
    fontSize: 15,
    lineHeight: 20,
  },

  questionText: {
    marginTop: 2,
    opacity: 0.85,
    fontStyle: "italic",
  },

  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  typeBadgeText: {
    fontSize: 11,
    color: "#334155",
    fontWeight: "600",
  },

  quickWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  chipWide: {
    maxWidth: "100%",
  },

  chipText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
  },

  composer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: "#E7EBF3",
  },

  composerInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingLeft: 44,
    paddingRight: 8,
    height: 52,
  },

  leadingIcon: {
    position: "absolute",
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(79, 70, 229, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,
    color: "#111827",
  },

  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
