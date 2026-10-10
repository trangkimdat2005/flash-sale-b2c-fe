import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SocialLoginButtons } from './SocialLoginButtons';
import { TestWrapper } from '@/__tests__/test-wrapper';

// Mock sonner to capture toast calls
const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

beforeEach(() => {
  toastError.mockClear();
});

describe('SocialLoginButtons', () => {
  it('renders the divider "hoặc tiếp tục với"', () => {
    render(
      <TestWrapper>
        <SocialLoginButtons />
      </TestWrapper>
    );
    expect(screen.getByText(/hoặc tiếp tục với/i)).toBeInTheDocument();
  });

  it('renders 3 social buttons: Google, Facebook, GitHub', () => {
    render(
      <TestWrapper>
        <SocialLoginButtons />
      </TestWrapper>
    );
    expect(
      screen.getByRole('button', { name: /Đăng nhập bằng Google/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Đăng nhập bằng Facebook/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Đăng nhập bằng GitHub/i })
    ).toBeInTheDocument();
  });

  it('calls toast.error when Google button clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <SocialLoginButtons />
      </TestWrapper>
    );
    await user.click(
      screen.getByRole('button', { name: /Đăng nhập bằng Google/i })
    );
    expect(toastError).toHaveBeenCalledWith('Chức năng đang phát triển');
  });

  it('calls toast.error when Facebook button clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <SocialLoginButtons />
      </TestWrapper>
    );
    await user.click(
      screen.getByRole('button', { name: /Đăng nhập bằng Facebook/i })
    );
    expect(toastError).toHaveBeenCalledWith('Chức năng đang phát triển');
  });

  it('calls toast.error when GitHub button clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <SocialLoginButtons />
      </TestWrapper>
    );
    await user.click(
      screen.getByRole('button', { name: /Đăng nhập bằng GitHub/i })
    );
    expect(toastError).toHaveBeenCalledWith('Chức năng đang phát triển');
  });
});
