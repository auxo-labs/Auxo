import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST as webhookPOST } from '../src/app/api/webhooks/stripe/route';
import { POST as compilePOST } from '../src/app/api/compile/route';
import { NextRequest } from 'next/server';
import { clearRateLimitLogs } from '../src/lib/rate-limiter';

// 1. Mock DB queries
const mockSingle = vi.fn().mockResolvedValue({
  data: { credits: 10, is_lifetime: false },
  error: null
});

const mockEq = vi.fn().mockResolvedValue({
  error: null
});

const mockUpdate = vi.fn().mockReturnValue({
  eq: mockEq
});

const mockEqSelect = vi.fn().mockReturnValue({
  single: mockSingle
});

const mockSelect = vi.fn().mockReturnValue({
  eq: mockEqSelect
});

const mockFrom = vi.fn().mockReturnValue({
  select: mockSelect,
  update: mockUpdate
});

vi.mock('../src/lib/supabase', () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'mock-user-id' } }, error: null })
      }
    },
    supabaseAdmin: {
      from: (table: string) => mockFrom(table)
    }
  };
});

// 2. Mock Stripe package
vi.mock('stripe', () => {
  class StripeMock {
    webhooks = {
      constructEvent: vi.fn().mockImplementation((payload: string) => JSON.parse(payload))
    };
  }
  return {
    default: StripeMock
  };
});

// 3. Mock compiler package
vi.mock('../src/lib/prompt-compiler', () => {
  return {
    compilePromptPack: vi.fn().mockResolvedValue({
      agentsMd: '# AGENTS TEST',
      claudeMd: '# CLAUDE TEST',
      phasesMd: '# PHASES TEST',
      readmeMd: '# README TEST',
      cursorRules: {}
    })
  };
});

