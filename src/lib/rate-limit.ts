// Simple in-memory rate limiter for server-side actions
// Note: This will reset when the server restarts.

type RateLimitEntry = {
  lastAttempt: number;
  attempts: number;
};

const resetAttempts = new Map<string, RateLimitEntry>();

const LIMIT_WINDOW = 2 * 60 * 1000; // 2 minutes
const MAX_ATTEMPTS = 3;

export function checkRateLimit(email: string): { allowed: boolean; waitTime?: number } {
  const now = Date.now();
  const entry = resetAttempts.get(email);

  if (!entry) {
    resetAttempts.set(email, { lastAttempt: now, attempts: 1 });
    return { allowed: true };
  }

  // If the last attempt was outside the limit window, reset the counter
  if (now - entry.lastAttempt > LIMIT_WINDOW) {
    resetAttempts.set(email, { lastAttempt: now, attempts: 1 });
    return { allowed: true };
  }

  // If too many attempts within the window
  if (entry.attempts >= MAX_ATTEMPTS) {
    const waitTime = Math.ceil((LIMIT_WINDOW - (now - entry.lastAttempt)) / 1000);
    return { allowed: false, waitTime };
  }

  // Update attempts
  entry.attempts += 1;
  entry.lastAttempt = now;
  resetAttempts.set(email, entry);
  
  return { allowed: true };
}
