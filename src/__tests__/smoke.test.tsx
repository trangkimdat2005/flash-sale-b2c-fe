import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

/**
 * Smoke test – verifies Vitest + jsdom + @testing-library/react are
 * correctly wired. If this test passes, the testing infrastructure
 * is ready for SP3-SP8 components.
 */

function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

describe('test infrastructure smoke', () => {
  it('renders a component with @testing-library/react', () => {
    render(<Greeting name="Vibe Mart" />);
    expect(
      screen.getByRole('heading', { name: /Hello, Vibe Mart!/i })
    ).toBeInTheDocument();
  });

  it('runs in jsdom environment', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });
});
