import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

/**
 * Public rate limiter instance for API endpoints and sensitive actions.
 * Limits users/IPs to 10 requests per 10 seconds.
 */
const publicRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: 'centerkick:ratelimit',
});

/**
 * Helper to check rate limits for a given identifier (e.g. user ID or IP address).
 */
export async function checkRateLimit(identifier: string) {
  try {
    const { success, limit, remaining, reset } = await publicRateLimiter.limit(identifier);
    return { success, limit, remaining, reset };
  } catch (error) {
    console.warn('[RateLimiter Error] Falling back (allowing request):', error);
    // Soft failure fallback so Redis outage does not block legitimate users
    return { success: true, limit: 10, remaining: 1, reset: Date.now() };
  }
}
