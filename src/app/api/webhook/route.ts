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
                    const result = getPremiumUserOnStripeCustomerId(customerId)
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
//     if (event.type === "checkout.session.completed") {
//         console.log("---------checkout session completed --------")
//         const session = await stripe.checkout.sessions.retrieve(
//             (event.data.object as Stripe.Checkout.Session).id,
//             {
//                 expand: ["line_items"],
//             }
//         );
//         const customerId = session.customer as string;
//         console.log(customerId)
//         const customerDetails = session.customer_details;
//         console.log('customerDetails -> ', customerDetails)

//         console.log("---------checkout session completed --------")
//     }
//     if (event.type === "customer.subscription.deleted") {
//         console.log("-------customer.subscription.deleted--------")


//         console.log("-------customer.subscription.deleted--------")
//     }
//     if(event.type === "payment_intent.succeeded"){

//     }
//     // const sessionEvent = event.data.object as Stripe.Checkout.Session;
//     // await getStripeEvents(sessionEvent)

//     // console.log("-------- sessionEvent ------")
//     // console.log(sessionEvent)
//     // console.log("-------- sessionEvent ------")
//     // charge.succeeded
//     // payment_intent.succeeded
//     // payment_intent.created


// } catch (err) {
//     console.log("-------customer.subscription.deleted--------")
//     console.error(err)
//     return NextResponse.json({ error: err }, { status: 400 });
// }

// const sessionEvent = event.data.object as Stripe.Checkout.Session;

// const stripeUserId = sessionEvent.id
// console.log(stripeUserId, 'stripeUserId')
// if (event.type === "checkout.session.completed") {
//     if (!stripeUserId) {
//         return new NextResponse(`Invalid sesison stripeUserId ${stripeUserId} doesn't exist`, { status: 400 });
//     }

//     try {
//         const stripeCustomer = await stripeCustomerExist(stripeUserId)
//         if (stripeCustomer) {
//             return NextResponse.json({ status: "existing stipe Customer", "events": event.type });
//         } else {
//             // const email = sessionEvent?.billin.email
//             const amount = sessionEvent.amount_total
//             const recepientEmail = sessionEvent.customer_email
//             const recepientURL = sessionEvent.url
//             const paymentMethodDetails = JSON.stringify(sessionEvent.payment_method_configuration_details)
//             const recepientCurrency = sessionEvent.currency
//             const createdAt = moment().format('yyyy/MM/DD')
//             insertStripeCustomer(stripeUserId, paymentMethodDetails, createdAt)


//         }
//         return NextResponse.json({ status: "success", "events": event.type });
//     } catch (error) {
//         return new NextResponse("Invalid User not authorized", { status: 500 });
//     }
// } else {
//     return new NextResponse("Invalid event", { status: 400 });
// }
// return new NextResponse("Success", { status: 200 });
