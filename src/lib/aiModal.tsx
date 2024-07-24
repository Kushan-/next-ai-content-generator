import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_GEMINI_API_KEY;
444
const genAI = new GoogleGenerativeAI(`AIzaSyA_O6NueMCSwXCTb14-DlV2_rPFgi5qTYA`);
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


