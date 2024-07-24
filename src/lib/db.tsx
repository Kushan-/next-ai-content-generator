//'use server'
import { neon } from '@neondatabase/serverless';

import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';
// import { pgTable, serial, pgSchema, varchar, text } from 'drizzle-orm/pg-core';



// export const aiOutputSchema = pgTable('aiOutput', {
//     id:serial('id').primaryKey(),
//     formData:varchar('formData').notNull(),
//     aiResponse:text('aiResponse'),
//     templateSlug:varchar('template-slug').notNull(),
//     createdBy:varchar('email').notNull(),
//     createdAt:varchar('createdAt')
// })
console.log(process.env.POSTGRES_DB_URI)
const sql = neon(`postgresql://ai-content-generator_owner:vIf4V1CWwPED@ep-delicate-shape-a5drx6sv.us-east-2.aws.neon.tech/ai-content-generator?sslmode=require`);
export const db = drizzle(sql,{schema});
