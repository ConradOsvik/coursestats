import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE
} from 'next-safe-action'
import { headers } from 'next/headers'
import { env } from '~/env'

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true
})

const baseActionClient = createSafeActionClient({
  handleServerError(e) {
    console.error('Action error:', e.message)

    if (e.message === 'Rate limit exceeded') {
      return 'Too many requests. Please try again later.'
    }

    return DEFAULT_SERVER_ERROR_MESSAGE
  }
})

export const actionClient = baseActionClient.use(async ({ next }) => {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for') ??
    headersList.get('x-real-ip') ??
    'unknown'

  const { success, limit, reset, remaining } = await ratelimit.limit(ip)

  if (!success) {
    throw new Error('Rate limit exceeded')
  }

  return next({
    ctx: {
      ip,
      limit,
      reset,
      remaining
    }
  })
})
