import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';
import { TestWrapper } from '@/__tests__/test-wrapper';

// Mock next/navigation because LoginForm uses useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock the auth hook used by LoginForm
vi.mock('@/features/auth', async () => {
  const actual = await vi.importActual<typeof import('@/features/auth')>(
    '@/features/auth'
  );
  return {
    ...actual,
    useLoginMutation: () => ({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
    }),
  };
});

function withQueryClient(ui: React.ReactNode) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <TestWrapper>{ui}</TestWrapper>
    </QueryClientProvider>
  );
}

describe('LoginForm', () => {
  it('renders identifier, password fields and submit button', () => {
    withQueryClient(<LoginForm />);
    expect(
      screen.getByLabelText(/Email hoặc Số điện thoại/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Nhập mật khẩu/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Đăng nhập/i })
    ).toBeInTheDocument();
  });

  it('shows validation error for empty identifier on submit', async () => {
    const user = userEvent.setup();
    withQueryClient(<LoginForm />);
    await user.click(screen.getByRole('button', { name: /Đăng nhập/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Vui lòng nhập email hoặc số điện thoại/i)
      ).toBeInTheDocument();
    });
  });

  it('shows validation error for too-short password', async () => {
    const user = userEvent.setup();
    withQueryClient(<LoginForm />);
    await user.type(
      screen.getByLabelText(/Email hoặc Số điện thoại/i),
      'user@example.com'
    );
    // Use placeholder to uniquely target the password input
    await user.type(screen.getByPlaceholderText(/Nhập mật khẩu/i), 'short');
    await user.click(screen.getByRole('button', { name: /Đăng nhập/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Mật khẩu tối thiểu 8 ký tự/i)
      ).toBeInTheDocument();
    });
  });

  it('renders the "Quên mật khẩu?" link', () => {
    withQueryClient(<LoginForm />);
    const link = screen.getByRole('link', { name: /Quên mật khẩu/i });
    expect(link).toHaveAttribute('href', '/quen-mat-khau');
  });

  it('renders the "Đăng ký ngay" link', () => {
    withQueryClient(<LoginForm />);
    const link = screen.getByRole('link', { name: /Đăng ký ngay/i });
    expect(link).toHaveAttribute('href', '/dang-ky');
  });
});
