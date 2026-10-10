#!/usr/bin/env node
// scripts/i18n-parity.test.mjs
// Unit tests for i18n messages parity (vi.json vs en.json).
// Rule: docs/i18n-convention.md mục 7 — every key in vi.json must exist in en.json.
// Run: node --test scripts/i18n-parity.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MESSAGES_DIR = path.join(ROOT, 'messages');

function loadMessages(locale) {
  const file = path.join(MESSAGES_DIR, `${locale}.json`);
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
}

function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...flattenKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// ===== Test 1: Both files exist and parse as JSON =====

test('i18n: both vi.json and en.json exist and parse', () => {
  const vi = loadMessages('vi');
  const en = loadMessages('en');
  assert.equal(typeof vi, 'object');
  assert.equal(typeof en, 'object');
});

// ===== Test 2: All vi.json keys exist in en.json =====

test('i18n: every key in vi.json exists in en.json', () => {
  const vi = loadMessages('vi');
  const en = loadMessages('en');
  const viKeys = new Set(flattenKeys(vi));
  const enKeys = new Set(flattenKeys(en));
  const missing = [...viKeys].filter((k) => !enKeys.has(k));
  assert.equal(
    missing.length,
    0,
    `en.json missing keys: ${missing.slice(0, 20).join(', ')}${missing.length > 20 ? ` (+${missing.length - 20} more)` : ''}`
  );
});

// ===== Test 3: All en.json keys exist in vi.json =====

test('i18n: every key in en.json exists in vi.json', () => {
  const vi = loadMessages('vi');
  const en = loadMessages('en');
  const viKeys = new Set(flattenKeys(vi));
  const enKeys = new Set(flattenKeys(en));
  const missing = [...enKeys].filter((k) => !viKeys.has(k));
  assert.equal(
    missing.length,
    0,
    `vi.json missing keys: ${missing.slice(0, 20).join(', ')}${missing.length > 20 ? ` (+${missing.length - 20} more)` : ''}`
  );
});

// ===== Test 4: auth.login namespace is fully present in both files =====

test('i18n: auth.login namespace exists with all required keys in both locales', () => {
  const requiredKeys = [
    'auth.login.title',
    'auth.login.subtitle',
    'auth.login.identifierLabel',
    'auth.login.identifierPlaceholder',
    'auth.login.passwordLabel',
    'auth.login.passwordPlaceholder',
    'auth.login.rememberMe',
    'auth.login.forgotPassword',
    'auth.login.submit',
    'auth.login.submitPending',
    'auth.login.dividerOr',
    'auth.login.noAccount',
    'auth.login.signupCta',
  ];
  const vi = loadMessages('vi');
  const en = loadMessages('en');
  const viKeys = new Set(flattenKeys(vi));
  const enKeys = new Set(flattenKeys(en));
  for (const k of requiredKeys) {
    assert.ok(viKeys.has(k), `vi.json missing ${k}`);
    assert.ok(enKeys.has(k), `en.json missing ${k}`);
  }
});

// ===== Test 5: auth.errors namespace exists with all required keys =====

test('i18n: auth.errors namespace exists with all required keys in both locales', () => {
  const requiredKeys = [
    'auth.errors.identifierRequired',
    'auth.errors.identifierInvalid',
    'auth.errors.passwordRequired',
    'auth.errors.passwordTooShort',
    'auth.errors.invalidCredentials',
    'auth.errors.oauthNotImplemented',
  ];
  const vi = loadMessages('vi');
  const en = loadMessages('en');
  const viKeys = new Set(flattenKeys(vi));
  const enKeys = new Set(flattenKeys(en));
  for (const k of requiredKeys) {
    assert.ok(viKeys.has(k), `vi.json missing ${k}`);
    assert.ok(enKeys.has(k), `en.json missing ${k}`);
  }
});

// ===== Test 6: auth.social namespace exists with all 3 OAuth providers =====

test('i18n: auth.social namespace exists with google/facebook/github in both locales', () => {
  const requiredKeys = [
    'auth.social.google',
    'auth.social.facebook',
    'auth.social.github',
  ];
  const vi = loadMessages('vi');
  const en = loadMessages('en');
  const viKeys = new Set(flattenKeys(vi));
  const enKeys = new Set(flattenKeys(en));
  for (const k of requiredKeys) {
    assert.ok(viKeys.has(k), `vi.json missing ${k}`);
    assert.ok(enKeys.has(k), `en.json missing ${k}`);
  }
});

// ===== Test 7: auth.brand namespace exists for left column =====

test('i18n: auth.brand namespace exists with title/intro/3 benefits in both locales', () => {
  const requiredKeys = [
    'auth.brand.title',
    'auth.brand.intro',
    'auth.brand.benefit1Title',
    'auth.brand.benefit1Desc',
    'auth.brand.benefit2Title',
    'auth.brand.benefit2Desc',
    'auth.brand.benefit2Badge',
    'auth.brand.benefit3Title',
    'auth.brand.benefit3Desc',
  ];
  const vi = loadMessages('vi');
  const en = loadMessages('en');
  const viKeys = new Set(flattenKeys(vi));
  const enKeys = new Set(flattenKeys(en));
  for (const k of requiredKeys) {
    assert.ok(viKeys.has(k), `vi.json missing ${k}`);
    assert.ok(enKeys.has(k), `en.json missing ${k}`);
  }
});

// ===== Test 7b: auth.chrome namespace exists for header + footer =====

test('i18n: auth.chrome namespace exists with header + footer keys in both locales', () => {
  const requiredKeys = [
    // Header
    'auth.chrome.header.authLabel',
    'auth.chrome.header.navHelp',
    'auth.chrome.header.navHome',
    // Footer
    'auth.chrome.footer.copyright',
    'auth.chrome.footer.terms',
    'auth.chrome.footer.privacy',
    'auth.chrome.footer.contact',
  ];
  const vi = loadMessages('vi');
  const en = loadMessages('en');
  const viKeys = new Set(flattenKeys(vi));
  const enKeys = new Set(flattenKeys(en));
  for (const k of requiredKeys) {
    assert.ok(viKeys.has(k), `vi.json missing ${k}`);
    assert.ok(enKeys.has(k), `en.json missing ${k}`);
  }
});

// ===== Test 8: Leaf values are non-empty strings (not null/undefined/empty) =====

test('i18n: all leaf values are non-empty strings in both locales', () => {
  function checkLeaves(obj, path = '', errors = []) {
    for (const [k, v] of Object.entries(obj)) {
      const fullPath = path ? `${path}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        checkLeaves(v, fullPath, errors);
      } else if (typeof v !== 'string' || v.length === 0) {
        errors.push(fullPath);
      }
    }
    return errors;
  }
  const vi = loadMessages('vi');
  const en = loadMessages('en');
  const viErrs = checkLeaves(vi);
  const enErrs = checkLeaves(en);
  assert.equal(viErrs.length, 0, `vi.json has empty/non-string values at: ${viErrs.join(', ')}`);
  assert.equal(enErrs.length, 0, `en.json has empty/non-string values at: ${enErrs.join(', ')}`);
});
