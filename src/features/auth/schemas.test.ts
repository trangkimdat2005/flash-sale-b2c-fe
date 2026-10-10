import { describe, expect, it } from 'vitest';
import {
  emailSchema,
  fullNameSchema,
  loginSchema,
  phoneRegisterSchema,
  passwordRegisterSchema,
  registerSchema,
} from './schemas';

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

describe('fullNameSchema', () => {
  it('accepts a typical Vietnamese full name with diacritics', () => {
    const r = fullNameSchema.safeParse('Nguyễn Văn An');
    expect(r.success).toBe(true);
  });

  it('rejects names with digits', () => {
    const r = fullNameSchema.safeParse('An 123');
    expect(r.success).toBe(false);
  });

  it('rejects names shorter than 2 chars', () => {
    const r = fullNameSchema.safeParse('A');
    expect(r.success).toBe(false);
  });

  it('rejects empty string', () => {
    const r = fullNameSchema.safeParse('');
    expect(r.success).toBe(false);
  });
});

describe('phoneRegisterSchema', () => {
  it('accepts 9-digit VN phone (no prefix)', () => {
    const r = phoneRegisterSchema.safeParse('912345678');
    expect(r.success).toBe(true);
  });

  it('rejects phone with leading 0', () => {
    const r = phoneRegisterSchema.safeParse('0912345678');
    expect(r.success).toBe(false);
  });

  it('rejects too-short phone', () => {
    const r = phoneRegisterSchema.safeParse('12345');
    expect(r.success).toBe(false);
  });

  it('rejects empty string', () => {
    const r = phoneRegisterSchema.safeParse('');
    expect(r.success).toBe(false);
  });
});

describe('passwordRegisterSchema', () => {
  it('accepts valid 8+ char password with letters and digits', () => {
    const r = passwordRegisterSchema.safeParse('VibeMart@2026');
    expect(r.success).toBe(true);
  });

  it('rejects password shorter than 8 chars', () => {
    const r = passwordRegisterSchema.safeParse('Short1');
    expect(r.success).toBe(false);
  });

  it('rejects password without digits', () => {
    const r = passwordRegisterSchema.safeParse('NoDigitsHere');
    expect(r.success).toBe(false);
  });

  it('rejects password without letters', () => {
    const r = passwordRegisterSchema.safeParse('12345678');
    expect(r.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const valid = {
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@example.com',
    phone: '912345678',
    password: 'VibeMart@2026',
    confirmPassword: 'VibeMart@2026',
  };

  it('accepts a fully valid input', () => {
    const r = registerSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it('rejects when confirmPassword does not match', () => {
    const r = registerSchema.safeParse({
      ...valid,
      confirmPassword: 'DifferentPassword1',
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issue = r.error.issues.find(
        (i) => i.path[0] === 'confirmPassword'
      );
      expect(issue?.message).toBe('Mật khẩu nhập lại không khớp');
    }
  });

  it('rejects when fullName is missing', () => {
    const { fullName, ...rest } = valid;
    void fullName;
    const r = registerSchema.safeParse(rest);
    expect(r.success).toBe(false);
  });

  it('rejects when email is invalid', () => {
    const r = registerSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(r.success).toBe(false);
  });

  it('rejects when phone is invalid', () => {
    const r = registerSchema.safeParse({ ...valid, phone: '12345' });
    expect(r.success).toBe(false);
  });
});
