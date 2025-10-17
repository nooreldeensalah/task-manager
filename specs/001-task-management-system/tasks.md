# Tasks: Task Management System

**Input**: Design documents from `/specs/001-task-management-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are NOT explicitly requested in this specification, therefore no test tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5, US6)
- Include exact file paths in descriptions

## Path Conventions

- Mobile + Web app structure using Expo Router
- `app/` - Expo Router screens
- `components/` - Reusable UI components
- `services/` - Business logic and API integrations
- `contexts/` - React Context providers
- `reducers/` - State reducers
- `types/` - TypeScript type definitions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Expo project with TypeScript template using `npx create-expo-app c1-task-manager --template expo-template-blank-typescript`
- [X] T002 Install core dependencies: `npx expo install expo-router react-native-reanimated`
- [X] T003 [P] Install Firebase SDK: `npx expo install firebase @react-native-async-storage/async-storage`
- [X] T004 [P] Install networking and notifications: `npx expo install expo-notifications @react-native-community/netinfo`
- [X] T005 [P] Install web dependencies: `npx expo install react-native-web react-dom @expo/metro-runtime`
- [X] T006 Configure TypeScript with strict mode in `tsconfig.json`
- [X] T007 [P] Configure Expo Router by creating `app/_layout.tsx` with root layout
- [X] T008 [P] Create project directory structure: `app/`, `components/`, `services/`, `contexts/`, `reducers/`, `types/`, `constants/`, `utils/`, `assets/`
- [X] T009 [P] Configure `app.json` for web, iOS, and Android platforms with proper app name and icons
- [X] T010 [P] Setup Firebase project and create `firebaseConfig.ts` in project root
- [X] T011 [P] Create Firestore security rules in `firestore.rules` (allow all read/write for anonymous access)
- [X] T012 [P] Configure Metro bundler for web builds in `metro.config.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T013 Create Task type definitions in `types/task.ts` (Task, TaskDocument interfaces)
- [X] T014 [P] Create UserPreferences type definitions in `types/preferences.ts`
- [X] T015 [P] Create TaskAction discriminated union type in `types/actions.ts`
- [X] T016 Implement taskReducer in `reducers/taskReducer.ts` with actions: SET_TASKS, ADD_TASK, UPDATE_TASK, DELETE_TASK, SET_LOADING, SET_ERROR
- [X] T017 Create TaskContext with useReducer in `contexts/TaskContext.tsx`
- [X] T018 [P] Create ThemeContext with light/dark theme support in `contexts/ThemeContext.tsx`
- [X] T019 Initialize Firestore with offline persistence in `services/firestore.ts`
- [X] T020 Implement taskService with CRUD operations in `services/taskService.ts` (createTask, updateTask, deleteTask, fetchTasks, subscribeToTasks)
- [X] T021 [P] Create useTasks custom hook in `hooks/useTasks.ts` to access TaskContext
- [X] T022 [P] Create useTheme custom hook in `hooks/useTheme.ts` to access ThemeContext
- [X] T023 [P] Create useOfflineStatus hook in `hooks/useOfflineStatus.ts` using NetInfo
- [X] T024 [P] Define app constants in `constants/Config.ts` (character limits, etc.)
- [X] T025 [P] Define color schemes in `constants/Colors.ts` (light and dark themes)
- [X] T026 [P] Create validation utilities in `utils/validation.ts` (validateTaskDescription, characterLimit)
- [X] T027 [P] Create formatting utilities in `utils/formatting.ts` (formatDate, formatTimestamp)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Task Management (Priority: P1) 🎯 MVP

**Goal**: Deliver core task management functionality - add, complete, delete tasks with Firestore persistence and offline support

**Independent Test**: User can add a new task, mark it complete, delete it with confirmation, and changes persist after app restart

### Implementation for User Story 1

- [ ] T028 [P] [US1] Create Button component in `components/common/Button.tsx`
- [ ] T029 [P] [US1] Create Input component in `components/common/Input.tsx`
- [ ] T030 [P] [US1] Create LoadingIndicator component in `components/common/LoadingIndicator.tsx`
- [ ] T031 [P] [US1] Create EmptyState component in `components/common/EmptyState.tsx` with action-oriented message
- [ ] T032 [P] [US1] Create ConfirmDialog component in `components/common/ConfirmDialog.tsx` for delete confirmation
- [ ] T033 [US1] Create TaskInput component in `components/task/TaskInput.tsx` with character counter (500 char limit)
- [ ] T034 [US1] Create TaskItem component in `components/task/TaskItem.tsx` with complete/delete actions
- [ ] T035 [US1] Create TaskList component in `components/task/TaskList.tsx` with ScrollView
- [ ] T036 [US1] Implement main task list screen in `app/(tabs)/index.tsx` with TaskList, TaskInput, and EmptyState
- [ ] T037 [US1] Integrate TaskContext provider in `app/_layout.tsx`
- [ ] T038 [US1] Integrate ThemeContext provider in `app/_layout.tsx`
- [ ] T039 [US1] Add task creation logic with validation in `app/(tabs)/index.tsx`
- [ ] T040 [US1] Add task completion toggle logic in TaskItem component
- [ ] T041 [US1] Add delete confirmation dialog trigger in TaskItem component
- [ ] T042 [US1] Implement offline queue mechanism in taskService.ts for Firestore writes
- [ ] T043 [US1] Add offline status indicator to main screen header
- [ ] T044 [US1] Test task persistence: create, complete, delete, restart app

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP complete!)

