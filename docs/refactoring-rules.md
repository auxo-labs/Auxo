# Refactoring & Coding Guidelines

This document outlines the core coding principles and best practices that the team will follow during the refactoring process and all future development. Adhering to these rules ensures our codebase remains clean, maintainable, and highly readable.

---

## 1. Core Coding Principles

### **DRY (Don't Repeat Yourself)**

- **Rule**: Every piece of knowledge or logic must have a single, unambiguous, authoritative representation within a system.

### **KISS (Keep It Simple, Stupid)**

- **Rule**: Most systems work best if they are kept simple rather than made complicated.

### **YAGNI (You Aren't Gonna Need It)**

- **Rule**: Always implement things when you actually need them, never when you just foresee that you _might_ need them.

### **SOLID Principles**

While primarily for Object-Oriented Programming, these concepts apply broadly:

- **S**ingle Responsibility Principle: A component or function should do one thing and have only one reason to change.
- **O**pen/Closed Principle: Code should be open for extension but closed for modification.
- **L**iskov Substitution Principle: Subtypes must be substitutable for their base types.
- **I**nterface Segregation Principle: Don't force components to depend on interfaces (or props) they don't use.
- **D**ependency Inversion Principle: High-level modules should not depend on low-level modules; both should depend on abstractions.

---

## 2. Naming Conventions

### **Semantic Variable Names**

- **Rule**: Variables, functions, and classes must have clear, intention-revealing names. It should be totally obvious what a variable holds without needing to read its context.
- **DO**:
  - `isActiveUser` (boolean)
  - `fetchUserCoordinates()` (function)
  - `maxRetries` (constant)
- **DON'T**:
  - `flag` or `x`
  - `getData()` (Too vague—what data?)
  - `usrCoords` (Don't use arbitrary abbreviations, just write `userCoordinates`)

---

## 3. Commenting Practices

### **Good Use of Comments**

- **Rule**: Code should explain _what_ it is doing cleanly enough that comments aren't needed for the mechanics. Comments should explain _why_ something is done.
- **Application**:
  - Use comments to explain complex business logic, regulatory rules, or strange workarounds for external bugs.
  - Do not write comments that just restate the code (e.g., `// adds 1 to i`).
  - Keep comments up to date; an outdated comment is worse than no comment at all.

### **JSDoc / TSDoc Standardized Comments**

- **Rule**: All major files, exported functions, and complex interfaces must use standardized JSDoc/TSDoc block comments to document their purpose and API.
- **Application**:
  - Type `/**` above a function and hit enter.
  - Doing this will automatically generate the standard structure containing `@param` and `@returns` tags based on your TypeScript properties.

---

## 4. TypeScript Specific

- Avoid `any` at all costs

---

## 5. React Hooks & ESLint Compliance

### **Avoid Synchronous SetState in Effects (`react-hooks/set-state-in-effect`)**

- **Rule**: Never call state-setting functions (like `setProfile`, `setCredits`, etc.) directly or synchronously inside the body of a `useEffect` hook. Doing so triggers cascading rendering passes that harm browser performance and violates standard rules.
- **DO**:
  - Query and update state variables inside asynchronous event callback hooks (such as event triggers or Supabase `onAuthStateChange` callbacks).
  - Use handlers or callback functions for updating state variables after network resolutions.
- **DON'T**:
  - Register a separate `useEffect` hook that listens to a variable (e.g., `user`) just to run a fetch function that synchronously calls `setState`.

### **Unused Variables & Imports (`@typescript-eslint/no-unused-vars`)**

- **Rule**: Clean up all unused type imports, functions, and variables before compiling. The Next.js production build runs strict TypeScript verification and will fail if unused items are present.

