# Implementation Plan: Task Management System

**Branch**: `001-task-management-system` | **Date**: 2025-10-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-task-management-system/spec.md`

## Summary

Build a cross-platform task management application using React Native with Expo that allows users to add, complete, and delete tasks. Tasks are stored anonymously in Firestore with offline support. The app features a polished UI with animations, theme support (dark/light), push notifications for reminders, and automated web deployment to GitHub Pages via CI/CD. The application emphasizes TypeScript-first development, component modularity, and excellent UX across web and mobile platforms.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) with React Native via Expo SDK 52+ (or latest stable)
**Primary Dependencies**:

- **Framework**: Expo (React Native) with web support via `react-native-web`
- **State Management**: Zustand for global state (lightweight, TypeScript-friendly)
- **Database**: Firestore SDK with offline persistence enabled
- **Navigation**: React Navigation 6.x (stack + tab navigators)
- **UI Components**: React Native Paper or NativeBase (consistent cross-platform design system)
- **Animations**: React Native Reanimated 3.x for 60fps animations
- **Notifications**: Expo Notifications API
- **Theme**: React Native Paper theming or custom Context-based theme provider

**Storage**: Firestore (cloud-based NoSQL) with local persistence for offline support
**Testing**: Jest + React Native Testing Library (component/integration tests)
**Target Platform**: Cross-platform - Web (GitHub Pages), iOS 13+, Android 8+
**Project Type**: Mobile (React Native with web support)
**Performance Goals**:

- 60fps animations on mid-range devices
- <2s task creation/completion response time
- <3s web initial load time
- <100ms UI interaction response

**Constraints**:

- TypeScript strict mode (NON-NEGOTIABLE per constitution)
- 500 character task description limit
- Anonymous user model (no authentication for MVP)
- Offline-capable with automatic sync
- Must work on web, iOS, and Android with single codebase

**Scale/Scope**:

- Support 1000+ tasks per user without performance degradation
- 3-5 core screens (Task List, Task Detail, Settings)
- ~15-20 reusable components
- Basic feature set focused on essential task management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. TypeScript-First Development (NON-NEGOTIABLE)

- ✅ **PASS**: All code will be TypeScript with `strict: true` in tsconfig.json
- ✅ **PASS**: Expo supports TypeScript out of the box
- ✅ **PASS**: Type definitions for Task, UserPreferences, and all component props
- ✅ **PASS**: No `any` types without justification

### II. Component Modularity

- ✅ **PASS**: Feature-based component organization (screens, components/common, components/task)
- ✅ **PASS**: Separation of container (logic) and presentational (UI) components
- ✅ **PASS**: Clear props interfaces for all components
- ✅ **PASS**: Independent testing capability for shared components

### III. Cross-Platform Compatibility

- ✅ **PASS**: React Native with Expo provides web, iOS, Android from single codebase
- ✅ **PASS**: Platform-specific code isolated using `Platform.select()` or `.ios/.android/.web` extensions
- ✅ **PASS**: Responsive layouts using Flexbox and Dimensions API
- ✅ **PASS**: Navigation patterns adapt to platform (tab bar positioning, gestures)

### IV. UI/UX Excellence

- ✅ **PASS**: Immediate visual feedback for all interactions (FR-014)
- ✅ **PASS**: Smooth 60fps animations using Reanimated (FR-015)
- ✅ **PASS**: Empty states, loading states, error states explicitly designed (FR-018, FR-019)
- ✅ **PASS**: Confirmation dialogs for destructive actions (deletion confirmation)
- ✅ **PASS**: Offline status indicators
- ✅ **PASS**: Character count feedback for task input

### V. State Management Discipline

- ✅ **PASS**: Zustand for global task state (CRUD operations, sync status)
- ✅ **PASS**: Context API for theme preferences
- ✅ **PASS**: Local component state for UI-only concerns (input focus, modal visibility)
- ✅ **PASS**: Firestore integration isolated in service layer
- ✅ **PASS**: Unidirectional data flow

**Result**: ✅ ALL GATES PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```plaintext
specs/001-task-management-system/
├── plan.md              # This file
├── research.md          # Phase 0 output (technology choices, patterns)
├── data-model.md        # Phase 1 output (Firestore schema)
├── quickstart.md        # Phase 1 output (setup instructions)
├── contracts/           # Phase 1 output (TypeScript interfaces/types)
│   └── types.ts         # Task, UserPreferences, AppState interfaces
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```plaintext
/
├── app/                          # Expo Router app directory (screens)
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx             # Home/Task List screen
│   │   ├── settings.tsx          # Settings screen (theme toggle)
│   │   └── _layout.tsx           # Tab layout configuration
│   ├── task/[id].tsx             # Task detail screen (dynamic route)
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx            # 404 screen
│
├── components/                   # Reusable components
│   ├── common/                   # Cross-feature components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingIndicator.tsx
│   │   ├── EmptyState.tsx
│   │   └── ConfirmDialog.tsx
│   └── task/                     # Task-specific components
│       ├── TaskItem.tsx          # Individual task in list
│       ├── TaskList.tsx          # Scrollable task list
│       ├── TaskInput.tsx         # Task creation/edit input
│       └── TaskDetailCard.tsx    # Task detail display
│
├── services/                     # Business logic & external integrations
│   ├── firestore.ts              # Firestore configuration & queries
│   ├── taskService.ts            # Task CRUD operations
│   └── notificationService.ts    # Push notification handling
│
├── store/                        # State management
│   ├── taskStore.ts              # Zustand store for tasks
│   └── types.ts                  # State type definitions
│
├── hooks/                        # Custom React hooks
│   ├── useTheme.ts               # Theme context hook
│   ├── useTasks.ts               # Task operations hook
│   └── useOfflineStatus.ts      # Network status monitoring
│
├── contexts/                     # React contexts
│   └── ThemeContext.tsx          # Theme provider
│
├── types/                        # Shared TypeScript types
│   ├── task.ts                   # Task entity types
│   ├── preferences.ts            # User preferences types
│   └── api.ts                    # API response types
│
├── constants/                    # App constants
│   ├── Colors.ts                 # Theme colors
│   ├── Layout.ts                 # Spacing, sizes
│   └── Config.ts                 # App configuration
│
├── utils/                        # Utility functions
│   ├── validation.ts             # Input validation
│   ├── formatting.ts             # Date/text formatting
│   └── storage.ts                # AsyncStorage helpers
│
├── assets/                       # Static assets
│   ├── fonts/
│   └── images/
│
├── __tests__/                    # Test files
│   ├── components/
│   ├── services/
│   └── hooks/
│
├── .github/
│   └── workflows/
│       └── deploy-web.yml        # CI/CD for GitHub Pages
│
├── app.json                      # Expo configuration
├── tsconfig.json                 # TypeScript configuration (strict mode)
├── package.json                  # Dependencies
├── babel.config.js               # Babel configuration
├── metro.config.js               # Metro bundler configuration
├── eas.json                      # EAS Build configuration
├── firestore.rules               # Firestore security rules
└── README.md                     # Project documentation
```

