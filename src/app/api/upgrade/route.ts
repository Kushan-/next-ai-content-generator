// /api/upgrade
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm';
import { premiumUser, stripeCustomer } from '@/lib/schema'
import { insertPremiumUser, upgradeToPaid, premiumUserExit, stripeCustomerExist, getPremiumUserOnClearkId } from "@/lib/dbUtils";
import moment from "moment";
import { Result } from "postcss";
import { STRIPE_WEBHOOK_ENPOINT_KEY } from "../../../../utils/envConfig";
import { STRIPE_PASS_KEY } from "../../../../utils/envConfig";

import { ENV_PROD_SUCCESS_URL } from "../../../../utils/envConfig"
import { ENV_PROD_CANCEL_URL } from "../../../../utils/envConfig"
import { ENV_DEV_SUCCESS_URL } from "../../../../utils/envConfig"
import { ENV_DEV_CANCEL_URL } from "../../../../utils/envConfig"

interface PREMIUMUSERDATA {
    id: string
    userId: string
    email: string
    userName: string
    active: boolean
    joinDate: string
    plan: string
    totalCredit: number
    stripeCustomerId: string,
}

// console.log("stripe pass key", process.env.STRIPE_PASS_KEY, STRIPE_PASS_KEY)
const stripe = new Stripe(STRIPE_PASS_KEY as string, {
    apiVersion: '2024-06-20'
})

export const POST = async (req: NextRequest) => {
    const basePath = req.nextUrl.basePath
    const pathname = req.nextUrl.pathname
    const hostname = req.nextUrl.hostname
    const protocol = req.nextUrl.protocol
    const port = req.nextUrl.port

    // console.info("basePath - > ", req.nextUrl.basePath)
    // console.info("pathname - > ", req.nextUrl.pathname)
    // console.info("hostname - > ", req.nextUrl.hostname)
    // console.info("protocol - > ", req.nextUrl.protocol)

    try {
        const { userId } = auth();
        const user = await currentUser()
        if (!userId) {
            return new NextResponse('Unauthorised', { status: 401 })
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: "10000 AI Credit",
                        description: "$9.99/Month",
                    },
                    unit_amount: 1000,
                },
            },
        ];
        const data = await req.json()
        const { date } = data
        const emailAddress = user?.primaryEmailAddress?.emailAddress
        const fullName = user?.fullName

        // console.log("--- Email Address ->", emailAddress)
        const premiumUserCheck = await premiumUserExit(userId)
        if (premiumUserCheck) {
            const premiumUserData: any = await getPremiumUserOnClearkId(userId)
            const customer = await stripe.customers.create({
                email: emailAddress
            })
            console.log("--------customer-------------")
            console.log("customer->", customer)
            console.log("--------customer-------------")

            // return Response.json({ dbResult })



            const env = process.env.NODE_ENV
            let env_success_url, env_cancel_url
            if (env === "development") {
                env_success_url = `${protocol}//${hostname}:${port}/dashboard`
                env_cancel_url = `${protocol}//${hostname}:${port}/`
            }
            else if (env === "production") {
                env_success_url = `${protocol}//${hostname}/dashboard`
                env_cancel_url = `${protocol}//${hostname}/`
                // env_success_url = ENV_PROD_SUCCESS_URL //`http://ai-content-generator.vercel.app/dashboard/`
                // env_cancel_url = ENV_PROD_CANCEL_URL //`http://ai-content-generator.vercel.app/`
            }
            console.info("env_success_url->", env_success_url)
            console.info("env_cancel_url->", env_cancel_url)
            console.log(customer.id)
            const session = await stripe.checkout.sessions.create({
                customer: customer.id,
                line_items,
                mode: "payment",
                success_url: env_success_url,
                cancel_url: env_cancel_url,
                metadata: {
                    userId: userId,
                },
            });

            // console.log(session)


            const customerId = session.customer
            console.log("customerId->",customerId)
            const createAt = moment().format('YYYY/MM/DD')
            const getTotalRemainingCredits = await getPremiumUserOnClearkId(userId)
            let dbResultSuccess=false
            if(getTotalRemainingCredits.length>0){
                // @ts-ignore
                const dbResult =  await upgradeToPaid(userId, getTotalRemainingCredits[0].totalCredit, customerId, createAt, "free", "false", null)
                console.log(dbResult)
                dbResultSuccess = true
                //return NextResponse.json({ url: session.url, result: dbResult });
            }
            return NextResponse.json({ url: session.url, result:  dbResultSuccess});
            
            // await upgradeToPaid
            // const dbResult = await insertPremiumUser(userId, session.customer_email, customerId, createAt, "free", 10000)
            // const dbResult = await insertPremiumUser(userId, emailAddress, customerId, fullName, createAt)
            // console.info('upgradeToPaid->', dbResult)
            
        }

        return NextResponse.json({ premiumUser: premiumUserCheck });


    } catch (error) {
        console.error(error)
        return NextResponse.json({ err: error });

    }
}


export const GET = async (req: NextRequest) => {
    return NextResponse.json({ greetings: "Hell-O from nextjs!" });
}