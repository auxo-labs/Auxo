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
| **TC-10** | Stripe | Checkout & Webhooks | Click "DEEP AI COMPILE", complete checkout, run Stripe CLI forwarder | Updates user credits (+15 or +50 depending on tier), auto-compiles and triggers download | PASS |
| **TC-11** | Security | Supabase RLS | Query profiles table using another user's account credentials | Queries reject or return empty rows; user can only view their own record | PASS |
| **TC-12** | Security | Stripe Signature Verification | Send mock webhook POST request to `/api/webhooks/stripe` without a signature in production | Server blocks request and returns a 500 error code | PASS |
| **TC-13** | Editor | Character Limit warning | Paste text exceeding 30,000 characters into the scratchpad | Text is truncated at 30,000, and character count label turns flashing red | PASS |
| **TC-14** | Settings | LocalStorage corruption | Write an invalid string to `auxo-settings-provider` in LocalStorage and refresh | LocalStorage value is reset to `premium` and workspace loads without crashing | PASS |
| **TC-15** | Support | Landing Support Modal | Click "Support" on homepage navbar, check copy room ID block | Modal opens showing contact channels, but room ID block is hidden (no crash) | PASS |

