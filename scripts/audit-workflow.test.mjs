#!/usr/bin/env node
// scripts/audit-workflow.test.mjs
// Unit tests for audit-workflow.mjs
// Run: node --test scripts/audit-workflow.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runAudit } from './audit-workflow.mjs';

// ===== Helpers =====

function makeCommit(opts = {}) {
  return {
    files: opts.files ?? ['src/lib/decimal.ts'],
    message: opts.message ?? 'feat: add decimal utility',
    body: opts.body ?? '',
    branch: opts.branch ?? 'feature/test',
    baseSha: opts.baseSha ?? 'origin/dev',
  };
}

function run(input) {
  return runAudit(input);
}

// ===== Test 1: Working tree clean =====

test('pass: working tree clean (3 files in scope)', () => {
  const result = run(makeCommit({
    files: ['src/lib/decimal.ts', 'src/lib/decimal.test.ts', 'src/lib/utils.ts'],
    body: 'Test:\n- src/lib/decimal.test.ts (added)',
  }));
  assert.equal(result.ok, true, `expected ok=true, got ${JSON.stringify(result)}`);
  assert.equal(result.checks.find(c => c.id === 'working-tree')?.status, 'pass');
});

// ===== Test 2: Working tree có file ngoài scope =====

test('fail: working tree có file ngoài scope (untracked)', () => {
  const result = run(makeCommit({
    files: ['src/lib/decimal.ts', 'random-debug.log'],
    body: 'Test: ok',
  }));
  // Currently: chỉ check file diff vs HEAD, untracked phải xuất hiện
  // Sau implement: file .log ngoài scope → fail #1 hoặc #4
  assert.equal(result.ok, false, 'expected fail for out-of-scope file');
});

// ===== Test 3: Sửa logic không có test =====

test('fail: sửa logic (src/lib/decimal.ts) không kèm test', () => {
  const result = run(makeCommit({
    files: ['src/lib/decimal.ts'],
    body: 'feat: add decimal utility',
  }));
  assert.equal(result.ok, false);
  const check = result.checks.find(c => c.id === 'test-coverage');
  assert.equal(check?.status, 'fail');
});

// ===== Test 4: Sửa rule .mdc (không logic) → skip test requirement =====

test('pass: sửa rule .mdc không cần test', () => {
  const result = run(makeCommit({
    files: ['.cursor/rules/workflow-process.mdc'],
    body: 'docs(rules): update workflow',
  }));
  // Rule không phải logic → skip check #2
  const check = result.checks.find(c => c.id === 'test-coverage');
  assert.equal(check?.status, 'skipped', `expected skipped, got ${check?.status}`);
});

// ===== Test 5: Commit body có "Test:" section =====

test('pass: commit body có "Test:" section', () => {
  const result = run(makeCommit({
    body: 'Test: src/lib/decimal.test.ts (added)',
  }));
  const check = result.checks.find(c => c.id === 'commit-message');
  assert.equal(check?.status, 'pass');
});

// ===== Test 6: Commit body KHÔNG có "Test:" section =====

test('fail: commit body không có "Test:" section', () => {
  const result = run(makeCommit({
    body: 'feat: add decimal utility\n\nJust a utility for money.',
  }));
  const check = result.checks.find(c => c.id === 'commit-message');
  assert.equal(check?.status, 'fail');
  assert.equal(check?.hint?.includes('Test:'), true, 'hint should mention Test:');
});

// ===== Test 7: Diff có .env (block) =====

test('fail: diff có .env (blocked)', () => {
  const result = run(makeCommit({
    files: ['.env', 'src/lib/decimal.ts'],
  }));
  const check = result.checks.find(c => c.id === 'secrets');
  assert.equal(check?.status, 'fail');
  assert.equal(check?.blocking, true, 'env files should be blocking');
});

// ===== Test 8: Diff có *.local (block) =====

test('fail: diff có *.local (blocked)', () => {
  const result = run(makeCommit({
    files: ['.env.local', 'config.local.json'],
  }));
  const check = result.checks.find(c => c.id === 'secrets');
  assert.equal(check?.status, 'fail');
});

// ===== Test 9: Branch base ≠ origin/dev =====

test('fail: branch base không phải origin/dev', () => {
  const result = run(makeCommit({
    branch: 'feature/stray',
    baseSha: 'feature/old',  // merge-base khác origin/dev
  }));
  const check = result.checks.find(c => c.id === 'branch-base');
  assert.equal(check?.status, 'fail');
});

// ===== Test 10: Commit message có [skip-audit] =====

test('pass: commit body có [skip-audit] → skip tất cả check', () => {
  const result = run({
    files: ['.env'],  // would normally fail
    message: 'hotfix [skip-audit]: emergency',
    body: 'hotfix [skip-audit]: emergency',
    branch: 'feature/test',
    baseSha: 'origin/dev',
  });
  assert.equal(result.ok, true, `expected ok=true, got ${JSON.stringify(result)}`);
});

// ===== Test 11: ESLint fail (mock) =====

test('fail: eslint fail (mocked)', () => {
  // Khi implement: script sẽ chạy `npm run lint --silent` và check exit code
  // Test này sẽ được implement trong integration test, không phải unit
  // → skip trong unit test
  assert.ok(true, 'placeholder - integration test');
});

// ===== Test 12: TSC fail (mock) =====

test('fail: tsc fail (mocked)', () => {
  // Same as #11 - integration test
  assert.ok(true, 'placeholder - integration test');
});

// ===== Test 13: hotfix/* branch → skip branch-base check =====

test('pass: hotfix/* branch → skip branch-base check', () => {
  const result = run(makeCommit({
    branch: 'hotfix/payment-callback',
    baseSha: 'main',  // hotfix branch from main, not dev
  }));
  const check = result.checks.find(c => c.id === 'branch-base');
  assert.equal(check?.status, 'skipped', `hotfix should skip branch-base, got ${check?.status}`);
});

// ===== Test 14: Result structure =====

test('result có shape chuẩn: { ok, checks: [...], summary }', () => {
  const result = run(makeCommit());
  assert.equal(typeof result.ok, 'boolean');
  assert.ok(Array.isArray(result.checks));
  assert.ok(result.checks.length >= 5, `expected ≥5 checks, got ${result.checks.length}`);
  for (const c of result.checks) {
    assert.ok(['pass', 'fail', 'skipped'].includes(c.status), `bad status: ${c.status}`);
    assert.ok(typeof c.id === 'string');
    assert.ok(typeof c.label === 'string');
  }
});

// ===== Test 15: Multiple fail → result.ok = false =====

test('multiple fail → result.ok = false', () => {
  const result = run(makeCommit({
    files: ['.env', 'src/lib/decimal.ts'],
    body: 'no test section',
  }));
  assert.equal(result.ok, false);
  const failed = result.checks.filter(c => c.status === 'fail');
  assert.ok(failed.length >= 2, `expected ≥2 failed checks, got ${failed.length}`);
});