**Structure Decision**: Using Expo Router file-based routing system with modular component architecture. The structure separates concerns clearly:

- `app/` for screen-level components (routing)
- `components/` for reusable UI components (organized by feature)
- `services/` for business logic and external integrations
- `store/` for state management (Zustand)
- `hooks/` and `contexts/` for shared React patterns
- `types/` for centralized type definitions

This structure supports:

- Clear separation of presentation and logic
- Easy testing of individual components
- Scalability for future features
- Cross-platform code sharing

## Complexity Tracking

**Constitutional Status**: All gates passed - no violations detected

---

## PHASE 0: RESEARCH

**Objective**: Document technology choices, architecture patterns, and implementation strategies before writing code.

**Deliverable**: `research.md` containing:

## Research Topics

### 1. Expo SDK Web Support

**Questions to Answer**:

- How to configure `app.json` for web platform support?
- What are the required dependencies for `react-native-web`?
- How to configure Metro bundler for web builds?
- What are the platform-specific considerations (web vs iOS vs Android)?

**Expected Findings**:

- `npx expo install react-native-web react-dom @expo/metro-runtime` command
- `app.json` platform configuration: `"platforms": ["ios", "android", "web"]`
- Web-specific asset handling and responsive design strategies
- Platform detection patterns using `Platform.OS === 'web'`

