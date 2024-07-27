import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeCustomerExist, insertStripeCustomer} from "@/lib/dbUtils";
import { STRIPE_WEBHOOK_SECRET_KEY } from "../../../../utils/envConfig";
import moment from "moment";

console.log("stripe-scret-key", STRIPE_WEBHOOK_SECRET_KEY)
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
    const sig = req.headers.get("stripe-signature");
    console.log(sig)
    let event;
    try {
        //whsec_5e6608e918443d8a3aa7b9993832fdeadc28291028231c5d688558ad12bae5ff
        event = stripe.webhooks.constructEvent(
            body,
            sig!,
            'whsec_5e6608e918443d8a3aa7b9993832fdeadc28291028231c5d688558ad12bae5ff'
        );
        console.log("event->", event.type)
        const sessionEvent = event.data.object as Stripe.Checkout.Session;
        await getStripeEvents(sessionEvent)

        console.log("-------- sessionEvent ------")
        console.log(sessionEvent)
        console.log("-------- sessionEvent ------")
        //charge.succeeded
        // payment_intent.succeeded
        // payment_intent.created


    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }

    const sessionEvent = event.data.object as Stripe.Checkout.Session;
    const stripeUserId = sessionEvent?.metadata?.userId;
    console.log(stripeUserId, 'stripeUserId')
    if (event.type === "checkout.session.completed") {
        if (!stripeUserId) {
            return new NextResponse("Invalid sesison", { status: 400 });
        }

        try {
            const stripeCustomer = await stripeCustomerExist(stripeUserId)
            if (stripeCustomer) {
                return NextResponse.json({ status: "existing stipe Customer" , "events": event.type });
            } else {
                // const email = sessionEvent?.billin.email
                const amount = sessionEvent.amount_total
                const recepientEmail = sessionEvent.customer_email
                const recepientURL = sessionEvent.url
                const paymentMethodDetails = JSON.stringify(sessionEvent.payment_method_configuration_details)
                const recepientCurrency = sessionEvent.currency
                const createdAt = moment().format('yyyy/MM/DD')
                insertStripeCustomer(stripeUserId, paymentMethodDetails, createdAt)


            }
            return NextResponse.json({ status: "success" , "events": event.type });
        } catch (error) {
            return new NextResponse("Invalid User not authorized", { status: 500 });
        }
    } else {
        return new NextResponse("Invalid event", { status: 200 });
    }
    return new NextResponse("Success", { status: 200 });
}