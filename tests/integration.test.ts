import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST as webhookPOST } from '../src/app/api/webhooks/stripe/route';
import { POST as compilePOST } from '../src/app/api/compile/route';
import { NextRequest } from 'next/server';

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

      // Verify DB update was triggered with +15 credits increment (10 initial + 15 = 25)
      expect(mockUpdate).toHaveBeenCalledWith({ credits: 25 });
      expect(mockEq).toHaveBeenCalledWith('id', 'mock-user-uuid');
    });

    it('should increment user credits by +50 for Developer Pack / Lifetime tier', async () => {
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

      // Verify DB update was triggered with +50 credits increment (10 initial + 50 = 60)
      expect(mockUpdate).toHaveBeenCalledWith({ credits: 60 });
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

    it('should return compiled pack directly for basic compile calls', async () => {
      const payload = {
        markdownText: '# Test Spec',
        roomId: 'room-uuid',
        compileType: 'basic'
      };

      const request = new NextRequest('http://localhost/api/compile', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const response = await compilePOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.agentsMd).toBe('# AGENTS TEST');
    });
  });

});
