"use client";

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
import { MockAdapter } from "@/chat/mock-adapter";
import type { ChatMessage } from "@/chat/types";

export default function ChatBotScreen() {
  const router = useRouter();

  // Seed messages that resemble the mock
  const initialMessages = useMemo<ChatMessage[]>(
    () => [
      {
        id: "m1",
        role: "assistant",
        content: "Since Yesterday",
        createdAt: Date.now() - 600000,
      },
      {
        id: "m2",
        role: "user",
        content: "Since how long you wanted to loose weight",
        createdAt: Date.now() - 590000,
      },
      {
        id: "m3",
        role: "assistant",
        content: "From last 3 Months",
        createdAt: Date.now() - 580000,
      },
      {
        id: "m4",
        role: "assistant",
        content: "Doctor, i feel weak and do not feel to eat.",
        createdAt: Date.now() - 570000,
      },
      {
        id: "m5",
        role: "user",
        content: "Ok and what else?",
        createdAt: Date.now() - 560000,
      },
      {
        id: "m6",
        role: "assistant",
        content: "Doctor, i feel weak and do not feel to eat.",
        createdAt: Date.now() - 550000,
      },
      {
        id: "m7",
        role: "user",
        content: "Ok and what else?",
        createdAt: Date.now() - 540000,
      },
    ],
    []
  );

  // Pluggable adapter — swap MockAdapter with your real provider later
  const { messages, isSending, send, setMessages } = useChat(
    new MockAdapter(),
    {
      initialMessages,
    }
  );

  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    // Auto scroll to end when messages change
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const onSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    setInput("");
    await send(text);
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
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
          <Text style={isUser ? styles.userText : styles.botText}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
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
          <Text style={styles.title}>Medi_Chat</Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      {/* Thread */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Composer */}
      <View style={styles.composer}>
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

  composer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
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
