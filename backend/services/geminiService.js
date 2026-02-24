import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Reverting to gemini-1.5-flash which is a known stable version.
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Standardized categories to match database/assets exactly
const categories = [
  "Gastroenterologist",
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist"
];

/**
 * Step 1: Classify the user message into a health category (Internal Logic)
 */
const classifyMessage = async (userMessage) => {
  const classificationPrompt = `
    You are a medical classifier. 
    Analyze the user's message and return ONLY a JSON object.
    
    1. Determine if the question is health-related.
    2. If NOT health-related, return: {"isHealthQuestion": false}
    3. If health-related, categorize into EXACTLY ONE of these specialties: ${categories.join(", ")}.
    4. If unsure, default to "General physician".
    
    Format: {"isHealthQuestion": true, "detectedCategory": "categoryName"}
  `;

  try {
    const result = await model.generateContent([classificationPrompt, userMessage]);
    const response = await result.response;
    const text = response.text().trim();
    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Classification Error:", error);
    return { isHealthQuestion: true, detectedCategory: "General physician" }; // Fallback
  }
};

/**
 * Step 2: Generate professional, detailed advice (User Output)
 */
const generateDetailedAdvice = async (userMessage) => {
  const generationPrompt = `
    You are a professional AI Health Assistant integrated into a Doctor Appointment Booking System.
    When a user asks a health-related question, your response must be:
    
    1. Detailed but easy to understand.
    2. Structured and visually organized.
    3. Reassuring and professional in tone.
    4. Informative but NOT diagnostic.
    5. Safe (no prescriptions, no dosage, no medical certainty).
    
    Response Formatting Rules:
    - Start with a short empathetic opening sentence.
    - Clearly explain possible common causes in simple language.
    - Add a section titled: "🔎 Possible Reasons" (Use bullet points with brief explanations.)
    - Add a section titled: "💡 What You Can Do" (Safe general advice only.)
    - Add a section titled: "⚠️ When to See a Doctor" (Mention warning signs.)
    - End with the disclaimer: "This is AI-generated advice and not a substitute for professional medical consultation."
    
    Tone: Calm, Supportive, Professional, Clear.
    Safety: Never prescribe medication or dosage. If symptoms suggest emergency (chest pain, stroke signs, breathing difficulty), advise immediate medical care.
    
    Keep the answer comprehensive but not overly long. Clean spacing between sections.
    Do NOT use markdown code blocks. Do NOT output JSON. Return only formatted readable text.
  `;

  try {
    const result = await model.generateContent([generationPrompt, userMessage]);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Generation Error:", error);
    return "I apologize, but I'm having trouble processing clinical advice right now. Please consult a doctor for any health concerns.";
  }
};

export const processChatMessage = async (userMessage) => {
  try {
    // 1. Classify for system logic (categories, etc.)
    const classification = await classifyMessage(userMessage);

    if (!classification.isHealthQuestion) {
      return {
        isHealthQuestion: false,
        reply: "I am a health assistant chatbot and can only answer medical or health-related questions."
      };
    }

    // 2. Generate detailed advice for user display
    const adviceText = await generateDetailedAdvice(userMessage);

    return {
      isHealthQuestion: true,
      detectedCategory: classification.detectedCategory,
      advice: adviceText,
      disclaimer: "This is AI-generated advice and not a substitute for professional medical consultation."
    };
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error("Failed to process message with Gemini AI");
  }
};
