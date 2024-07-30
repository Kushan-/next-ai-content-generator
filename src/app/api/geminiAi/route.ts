import { NextRequest, NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { NEXT_GEMINI_API_KEY } from "../../../../utils/envConfig"

export const POST = async (req: NextRequest) => {
    const data = await req.json()
    console.log("===================")
    console.log(data)
    console.log(`NEXT_GEMINI_API_KEY = ${NEXT_GEMINI_API_KEY}`)
    const generateResponseOn = data.contentPayload
    const genAI = new GoogleGenerativeAI(`${NEXT_GEMINI_API_KEY}`);

    console.log("===================")
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


    const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [
        ],
    });

    try{
        const result = await chatSession.sendMessage(generateResponseOn);

        // console.log(result.response.text())
        return NextResponse.json({success:true, aIresponse:result.response.text()}) 
    }catch(err){
        return NextResponse.json({error : err})
        
    }
    

}