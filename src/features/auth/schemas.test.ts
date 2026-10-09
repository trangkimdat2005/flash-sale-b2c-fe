import { describe, expect, it } from 'vitest';
import {
  identifierSchema,
  loginSchema,
  passwordSchema,
} from './schemas';

describe('identifierSchema', () => {
  it('accepts a valid email', () => {
    const r = identifierSchema.safeParse('user@example.com');
    expect(r.success).toBe(true);
  });

  it('accepts a valid VN phone (0x format)', () => {
    const r = identifierSchema.safeParse('0912345678');
    expect(r.success).toBe(true);
  });

  it('accepts a valid VN phone (+84 format)', () => {
    const r = identifierSchema.safeParse('+84912345678');
    expect(r.success).toBe(true);
  });

  it('rejects empty string', () => {
    const r = identifierSchema.safeParse('');
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toMatch(/Vui lòng nhập/i);
    }
  });

  it('rejects invalid email format', () => {
    const r = identifierSchema.safeParse('not-an-email');
    expect(r.success).toBe(false);
  });

  it('rejects invalid phone number (wrong prefix)', () => {
    const r = identifierSchema.safeParse('1234567890');
    expect(r.success).toBe(false);
  });

  it('rejects too-short phone number', () => {
    const r = identifierSchema.safeParse('09123');
    expect(r.success).toBe(false);
  });
});

describe('passwordSchema', () => {
  it('accepts password with 8+ chars', () => {
    const r = passwordSchema.safeParse('12345678');
    expect(r.success).toBe(true);
  });

  it('rejects password shorter than 8 chars', () => {
    const r = passwordSchema.safeParse('short');
    expect(r.success).toBe(false);
  });

  it('rejects empty password', () => {
    const r = passwordSchema.safeParse('');
    expect(r.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts email + password', () => {
    const r = loginSchema.safeParse({
      identifier: 'user@example.com',
      password: '12345678',
    });
    expect(r.success).toBe(true);
  });

  it('accepts phone + password', () => {
    const r = loginSchema.safeParse({
      identifier: '0912345678',
      password: '12345678',
    });
    expect(r.success).toBe(true);
  });

  it('rejects invalid identifier', () => {
    const r = loginSchema.safeParse({
      identifier: 'bad-input',
      password: '12345678',
    });
    expect(r.success).toBe(false);
  });

  it('rejects short password', () => {
    const r = loginSchema.safeParse({
      identifier: 'user@example.com',
      password: 'short',
    });
    expect(r.success).toBe(false);
  });
});
