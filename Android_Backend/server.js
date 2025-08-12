import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResponseSchema, systemPrompt } from "./configurations.js";
import reportRoutes from "./routes/report-routes.js";

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
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
});

const SYSTEM_PROMPT = systemPrompt;

const responseSchema = ResponseSchema;

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: "Provide { messages }" });
    }

    const toGemini = (m) => {
      const text = m.content.response ? JSON.stringify(m.content) : m.content;
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text }],
      };
    };

    let historyFromClient = Array.isArray(messages)
      ? messages.map(toGemini)
      : [];

    const lastUserMessage = Array.isArray(messages)
      ? [...messages].reverse().find((m) => m.role === "user")?.content ?? ""
      : typeof messages === "string"
      ? messages
      : "";

    if (historyFromClient.length && historyFromClient[0].role !== "user") {
      historyFromClient = historyFromClient.slice(1);
    }

    const chat = model.startChat({
      systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
      history: historyFromClient.slice(-20),
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.5,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    console.log("lastUserMessage:", lastUserMessage);

    const result = await chat.sendMessage(
      String(lastUserMessage.response || "").trim()
    );

    // console.log("result:", result.response);

    const replyText = await result.response.text();
    console.log("Raw AI reply:", replyText);

    const replyJson = JSON.parse(replyText);
    console.log("replyJson:", replyJson);

    res.json({ reply: replyJson });
  } catch (error) {
    console.log("Error in /chat:", error);
    res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
});

app.use("/api", reportRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