---

## Phase 4: User Story 6 - Web Deployment with CI/CD (Priority: P1)

**Goal**: Deploy web version to GitHub Pages with automated CI/CD pipeline

**Independent Test**: Access GitHub Pages URL, verify app loads and core features work, confirm commits trigger deployments

### Implementation for User Story 6

- [ ] T045 [P] [US6] Configure `app.json` with web-specific settings and baseUrl for GitHub Pages
- [ ] T046 [P] [US6] Create responsive web styles in `constants/Layout.ts`
- [ ] T047 [US6] Test web build locally with `npx expo export -p web`
- [ ] T048 [US6] Create GitHub Actions workflow in `.github/workflows/deploy-web.yml`
- [ ] T049 [US6] Configure workflow to build Expo web on push to main branch
- [ ] T050 [US6] Configure workflow to deploy `dist/` directory to gh-pages branch using peaceiris/actions-gh-pages@v3
- [ ] T051 [US6] Create `404.html` redirect for client-side routing in web build
- [ ] T052 [US6] Enable GitHub Pages in repository settings
- [ ] T053 [US6] Add build failure notifications in workflow (GitHub Actions status checks)
- [ ] T054 [US6] Test CI/CD: commit change, verify automatic build and deployment
- [ ] T055 [US6] Verify web app functionality on GitHub Pages URL

**Checkpoint**: At this point, User Stories 1 AND 6 should both work - MVP is deployed to web!

---

## Phase 5: User Story 2 - Detailed Task Information (Priority: P2)

**Goal**: Provide detailed view screen for each task showing metadata and enabling editing

**Independent Test**: Create a task, tap on it to navigate to detail screen, view metadata, edit description, navigate back

### Implementation for User Story 2

- [ ] T056 [P] [US2] Create TaskDetailCard component in `components/task/TaskDetailCard.tsx`
- [ ] T057 [US2] Create dynamic route `app/task/[id].tsx` for task detail screen
- [ ] T058 [US2] Implement task detail screen with TaskDetailCard showing description, timestamps, completion status
- [ ] T059 [US2] Add edit mode toggle in detail screen
- [ ] T060 [US2] Add inline editing capability for task description in detail screen
- [ ] T061 [US2] Implement navigation from TaskItem to detail screen using Expo Router
- [ ] T062 [US2] Add back/close navigation from detail screen to list
- [ ] T063 [US2] Update taskService to support task updates in Firestore
- [ ] T064 [US2] Test detail view: create task, navigate to detail, edit, navigate back, verify changes persist

**Checkpoint**: At this point, User Stories 1, 6, AND 2 should all work independently

---

## Phase 6: User Story 3 - Visual Feedback and Animations (Priority: P2)

**Goal**: Add smooth animations and visual feedback to make app feel polished and responsive

**Independent Test**: Perform actions (add, complete, delete) and observe smooth 60fps animations and immediate visual feedback

### Implementation for User Story 3

- [ ] T065 [P] [US3] Add Reanimated configuration to `babel.config.js`
- [ ] T066 [P] [US3] Configure Reanimated plugin in `app.json`
- [ ] T067 [US3] Implement fade-in animation for task addition in TaskList using useAnimatedStyle
- [ ] T068 [US3] Implement slide-out animation for task deletion in TaskItem using useAnimatedStyle
- [ ] T069 [US3] Implement spring animation for task completion checkbox in TaskItem using withSpring
- [ ] T070 [US3] Add ripple effect or press feedback to Button component using Pressable
- [ ] T071 [US3] Add press feedback to TaskItem component
- [ ] T072 [US3] Implement smooth screen transitions for navigation using Expo Router transitions
- [ ] T073 [US3] Add swipe-to-delete gesture handler in TaskItem using Gesture.Pan()
- [ ] T074 [US3] Optimize animations for web platform (check Platform.OS === 'web')
- [ ] T075 [US3] Test animation performance on mid-range device (verify 60fps)

**Checkpoint**: At this point, User Stories 1, 6, 2, AND 3 should all work independently

---

## Phase 7: User Story 4 - Theme Customization (Priority: P3)

