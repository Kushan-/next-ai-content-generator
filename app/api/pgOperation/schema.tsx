import { pgTable, serial, pgSchema, varchar, text } from 'drizzle-orm/pg-core';

export const aiOutputSchema = pgTable('aiOutput', {
    id:serial('id').primaryKey(),
    formData:varchar('formData').notNull(),
    aiResponse:text('aiResponse'),
    templateSlug:varchar('templateSlug').notNull(),
    createdBy:varchar('email'),
    createdAt:varchar('createdAt')
})