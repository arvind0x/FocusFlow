import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import type { FocusFlowSnapshot } from '../../src/types/index.ts'

export const focusFlowUserState = pgTable('focusflow_user_state', {
  userId: text('user_id').primaryKey(),
  state: jsonb('state').$type<FocusFlowSnapshot>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})

export const focusFlowFeedback = pgTable('focusflow_feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: text('category').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})
