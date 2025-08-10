import type { ChatAdapter, chatReply, ChatMessage } from "./types"
import { BACKEND_URL } from "./config"

export class RestAdapter implements ChatAdapter {
  constructor(private baseUrl: string = BACKEND_URL) {}

  async send(messages: ChatMessage[]): Promise<chatReply> {
    const res = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    })

    if (!res.ok) {
      throw new Error(res.statusText)
    }
    const data = (await res.json())
    console.log("data-reply", data?.reply);
    
    return data?.reply as chatReply ?? ""
  }
}
