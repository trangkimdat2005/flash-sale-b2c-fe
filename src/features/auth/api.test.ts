import { describe, expect, it, vi, beforeEach } from 'vitest';
import { loginRequest, fetchMe, logoutRequest } from './api';

// Mock apiFetch
vi.mock('@/lib/api', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/lib/api';
const mockedApiFetch = vi.mocked(apiFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('loginRequest', () => {
  it('posts to /auth/login with email|password payload (no phoneNumber)', async () => {
    mockedApiFetch.mockResolvedValueOnce({
      accessToken: 'token',
      expiresIn: 3600,
    });
    await loginRequest({
      identifier: 'user@example.com',
      password: '12345678',
    });
    expect(mockedApiFetch).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      json: {
        email: 'user@example.com',
        phoneNumber: undefined,
        password: '12345678',
      },
      withAuth: false,
    });
  });

  it('maps phone identifier to phoneNumber field (email undefined)', async () => {
    mockedApiFetch.mockResolvedValueOnce({
      accessToken: 'token',
      expiresIn: 3600,
    });
    await loginRequest({ identifier: '0912345678', password: '12345678' });
    expect(mockedApiFetch).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      json: {
        email: undefined,
        phoneNumber: '0912345678',
        password: '12345678',
      },
      withAuth: false,
    });
  });
});

describe('fetchMe', () => {
  it('GETs /auth/me', async () => {
    mockedApiFetch.mockResolvedValueOnce({
      id: '1',
      email: 'u@e.com',
      role: 'BUYER',
    });
    await fetchMe();
    expect(mockedApiFetch).toHaveBeenCalledWith('/auth/me', { method: 'GET' });
  });
});

describe('logoutRequest', () => {
  it('POSTs /auth/logout and swallows errors', async () => {
    mockedApiFetch.mockRejectedValueOnce(new Error('boom'));
    await expect(logoutRequest()).resolves.toBeUndefined();
  });
});
