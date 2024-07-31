import { pgTable, serial, pgSchema, varchar, text, boolean, integer, unique, uuid } from 'drizzle-orm/pg-core';

export const aiOutputSchema = pgTable('aiOutput', {
    id:serial('id').primaryKey(),
    userId:varchar('userId').notNull(),
    formData:varchar('formData').notNull(),
    aiResponse:text('aiResponse'),
    templateSlug:varchar('templateSlug').notNull(),
    createdBy:varchar('email'),
    createdAt:varchar('createdAt')
})

export const premiumUser = pgTable('premiumUser',{
    id:serial('id'),
    clerkUserId:varchar('clerkUserId').primaryKey(),
    email: varchar('email'),
    userName:varchar('username'),
    active:boolean('active').default(false),
    joinDate:varchar('joinData'),
    plan:varchar('plan'),
    totalCredit:integer('totalCredit').default(0),
    stripeCustomerId:varchar('stripeCustomerId'),
})

export const appUser = pgTable('appUSer',{
    id:serial('id').primaryKey(),
    clerkUserId:varchar('userId').unique(),
    email: varchar('email'),
    userName:varchar('username'),
    active:boolean('active'),
    joinDate:varchar('joinData'),
    plan:varchar('plan'),
    totalCredit:integer('totalCredit').default(0),
    stripeCustomerId:varchar('stripeCustomerId'),
})



export const stripeCustomer = pgTable('stripeCustomer',{
    id:uuid('id').defaultRandom(),
    chargeSucceedId:varchar('chargeSucceedId'),
    stripeCustomerId:varchar('stripeCustomerId').primaryKey(), // from stripe
    billingDetails:varchar('billingDetails'), // events
    paymentMethod:varchar('paymentMethod'), // events
    createdAt:varchar('createdAt'),
    email: varchar('email'),
    userName:varchar('username'),
})