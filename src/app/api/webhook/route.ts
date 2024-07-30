import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripeCustomerExist, insertStripeCustomer, getPremiumUserOnClearkId } from "@/lib/dbUtils";
import { STRIPE_WEBHOOK_SECRET_KEY } from "../../../../utils/envConfig";
import moment from "moment";
import { insertPremiumUser, upgradeToPaid, getPremiumUserOnStripeCustomerId } from "@/lib/dbUtils";
import { auth, currentUser } from "@clerk/nextjs/server"

console.log("stripe-webhook-secret", STRIPE_WEBHOOK_SECRET_KEY)
const stripe = new Stripe(STRIPE_WEBHOOK_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
});

const getStripeEvents = async (sessionEvent: any) => {
    const email = sessionEvent.billing_details.email
    const amount = sessionEvent.amount
    const recepientEmail = sessionEvent.recepient_email
    const recepientURL = sessionEvent.recepient_url
    const paymentMethodDetails = JSON.stringify(sessionEvent.payment_method_details)
    console.log(paymentMethodDetails)
    const billingDetails = JSON.stringify(sessionEvent.billing_details)
    console.log(billingDetails)
    const recepientCurrency = sessionEvent.currency

}

export const GET = async(req:NextRequest) =>{
    console.log(req.body)
    return NextResponse.json({ message: 'Listening to strip hooks' })
}

export async function POST(req: NextRequest) {
    const body = await req.text();

    const resp = JSON.parse(body)
    console.log(resp)
    const sig = req.headers.get("stripe-signature");
    console.log('sig->', sig, "webhook secret", STRIPE_WEBHOOK_SECRET_KEY)
    let event: Stripe.Event;
    try {
        
        event = stripe.webhooks.constructEvent(
            body,
            sig!,
            `${STRIPE_WEBHOOK_SECRET_KEY}`
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed.", err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
    console.log("event->", event.type)

    // const customerId = customer.id
    const createAt = moment().format('YYYY/MM/DD')
    // const remainingCredits = 0
    try {
        const {userId,} = auth()
        if(event.type === 'checkout.session.completed'){
            const checkoutSession = event.data.object
            console.log("----- checkout session-----")
            console.log(checkoutSession)
            console.log("----- checkout session-----")
        }
        if (event.type === 'customer.created') {

            console.log("---- customer created-----")
            const customerCreated = event.data.object;

            console.log(customerCreated.object)

            // console.log(chargeSucceeded.customer_details)
            const customerCreatedId = customerCreated.id
            const customerEmail = customerCreated.email
            // const userId = customerCreated.metadata.userId
            console.log("--- customerCreated---", userId)
            //userId: string, emailAddress: string | undefined, customerId: string | null, createAt: string, plan:string, totalCredit:number
            //const dbResult = await insertPremiumUser(userId, customerEmail, null, createAt, "free", 10000)
            // console.log(dbResult)
            console.log("---- customer created-----")

        }
        if (event.type === "charge.succeeded") {
            console.log("---- charge succeeded-----")
            const chargeSucceeded = event.data.object;
            console.log(chargeSucceeded)
            console.log(chargeSucceeded.status)
            if (chargeSucceeded.status === 'succeeded') {

                const chargeSucceededId = chargeSucceeded.id
                const chargeSucceededName = chargeSucceeded.billing_details.name
                const chargeSucceededBillingDetails = JSON.stringify(chargeSucceeded.billing_details)
                const customerId = chargeSucceeded.customer
                //const customerEmail = chargeSucceeded.email

                const metadataUserId = chargeSucceeded.metadata.userId
                console.log(metadataUserId)
                // @ts-ignore
                const getPremiumUserCredit = await getPremiumUserOnStripeCustomerId(customerId)
                if (getPremiumUserCredit.length > 0) {
                    const remainingCredits = getPremiumUserCredit[0].totalCredit
                    const stripeDbResult = await insertStripeCustomer(chargeSucceededId, chargeSucceededBillingDetails, "card", createAt)
                    console.log(stripeDbResult)
                    // @ts-ignore
                    const result = getPremiumUserOnStripeCustomerId(customerId)
                    // @ts-ignore
                    console.log(result[0])
                    // @ts-ignore
                    const premiumDbResult = await upgradeToPaid(result[0].userId, remainingCredits + 100000, chargeSucceededId, createAt, "basic", true, chargeSucceededName)
                    console.log(premiumDbResult)
                } else {
                    console.error(getPremiumUserCredit)
                }

            } else {
                console.warn(`chargeSucceeded.status ${chargeSucceeded.status} && ${chargeSucceeded.paid}`)
            }
            console.log("---- charge succeeded-----")


        }
        // console.log("event--->>>>>,", event)
        return NextResponse.json({ status: 200, event: event.type });

    } catch (err) {
        console.log("------------err-----------")
        console.error(err)
        return NextResponse.json({ error: err }, { status: 400 });
        // console.log("------------err-----------")
    }

}