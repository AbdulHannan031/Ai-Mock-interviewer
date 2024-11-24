// src/GeminiAPI.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey="yourapikey"
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

/**
 * Function to get a response from Gemini by passing the prompt
 * @param {string} prompt - The prompt to be sent to the Gemini model
 * @returns {Promise<Object>} - The JSON response from Gemini
 */
export async function getGeminiResponse(prompt) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    return result.response;
  } catch (error) {
    console.error("Error in getGeminiResponse:", error);
    throw error;
  }
}
