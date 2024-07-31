import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { STRIPE_WEBHOOK_SECRET_KEY } from "../../../../utils/envConfig";
import moment from "moment";
import { upgradeToPaid, getPremiumUserOnStripeCustomerId, insertStripeCustomer } from "@/lib/dbUtils";
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

export const GET = async (req: NextRequest) => {
    console.log(req.body)
    return NextResponse.json({ message: 'Listening to strip hooks' })
}

export async function POST(req: NextRequest) {
    const body = await req.text();

    const resp = JSON.parse(body)
    // console.log("--- stripe response-----")
    // console.log(resp)
    // console.log("--- stripe response-----")
    console.log(resp.data.object.id)
    const stripeCustomerId = resp.data.object.id
    const stripeCustomerEmailId = resp.data.object.email
    console.log(resp.data.object.email)
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
    // console.log("event->", event.type)

    // const customerId = customer.id
    const createAt = moment().format('YYYY/MM/DD')
    // const remainingCredits = 0
    try {
        //const {userId,} = auth()
        if (event.type === 'checkout.session.completed') {
            const checkoutSession = event.data.object
            console.log("----- checkout session-----")
            console.log(checkoutSession)
            console.log("----- checkout session-----")
        }
        if (event.type === 'customer.created') {

            console.log("---- customer created-----")
            const customerCreated = event.data.object;

            console.log(customerCreated)
            console.log("--- customerCreated---")

        }
        if (event.type === "charge.succeeded") {
            console.log("---- charge succeeded-----")
            const chargeSucceeded = event.data.object;
            //console.log(chargeSucceeded)
            if (chargeSucceeded.status === 'succeeded') {

                const chargeSucceededId = chargeSucceeded.id
                const chargeSucceededName = chargeSucceeded.billing_details.name
                const chargeSucceededBillingDetails = JSON.stringify(chargeSucceeded.billing_details)
                const chargeSucceededPaymentDetails = JSON.stringify(chargeSucceeded.payment_method_details)
                const customerId = chargeSucceeded.customer
                //const customerEmail = chargeSucceeded.email
                console.info(chargeSucceededBillingDetails)
                console.info(chargeSucceededPaymentDetails)

                const metadataUserId = chargeSucceeded.customer
                console.log("customerid->", customerId)
                // @ts-ignore
                const getPremiumUserCredit = await getPremiumUserOnStripeCustomerId(customerId)
                // console.log(`getPremiumUserCredit`)
                // console.log(getPremiumUserCredit)
                // console.log(`getPremiumUserCredit`)
                if (getPremiumUserCredit.length > 0) {
                    const remainingCredits = getPremiumUserCredit[0].totalCredit
                    // @ts-ignore
                    console.log(remainingCredits)
                    
                    const upgradeToPaidDbPayload = {
                        stripeCustomerId:customerId,
                        // @ts-ignore
                        totalCredit:remainingCredits + 100000,
                        plan:"basic",
                        active:true, 
                        joinedDate:createAt
                    }
                    const premiumDbResult = await upgradeToPaid(upgradeToPaidDbPayload)
                    console.log(premiumDbResult)
                    const stripeCustomerPayload = {
                        chargeSucceedId:chargeSucceeded.id,
                        stripeCustomerId:customerId,
                        billingDetails:chargeSucceededBillingDetails,
                        paymentMethod:chargeSucceededPaymentDetails,
                        createAt:createAt,
                    }
                    const stripCustomerInserted = await insertStripeCustomer(stripeCustomerPayload)
                    console.log(stripCustomerInserted)
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
