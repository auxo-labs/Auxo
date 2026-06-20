# CareWorkspace Clinic Portal - CLI Runtime Executive

This document lists the explicit, safe, and sanctioned command-line interface (CLI) commands for developing, building, linting, and testing the CareWorkspace Clinic Portal. Agents MUST only use these commands.

## Development Commands

*   **Start Development Server:**
    ```bash
    npm run dev
    ```
    This command initiates the Next.js development server, typically accessible at `http://localhost:3000`. It includes hot-reloading for development efficiency.

## Build Commands

*   **Build Production Application:**
    ```bash
    npm run build
    ```
    This command compiles the Next.js application for production deployment, optimizing assets and code.

## Code Quality & Testing Commands

*   **Run Linter:**
    ```bash
    npm run lint
    ```
    This command executes ESLint to check for code style inconsistencies, potential errors, and enforce coding standards.

*   **Run Tests:**
    ```bash
    npm run test
    ```
    This command executes the project's test suite to ensure functionality and prevent regressions.