// /api/postGresOperation
import { NextRequest, NextResponse} from "next/server"

import { db } from './db'
import { aiOutputSchema } from './schema'
import { eq } from 'drizzle-orm';


export const PUT = async (req: NextRequest) => {
    // console.log(req.json())
    console.log("======in put req==================")
    const data = await req.json()
    console.log("params->", data.params)
    console.log(data)
    if (data.params === "dbInertion" ) {
        
        const { formData, templateSlug, aiResponse, createdBy, createdAt } = data
        console.log("formData->", formData)
        // console.log(aiContentPayload)
        const dbResult = await db.insert(aiOutputSchema).values({
            formData: JSON.stringify(formData),
            templateSlug: templateSlug,
            aiResponse: aiResponse,
            createdBy: createdBy,
            createdAt: createdAt
        })

        return Response.json({ dbResult })

    }else{
        return Response.json({
            error:`No params found for ${data.params} method ${req.method}`
        })

    }

}

export const POST = async (req: NextRequest) => {
    // console.log(req.json())
    const data = await req.json()
    console.log("===================")
    console.log(data.params)
    console.log("===================")

    // insertAiContent(req)
    if (data.params === "creditUsageTracker" || data.params === "userHistoryContent") {
        const { email, params } = data

        console.log('email->>>>>', email)
        const result = await db.select()
            .from(aiOutputSchema)
            .where(eq(aiOutputSchema.createdBy, email))
        // console.log(result)
        // let total = 0
        // result.forEach(ele => {
        //     total += ele.aiResponse?.length
        // })
        // console.log(total)


        return NextResponse.json({ 'userEnteries': result })
    }else{
        return Response.json({
            error:`No params found for ${data.params} method ${req.method}`
        })
    }

}

export const GET = async (req: NextRequest) => {
    console.log(req.body)
    return Response.json({ message: 'Hello from Next.js!' })
}