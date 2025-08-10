import type { ChatAdapter, ChatMessage } from "./types"
import { BACKEND_URL } from "./config"

export class RestAdapter implements ChatAdapter {
  constructor(private baseUrl: string = BACKEND_URL) {}

  async send(messages: ChatMessage[]): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(text || "Chat API error")
    }

    const data = (await res.json()) as { reply?: string }
    return data?.reply ?? ""
  }
}
