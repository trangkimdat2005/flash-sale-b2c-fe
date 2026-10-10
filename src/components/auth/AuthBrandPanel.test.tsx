import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthBrandPanel } from './AuthBrandPanel';
import { TestWrapper } from '@/__tests__/test-wrapper';

describe('AuthBrandPanel', () => {
  it('renders the brand title and intro', () => {
    render(
      <TestWrapper>
        <AuthBrandPanel />
      </TestWrapper>
    );
    expect(
      screen.getByText(/Mua sắm dễ dàng, săn deal mỗi ngày/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Nền tảng thương mại điện tử đồng hành/i)
    ).toBeInTheDocument();
  });

  it('renders all 3 benefit titles', () => {
    render(
      <TestWrapper>
        <AuthBrandPanel />
      </TestWrapper>
    );
    expect(
      screen.getByText(/Hàng nghìn gian hàng uy tín/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Flash Sale giá sốc mỗi khung giờ/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Thanh toán ZaloPay hoặc COD/i)
    ).toBeInTheDocument();
  });

  it('renders the HOT DEAL badge', () => {
    render(
      <TestWrapper>
        <AuthBrandPanel />
      </TestWrapper>
    );
    expect(screen.getByText(/HOT DEAL/i)).toBeInTheDocument();
  });

  it('renders the brand mark logo image', () => {
    render(
      <TestWrapper>
        <AuthBrandPanel />
      </TestWrapper>
    );
    const logos = screen.getAllByRole('img', { name: /Vibe Mart/i });
    expect(logos.length).toBeGreaterThan(0);
  });
});
