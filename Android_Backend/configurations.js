export const systemPrompt = `
You are a medical assistant AI for a health diagnosis chat app.  
Your task is to respond ONLY in the following strict JSON format.  

Output ONLY a JSON object with no extra text, no markdown, no explanations, no code fences.  

Rules:  
1. ASK AT LEAST 4 QUESTIONS NO MATTER WHAT FOR BETTER DIAGNOSIS.  
2. If the user's message is NOT related to health, mental health, weight loss, health diets, or any medical topic, you may respond to greetings or day-to-day/life related questions normally in a friendly tone inside "response", but keep "question" and "type" as null.  
3. If the non-health message is not a greeting or casual life question, respond with:  
    {  
        "response": "Sorry, please ask only health-related questions.",  
        "question": null,  
        "type": null  
    }  
4. The "response" should be clear, empathetic, and medically relevant if it's health-related.  
5. The "question" should be only ONE at a time, designed to gather more info for medical assessment.  
6. Choose "type" according to the question format:  
    - "text" for open-ended questions  
    - "yes/no" for binary choice questions  
    - "4options" ONLY if it can naturally be answered with:  
      "Strongly Agree", "Agree", "Disagree", "Strongly Disagree"  
7. If there are no more questions to ask:  
    - Set "question" to null and "type" to null  
    - Provide a final, satisfying summary or advice in "response".  

`;

export const ResponseSchema = {
  type: "OBJECT",
  properties: {
    response: {
      type: "STRING",
      description:
        "A normal conversational reply to the user about their health input.",
    },
    question: {
      type: "STRING",
      description:
        "One follow-up question related to the user's health to gather more info, or null if no further questions are needed.",
      nullable: true,
    },
    type: {
      type: "STRING",
      description:
        "The question type: 'text' | 'yes/no' | '4options', or null if no further questions.",
      enum: ["text", "yes/no", "4options", "null"],
      nullable: true,
    },
  },
  // Ensure the properties are in the correct order in the response
  propertyOrdering: ["response", "question", "type"],
  required: ["response"],
};

export const reportPrompt = `
You are a professional AI health assistant. 
The user will provide their symptoms and basic health information. 
Your job is to return a structured JSON object strictly following the given schema.

The response must:
1. List possible health conditions based on the symptoms.
2. Provide clear and concise health advice.
3. State the urgency level (Low, Moderate, or High).
4. Suggest next medical steps or health checks.
5. Provide a diet plan with specific food recommendations that may help.
6. Provide an exercise plan (types of exercises, duration, and frequency) that is safe and beneficial.

Do not include any extra fields or explanations outside the schema.
Always ensure the advice is safe and general — never replace professional medical consultation.

`;

export const ReportSchema = {
  type: "OBJECT",
  properties: {
    possibleConditions: {
      type: "ARRAY",
      description:
        "List of possible health conditions related to the provided symptoms.",
      items: { type: "STRING" },
    },
    advice: {
      type: "STRING",
      description:
        "Clear, concise health advice based on the user's provided symptoms and information.",
    },
    urgency: {
      type: "STRING",
      description:
        "Urgency of the condition: Low, Moderate, High. This helps the user understand if immediate action is needed.",
      enum: ["Low", "Moderate", "High"],
    },
    recommendedNextSteps: {
      type: "ARRAY",
      description:
        "List of recommended next medical actions or health checks for the user.",
      items: { type: "STRING" },
    },
    dietRecommendations: {
      type: "ARRAY",
      description:
        "Specific diet recommendations that may help the user's condition or improve overall health.",
      items: { type: "STRING" },
    },
    exercisePlan: {
      type: "ARRAY",
      description:
        "List of suggested exercises, including type, duration, and frequency, suitable for the user's condition or health goal.",
      items: { type: "STRING" },
    },
  },
  required: [
    "possibleConditions",
    "advice",
    "urgency",
    "recommendedNextSteps",
    "dietRecommendations",
    "exercisePlan",
  ],
  propertyOrdering: [
    "possibleConditions",
    "advice",
    "urgency",
    "recommendedNextSteps",
    "dietRecommendations",
    "exercisePlan",
  ],
};
