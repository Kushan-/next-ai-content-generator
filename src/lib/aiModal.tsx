import { GoogleGenerativeAI } from "@google/generative-ai";
import { NEXT_GEMINI_API_KEY } from "../../utils/envConfig";
// const apiKey = process.env.NEXT_GEMINI_API_KEY;
console.log("gemini api key", NEXT_GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(`${NEXT_GEMINI_API_KEY}`);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
});


