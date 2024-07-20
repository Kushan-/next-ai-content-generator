// /api/postGresOperation
import { NextRequest } from "next/server"

import { db } from './db'
import { aiOutputSchema } from './schema'

export const POST = async (req: NextRequest) => {
    // console.log(req.json())
    if (req.nextUrl.pathname === "/api/postGresOperation") {
        // insertAiContent(req)

        console.log("basePAth->", req.nextUrl.basePath)
        console.log(" PAthNAme->", req.nextUrl.pathname)
        const { formData, templateSlug, aiResponse, createdBy, createdAt } = await req.json()
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

    }
}

export const GET = async (req: NextRequest) => {
    console.log(req.body)
    return Response.json({ message: 'Hello from Next.js!' })
}