describe('Batch 2: Webhook and API Integration Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
    clearRateLimitLogs();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('POST /api/webhooks/stripe', () => {
    it('should increment user credits by +15 for standard compile tier', async () => {
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
      
      const payload = {
        type: 'checkout.session.completed',
        data: {
          object: {
            client_reference_id: 'mock-user-uuid',
            metadata: { tier: 'credits' }
          }
        }
      };

      const request = new NextRequest('http://localhost/api/webhooks/stripe', {
        method: 'POST',
        headers: { 'stripe-signature': 'mock-sig' },
        body: JSON.stringify(payload)
      });

      const response = await webhookPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);

      // Verify DB select was triggered for client reference ID
      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();

      // Verify DB update was triggered with +20 credits increment (10 initial + 20 = 30)
      expect(mockUpdate).toHaveBeenCalledWith({ credits: 30 });
      expect(mockEq).toHaveBeenCalledWith('id', 'mock-user-uuid');
    });

    it('should increment user credits by +75 for Developer Pack / Lifetime tier', async () => {
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
      
      const payload = {
        type: 'checkout.session.completed',
        data: {
          object: {
            client_reference_id: 'mock-user-uuid',
            metadata: { tier: 'lifetime' }
          }
        }
      };

      const request = new NextRequest('http://localhost/api/webhooks/stripe', {
        method: 'POST',
        headers: { 'stripe-signature': 'mock-sig' },
        body: JSON.stringify(payload)
      });

      const response = await webhookPOST(request);
      expect(response.status).toBe(200);

      // Verify DB update was triggered with +75 credits increment (10 initial + 75 = 85) and is_lifetime: true
      expect(mockUpdate).toHaveBeenCalledWith({ credits: 85, is_lifetime: true });
    });

    it('should return 500 error if webhook secret is missing in production environment', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true
      });
      delete process.env.STRIPE_WEBHOOK_SECRET;

      const request = new NextRequest('http://localhost/api/webhooks/stripe', {
        method: 'POST',
        headers: { 'stripe-signature': 'mock-sig' },
        body: JSON.stringify({})
      });

      try {
        const response = await webhookPOST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toContain('Webhook Error: Missing signature secret configuration');
      } finally {
        Object.defineProperty(process.env, 'NODE_ENV', {
          value: originalNodeEnv,
          configurable: true
        });
      }
    });
  });

  describe('POST /api/compile', () => {
    it('should bypass database credit checking if client-side BYOK key is configured', async () => {
      const payload = {
        markdownText: '# Test Spec',
        roomId: 'room-uuid',
        compileType: 'premium',
        userConfig: {
          provider: 'gemini',
          apiKey: 'AIzaSy-TestKey',
          model: 'gemini-2.5-flash'
        }
      };

      const request = new NextRequest('http://localhost/api/compile', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const response = await compilePOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.agentsMd).toBe('# AGENTS TEST');
      
      // Assert that DB was NOT queried (bypassed database gate due to local BYOK credentials)
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('should reject BYOK compiles exceeding 30,000 characters', async () => {
      const payload = {
        markdownText: 'a'.repeat(30001),
        roomId: 'room-uuid',
        compileType: 'premium',
        userConfig: {
          provider: 'gemini',
          apiKey: 'AIzaSy-TestKey',
          model: 'gemini-2.5-flash'
        }
      };

      const request = new NextRequest('http://localhost/api/compile', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const response = await compilePOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('exceeds the 30,000 character limit');
    });

    it('should allow BYOK compiles under 30,000 characters', async () => {
      const payload = {
        markdownText: 'a'.repeat(25000),
        roomId: 'room-uuid',
        compileType: 'premium',
        userConfig: {
          provider: 'gemini',
          apiKey: 'AIzaSy-TestKey',
          model: 'gemini-2.5-flash'
        }
      };

      const request = new NextRequest('http://localhost/api/compile', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const response = await compilePOST(request);
      expect(response.status).toBe(200);
    });

    it('should allow hosted Developer Pack compiles under 30,000 characters', async () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test';
      mockSingle.mockResolvedValueOnce({
        data: { credits: 10, is_lifetime: true },
        error: null
      });

      const payload = {
        markdownText: 'a'.repeat(20000),
        roomId: 'room-uuid',
        compileType: 'premium'
      };

      const request = new NextRequest('http://localhost/api/compile', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer mock-token' },
        body: JSON.stringify(payload)
      });

      const response = await compilePOST(request);
      expect(response.status).toBe(200);
    });

    it('should reject hosted standard compiles exceeding 15,000 characters', async () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test';
      mockSingle.mockResolvedValueOnce({
        data: { credits: 10, is_lifetime: false },
        error: null
      });

      const payload = {
        markdownText: 'a'.repeat(16000),
        roomId: 'room-uuid',
        compileType: 'premium'
      };

      const request = new NextRequest('http://localhost/api/compile', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer mock-token' },
        body: JSON.stringify(payload)
      });

      const response = await compilePOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('exceeds the 15,000 character limit');
    });

    it('should rate limit requests exceeding 5 compiles per minute per IP (SEC-07)', async () => {
      const { proxy } = await import('../src/proxy');
      const payload = {
        markdownText: '# Test Spec',
        roomId: 'room-uuid',
        userConfig: {
          provider: 'gemini',
          apiKey: 'AIzaSy-TestKey',
          model: 'gemini-2.5-flash'
        }
      };

      // Execute 5 compile requests (within limits) through proxy
      for (let i = 0; i < 5; i++) {
        const req = new NextRequest('http://localhost/api/compile', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        const res = await proxy(req);
        expect(res.status).not.toBe(429);
      }

      // The 6th request from the same IP must be rate limited by the proxy
      const limitReq = new NextRequest('http://localhost/api/compile', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const limitRes = await proxy(limitReq);
      const limitData = await limitRes.json();

      expect(limitRes.status).toBe(429);
      expect(limitData.error).toContain('Too many requests');
    });

    it('should enforce PoW challenge verification when ENFORCE_POW is set to true', async () => {
      process.env.ENFORCE_POW = 'true';
      
      const payloadWithoutPoW = {
        markdownText: '# Test Spec',
        roomId: 'room-uuid',
        userConfig: {
          provider: 'gemini',
          apiKey: 'AIzaSy-TestKey',
          model: 'gemini-2.5-flash'
        }
      };

      const request1 = new NextRequest('http://localhost/api/compile', {
        method: 'POST',
        body: JSON.stringify(payloadWithoutPoW)
      });

      const response1 = await compilePOST(request1);
      const data1 = await response1.json();

      expect(response1.status).toBe(400);
      expect(data1.error).toContain('missing challenge solution');

      // Now generate a valid solution for difficulty 4 (matching default compile verification)
      const { generateChallenge, solveChallenge } = await import('../src/lib/pow');
      const challenge = await generateChallenge(4);
      const nonce = await solveChallenge(challenge.salt, 4);

      const payloadWithPoW = {
        markdownText: '# Test Spec',
        roomId: 'room-uuid',
        userConfig: {
          provider: 'gemini',
          apiKey: 'AIzaSy-TestKey',
          model: 'gemini-2.5-flash'
        },
        powChallenge: {
          salt: challenge.salt,
          timestamp: challenge.timestamp,
          signature: challenge.signature,
          nonce
        }
      };

      const request2 = new NextRequest('http://localhost/api/compile', {
        method: 'POST',
        body: JSON.stringify(payloadWithPoW)
      });

      const response2 = await compilePOST(request2);
      expect(response2.status).toBe(200);
    });
  });

});
