export type ChatRole = "user" | "assistant" | "system"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: chatReply
  createdAt: number
}

export type sendChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: number
}

export type chatReply = {
  response: string;
  question: string | null;
  type: "text" | "yes/no" | "4options" | null;
}

export interface ChatAdapter {
  /**
   * Send the full message list to your model/backend and return the assistant reply text.
   * Replace this with your real provider (OpenAI, Grok, your API, etc.).
   */
  send(messages: ChatMessage[], opts?: { signal?: AbortSignal }): Promise<chatReply>
}
