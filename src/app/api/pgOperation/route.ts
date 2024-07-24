// /api/postGresOperation
import { NextRequest, NextResponse} from "next/server"

import { db } from '../../../lib/db'
import { aiOutputSchema } from '../../../lib/schema'
import { eq } from 'drizzle-orm';
import { auth, currentUser } from "@clerk/nextjs/server"
// import { premiumUserExit, stripeCustomerExist } from "@/lib/dbUtils";

export const PUT = async (req: NextRequest) => {
    const {userId, } = auth()
    const user=await currentUser();

    console.log("userId ->", userId)
    console.log('user->', currentUser())
    if(!userId){
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const data = await req.json()
    if (data.params === "dbInertion" && userId) {
     console.log("--->>> email not from params ==== ",user?.primaryEmailAddress?.emailAddress)
     console.log(user?.fullName)   
        
        const { formData, templateSlug, aiResponse, createdBy, createdAt } = data
        console.log("formData->", formData)
        // console.log(aiContentPayload)
        const createNewInsertion = await db.insert(aiOutputSchema).values({
            userId:userId,
            formData: JSON.stringify(formData),
            templateSlug: templateSlug,
            aiResponse: aiResponse,
            createdBy: createdBy,
            createdAt: createdAt
        })

        return NextResponse.json( createNewInsertion, { status: 200 })

    }else{
        return NextResponse.json({
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
    const {userId} = auth()
    const user=await currentUser();
    console.log("userId ->", userId)
    console.log('user->', currentUser)
    if(!userId){
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // insertAiContent(req)
    if (data.params === "creditUsageTracker" || data.params === "userHistoryContent") {
        const { email, params } = data

        console.log('email->>>>>', email)
        const result = await db.select()
            .from(aiOutputSchema)
            .where(eq(aiOutputSchema.createdBy, email))
        console.log(typeof(result))
        console.log(result)
        return NextResponse.json(result)
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