import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminAuth } from '../lib/admin-auth';
import bcrypt from 'bcrypt';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn()
      })),
      insert: vi.fn()
    }))
  }))
}));

// Mock bcrypt
vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn()
  }
}));

describe('AdminAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should return null for invalid credentials', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => ({
                data: null,
                error: { code: 'PGRST116' }
              }))
            }))
          }))
        }))
      };

      // Mock the createClient to return our mock
      const { createClient } = await import('@supabase/supabase-js');
      vi.mocked(createClient).mockReturnValue(mockSupabase as any);

      const result = await AdminAuth.authenticate('invalid', 'password', '127.0.0.1');
      expect(result).toBeNull();
    });

    it('should return session for valid credentials', async () => {
      const mockAdmin = {
        id: 'admin-id',
        username: 'admin',
        email: 'admin@example.com',
        password_hash: 'hashed-password',
        role: 'admin',
        is_active: true
      };

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => ({
                data: mockAdmin,
                error: null
              }))
            }))
          })),
          update: vi.fn(() => ({
            eq: vi.fn(() => ({
              data: null,
              error: null
            }))
          })),
          insert: vi.fn(() => ({
            data: null,
            error: null
          }))
        }))
      };

      // Mock bcrypt.compare to return true
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      // Mock the createClient to return our mock
      const { createClient } = await import('@supabase/supabase-js');
      vi.mocked(createClient).mockReturnValue(mockSupabase as any);

      // Mock jwt.sign
      vi.mock('jsonwebtoken', () => ({
        default: {
          sign: vi.fn(() => 'mock-jwt-token')
        }
      }));

      const result = await AdminAuth.authenticate('admin', 'password', '127.0.0.1');
      
      expect(result).toEqual({
        admin: {
          id: 'admin-id',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          is_active: true
        },
        token: 'mock-jwt-token'
      });
    });
  });

  describe('verifyToken', () => {
    it('should return null for invalid token', async () => {
      vi.mock('jsonwebtoken', () => ({
        default: {
          verify: vi.fn(() => {
            throw new Error('Invalid token');
          })
        }
      }));

      const result = await AdminAuth.verifyToken('invalid-token');
      expect(result).toBeNull();
    });
  });
});
