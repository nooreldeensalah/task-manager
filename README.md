# C1 Task Manager

[![Deploy Web Export to GitHub Pages](https://github.com/nooreldeensalah/c1-task-manager/actions/workflows/deploy-web.yml/badge.svg)](https://github.com/nooreldeensalah/c1-task-manager/actions/workflows/deploy-web.yml)
[![EAS Preview Builds](https://github.com/nooreldeensalah/c1-task-manager/actions/workflows/eas-build.yml/badge.svg)](https://github.com/nooreldeensalah/c1-task-manager/actions/workflows/eas-build.yml)

C1 Task Manager is a polished, cross-platform task tracker built with Expo and React Native. It supports authenticated, user-scoped task management on iOS, Android, and the web, with a single-page web export that can be hosted on GitHub Pages. The codebase is TypeScript-first, Firebase-backed, and wired for automated Expo Application Services (EAS) releases.

>[!NOTE]
> This project follows a spec-driven development approach using [GitHub's Spec Kit](https://github.com/github/spec-kit) to define and guide its requirements and implementation.

## Core Functionality

- Add new tasks with validated titles, optional descriptions, and due date.
- Mark tasks complete or incomplete from the list, with quick toggles on the detail view.
- Delete tasks with confirmation to prevent accidental loss.
- Cross-platform real-time updates that stay in sync via Firestore.
- Filter by status and search titles/descriptions instantly.
- Dive into a dedicated task detail screen for rich editing, due date adjustments, and activity timestamps.
- Authenticate with email/password (Firebase Authentication) and keep sessions across devices.
- User-scoped tasks with complete data isolation between accounts.
- Toggle light/dark themes, responsive layouts, and accessibility-friendly defaults across platforms.

## Technology Stack

- **Frontend**: Expo SDK 54, React Native 0.81, Expo Router navigation, TypeScript.
- **Backend**: Firebase Authentication + Cloud Firestore to ensure cross-platform experience with proper synchronization.
- **Build tooling**: Expo CLI, EAS CLI, GitHub Actions for CI/CD.

## Getting Started

### 1. Prerequisites

- Node.js 22+ (Node 24.x is used in CI) and npm 9+.
- Expo CLI (optional, `npm install -g expo-cli`) or rely on `npx`.
- A Firebase project with Authentication and Firestore enabled.

### 2. Environment Variables

Create a `.env` with these variables

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the App

- Launch the Metro bundler:

```bash
  npx expo start
```

The Task Manager requires users to register or sign in before accessing task data. All task operations are scoped to the logged-in Firebase user.

## Web Export (SPA on GitHub Pages)

The project is configured for Expo's static web export so the exact app ships as a single-page application hosted on GitHub Pages:

Because the export is a SPA, navigation and task detail routes work seamlessly when deployed to Pages.

## Continuous Delivery

- **Expo web → GitHub Pages** (`.github/workflows/deploy-web.yml`)
  Runs on pushes to `main`, pull requests, or manual dispatches. It installs dependencies, performs `expo export --platform web`, and deploys the artifact to GitHub Pages. Firebase credentials are injected through repository secrets, and concurrency safeguards keep deployments serialized.

- **EAS preview builds** (`.github/workflows/eas-build.yml`)
  Automates `eas build` for Android (extendable to iOS) using the `preview` profile. It authenticates with `EXPO_TOKEN`, waits for completion, downloads the latest artifact, and uploads it to the workflow summary for distribution to testers. The same workflow with minor modifications can be used to create GitHub Releases as well!

## Project Structure

- `app/` - Expo Router entry points (`index`, `task/[id]`, modal flow).
- `components/` - Reusable UI (task list/detail, inputs, themed controls, auth screens).
- `contexts/` - Providers for authentication, theme, and task state.
- `hooks/` - Typed hooks for consuming context and business logic.
- `services/` - Firebase integration for auth, Firestore, and (future) notifications.
- `reducers/` - Task reducer/state machine.
- `utils/` - Formatting, validation, and error helpers.
- `specs/` - Product specification, sprint plan, and acceptance criteria crafted with [GitHub Spec Kit](https://github.com/github/spec-kit).
- `.github/workflows/` - CI/CD definitions for web deploys and EAS builds.

## Firestore Security

Custom security rules live in `firestore.rules`. Deploy them with the Firebase CLI to ensure each user can only access their own tasks.
