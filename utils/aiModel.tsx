import { GoogleGenerativeAI } from "@google/generative-ai";
import {NEXT_GEMINI_API_KEY} from "./envConfig"

const spiKey :string|undefined = NEXT_GEMINI_API_KEY
/* @ts-ignore */
const genAI = new GoogleGenerativeAI(`${NEXT_GEMINI_API_KEY}`);
console.log(`${NEXT_GEMINI_API_KEY} === AIzaSyA_O6NueMCSwXCTb14-DlV2_rPFgi5qTYA`)

console.log('-------------NEXT_GEMINI_API_KEY---------------------')
console.log(`NEXT_GEMINI_API_KEY->", ${typeof(NEXT_GEMINI_API_KEY)}, ${NEXT_GEMINI_API_KEY}`)
console.log('-------------NEXT_GEMINI_API_KEY---------------------')

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
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
    ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());


