/**
 * In-memory sliding window rate limiter helper (SEC-07).
 * Tracks client IP request frequencies to mitigate compilation endpoint spam.
 */

const WINDOW_MS = 60 * 1000; // 60 seconds window
const MAX_REQUESTS = 5;      // 5 compilations maximum per window

// In-memory request log map: clientIp -> timestamp[]
const requestLogs = new Map<string, number[]>();

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks if the client IP has exceeded the compilation rate limit.
 * @param ip - The client's IP address.
 * @returns Rate limit verification result object.
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  let timestamps = requestLogs.get(ip) || [];

  // Filter out timestamps older than the active window
  timestamps = timestamps.filter((time) => time > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldestTimestamp = timestamps[0];
    const resetSeconds = Math.ceil((oldestTimestamp + WINDOW_MS - now) / 1000);
    return {
      limited: true,
      remaining: 0,
      resetSeconds: resetSeconds > 0 ? resetSeconds : 0,
    };
  }

  // Record active request timestamp
  timestamps.push(now);
  requestLogs.set(ip, timestamps);

  return {
    limited: false,
    remaining: MAX_REQUESTS - timestamps.length,
    resetSeconds: Math.ceil(WINDOW_MS / 1000),
  };
}

/**
 * Helper to manually clear logs for unit testing mock instances.
 */
export function clearRateLimitLogs(): void {
  requestLogs.clear();
}
