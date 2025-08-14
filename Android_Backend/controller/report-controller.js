import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { reportPrompt, ReportSchema } from "../configurations.js";

dotenv.config();

export const generateReport = async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({ error: "Missing 'data' in request body." });
    }
    // console.log("The data that came from the front end:", data);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const finalPrompt = `${reportPrompt}\n\nUser Data: ${JSON.stringify(data)}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: finalPrompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 7000,
        temperature: 0.5,
        responseMimeType: "application/json",
        responseSchema: ReportSchema,
      },
    });

    const rawReply = await result.response.text();
    // console.log("rawReply:", rawReply);

    const parsedReply = JSON.parse(rawReply);
    // console.log("parsedReply:", parsedReply);

    res.status(200).json(parsedReply);
  } catch (e) {
    console.error("Error generating report:", e);

    res.status(500).json({
      error: "Failed to generate report",
      errorMessage: e.message,
    });
  }
};
