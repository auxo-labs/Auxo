/**
 * Utility functions for cryptographic Proof-of-Work bot protection.
 * Uses standard cross-platform Web Crypto APIs compatible with Edge Runtime & Browsers.
 */

const POW_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.STRIPE_SECRET_KEY || 'auxo-pow-secret-key-fallback';

/**
 * Computes SHA-256 hash using the native web crypto APIs.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Generates a signed cryptographic challenge for the client.
 */
export async function generateChallenge(difficulty = 4): Promise<{
  salt: string;
  difficulty: number;
  signature: string;
  timestamp: number;
}> {
  const timestamp = Date.now();
  const randomBits = Math.random().toString(36).substring(2);
  const salt = `${timestamp}-${randomBits}`;

  // Sign the challenge to prevent tampering
  const signature = await sha256(`${salt}:${timestamp}:${POW_SECRET}`);
  return { salt, difficulty, signature, timestamp };
}

/**
 * Solves a server challenge on the client browser.
 */
export async function solveChallenge(salt: string, difficulty: number): Promise<string> {
  const targetPrefix = '0'.repeat(difficulty);
  let nonce = 0;
  
  while (true) {
    const nonceStr = nonce.toString();
    const hash = await sha256(`${salt}:${nonceStr}`);
    if (hash.startsWith(targetPrefix)) {
      return nonceStr;
    }
    nonce++;
  }
}

/**
 * Verifies a client's solution to a server challenge.
 */
export async function verifyChallenge(
  salt: string,
  timestamp: number,
  signature: string,
  nonce: string,
  difficulty = 4
): Promise<boolean> {
  // 1. Verify challenge timestamp freshness (e.g. max 5 mins delay)
  const now = Date.now();
  const challengeAge = now - timestamp;
  if (challengeAge < 0 || challengeAge > 5 * 60 * 1000) {
    return false;
  }

  // 2. Verify server signature to validate salt authenticity
  const expectedSignature = await sha256(`${salt}:${timestamp}:${POW_SECRET}`);
  if (signature !== expectedSignature) {
    return false;
  }

  // 3. Verify the computed hash matching the difficulty target
  const solutionHash = await sha256(`${salt}:${nonce}`);
  const targetPrefix = '0'.repeat(difficulty);
  return solutionHash.startsWith(targetPrefix);
}
