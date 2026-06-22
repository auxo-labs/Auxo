/**
 * Rate limiter helper (SEC-07).
 * Tracks client IP request frequencies to mitigate endpoint spam.
 * Automatically queries Vercel KV / Upstash Redis REST API if credentials are set,
 * falling back to a local in-memory sliding-window log.
 */

// In-memory request log map: key -> timestamp[]
const requestLogs = new Map<string, number[]>();

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Checks if the client IP has exceeded the specified rate limit.
 * @param ip - The client's IP address.
 * @param limit - Max requests allowed in the window.
 * @param windowSeconds - Size of the rate limiting window in seconds.
 * @param prefix - Prefix to separate limits across different endpoints.
 * @returns Rate limit verification result object.
 */
export async function checkRateLimit(
  ip: string,
  limit = 5,
  windowSeconds = 60,
  prefix = 'compile'
): Promise<RateLimitResult> {
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const key = `rate:${prefix}:${ip}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
      const res = await fetch(`${redisUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redisToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSeconds],
        ]),
        signal: AbortSignal.timeout(1500),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length >= 2) {
          const first = data[0];
          const count = first && typeof first === 'object' && 'result' in first ? Number(first.result) : Number(first);
          if (!isNaN(count)) {
            return {
              limited: count > limit,
              remaining: Math.max(0, limit - count),
              resetSeconds: windowSeconds,
            };
          }
        }
      }
      console.warn('KV rate limiter returned unexpected response, falling back to memory log.');
    } catch (error) {
      console.warn('KV rate limiter failed, falling back to memory log:', error);
    }
  }

  // Graceful in-memory sliding window fallback
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;
  const logKey = `${prefix}:${ip}`;

  let timestamps = requestLogs.get(logKey) || [];

  // Filter out timestamps older than the active window
  timestamps = timestamps.filter((time) => time > windowStart);

  if (timestamps.length >= limit) {
    const oldestTimestamp = timestamps[0];
    const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      limited: true,
      remaining: 0,
      resetSeconds: resetSeconds > 0 ? resetSeconds : 0,
    };
  }

  // Record active request timestamp
  timestamps.push(now);
  requestLogs.set(logKey, timestamps);

  return {
    limited: false,
    remaining: limit - timestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}

/**
 * Helper to manually clear logs for unit/integration testing mock instances.
 */
export function clearRateLimitLogs(): void {
  requestLogs.clear();
}

