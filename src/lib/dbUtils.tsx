import { db } from '@/lib/db'
import { eq } from 'drizzle-orm';
import { premiumUser, stripeCustomer } from '@/lib/schema'

export const getPremiumUser = async (userId:string) => {
    const result = await db.select()
        .from(premiumUser)
        .where(eq(premiumUser.userId, userId))

    if (result.length>0) {
        return result
    } else {
        return []
    }
}

export const premiumUserExit = async (userId:string) => {
    const result = await getPremiumUser(userId)

    if (result.length>0) {
        return true
    } else {
        return false
    }
}

export const upgradeToPaid = async(userId:string, remainingCredits:number, stripeCustomerId:string, createAt:string, plan:any, active:any, )=>{
    const result = await db.update(premiumUser)
    .set({
        
        totalCredit:remainingCredits,
        plan:plan,
        active:false,
        stripeCustomerId:stripeCustomerId,
        joinDate:createAt

    }).where(eq(premiumUser.userId, userId))
        
    console.log(result)
    
}

export const stripeCustomerExist = async (userId:string) => {
    const result = await db.select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.stripeCustomerId, userId))

    if (result.length>0) {
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

export const insertPremiumUser= async(userId: string, emailAddress: string | undefined, customerId: string | null, fullName: string | null | undefined, createAt: string, plan:string, totalCredit:number)=>{
    const dbResult = await db.insert(premiumUser).values({
        userId: userId,
        email: emailAddress,
        userName: fullName,
        active: false,
        joinDate: createAt,
        plan: plan,
        totalCredit: totalCredit,
        stripeCustomerId: customerId
    })
    return(dbResult)
}

// after evry ai response use
export const updateUserCredit = async(userId:string, remainingCredits:number )=>{
    const result = await db.update(premiumUser)
    .set({
        
        totalCredit:remainingCredits,


    }).where(eq(premiumUser.userId, userId))
        
    console.log(result)
    
}