### 2. Firestore Offline Persistence

**Questions to Answer**:

- How to enable offline persistence in React Native?
- What is the queueing mechanism for offline changes?
- How to detect online/offline status and notify users?
- What are the conflict resolution strategies?

**Expected Findings**:

- `enableIndexedDbPersistence()` for web, `enablePersistence()` for native
- Firestore automatically queues writes when offline
- Use `NetInfo` from `@react-native-community/netinfo` for network status
- Firestore uses last-write-wins for conflict resolution
- Consider optimistic UI updates for better UX

### 3. Zustand Integration with React Native

**Questions to Answer**:

- How to structure Zustand stores for TypeScript?
- How to persist store state using AsyncStorage?
- How to integrate Zustand with Firestore real-time updates?
- What are the performance optimization strategies?

**Expected Findings**:

- `create<StoreInterface>()` with typed actions and selectors
- `persist` middleware with `AsyncStorage` adapter for state persistence
- Subscribe to Firestore snapshots and update store in real-time
- Use shallow equality checks and selectors to prevent unnecessary re-renders
- Consider `immer` middleware for immutable state updates

### 4. React Native Reanimated Animations

**Questions to Answer**:

- How to implement 60fps animations for task list items?
- What are the gesture handlers for swipe-to-delete?
- How to animate task completion checkboxes?
- What are the web platform considerations for animations?

**Expected Findings**:

- Use `useSharedValue` and `useAnimatedStyle` for declarative animations
- `Gesture.Pan()` for swipe gestures with `runOnJS` for side effects
- `withTiming` and `withSpring` for smooth transitions
- Reanimated 3.x has improved web support via Worklets
- Consider `LayoutAnimation` for simple layout transitions

### 5. Expo Notifications

**Questions to Answer**:

- How to request notification permissions on iOS/Android/Web?
- How to schedule local notifications for task reminders?
- How to handle notification interactions (tapping, dismissing)?
- What are the web platform limitations?

**Expected Findings**:

- `Notifications.requestPermissionsAsync()` for permission handling
- `Notifications.scheduleNotificationAsync()` for scheduling
- `Notifications.addNotificationReceivedListener()` for foreground handling
- `Notifications.addNotificationResponseReceivedListener()` for tap handling
- Web notifications require Service Worker registration
- iOS requires proper entitlements in `app.json`

### 6. GitHub Pages Deployment

**Questions to Answer**:

- How to build Expo web app for static hosting?
- What are the required GitHub Actions workflow steps?
- How to configure routing for SPA on GitHub Pages?
- What are the asset optimization strategies?

**Expected Findings**:

- `npx expo export -p web` to generate static build
- Deploy `dist/` directory to `gh-pages` branch
- Add `404.html` that redirects to `index.html` for client-side routing
- Configure `app.json` with `"baseUrl": "/repo-name/"` if not using custom domain
- Use GitHub Actions with `peaceiris/actions-gh-pages@v3` for automated deployment

### 7. EAS Build Configuration

**Questions to Answer**:

- How to configure `eas.json` for development/preview/production builds?
- What are the build profiles for iOS and Android?
- How to handle environment variables and secrets?
- What are the over-the-air (OTA) update strategies?

**Expected Findings**:

- `eas.json` with profiles: `development` (local testing), `preview` (internal distribution), `production` (store submission)
- `eas build --platform ios/android --profile preview` for build command
- Use `eas.json` `env` field or `.env` files with `app.config.js` for environment variables
- `eas update` for OTA updates to JavaScript/assets without rebuilding native code
- Configure proper signing credentials for iOS (certificates) and Android (keystore)

## Research Success Criteria

- [ ] All 7 research topics documented with concrete examples
- [ ] Code snippets provided for critical configurations
- [ ] Architecture decisions justified with trade-offs
- [ ] Platform-specific considerations documented
- [ ] Performance implications analyzed
- [ ] Security considerations addressed (Firestore rules, notification permissions)

**Note**: This research phase must be completed before Phase 1 design. The findings will inform the data model, type contracts, and quickstart guide.

---

## PHASE 1: DESIGN

**Objective**: Create detailed design artifacts (data models, type contracts, setup guide) that will guide implementation.

