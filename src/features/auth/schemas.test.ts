import { describe, expect, it } from 'vitest';
import { emailSchema, loginSchema } from './schemas';

describe('emailSchema', () => {
  it('accepts a valid email', () => {
    const r = emailSchema.safeParse('user@example.com');
    expect(r.success).toBe(true);
  });

  it('rejects empty string', () => {
    const r = emailSchema.safeParse('');
    expect(r.success).toBe(false);
  });

  it('rejects non-email string', () => {
    const r = emailSchema.safeParse('not-an-email');
    expect(r.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts email + password', () => {
    const r = loginSchema.safeParse({
      email: 'user@example.com',
      password: '12345678',
    });
    expect(r.success).toBe(true);
  });

  it('rejects short password', () => {
    const r = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
    });
    expect(r.success).toBe(false);
  });

  it('rejects missing email', () => {
    const r = loginSchema.safeParse({ password: '12345678' });
    expect(r.success).toBe(false);
  });
});
