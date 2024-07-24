import { db } from '@/lib/db'
import { eq } from 'drizzle-orm';
import { premiumUser, stripeCustomer } from '@/lib/schema'


export const premiumUserExit = async (userId:string) => {
    const result = await db.select()
        .from(premiumUser)
        .where(eq(premiumUser.userId, userId))

    if (result) {
        return true
    } else {
        return false
    }
}

export const stripeCustomerExist = async (userId:string) => {
    const result = await db.select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.stripeCustomerId, userId))

    if (result) {
        return true
    } else {
        return false
    }
}

export const insertStripeCustomer = async (stripeUserId: string, paymentMethodDetails: string, createdAt: string) => {
    await db.insert(stripeCustomer).values({
        stripeCustomerId:stripeUserId,
        billingDetails:null,
        paymentMethod:paymentMethodDetails,
        createdAt:createdAt
    })     
}
