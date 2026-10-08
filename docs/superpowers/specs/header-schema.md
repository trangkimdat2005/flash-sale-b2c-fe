# Header Schema - .mdc Rule Files

> Source-of-truth: `docs/CLAUDE.md` (UI conventions); this document defines the frontmatter contract that every `.mdc` rule file in `.cursor/rules/` MUST satisfy.

Every `.mdc` rule file begins with a YAML frontmatter block delimited by `---` lines. The frontmatter is consumed by Cursor to decide when the rule applies (`alwaysApply`, `globs`) and to surface the file in rule-index UIs (`description`).

This schema is consumed by `scripts/verify-rules.ps1` for mechanical validation.

## 1. Keys

| Key | Required | Type | Description |
|---|---|---|---|
| `description` | YES | string | One-line English describing what the rule enforces. Max 100 chars. Used in Cursor rule picker. |
| `globs` | YES | string[] | Path patterns the rule applies to. Empty array `[]` if `alwaysApply: true`. Use forward slashes. |
| `alwaysApply` | YES | boolean | `true` for always-on rules (workflow, stack, tests, error handling). `false` for rules scoped to a subdirectory. |
| `owner` | YES | enum (`ai` / `human` / `team`) | Who maintains this rule. `ai` for AI-authored rules, `human` for human-authored, `team` for jointly owned. |
| `last_reviewed` | YES | `YYYY-MM-DD` | Date of the last semantic review of the rule body. Must be a real ISO date. |
| `depends_on` | NO | string[] | List of other `.mdc` filenames this rule depends on. Used by Dot B ordering. |
| `version` | NO | integer | SemVer major version. Defaults to `1` if omitted. Bump when semantics change. |

## 2. Conventions

- File encoding: UTF-8 without BOM.
- Line endings: LF (Unix).
- Frontmatter delimiter: exactly three hyphens `---` on its own line, with no trailing whitespace.
- The body starts immediately after the closing `---`, ideally preceded by a YAML `>` Stack line and a `>` Source-of-truth line for traceability.
- All keys are lowercase snake_case.
- `globs` uses forward slashes regardless of OS.

## 3. Examples

### 3.1 Minimal rule (globs-scoped)

```yaml
---
description: How to use TanStack Query in feature hooks.
globs:
  - src/features/**/*.ts
  - src/features/**/*.tsx
alwaysApply: false
owner: ai
last_reviewed: 2026-10-09
---
> Stack: Next 16.3.8 · React 19.2 · TS 5.x · Tailwind 4.x
> Source-of-truth: docs/CLAUDE.md section 7 - API and data flow

# TanStack Query usage

<rule body in Vietnamese, UTF-8 clean>
```

### 3.2 Always-apply rule (workflow / stack)

```yaml
---
description: Workflow rules - branch, commit, push policy.
globs: []
alwaysApply: true
owner: team
last_reviewed: 2026-10-09
depends_on:
  - testing-required.mdc
version: 2
---
> Stack: Next 16.3.8 · React 19.2 · TS 5.x · Tailwind 4.x
> Source-of-truth: docs/CLAUDE.md section 12 - workflow process

# Workflow process

<rule body in Vietnamese, UTF-8 clean>
```

### 3.3 Rule with depends_on

```yaml
---
description: Design tokens (color, font, spacing) for the Ocean Mint system.
globs:
  - tailwind.config.ts
  - src/app/globals.css
  - src/components/**/*.tsx
alwaysApply: false
owner: ai
last_reviewed: 2026-10-09
depends_on:
  - no-overengineering.mdc
  - stack-versions.mdc
version: 1
---
> Stack: Next 16.3.8 · React 19.2 · TS 5.x · Tailwind 4.x
> Source-of-truth: docs/CLAUDE.md section 3 - design tokens

# Design system

<rule body in Vietnamese, UTF-8 clean>
```

## 4. Validation Rules

`scripts/verify-rules.ps1` enforces:

1. Frontmatter exists (file starts with `---`).
2. Frontmatter closes (second `---` line).
3. All 5 required keys present: `description`, `globs`, `alwaysApply`, `owner`, `last_reviewed`.
4. `description` length <= 100 chars.
5. `alwaysApply` is boolean (`true` / `false`).
6. `owner` is one of `ai` / `human` / `team`.
7. `last_reviewed` matches regex `^\d{4}-\d{2}-\d{2}$`.
8. `globs` is an array (possibly empty).
9. No UTF-8 BOM.
10. No corrupt characters from encoding-broken source files.

Files failing any rule are listed under `## FAILED FILES` in `verify-rules.ps1` output.