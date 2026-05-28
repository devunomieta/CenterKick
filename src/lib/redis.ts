import { Redis } from '@upstash/redis'

/**
 * Global Redis client for CenterKick.
 * Uses HTTP-based REST API which is ideal for Vercel/Next.js Edge and Serverless functions.
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// L1 In-Memory Cache for ultra-fast local lookups (0ms)
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const l1Cache = new Map<string, CacheEntry<any>>();

// Standard default TTL for L1 cache is 15 seconds to keep data reasonably fresh while completely neutralizing page latency
const L1_DEFAULT_TTL = 15;

/**
 * Cache helper to simplify the "Try Cache -> Fetch -> Save Cache" pattern.
 * Optimized with L1 (In-Memory) and L2 (Upstash Redis) caching, and async non-blocking L2 updates.
 */
export async function getCachedData<T>(
  key: string, 
  fetcher: () => Promise<T>, 
  ttl: number = 3600
): Promise<T> {
  const now = Date.now();

  // 1. Try L1 In-Memory Cache (extremely fast, 0ms)
  const l1Entry = l1Cache.get(key);
  if (l1Entry && l1Entry.expiresAt > now) {
    console.log(`[Cache L1 Hit] ${key}`);
    return l1Entry.value as T;
  }

  // 2. Try L2 Redis Cache (HTTP/TCP)
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log(`[Cache L2 Hit] ${key}`);
      
      // Store in L1 for subsequent requests
      const l1Ttl = Math.min(ttl, L1_DEFAULT_TTL);
      l1Cache.set(key, {
        value: cached,
        expiresAt: now + l1Ttl * 1000
      });

      return cached as T;
    }
  } catch (error) {
    console.warn(`[Redis L2 Error] Error fetching ${key}:`, error);
  }

  // 3. Fallback to Database Fetcher (Cache Miss)
  console.log(`[Cache Miss] ${key}. Fetching fresh data...`);
  const data = await fetcher();

  if (data !== undefined && data !== null) {
    // Save to L1 Cache
    const l1Ttl = Math.min(ttl, L1_DEFAULT_TTL);
    l1Cache.set(key, {
      value: data,
      expiresAt: now + l1Ttl * 1000
    });

    // Save to L2 Redis Cache asynchronously (non-blocking)
    redis.set(key, data, { ex: ttl }).catch(err => 
      console.error(`[Redis L2 Error] Error setting ${key}:`, err)
    );
  }

  return data;
}

// Intercept and wrap redis.del to automatically clear the local L1 Cache as well
const originalDel = redis.del.bind(redis);
redis.del = async function (...keys: string[]) {
  for (const key of keys) {
    l1Cache.delete(key);
    console.log(`[Cache L1 Invalidate] Cleared key: ${key}`);
  }
  return originalDel(...keys);
} as any;