**Goal**: Allow users to switch between dark and light themes with preference persistence

**Independent Test**: Toggle theme, verify all screens adapt, restart app, verify theme preference is remembered

### Implementation for User Story 4

- [ ] T076 [P] [US4] Create Settings screen in `app/(tabs)/settings.tsx`
- [ ] T077 [P] [US4] Add theme toggle switch component to Settings screen
- [ ] T078 [US4] Implement theme toggle action in ThemeContext (dispatch TOGGLE_THEME)
- [ ] T079 [US4] Persist theme preference to AsyncStorage in ThemeContext useEffect
- [ ] T080 [US4] Load theme preference from AsyncStorage on app start
- [ ] T081 [US4] Apply theme colors to all screens using useTheme hook
- [ ] T082 [US4] Apply theme colors to all components (Button, Input, TaskItem, etc.)
- [ ] T083 [US4] Implement system theme detection using Appearance API
- [ ] T084 [US4] Default to system theme when no user preference exists
- [ ] T085 [US4] Add tab navigation for Settings screen in `app/(tabs)/_layout.tsx`
- [ ] T086 [US4] Test theme switching: toggle, verify all screens update, restart app, verify persistence

**Checkpoint**: At this point, User Stories 1, 6, 2, 3, AND 4 should all work independently

---

## Phase 8: User Story 5 - Task Notifications and Reminders (Priority: P3)

**Goal**: Enable users to set due dates and reminders, receive push notifications at scheduled times

**Independent Test**: Create task with due date, set reminder, wait for notification time, verify notification appears, tap notification, verify deep link to task

### Implementation for User Story 5

- [ ] T087 [P] [US5] Create notificationService in `services/notificationService.ts` with permission requests
- [ ] T088 [P] [US5] Add dueDate field to Task type in `types/task.ts`
- [ ] T089 [US5] Implement scheduleNotification function in notificationService
- [ ] T090 [US5] Implement cancelNotification function in notificationService
- [ ] T091 [US5] Add date picker component to TaskInput for due date selection
- [ ] T092 [US5] Add date picker to task detail edit mode
- [ ] T093 [US5] Update createTask to schedule notification if dueDate is set
- [ ] T094 [US5] Update updateTask to reschedule notification if dueDate changes
- [ ] T095 [US5] Update deleteTask to cancel notification in taskService
- [ ] T096 [US5] Update toggleTaskCompletion to cancel notification when task completed
- [ ] T097 [US5] Implement notification tap handler for deep linking in `app/_layout.tsx`
- [ ] T098 [US5] Configure iOS notification entitlements in `app.json`
- [ ] T099 [US5] Handle denied notification permissions gracefully (show message in Settings)
- [ ] T100 [US5] Setup web notifications with Service Worker (web platform only)
- [ ] T101 [US5] Test notifications: set reminder, receive notification, tap, verify deep link

**Checkpoint**: At this point, ALL user stories (1-6) should work independently - feature complete!

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T102 [P] Create README.md with project description, setup instructions, and deployment guide
- [ ] T103 [P] Add error boundary component in `app/_layout.tsx` for graceful error handling
- [ ] T104 [P] Implement retry logic for failed Firestore operations in taskService
- [ ] T105 [P] Add loading states for all async operations
- [ ] T106 [P] Optimize bundle size by analyzing with `npx expo export --dump-sourcemap`
- [ ] T107 [P] Add accessibility labels to all interactive components (aria-label, accessibilityLabel)
- [ ] T108 [P] Test keyboard navigation on web platform
- [ ] T109 [P] Configure EAS Build profiles in `eas.json` (development, preview, production)
- [ ] T110 [P] Test iOS build with `eas build --platform ios --profile preview`
- [ ] T111 [P] Test Android build with `eas build --platform android --profile preview`
- [ ] T112 Performance audit: test with 1000+ tasks and verify <100ms interaction response
- [ ] T113 Security audit: review Firestore rules and add rate limiting if needed
- [ ] T114 Code cleanup: remove console.logs, unused imports, commented code
- [ ] T115 Final validation: run through all acceptance scenarios from spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase - MVP, highest priority
- **User Story 6 (Phase 4)**: Depends on User Story 1 - Web deployment of MVP
- **User Story 2 (Phase 5)**: Depends on Foundational phase - Independent of US1/US6 but uses same infrastructure
- **User Story 3 (Phase 6)**: Depends on User Story 1 components being available - Enhances existing UI
- **User Story 4 (Phase 7)**: Depends on Foundational phase - Independent theme system
- **User Story 5 (Phase 8)**: Depends on User Story 1 task management - Adds notifications to existing tasks
- **Polish (Phase 9)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 6 (P1)**: Depends on User Story 1 completion - Deploys the MVP
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent, uses US1 components
- **User Story 3 (P2)**: Depends on User Story 1 components - Enhances existing UI
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Completely independent theme system
- **User Story 5 (P3)**: Depends on User Story 1 task model - Adds notifications to existing tasks

