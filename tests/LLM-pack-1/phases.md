# Project Roadmap: SignalSignal

This document outlines the phased development roadmap for the SignalSignal project. Each phase represents a set of logical tasks to be completed.

- [ ] **Phase 1: Project Setup & Core Navigation**
    - [ ] Initialize Next.js project with Tailwind CSS.
    - [ ] Configure `src/app/globals.css` with `@theme` directive for Tailwind v4 tokens.
    - [ ] Implement a responsive left sidebar navigation for Dashboard, Research, and Settings.
    - [ ] Set up basic routing for Dashboard, Research, and Settings pages.

- [ ] **Phase 2: Home Dashboard UI & Data Display**
    - [ ] Design and implement the Home Dashboard layout using a Bento grid aesthetic.
    - [ ] Display mock/static portfolio statistics (e.g., total value, P&L, asset allocation).
    - [ ] Implement a section for recent activities or transactions.
    - [ ] Ensure the UI adheres to the "true-black Bloomberg terminal" aesthetic.

- [ ] **Phase 3: Supabase Realtime Integration (Portfolio Data)**
    - [ ] Integrate Supabase client library `@supabase/supabase-js`.
    - [ ] Implement data fetching for user portfolio positions (crypto and stocks) from Supabase.
    - [ ] Utilize Supabase Realtime Broadcast or Presence channels for live updates to portfolio data on the dashboard.
    - [ ] Display dynamic portfolio statistics and live asset prices.

- [ ] **Phase 4: Research Rooms & Collaborative Features**
    - [ ] Develop the "Research" page with individual "rooms" for specific asset research.
    - [ ] Implement collaborative notes functionality within research rooms using Supabase Realtime.
    - [ ] Integrate Supabase Realtime Presence to show cursor tracking and active users within a research room.
    - [ ] Ensure data persistence for collaborative notes.

- [ ] **Phase 5: Settings & User Experience Refinements**
    - [ ] Implement a basic Settings page (e.g., theme toggles, account info placeholders).
    - [ ] Refine UI/UX across all pages for a consistent, professional "Bloomberg terminal" feel.
    - [ ] Implement robust error handling and loading states for data fetching.
    - [ ] Conduct final performance optimizations and code review.