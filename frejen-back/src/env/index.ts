// src/env/index.tsx

import path from 'node:path'

import { config } from 'dotenv'
import { z } from 'zod'

import { InternalServerError } from '@/errors'

const envPath = path.resolve(
  process.cwd(),
  `.env.${process.env.NODE_ENV || 'development'}`,
)
config({ path: envPath })

const envSchema = z.object({
  ACCESS_TOKEN_EXPIRATION: z.coerce.number().default(1000 * 60 * 60 * 24), // 1 day
  DB_HOST: z.string(),
  DB_NAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  FRONT_END_BASE_URL: z.string().default('http://localhost:8080'),
  HOST: z.string().default('0.0.0.0'),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3001),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  const errorMessages = _env.error.issues.map((issue) => {
    const path = issue.path.map(String).join('.')
    return `→ ${path}: ${issue.message}`
  })

  const formatted = [
    '❌ Invalid environment variables (.env):',
    ...errorMessages,
    '',
  ].join('\n')

  throw new InternalServerError(formatted)
}

export const env = _env.data
