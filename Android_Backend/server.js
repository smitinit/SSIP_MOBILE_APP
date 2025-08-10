import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "1mb" }));

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SYSTEM_PROMPT =
  "You are a medical assistant and the user may ask you questions about their health or mental health or weight loss or health diets or anything related to health. If the questions are not related to health or mental health or weight loss or health diets or anything related to health, you should respond with 'I am sorry, Please ask a question related to health'.";

app.get("/", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

app.post("/chat", async (req, res) => {
  try {
    const { message, messages } = req.body ?? {};

    if (!message && !Array.isArray(messages)) {
      return res
        .status(400)
        .json({ error: "Provide { message } or { messages }" });
    }

    // Convert our app roles to Gemini roles
    const toGemini = (m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content ?? "") }],
    });

    const historyFromClient = Array.isArray(messages)
      ? messages.map(toGemini)
      : [];
    const lastUserMessage =
      typeof message === "string"
        ? message
        : (messages ?? [])
            .slice()
            .reverse()
            .find((m) => m.role === "user")?.content ?? "";

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        ...historyFromClient.slice(-20), // keep recent context
      ],
      generationConfig: {
        maxOutputTokens: 256,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(String(lastUserMessage || "").trim());
    const replyText = result.response.text();

    res.json({ reply: replyText });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
