import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useToastAutoDismiss } from './useToast';
import { useUIStore } from '@/stores';

// Mock @/stores to avoid pulling in the full store graph
vi.mock('@/stores', () => ({
  useUIStore: vi.fn(),
}));

describe('useToastAutoDismiss', () => {
  it('returns undefined (no longer exposes hydration flag — refactor 2026-10-08)', () => {
    const dismiss = vi.fn();
    (useUIStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (s: { dismissToast: typeof dismiss }) => unknown) =>
        selector({ dismissToast: dismiss })
    );

    const { result } = renderHook(() => useToastAutoDismiss('toast-1', 1000));

    // After refactor: hook no longer returns `hydrated` boolean.
    // ToastItem (the only caller) never read it, so dropping it is safe.
    expect(result.current).toBeUndefined();
  });

  it('calls dismissToast after the configured timeout', () => {
    vi.useFakeTimers();
    const dismiss = vi.fn();
    (useUIStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (s: { dismissToast: typeof dismiss }) => unknown) =>
        selector({ dismissToast: dismiss })
    );

    renderHook(() => useToastAutoDismiss('toast-2', 2000));
    expect(dismiss).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2000);
    expect(dismiss).toHaveBeenCalledWith('toast-2');

    vi.useRealTimers();
  });
});