# CLI Runtime Executive

This document outlines the explicit, safe command-line interface (CLI) commands for developing, building, and maintaining the SignalSignal project.

## Development

*   **Start Development Server**:
    ```bash
    npm run dev
    ```
    (Alias for `next dev`)

## Build & Deployment

*   **Build for Production**:
    ```bash
    npm run build
    ```
    (Alias for `next build`)

*   **Start Production Server (after build)**:
    ```bash
    npm run start
    ```
    (Alias for `next start`)

## Code Quality & Testing

*   **Lint Codebase**:
    ```bash
    npm run lint
    ```
    (Alias for `next lint`)

*   **Run Tests**:
    ```bash
    npm test
    ```
    (Assumes a configured testing framework like Jest or React Testing Library)