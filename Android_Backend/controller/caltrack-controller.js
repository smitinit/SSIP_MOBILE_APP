import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { nutritionPrompt, NutritionSchema } from "../configurations.js";

dotenv.config();

export const generateCaltrack = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided." });
    }

    const { userInput } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const parts = [
      imagePart,
      { text: userInput || "" },
      { text: nutritionPrompt },
    ];

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts,
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.5,
        responseMimeType: "application/json",
        responseSchema: NutritionSchema,
      },
    });

    const responseJSON = JSON.parse(result.response.text());
    console.log("responseJSON parsed and the DATA IS FUCKING FINALLY SEND");

    res.status(200).json(responseJSON);
  } catch (error) {
    console.error("Error in analyzing Nutritions", error);
    res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
};
