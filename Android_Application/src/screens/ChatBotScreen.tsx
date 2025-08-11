import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
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

// Framer Motion-style animations for React Native
import { MotiView } from "moti";

function TypingIndicator() {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const makeAnim = (val: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(val, {
          toValue: -6,
          duration: 280,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(val, {
          toValue: 0,
          duration: 280,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

  const animations = dots.map((v, idx) => makeAnim(v, idx * 120));
  useEffect(() => {
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View
      style={styles.typingWrap}
      accessibilityRole="text"
      accessibilityLabel="Assistant is typing"
      accessibilityLiveRegion="polite"
    >
      {dots.map((val, i) => (
        <Animated.View
          key={i}
          style={[
            styles.typingDot,
            {
              transform: [{ translateY: val }],
            },
          ]}
        />
      ))}
    </View>
  );
}

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
  }, [messages.length, isSending]);

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
    if (type === "typing") return "typing";
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
        <MotiView
          from={{ opacity: 0, translateY: 6 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 200 }}
          accessibilityRole="menu"
          style={styles.quickWrap}
        >
          {options.map((opt, idx) => (
            <MotiView
              key={opt}
              from={{ opacity: 0, translateY: 6, scale: 0.98 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "timing", duration: 220, delay: idx * 40 }}
            >
              <Pressable
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
            </MotiView>
          ))}
        </MotiView>
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
        <MotiView
          from={{ opacity: 0, translateY: 6 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 200 }}
          accessibilityRole="menu"
          style={styles.quickWrap}
        >
          {options.map((opt, idx) => (
            <MotiView
              key={opt}
              from={{ opacity: 0, translateY: 6, scale: 0.98 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "timing", duration: 220, delay: idx * 40 }}
              style={styles.chipWide}
            >
              <Pressable
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
                <Text numberOfLines={1} style={styles.chipText}>
                  {opt}
                </Text>
              </Pressable>
            </MotiView>
          ))}
        </MotiView>
      );
    }

    return null;
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ChatMessage;
    index: number;
  }) => {
    const isUser = item.role === "user";
    const content: any = (item as any).content ?? {};
    const typeBadge = normalizeType(content.type);

    // Typing bubble (assistant)
    if (!isUser && typeBadge === "typing") {
      return (
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 220 }}
          style={[styles.bubbleWrap, styles.bubbleLeft]}
        >
          <View style={[styles.bubble, styles.botBubble]}>
            <TypingIndicator />
          </View>
        </MotiView>
      );
    }

    return (
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 240 }}
        style={[
          styles.bubbleWrap,
          isUser ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
        >
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

          {!isUser ? <QuickReplies item={item} /> : null}
        </View>
      </MotiView>
    );
  };

  // Append a temporary "typing" message when the assistant is thinking
  const dataWithTyping = useMemo(() => {
    if (!isSending) return messages;
    const typingMessage: ChatMessage = {
      id: "typing",
      role: "assistant",
      content: { type: "typing" } as any,
      createdAt: Date.now(),
    };
    return [...messages, typingMessage];
  }, [isSending, messages]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({
        ios: insets.top + 8,
        android: insets.bottom + 30,
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
        data={dataWithTyping}
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
              isSending && styles.sendBtnDisabled,
              pressed &&
                Platform.select({
                  ios: { opacity: 0.85 },
                  default: { opacity: 0.9 },
                }),
            ]}
            accessibilityRole="button"
            accessibilityLabel={isSending ? "Sending..." : "Send"}
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
    paddingBottom: 100, // Add enough padding so last messages don't get hidden behind input
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  userBubble: {
    backgroundColor: BLUE,
    borderBottomRightRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },

  botText: { color: "#111827" },
  userText: { color: "#fff" },

  responseText: { fontSize: 15, lineHeight: 22 },

  questionText: { marginTop: 2, opacity: 0.85, fontStyle: "italic" },

  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  typeBadgeText: { fontSize: 11, color: "#334155", fontWeight: "600" },

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

  chipWide: { maxWidth: "100%" },

  chipText: { color: "#111827", fontSize: 13, fontWeight: "600" },

  composer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: Math.max(spacing.md, 0), // keep safe area
    backgroundColor: "transparent", // make sure background is transparent
    // optionally add a little shadow or blur for better visibility
  },

  composerInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // semi-transparent white background for floating effect
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
    backgroundColor: "transparent", // make TextInput transparent
  },

  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  sendBtnDisabled: { opacity: 0.6 },

  // Typing indicator
  typingWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    paddingVertical: 2,
  },

  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#94A3B8",
  },
});