**Deliverables**: `data-model.md`, `contracts/types.ts`, `quickstart.md`

## Design Artifacts

### 1. data-model.md

**Content Requirements**:

#### Entity: Task

- Fields: `id`, `title`, `description`, `completed`, `createdAt`, `updatedAt`, `dueDate` (optional)
- Firestore collection structure: `/tasks/{taskId}`
- Indexes required for queries (e.g., `completed` + `createdAt` for sorting)
- Field validation rules (title required, description max 500 chars, etc.)

#### Entity: UserPreferences

- Fields: `theme` ('light' | 'dark'), `notificationsEnabled`
- Storage: AsyncStorage (local only, no sync required for MVP)
- Type-safe keys using enum/const assertions

**Relationships**:

- None for MVP (anonymous tasks, no user authentication)

**Firestore Security Rules**:

- Allow all read/write operations (anonymous access)
- Future: Add user authentication and per-user task isolation

### 2. contracts/types.ts

**Content Requirements**:

```typescript
// Task entity
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

// Firestore document type (dates as Timestamps)
export interface TaskDocument {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  dueDate?: Timestamp;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
}

// Zustand store state
export interface TaskStoreState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
}

// Component prop types
export interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (id: string) => void;
}

export interface EmptyStateProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}
```

**Type Contract Requirements**:

- All entity types strictly typed (no `any`)
- Firestore document types separate from domain types (Timestamp vs Date)
- Store state includes both data and action types
- Component prop types for all major UI components
- Use `Omit`, `Partial`, and `Pick` utility types for derived types

### 3. quickstart.md

**Content Requirements**:

**Prerequisites**:

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Studio (for mobile development)
- Firebase project with Firestore enabled

**Setup Steps**:

1. **Clone repository** (placeholder, repository will be created later)

   ```bash
   git clone <repo-url>
   cd c1-task-manager
   ```

2. **Install dependencies**

   ```bash
   # Use npx expo install for SDK-compatible versions
   npx expo install expo-router react-native-reanimated zustand
   npx expo install firebase @react-native-async-storage/async-storage
   npx expo install expo-notifications @react-native-community/netinfo
   npx expo install react-native-web react-dom @expo/metro-runtime

   # Install dev dependencies
   npm install --save-dev @types/react @types/react-native typescript
   npm install --save-dev jest @testing-library/react-native
   ```

3. **Configure Firebase**

   - Create `firebaseConfig.ts` with your Firebase credentials
   - Enable Firestore in Firebase Console
   - Deploy Firestore security rules from `firestore.rules`

4. **Configure TypeScript**

   - Ensure `tsconfig.json` has `"strict": true`
   - Add path aliases for clean imports (e.g., `@components/*`, `@services/*`)

5. **Run development server**

   ```bash
   npx expo start
   ```

   - Press `w` for web
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator

6. **Run tests**

   ```bash
   npm test
   ```

**Troubleshooting**:

- Metro bundler cache issues: `npx expo start -c`
- iOS build issues: `npx pod-install`
- TypeScript errors: Ensure all dependencies have `@types` packages

**Deployment**:

- Web: See `.github/workflows/deploy-web.yml` for GitHub Pages CI/CD
- Mobile: Use `eas build` for iOS/Android builds (requires EAS account)

## Design Success Criteria

- [ ] `data-model.md` defines all entities with Firestore schema
- [ ] `contracts/types.ts` provides comprehensive TypeScript types
- [ ] `quickstart.md` enables new developers to run the app in < 10 minutes
- [ ] All design artifacts are consistent with constitution principles
- [ ] TypeScript strict mode compliance verified

**After Phase 1 Completion**: Run `.specify/scripts/bash/update-agent-context.sh copilot` to update agent memory with design artifacts.

---

## NEXT STEPS

1. **Generate research.md**: Document findings for all 7 research topics with code examples
2. **Generate design artifacts**: Create `data-model.md`, `contracts/types.ts`, and `quickstart.md`
3. **Update agent context**: Run `update-agent-context.sh copilot` after Phase 1
4. **Run /speckit.tasks**: Generate `tasks.md` with implementation breakdown (separate command)

**Status**: Plan complete, ready for research phase. Constitution gates passed ✅.
