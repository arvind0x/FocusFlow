import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'

let pool: Pool | undefined
let database: ReturnType<typeof drizzle> | undefined

export function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured')
  }

  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 })
    database = drizzle(pool, { schema })
  }

  return database!
}
