# TESTING.md - Auxo Playground Test Plan

The following test cases describe the verification procedures for the core functionalities of the Auxo platform:

| Test ID | Component | Description | Steps | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Landing | Sandbox Creation | Click "Create Anonymous Sandbox" on home page | Instantly routes to `/room/[uuid]` with generated UUID | PASS |
| **TC-02** | Editor | Text Editor Feedback | Type inside the collaborative scratchpad | Word/character counters update in real-time | PASS |
| **TC-03** | Realtime | Broadcast Synchronization | Open the same URL in two side-by-side tabs; type in Tab A | Text syncs instantly to Tab B without cursor jumping | PASS |
| **TC-04** | Presence | Active Users Tracker | Connect multiple windows to the same sandbox room | Builder presence count matches total active tabs | PASS |
| **TC-05** | Compiler | LLM Server Action | Type outlines and click "Compile Agent Pack" | Shows spinner, calls Server Action, returns structured files | PASS |
| **TC-06** | Exporter | Pack Zip Exporter | Click "Compile Agent Pack" | Initiates download of `auxo-blueprint-[roomId].zip` | PASS |
| **TC-07** | Exporter | Directory Matrix | Extract and inspect the downloaded `.zip` file | Contains root `AGENTS.md`, `CLAUDE.md`, and folder `.cursor/rules/` | PASS |
| **TC-08** | Auth | Magic Link Login | Click "SIGN IN" in toolbar, enter email, click send, open OTP link | Redirects back to active room, logs user in, and fetches profile credits | PASS |
| **TC-09** | Compiler | Basic vs Premium Compile | Click "COMPILE BASIC" (Free) vs "DEEP AI COMPILE" (Premium) | Basic runs instantly. Premium requests Stripe checkout if no credits / not logged in | PASS |
| **TC-10** | Stripe | Checkout & Webhooks | Click "DEEP AI COMPILE", complete checkout, run Stripe CLI forwarder | Updates user credits (+3) or applies lifetime status, auto-compiles and triggers download | PASS |