### Within Each User Story

- Common components before feature-specific components
- Reducers and contexts before components that use them
- Core functionality before enhancements
- Local testing before deployment
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 (Setup)**: Tasks T002-T005, T007-T012 can run in parallel (different config files)
- **Phase 2 (Foundational)**: Tasks T014-T015, T018, T021-T027 can run in parallel
- **Phase 3 (US1)**: Tasks T028-T032 (common components) can run in parallel
- **Phase 4 (US6)**: Tasks T045-T046 can run in parallel
- **Phase 5 (US2)**: Task T056 can start while T057 is being worked on
- **Phase 6 (US3)**: Tasks T065-T066 can run in parallel
- **Phase 7 (US4)**: Tasks T076-T077 can run in parallel
- **Phase 8 (US5)**: Tasks T087-T088 can run in parallel
- **Phase 9 (Polish)**: Most polish tasks (T102-T111) can run in parallel

**Team Strategy**: After Foundational phase completes:

- Developer A: User Story 1 → User Story 3 (animations)
- Developer B: User Story 6 (CI/CD) → User Story 4 (themes)
- Developer C: User Story 2 (detail view) → User Story 5 (notifications)

---

## Parallel Example: User Story 1 (MVP)

```bash
# Launch common components together:
Task T028: "Create Button component in components/common/Button.tsx"
Task T029: "Create Input component in components/common/Input.tsx"
Task T030: "Create LoadingIndicator component in components/common/LoadingIndicator.tsx"
Task T031: "Create EmptyState component in components/common/EmptyState.tsx"
Task T032: "Create ConfirmDialog component in components/common/ConfirmDialog.tsx"

# Then task-specific components:
Task T033: "Create TaskInput component in components/task/TaskInput.tsx"
Task T034: "Create TaskItem component in components/task/TaskItem.tsx"
Task T035: "Create TaskList component in components/task/TaskList.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 6 Only)

1. Complete Phase 1: Setup → Project initialized
2. Complete Phase 2: Foundational → Core infrastructure ready
3. Complete Phase 3: User Story 1 → Task management works
4. Complete Phase 4: User Story 6 → MVP deployed to web
5. **STOP and VALIDATE**: Test independently, gather feedback
6. Decision point: Continue with P2/P3 features or iterate on MVP

### Incremental Delivery

1. **Sprint 1**: Setup + Foundational + US1 → MVP working locally
2. **Sprint 2**: US6 → MVP deployed to GitHub Pages ✅
3. **Sprint 3**: US2 + US3 → Enhanced UX with details and animations
4. **Sprint 4**: US4 + US5 → Polish with themes and notifications
5. **Sprint 5**: Polish phase → Production-ready

Each sprint delivers independently testable value!

### Parallel Team Strategy

With 3 developers after Foundational phase:

1. **Developer A (Critical Path)**: US1 → US3 → Polish
2. **Developer B (Infrastructure)**: US6 → US4 → EAS builds
3. **Developer C (Features)**: US2 → US5 → Documentation

Stories integrate at checkpoints without blocking each other.

---

## Notes

- All tasks follow strict checkbox format: `- [ ] [ID] [P?] [Story?] Description with path`
- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story (US1-US6) for traceability
- Each user story should be independently completable and testable
- Tests are NOT included as they were not requested in specification
- Commit after each task or logical group of tasks
- Stop at any checkpoint to validate story independently
- MVP = User Story 1 + User Story 6 (basic task management + web deployment)
- TypeScript strict mode enforced throughout (per constitution)
- Use `npx expo install` for all packages to ensure SDK compatibility

---

## Task Summary

- **Total Tasks**: 115
- **Setup Phase**: 12 tasks
- **Foundational Phase**: 15 tasks (BLOCKING)
- **User Story 1 (P1 - MVP)**: 17 tasks
- **User Story 6 (P1 - Deployment)**: 11 tasks
- **User Story 2 (P2 - Details)**: 9 tasks
- **User Story 3 (P2 - Animations)**: 11 tasks
- **User Story 4 (P3 - Themes)**: 11 tasks
- **User Story 5 (P3 - Notifications)**: 15 tasks
- **Polish Phase**: 14 tasks

**MVP Scope** (Recommended first delivery):

- Phase 1: Setup (12 tasks)
- Phase 2: Foundational (15 tasks)
- Phase 3: User Story 1 (17 tasks)
- Phase 4: User Story 6 (11 tasks)
- **Total MVP**: 55 tasks

**Parallel Opportunities**: 40+ tasks marked with [P] can run in parallel, significantly reducing total development time with proper team coordination.
