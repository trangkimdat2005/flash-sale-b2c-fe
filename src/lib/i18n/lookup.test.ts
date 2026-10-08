import { describe, it, expect } from 'vitest';
import {
  getMessage,
  getMessagesByNamespace,
  isLocale,
  listNamespaces,
  SUPPORTED_LOCALES,
} from './lookup';

describe('i18n lookup', () => {
  describe('SUPPORTED_LOCALES', () => {
    it('contains vi (default) and en', () => {
      expect(SUPPORTED_LOCALES).toEqual(['vi', 'en']);
    });
  });

  describe('isLocale', () => {
    it('accepts vi and en', () => {
      expect(isLocale('vi')).toBe(true);
      expect(isLocale('en')).toBe(true);
    });

    it('rejects unknown locales', () => {
      expect(isLocale('fr')).toBe(false);
      expect(isLocale('')).toBe(false);
      expect(isLocale(undefined)).toBe(false);
      expect(isLocale(42)).toBe(false);
    });
  });

  describe('getMessage', () => {
    it('returns a simple key from vi bundle', () => {
      expect(getMessage('vi', 'common.loading')).toBe('Đang tải...');
    });

    it('returns a simple key from en bundle', () => {
      expect(getMessage('en', 'common.loading')).toBe('Loading...');
    });

    it('walks nested namespaces', () => {
      expect(getMessage('vi', 'order.status.PAID')).toBe('Đã thanh toán');
      expect(getMessage('en', 'order.status.PAID')).toBe('Paid');
    });

    it('walks three-level nested paths (home.hero.title)', () => {
      expect(getMessage('vi', 'home.hero.title')).toContain('Flash Sale');
      expect(getMessage('en', 'home.hero.title')).toContain('Flash Sale');
    });

    it('returns undefined for unknown locale', () => {
      // @ts-expect-error - testing runtime guard
      expect(getMessage('fr', 'common.loading')).toBeUndefined();
    });

    it('returns the new addressLabel key in flash-sale.buyModal (cleanup 2026-10-08)', () => {
      // SP4 follow-up: replace literal "Địa chỉ nhận hàng" with t('addressLabel')
      expect(getMessage('vi', 'flash-sale.buyModal.addressLabel')).toBe(
        'Địa chỉ nhận hàng'
      );
      expect(getMessage('en', 'flash-sale.buyModal.addressLabel')).toBe(
        'Shipping address'
      );
    });

    it('returns the new cancel key in flash-sale.buyModal (cleanup 2026-10-08)', () => {
      // SP4 follow-up: replace literal "Huỷ" with t('cancel')
      expect(getMessage('vi', 'flash-sale.buyModal.cancel')).toBe('Huỷ');
      expect(getMessage('en', 'flash-sale.buyModal.cancel')).toBe('Cancel');
    });

    it('returns undefined for unknown path', () => {
      expect(getMessage('vi', 'common.doesNotExist')).toBeUndefined();
      expect(getMessage('vi', 'noNamespace.key')).toBeUndefined();
    });

    it('returns undefined when leaf is not a string (object hit)', () => {
      expect(getMessage('vi', 'common')).toBeUndefined();
    });
  });

  describe('getMessagesByNamespace', () => {
    it('returns messages for both locales under a namespace', () => {
      const home = getMessagesByNamespace('home');
      expect(home.vi).toBeDefined();
      expect(home.en).toBeDefined();
      expect((home.vi.hero as Record<string, string>).title).toContain(
        'Flash Sale'
      );
      expect((home.en.hero as Record<string, string>).title).toContain(
        'Flash Sale'
      );
    });

    it('returns empty object for unknown namespace', () => {
      const ghost = getMessagesByNamespace('ghost-namespace');
      expect(ghost.vi).toEqual({});
      expect(ghost.en).toEqual({});
    });
  });

  describe('listNamespaces', () => {
    it('lists the 13 expected top-level namespaces', () => {
      const namespaces = listNamespaces();
      // Spec §7 says 13 namespaces
      expect(namespaces.length).toBe(13);
      for (const required of [
        'common',
        'auth',
        'home',
        'product',
        'cart',
        'checkout',
        'address',
        'profile',
        'order',
        'payment',
        'flash-sale',
        'toast',
        'error',
      ]) {
        expect(namespaces).toContain(required);
      }
    });
  });
});