// /api/postGresOperation
import { NextRequest, NextResponse} from "next/server"

import { db } from '../../../lib/db'
import { aiOutputSchema, premiumUser } from '../../../lib/schema'
import { eq } from 'drizzle-orm';
import { auth, currentUser } from "@clerk/nextjs/server"
import { premiumUserExit, insertPremiumUser, updateUserCredit, getPremiumUserOnClearkId} from "@/lib/dbUtils";

import moment from "moment";

export const PUT = async (req: NextRequest) => {
    const {userId,} = auth()
    const user=await currentUser();
    
    // console.log("userId ->", userId)
    console.log('user->',  user)
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

    if(!userId){
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // insertAiContent(req)
    if (data.params === "creditUsageTracker" || data.params === "userHistoryContent") {
        const { email, params } = data

        const result = await db.select()
            .from(aiOutputSchema)
            .where(eq(aiOutputSchema.createdBy, email))
        //console.log(typeof(result))
        //console.log(result)
        return NextResponse.json(result)
    }
    
    if(data.params === "newUser"){
        const {params, userId} = data


        // check to see if user is new or login token expired
        const premiumUserExitCheck = await premiumUserExit(userId)
        // console.log(premiumUserExitCheck)
        if(premiumUserExitCheck){
            const dbResult = await getPremiumUserOnClearkId(userId)
            // console.log(dbResult)
            return NextResponse.json({totalRemainingCredits : dbResult[0].totalCredit, params:"initiate", active:dbResult[0].active, plan:dbResult[0].plan, date:dbResult[0].joinDate })
        }
        else if(premiumUserExitCheck === false){
            const createAt = moment().format('YYYY/MM/DD')
            const dbResult = await insertPremiumUser(userId, null, null, createAt, "free", 10000)
            // console.log(dbResult)
            return NextResponse.json({ totalRemainingCredits: 1000, result : dbResult, params:"initiate"})
        }


        // if not grant 1000 credit with free plan

        
    }

    if(data.params === "updateUserCredits"){
        console.log('credit LEft->', data.totalUserCreditLeft)
        const dbResult = await updateUserCredit(userId, data.totalUserCreditLeft)
        return NextResponse.json({dbResult})
    }

    else{
        return Response.json({
            error:`No params found for ${data.params} method ${req.method}`
        })
    }

}

export const GET = async (req: NextRequest) => {
    console.log(req.body)
    return Response.json({ message: 'Hello from Next.js!' })
}