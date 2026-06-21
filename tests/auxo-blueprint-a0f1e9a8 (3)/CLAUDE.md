# CLI Runtime Executive

This document outlines the standard and safe command-line interface (CLI) commands for developing, building, and testing the Scope3-Pulse application. Always use these commands for consistency and stability.

## Development Server
To start the local development server with hot-reloading:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Build Process
To compile the application for production deployment:
```bash
npm run build
# or
yarn build
# or
pnpm build
```

## Linting & Code Formatting
To lint the codebase and automatically fix any applicable formatting issues:
```bash
npm run lint -- --fix
# or
yarn lint --fix
# or
pnpm lint --fix
```
To check for linting errors without fixing:
```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Testing
To run all automated tests:
```bash
npm run test
# or
yarn test
# or
pnpm test
```
To run tests in watch mode (useful during development):
```bash
npm run test -- --watch
# or
yarn test --watch
# or
pnpm test --watch
```