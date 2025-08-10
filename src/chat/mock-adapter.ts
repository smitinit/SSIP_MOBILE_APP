import type { ChatAdapter, ChatMessage } from "./types"

const FALLBACKS = [
  "Thanks for sharing. Could you describe any other symptoms?",
  "I understand. How long have you noticed this?",
  "Ok and what else?",
  "Got it. Do you feel any dizziness or nausea?",
]

export const MockAdapter: ChatAdapter =  {
  async send(messages: ChatMessage[]): Promise<string> {
    // Very simple mock: alternate canned responses or echo last user line.
    const last = [...messages].reverse().find((m) => m.role === "user")
    const t = last?.content ?? ""
    const idx = Math.min(messages.length % FALLBACKS.length, FALLBACKS.length - 1)

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 600))
    if (t.length > 0 && t.length < 16) {
      return `You said: "${t}". Can you tell me more?`
    }
    return FALLBACKS[idx]
  }
}
