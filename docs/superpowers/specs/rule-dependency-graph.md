# Rule Dependency Graph - 24 .mdc Rule Files

> Generated: 2026-10-09. Baseline snapshot before Dot B (re-author work).
> Branch: `docs/standardize-rules-utf8`.

This table maps cross-references between the 24 rule files. `DependsOn` lists other `.mdc` filenames that this rule's body text references (e.g. `(see X.mdc)`, inline mentions in body sections, or `globs` cross-references). Discovery: PowerShell regex `\b([a-z][a-z\-]*\.mdc)\b` over each file body, filtering out self-references and broken `n.mdc` substrings.

| Rule | DependsOn |
|---|---|
| api-data.mdc | auth-jwt.mdc, enum-labels.mdc, layer-convention.mdc |
| auth-jwt.mdc | no-overengineering.mdc |
| component-pattern.mdc | design-system.mdc, enum-labels.mdc, no-overengineering.mdc, stack-versions.mdc |
| design-system.mdc | component-pattern.mdc, no-overengineering.mdc |
| docs-sync.mdc | (none) |
| enum-labels.mdc | (none) |
| error-handling.mdc | api-data.mdc, auth-jwt.mdc, validation-forms.mdc |
| features-migration.mdc | (none) |
| flash-sale-b2c-api-reference.mdc | flash-sale-b2c-api.mdc |
| flash-sale-b2c-api.mdc | auth-jwt.mdc, stack-versions.mdc, websocket-realtime.mdc |
| flash-sale-payment.mdc | stack-versions.mdc |
| git-workflow.mdc | git-worktree.mdc, testing-required.mdc, workflow-process.mdc |
| git-worktree.mdc | git-workflow.mdc, workflow-process.mdc |
| i18n.mdc | enum-labels.mdc |
| layer-convention.mdc | no-overengineering.mdc |
| no-overengineering.mdc | component-pattern.mdc, design-system.mdc, routing-guards.mdc, stack-versions.mdc |
| routing-guards.mdc | no-overengineering.mdc |
| skill-loading.mdc | (none) |
| stack-versions.mdc | component-pattern.mdc, design-system.mdc |
| state-management.mdc | no-overengineering.mdc |
| testing-required.mdc | no-overengineering.mdc |
| validation-forms.mdc | (none) |
| websocket-realtime.mdc | auth-jwt.mdc, no-overengineering.mdc, stack-versions.mdc |
| workflow-process.mdc | git-workflow.mdc, git-worktree.mdc, layer-convention.mdc, stack-versions.mdc, testing-required.mdc |

## Dependency Hot-Spots

Rules referenced by 5+ other rules (re-author these carefully - many callers depend on them):

| Rule | Inbound references | Sources |
|---|---|---|
| no-overengineering.mdc | 9 | auth-jwt, component-pattern, design-system, error-handling, layer-convention, routing-guards, state-management, testing-required, websocket-realtime |
| stack-versions.mdc | 6 | component-pattern, flash-sale-b2c-api, flash-sale-payment, no-overengineering, websocket-realtime, workflow-process |
| workflow-process.mdc | 3 | git-workflow, git-worktree |
| auth-jwt.mdc | 4 | api-data, error-handling, flash-sale-b2c-api, websocket-realtime |
| component-pattern.mdc | 3 | design-system, no-overengineering, stack-versions |
| design-system.mdc | 3 | component-pattern, no-overengineering, stack-versions |

## Cyclic Dependencies Detected

- **git-workflow 뿯↽ git-worktree 뿯↽ workflow-process** (triangle):
  - `git-workflow.mdc` -> `git-worktree.mdc`, `workflow-process.mdc`
  - `git-worktree.mdc` -> `git-workflow.mdc`, `workflow-process.mdc`
  - `workflow-process.mdc` -> `git-workflow.mdc`, `git-worktree.mdc`
- **component-pattern 뿯↽ design-system** (cycle):
  - `component-pattern.mdc` -> `design-system.mdc`
  - `design-system.mdc` -> `component-pattern.mdc`

> Cycles are expected because cross-references are documentation pointers (not data flow). Re-author order does not need to break cycles; instead, ensure that updated cross-references match the actual filenames after rename.

## Notes

- Self-references (e.g. `workflow-process.mdc` mentioning itself) and `n.mdc` (corrupted `Stack: Next.js` substring) were filtered out during extraction.
- Files with `(none)` have no cross-references in their body and are safe to re-author first (no naming cascade risk).
- This graph enables Dot B re-author tasks to quickly identify:
  - **Safe-to-rewrite first**: rules with `(none)` deps - 5 files: `docs-sync.mdc`, `enum-labels.mdc`, `features-migration.mdc`, `skill-loading.mdc`, `validation-forms.mdc`
  - **High-risk**: `no-overengineering.mdc` (9 inbound) - re-author last or carefully to avoid breaking 9 other rules.
  - **Cycle clusters**: re-author git-workflow/git-worktree/workflow-process and component-pattern/design-system together in the same Dot B subplan to keep cross-references consistent.