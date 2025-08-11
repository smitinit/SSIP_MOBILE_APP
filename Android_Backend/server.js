// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(
//   cors({
//     origin: "*",
//   })
// );
// app.use(express.json({ limit: "1mb" }));

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

// const SYSTEM_PROMPT = `
// You are a medical assistant AI for a health diagnosis chat app.
// Your task is to respond ONLY in the following strict JSON format:

// {
//     "response": "<normal conversational reply to the user about their health input>",
//     "question": "<one follow-up question related to the user’s health to gather more info, or null if no further questions are needed>",
//     "type": "<question type: 'text' | 'yes/no' | '4options', or null if no further questions>"
// }

// INSRUCTION: STRICTLY FOLLOW THE GIVEN JSON FORMAT OUT PUT AND DONT MISS THE BRACKETS
// Rules:
// 1. ASK ATLEAST 4 QUESTIONS NO MATTER WHAT FOR BETTER DIAGNOSIS
// 2. If the user’s message is NOT related to health, mental health, weight loss, health diets, or any medical topic, respond with:
//    {
//        "response": "Sorry, please ask only health-related questions.",
//        "question": null,
//        "type": null
//    }

// 3. The "response" should be clear, empathetic, and medically relevant.
// 4. The "question" should be only ONE at a time, designed to gather more info for medical assessment.
// 5. Choose "type" according to the question format:
//    - "text" for open-ended questions
//    - "yes/no" for binary choice questions
//    - "4options" ONLY if it can naturally be answered with:
//      "Strongly Agree", "Agree", "Disagree", "Strongly Disagree"
// 6. If there are no more questions to ask:
//    - Set "question" to null and "type" to null
//    - Provide a final, satisfying summary or advice in "response"
// 7. Output ONLY the JSON object, no extra text or markdown.
// 8. Ask type: 4question more and frequently
// `;

// app.get("/", (req, res) => {
//   res.json({ message: "Hello from the server!" });
// });

// app.post("/chat", async (req, res) => {
//   try {
//     const { messages } = req.body;
//     if (!messages) {
//       return res.status(400).json({ error: "Provide { messages }" });
//     }
//     console.log("messages", messages);

//     if (!messages && !Array.isArray(messages)) {
//       return res
//         .status(400)
//         .json({ error: "Provide { message } or { messages }" });
//     }

//     const toGemini = (m) => {
//       const text = m.content.response ? JSON.stringify(m.content) : m.content;

//       return {
//         role: m.role === "assistant" ? "model" : "user",
//         parts: [{ text }],
//       };
//     };

//     let historyFromClient = Array.isArray(messages)
//       ? messages.map(toGemini)
//       : [];

//     const lastUserMessage = Array.isArray(messages)
//       ? [...messages].reverse().find((m) => m.role === "user")?.content ?? ""
//       : typeof messages === "string"
//       ? messages
//       : "";

//     if (historyFromClient.length && historyFromClient[0].role !== "user") {
//       historyFromClient = historyFromClient.slice(1);
//     }

//     const chat = model.startChat({
//       systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
//       history: historyFromClient.slice(-20),
//       generationConfig: {
//         maxOutputTokens: 2048,
//         temperature: 0.5,
//       },
//     });
//     console.log("lastUserMessage:", lastUserMessage.response);
//     const result = await chat.sendMessage(
//       String(lastUserMessage.response || "").trim()
//     );
//     console.log(result);

//     let replyText = result.response.text();

//     replyText = replyText.replace(/```json|```/g, "").trim();

//     try {
//       console.log("replyText:", replyText);
//       replyText = JSON.parse(replyText);
//     } catch (e) {
//       console.error("Invalid JSON from Gemini:", replyText);
//       return res.status(500).json({ error: "Invalid AI response format" });
//     }
//     // console.log("replyText:", replyText);

//     res.json({ reply: replyText });
//   } catch (error) {
//     console.error("Error in /chat:", error);
//     res.status(500).json({ error: error?.message || "Internal Server Error" });
//   }
// });

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on http://0.0.0.0:${PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResponseSchema, systemPrompt } from "./configurations.js";

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
