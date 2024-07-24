// /api/upgrade
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm';
import { premiumUser, stripeCustomer } from '@/lib/schema'



console.log(process.env.STRIPE_PASS_KEY)
const stripe = new Stripe(process.env.STRIPE_PASS_KEY as string, {
    apiVersion: '2024-06-20'
})

export const premiumUserExit = async (userId: string) => {
    const result = await db.select()
        .from(premiumUser)
        .where(eq(premiumUser.userId, userId))

    if (result) {
        return true
    } else {
        return false
    }
}

export const stripeCustomerExist = async (userId: string) => {
    const result = await db.select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.stripeCustomerId, userId))

    if (result) {
        return true
    } else {
        return false
    }
}

export const PUT = async (req: NextRequest) => {
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
                        name: "10,000 AI Credit",
                        description: "all $10 worth of credit",
                    },
                    unit_amount: 100000,
                },
            },
        ];
        const data = await req.json()
        const { date, plan } = data
        const emailAddress = user?.primaryEmailAddress?.emailAddress

        // console.log("--- Email Address ->", emailAddress)
        const premiumUserCheck = premiumUserExit(userId)
        if (!premiumUserCheck) {
            const customer = await stripe.customers.create({
                email: emailAddress
            })
            const dbResult = await db.insert(premiumUser).values({
                userId: userId,
                email: emailAddress,
                userName: user?.fullName,
                active: true,
                joinDate: date,
                plan: plan,
                totalCredit: 100000,
                stripeCustomerId: customer.id
            })

            // return Response.json({ dbResult })



            const env = process.env.NODE_ENV
            let env_success_url, env_cancel_url
            if (env == "development") {
                env_success_url = `http://localhost:3000/dashboard`
                env_cancel_url = `http://localhost:3000/`
            }
            else if (env == "production") {
                env_success_url = `http://ai-content-generator.vercel.app/dashboard/`
                env_cancel_url = `http://ai-content-generator.vercel.app/`
            }

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
            return NextResponse.json({ url: session.url });

            // const stripCustomerCheck = stripeCustomerExist(userId)
            // if (!stripCustomerCheck) {
            //     const customer = await stripe.customers.create({
            //         email: emailAddress
            //     })
            //     const dbResult = await db.insert(stripeCustomer).values({
            //         userId: userId,
            //         stripeCustomerId: customer.id
            //     })
        }

        return NextResponse.json({ premiumUser: premiumUserCheck });


    } catch (error) {
        return NextResponse.json({ err: error });

    }
}


export const GET = async (req: NextRequest) => {
    return NextResponse.json({ greetings: "Hell-O from nextjs!" });
}