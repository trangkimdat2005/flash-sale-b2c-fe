import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next/navigation's useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

// Mock next/link to inspect rendered href without router interaction
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className} data-testid="next-link">
      {children}
    </a>
  ),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    if (key === 'emptyCart') return 'Giỏ hàng trống';
    if (key === 'goShopping') return 'Tiếp tục mua sắm';
    return key;
  },
}));

// Mock auth store: present so we skip the redirect
vi.mock('@/stores/auth.store', () => ({
  useAuthStore: (selector: (s: { accessToken: string }) => unknown) =>
    selector({ accessToken: 'fake-token' }),
}));

// Mock cart query: empty cart to trigger empty-cart branch
const EMPTY_CART = { storeGroups: [], totalItems: 0, grandTotal: '0' };

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: EMPTY_CART, isLoading: false }),
  useMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

// Mock toast hook
vi.mock('@/hooks', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}));

// Mock layout (Header/Footer) — they're noise for this test
vi.mock('@/components/layout', () => ({
  Header: () => <header data-testid="header" />,
  Footer: () => <footer data-testid="footer" />,
}));

// Mock the cart/order/voucher/address APIs (not exercised here)
vi.mock('@/lib/api', () => ({
  cartApi: { get: vi.fn() },
  orderApi: { checkout: vi.fn() },
  voucherApi: { apply: vi.fn() },
  addressApi: { list: vi.fn() },
}));

import CheckoutPage from './page';

describe('CheckoutPage — empty cart branch', () => {
  it('renders the "go shopping" link using next/link with href="/products" (refactor 2026-10-08)', () => {
    render(<CheckoutPage />);
    const link = screen.getByTestId('next-link');
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/products');
    expect(link.textContent).toContain('Tiếp tục mua sắm');
  });
});