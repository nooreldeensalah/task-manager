<!--
Sync Impact Report
- Version change: unversioned → 1.0.0
- Modified principles: N/A (initial adoption)
- Added sections: Core Principles, Technology & Constraints, Development Workflow, Governance
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated (Constitution Check gates)
  - .specify/templates/spec-template.md ✅ validated (no changes required)
  - .specify/templates/tasks-template.md ✅ validated (tests marked optional already)
  - .specify/templates/agent-file-template.md ✅ validated (no changes required)
  - .specify/templates/checklist-template.md ✅ validated (no changes required)
  - .specify/templates/commands/* ⚠ pending (folder not present in repo)
- Follow-up TODOs: None
-->

# C1 Task Manager Constitution

## Core Principles

### I. MVP-First Delivery

The project MUST prioritize delivering a viable quality MVP for a cross-platform
React Native task manager. Scope for MVP is limited to: add tasks, mark tasks
complete/incomplete, and delete tasks. Any non-essential work (e.g., data
persistence, authentication, analytics, internationalization, theming beyond
defaults, automated tests) is deferred until after MVP ships.

Rationale: Constraining scope ensures focus, speed, and early user value.

### II. UX and Accessibility Driven

The interface MUST be intuitive, responsive, and accessible by default:

- Touch targets ≥ 44x44dp and adequate spacing for mobile gestures.
- Respect dynamic font sizes; ensure contrast meets WCAG AA where practical.
- Provide clear affordances for add/complete/delete interactions.
- Avoid hidden critical actions; ensure keyboard and screen-reader reachability
  where feasible for React Native and web targets.

Rationale: Good UX/accessibility reduces user friction and increases adoption.

### III. State Management Discipline

State MUST be predictable and minimal:

- Use a single source of truth per screen. Prefer local component state via
  useState/useReducer; only elevate to Context when shared across screens.
- Avoid global state libraries unless the shared surface justifies it.
- Side effects are handled via useEffect (with cleanups) or event handlers; no
  side effects during render; reducers are pure.

Rationale: Predictable state simplifies reasoning and avoids regressions.

### IV. TypeScript and Modular Architecture

All source MUST be TypeScript with explicit types for domain objects
(e.g., Task, TaskId). Organize code into small, composable modules (components,
screens, hooks, state, utils, theme). Avoid cyclic dependencies. Public
interfaces (props, exported types) remain stable across refactors.

Rationale: Types and modularity improve correctness, reuse, and velocity.

### V. Cross-Platform Consistency and Performance

The UI MUST render consistently across iOS, Android, and Web (React Native Web
if used). Maintain responsiveness (target 60fps); avoid unnecessary re-renders
(memoize where beneficial), and use FlatList/SectionList for lists. Keep bundle
and component complexity small to meet MVP performance expectations on
mid‑tier devices. Target first interaction under ~1s on typical devices.

Rationale: Consistency and snappy interactions are core to perceived quality.

## Technology & Constraints

- Technology: React Native with TypeScript for a cross‑platform (mobile/web)
  frontend application. No backend services are required for MVP.
- State: In-memory state only for MVP; no persistence layer is mandated.
- Out of Scope for MVP: Authentication, remote sync, analytics, theming beyond
  defaults, localization, advanced accessibility auditing, automated tests,
  CI/CD, performance instrumentation beyond basic profiling.
- Dependencies: Prefer minimal, widely used libraries. Introduce new libraries
  only when they clearly reduce complexity or enable cross‑platform parity.

## Development Workflow

- Branching: Use concise branches like `feat/tasks-mvp`, `fix/ui-spacing`.
- Commits: Prefer Conventional Commits (e.g., `feat: add task creation UI`),
  but do not block on style during MVP.
- Reviews: Lightweight reviews are encouraged; solo self‑review is acceptable
  for MVP pace. Use the Constitution Check in plans to self‑validate scope and
  constraints before implementation.

Definition of Done (MVP):

- Users can add tasks, toggle completion, and delete tasks.
- UI meets Principle II basics (touch targets, contrast, discoverability).
- Code adheres to Principles III–V (state discipline, TS modularity, cross‑platform rendering).

## Governance

- This Constitution supersedes other style or process documents for this
  repository where conflicts arise.
- Amendments: Any change MUST update the version (see Versioning Policy) and
  record the Last Amended date. Material scope/principle changes SHOULD include
  a brief rationale in the commit message.
- Versioning Policy (for this Constitution only):
  - MAJOR: Backward‑incompatible governance changes or removal/redefinition of core principles.
  - MINOR: New principle/section added or materially expanded guidance.
  - PATCH: Clarifications, wording, or non‑semantic refinements.
- Compliance: Each feature plan MUST include a Constitution Check gate aligned
  with the Core Principles. Deviations MUST be justified in the plan’s
  Complexity Tracking section.

**Version**: 1.0.0 | **Ratified**: 2025-10-17 | **Last Amended**: 2025-10-17
