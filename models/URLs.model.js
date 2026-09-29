import { text, pgTable, varchar,uuid, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const URLsTable= pgTable("urls",{
  id: uuid().primaryKey().defaultRandom(),
  targetUrl: text('target_url').notNull(),
  shortCode: varchar('code',{length:50}).notNull().unique(),
  userId: uuid('user_id').references(()=> usersTable.id).notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(()=> new Date())
})