import { db } from '@/lib/db'
import { eq } from 'drizzle-orm';
import { premiumUser, stripeCustomer } from '@/lib/schema'
import { EmailAddress } from '@clerk/nextjs/server';

export const getPremiumUserOnClearkId = async (userId:string) => {
    const result = await db.select()
        .from(premiumUser)
        .where(eq(premiumUser.clerkUserId, userId))

    if (result.length>0) {
        return result
    } else {
        return []
    }
}

export const getPremiumUserOnStripeCustomerId = async (stripeCustomerId:string) => {
    const result = await db.select()
        .from(premiumUser)
        .where(eq(premiumUser.stripeCustomerId, stripeCustomerId))

    if (result.length>0) {
        return result
    } else {
        return []
    }
}


export const premiumUserExit = async (userId:string) => {
    const result = await getPremiumUserOnClearkId(userId)

    if (result.length>0) {
        return true
    } else {
        return false
    }
}

// on charge cutomer succeed
export const upgradeToPaid = async({...payload} )=>{
    console.log(payload)
    const {totalCredit, plan, active, joinedDate, stripeCustomerId} = payload
    const result = await db.update(premiumUser)
    .set({
        
        totalCredit:totalCredit,
        // userName:fullname,
        plan:plan,
        active:active,
        // stripeCustomerId:stripeCustomerId,
        joinDate:joinedDate

    }).where(eq(premiumUser.stripeCustomerId, stripeCustomerId))
        
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

// on charge succeed
export const insertStripeCustomer = async ({...dbPayload}) => {
    const {chargeSucceedId, stripeCustomerId, billingDetails, paymentMethod, createAt} = dbPayload
    const result=await db.insert(stripeCustomer).values({
        chargeSucceedId:chargeSucceedId,
        stripeCustomerId:stripeCustomerId,
        billingDetails:billingDetails,
        paymentMethod:paymentMethod,
        createdAt:createAt
    })
    return result 
}

// on new User afte clerk auth
export const insertPremiumUser= async({...dbPayload})=>{
    const {userId, emailAddress, userName, createAt, plan, totalCredit, customerId} = dbPayload
    const dbResult = await db.insert(premiumUser).values({
        clerkUserId: userId,
        email: emailAddress,
        userName: userName,
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


    }).where(eq(premiumUser.clerkUserId, userId))
        
    console.log(result)
    
}

export const upgradeUserSripeId = async(userId: string, stripeCustomerId:string) =>{
    const result = await db.update(premiumUser)
    .set({
        
        stripeCustomerId:stripeCustomerId,


    }).where(eq(premiumUser.clerkUserId, userId))
        
    console.log(result)
}
// on strip user creation
const updatePremiumUser = (stripeCustomerId:string, clerkUserId:string) =>{

}