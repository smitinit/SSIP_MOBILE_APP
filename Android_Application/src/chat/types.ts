export type ChatRole = "user" | "assistant" | "system"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: number
}

export interface ChatAdapter {
  /**
   * Send the full message list to your model/backend and return the assistant reply text.
   * Replace this with your real provider (OpenAI, Grok, your API, etc.).
   */
  send(messages: ChatMessage[], opts?: { signal?: AbortSignal }): Promise<string>
}
