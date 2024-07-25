// const {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
// } = require("@google/generative-ai");

import { GoogleGenerativeAI } from "@google/generative-ai";
import {NEXT_GEMINI_API_KEY} from "./envConfig"

// console.log(process.env.NEXT_GEMINI_API_KEY)
// const apiKey = process.env.NEXT_GEMINI_API_KEY;
// console.log(apiKey, process.env.NEXT_GEMINI_API_KEY)
// console.log(typeof(apiKey))
const genAI = new GoogleGenerativeAI(NEXT_GEMINI_API_KEY);

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

// fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA_O6NueMCSwXCTb14-DlV2_rPFgi5qTYA`,{
//     method:'POST',
//     body:JSON.stringify({"contents":[{"parts":[{"text":"Explain how AI works"}]}]}),
//     headers:{'Content-Type': 'application/json'},
// }).then(data=>{console.log(data)}).catch(err=>err)

export const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
    ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());


