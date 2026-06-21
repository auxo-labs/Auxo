# Auxo System Architecture & Service Flow

This document details the architectural layout, authentication flows, Stripe payment handshakes, and Bring Your Own Key (BYOK) execution pipeline for Auxo.

---

## 1. Architectural Overview

Auxo operates on a stateless server API layer backed by ephemeral real-time messaging on the client, client-side configuration caches, and optional Supabase authentication + Stripe billing infrastructure.

```mermaid
graph TB
    Client[Client UI: React Workspace]
    API[Next.js API Handler: /api/compile]
    DB[(Supabase PostgreSQL)]
    Stripe[Stripe API & Webhooks]
    LLM[Generative AI: Gemini / Anthropic / OpenAI]

    Client -->|1. Realtime Broadcast & Presence| DB
    Client -->|2. POST Request: notes + userConfig| API
    API -->|3. Validate Credits / Auth token| DB
    API -->|4. Resolve Versions| NPM[NPM Registry API]
    API -->|5. Forward Prompt| LLM
    Stripe -->|6. Webhook: session.completed| DB
```

---

## 2. Authentication & User Profile Synchronization

Auxo uses passwordless Magic Link logins powered by Supabase OTP auth. The public user profile holds credit balances and lifetime pass flags.

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer (Daniel)
    participant Client as React Client (room/[id]/page.tsx)
    participant Auth as Supabase Auth Service
    participant DB as Supabase PostgreSQL
    participant Webhook as Stripe Webhook Route

    User->>Client: Enters email & requests magic link
    Client->>Auth: signInWithOtp({ email, emailRedirectTo })
    Auth-->>User: Sends email containing verification link
    User->>Client: Clicks link, redirected back to room URL
    Client->>Auth: Handles redirect, establishes active session
    Note over DB: PostgreSQL Trigger: public.create_profile_for_user()<br/>automatically inserts public.profiles record
    Client->>DB: Queries user profile credentials
    DB-->>Client: Returns profile data (credits: 0, is_lifetime: false)
    Client->>Client: Splits email (daniel@domain.com) -> Displays "DANIEL"
```

---

## 3. The Compile Pipeline & Gateways

Auxo supports three compilation triggers. The route handler at `/api/compile` filters requests based on user configuration and authentication status.

### A. Hosted Premium Compile (Authenticated + Gated)
If Stripe billing is enabled and no client-side custom keys are present, compiles consume credits.

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer
    participant Client as React Client
    participant API as /api/compile
    participant DB as Supabase Profiles
    participant LLM as hosted AI Model (gpt-4o-mini)

    User->>Client: Clicks "DEEP AI COMPILE"
    Client->>Client: Check: Does user have custom local keys? (No)
    Client->>API: POST /api/compile with User JWT Header
    API->>DB: Verifies user profile has credits / lifetime pass
    DB-->>API: Credits > 0
    API->>DB: Decrements credits by 1
    API->>LLM: Fetches hosted compile template
    LLM-->>API: Stream output
    API-->>Client: Returns CompiledPack JSON
```

### B. BYOK Bypass Compile (Free + Local Key)
If the user configures custom keys, the entire billing database layer is bypassed, routing directly to the developer's private AI endpoint via server proxies.

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer
    participant Client as React Client
    participant API as /api/compile
    participant LLM as Selected Provider (Gemini / Anthropic / OpenAI)

    User->>Client: Enters private key & select model in Settings
    Client->>Client: Caches details in localStorage
    User->>Client: Clicks "DEEP AI COMPILE"
    Client->>API: POST /api/compile (Includes userConfig API Key & Model)
    Note over API: Server checks: userConfig.apiKey is present.<br/>Bypasses auth and DB billing rules!
    API->>LLM: fetch(generativelanguage.googleapis.com) using Daniel's key
    LLM-->>API: Stream output
    API-->>Client: Returns CompiledPack JSON
```

---

## 4. Key Directory & Code Mappings

To trace execution paths, reference the following codebase locations:
- **Client Workspace Page:** [room/page.tsx](../src/app/room/[id]/page.tsx)
- **Settings configuration:** [settings-modal.tsx](../src/components/settings-modal.tsx)
- **Supabase initialization:** [supabase.ts](../src/lib/supabase.ts)
- **Tech Stack Registry Resolver:** [tech-resolver.ts](../src/lib/tech-resolver.ts)
- **LLM Compiler logic:** [prompt-compiler/](../src/lib/prompt-compiler/) (modular folder)
- **Stripe Webhook handler:** [route.ts](../src/app/api/webhooks/stripe/route.ts) (Stripe webhooks)
