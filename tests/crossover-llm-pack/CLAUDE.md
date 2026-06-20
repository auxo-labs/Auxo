# CLI Runtime Executive

This document outlines the explicit and safe commands for developing, building, linting, and testing the CareWorkspace Clinic Portal application.

## Development Commands

*   **Start Development Server**: Runs the Next.js development server with hot module reloading.
    ```bash
    npm run dev
    ```
    (Equivalent to `next dev`)

## Build Commands

*   **Build Production Application**: Compiles the application for production deployment.
    ```bash
    npm run build
    ```
    (Equivalent to `next build`)

*   **Start Production Server**: Serves the previously built production application. This command should only be used after `npm run build`.
    ```bash
    npm run start
    ```
    (Equivalent to `next start`)

## Code Quality Commands

*   **Lint Project**: Runs ESLint to identify and report on patterns found in JavaScript/TypeScript code, ensuring code quality and consistency.
    ```bash
    npm run lint
    ```
    (Equivalent to `next lint`)

## Testing Commands

*   **Run Tests**: Executes the project's test suite. (Assuming a standard test runner like Jest or Vitest).
    ```bash
    npm run test
    ```