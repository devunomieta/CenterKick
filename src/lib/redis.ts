import { Redis } from '@upstash/redis'

/**
 * Global Redis client for CenterKick.
 * Uses HTTP-based REST API which is ideal for Vercel/Next.js Edge and Serverless functions.
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Cache helper to simplify the "Try Cache -> Fetch -> Save Cache" pattern.
 * @param key The Redis key to store/fetch
 * @param fetcher The async function to get data if cache misses
 * @param ttl Time to live in seconds (default 3600 / 1 hour)
 */
export async function getCachedData<T>(
  key: string, 
  fetcher: () => Promise<T>, 
  ttl: number = 3600
): Promise<T> {
  try {
    // 1. Try to get from Redis
    const cached = await redis.get(key)
    if (cached) {
      console.log(`[Redis] Cache Hit: ${key}`)
      return cached as T
    }
  } catch (error) {
    console.warn(`[Redis] Error fetching ${key}:`, error)
  }

  // 2. Fallback to fetcher
  console.log(`[Redis] Cache Miss: ${key}`)
  const data = await fetcher()

  // 3. Save to Redis asynchronously (don't block the response)
  if (data) {
    redis.set(key, data, { ex: ttl }).catch(err => 
      console.error(`[Redis] Error setting ${key}:`, err)
    )
  }

  return data
}
