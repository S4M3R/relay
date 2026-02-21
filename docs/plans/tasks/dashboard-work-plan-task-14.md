# Task: CallPage + TelegramLoginPage

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 5C (Advanced Pages)
- Dependencies: dashboard-work-plan-task-08 (shared components)
- Size: Small (2 new files)

## Implementation Content
Implement CallPage and TelegramLoginPage for feature parity with `relay call` and `relay telegram-login` CLI commands.

Reference: Design Doc FR-9 (call command), FR-10 (telegram login).

## Target Files
- [x] `apps/cli/dashboard/src/pages/CallPage.tsx` (new)
- [x] `apps/cli/dashboard/src/pages/TelegramLoginPage.tsx` (new)
- [x] `apps/cli/dashboard/src/App.tsx` (modify: add routes)

## Implementation Steps

### 1. Create CallPage
- [x] Create `apps/cli/dashboard/src/pages/CallPage.tsx`:
  - Form fields matching `relay call` parameters:
    - `to_number` (text input, required, E.164 format)
    - `phone_number_id` (text input, required)
    - `elevenlabs_api_key` (text input, required, password-masked)
    - `prompt` (textarea, required)
    - `first_message` (textarea, required)
    - `voice_id` (text input, optional)
    - `language` (text input, optional)
  - Submit via `POST /call` using `apiPost`
  - On success: display call initiation status (agent_id, conversation_id)
  - On error: display error message
  - Glass card styling

### 2. Create TelegramLoginPage
- [x] Create `apps/cli/dashboard/src/pages/TelegramLoginPage.tsx`:
  - Display current Telegram connection status (from `GET /status` -> `telegram_connected`)
  - "Connect Telegram" button that POSTs to `/telegram/login` (or relevant endpoint)
  - Display auth flow status/result
  - Instructions text explaining the Telegram bot setup process

### 3. Register Routes
- [x] Update `App.tsx`: add routes for `/call` and `/telegram-login`

### 4. Verify
- [x] Build dashboard
- [ ] Navigate to Call page, verify form renders
- [ ] Navigate to Telegram Login page, verify status display
- [ ] Submit call form (if ElevenLabs credentials available), verify response

## Completion Criteria
- [x] CallPage form renders with all `relay call` parameters
- [x] CallPage submits to `POST /call` and displays result
- [x] TelegramLoginPage shows connection status and auth trigger
- [x] Build succeeds (L1: Functional Operation Verification)

## Notes
- Impact scope: New dashboard pages only. No daemon code changes.
- Constraints: ElevenLabs API key should be masked in the form (password input type).
- These pages provide feature parity with existing CLI commands. The API endpoints already exist.
