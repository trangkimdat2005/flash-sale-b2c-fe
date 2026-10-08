# Audit Inventory - 24 .mdc Rule Files

> Generated: 2026-10-09. Baseline snapshot before Dot B (re-author work).
> Branch: `docs/standardize-rules-utf8`.
> Source of truth: `docs/CLAUDE.md`.

This table captures the current encoding state of all 24 `.mdc` rule files in `.cursor/rules/`. Columns:

- **File**: filename only
- **Size (bytes)**: raw byte length
- **HasBOM**: true if first 3 bytes are `0xEF 0xBB 0xBF` (UTF-8 BOM)
- **HasNonASCII**: true if any byte > 0x7F
- **CorruptCount**: number of known encoding-broken characters matched by regex `[\u2514\u2556-\u2573\u2534\u252C\u251C\u2500\u2567\u25BC\u2592\u25A0\u25C7\u22A1?]`
- **LastCleanCommit**: most recent commit hash touching this file (from `git log --follow --format=%H -1 -- <file>`)

| File | Size (bytes) | HasBOM | HasNonASCII | CorruptCount | LastCleanCommit |
|---|---|---|---|---|---|
| api-data.mdc | 11364 | False | True | 50 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| auth-jwt.mdc | 8622 | False | True | 0 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| component-pattern.mdc | 18270 | False | True | 275 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| design-system.mdc | 10324 | False | True | 108 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| docs-sync.mdc | 5972 | False | True | 3 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| enum-labels.mdc | 7524 | False | True | 1 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| error-handling.mdc | 15588 | False | True | 241 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| features-migration.mdc | 22746 | False | True | 235 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| flash-sale-b2c-api-reference.mdc | 4008 | False | True | 0 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| flash-sale-b2c-api.mdc | 8120 | False | True | 2 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| flash-sale-payment.mdc | 9702 | False | True | 2 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| git-workflow.mdc | 22614 | False | True | 1 | 4264d881a97059c8aa67122367146c0ad89cbeec |
| git-worktree.mdc | 7268 | False | True | 204 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| i18n.mdc | 8070 | False | True | 15 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| layer-convention.mdc | 9248 | False | True | 99 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| no-overengineering.mdc | 3940 | False | True | 0 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| routing-guards.mdc | 12908 | False | True | 80 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| skill-loading.mdc | 3376 | False | True | 1 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| stack-versions.mdc | 4326 | False | True | 0 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| state-management.mdc | 11026 | False | True | 17 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| testing-required.mdc | 18208 | False | True | 1 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| validation-forms.mdc | 10800 | False | True | 3 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| websocket-realtime.mdc | 7674 | False | True | 0 | 3102a8cfc57a126b49586c8751e28a847b40df46 |
| workflow-process.mdc | 20176 | False | True | 1558 | f51b014e8a1df5a05272f399dad6bc990eef1019 |

## Summary

- **Total files**: 24
- **HasBOM**: 0 (all files are BOM-free at this point)
- **HasNonASCII**: 24 (all 24 files contain non-ASCII bytes; expected for Vietnamese content)
- **Corrupt characters**: sum of `CorruptCount` = 2897 across all files
- **Files with 0 corrupt characters**: 5 (`auth-jwt.mdc`, `flash-sale-b2c-api-reference.mdc`, `no-overengineering.mdc`, `stack-versions.mdc`, `websocket-realtime.mdc`)
- **Highest corrupt count**: `workflow-process.mdc` (1558), `component-pattern.mdc` (275), `error-handling.mdc` (241)

## Notes

- All files were authored at commit `3102a8cfc57a126b49586c8751e28a847b40df46` (baseline) with `git-workflow.mdc` later touched at `4264d881a97059c8aa67122367146c0ad89cbeec` and `workflow-process.mdc` most recently at `f51b014e8a1df5a05272f399dad6bc990eef1019`.
- The corrupt-character regex catches box-drawing / mojibake glyphs from Windows-1252 / latin-1 to UTF-8 misinterpretation. Files with 0 corrupt count may still have non-ASCII bytes (e.g. valid Vietnamese diacritics) which is desired behavior.
- This inventory is consumed by Dot B re-author tasks to identify safe-to-rewrite files (low corrupt count) versus heavy rewrites (high corrupt count).