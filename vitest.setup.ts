import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * Vitest setup file.
 * - Registers @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
 * - Auto-cleans up the DOM after each test
 */

afterEach(() => {
  cleanup();
});
