import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import type { FocusFlowSnapshot } from '../../src/types/index.ts'

export const focusFlowUserState = pgTable('focusflow_user_state', {
  userId: text('user_id').primaryKey(),
  state: jsonb('state').$type<FocusFlowSnapshot>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
})
