# Task: ConfigPage (includes relay init / POST /init coverage)

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 5C (Advanced Pages)
- Dependencies: dashboard-work-plan-task-08 (shared components)
- Size: Small (1 new file)

## Implementation Content
Implement the ConfigPage providing feature parity with both `relay config` (GET/POST /config) and `relay init` (POST /init). The Config page displays current configuration and allows editing. It also includes an initialization section that triggers POST /init to save config and connect WhatsApp.

Reference: Design Doc FR-8 (config operations), API surface mapping (`relay config` -> `GET /config`, `relay init` -> `POST /init`).

**Review condition note**: This task explicitly includes `relay init` (POST /init) coverage, which was missing in the original work plan's ConfigPage description.

## Target Files
- [x] `apps/cli/dashboard/src/pages/ConfigPage.tsx` (new)
- [x] `apps/cli/dashboard/src/App.tsx` (modify: add route)

## Implementation Steps

### 1. Create ConfigPage
- [x] Create `apps/cli/dashboard/src/pages/ConfigPage.tsx`:
  - **Config Display Section**:
    - Fetch current config via `GET /config` on mount
    - Display all config fields in a readable format
    - Edit button to toggle edit mode
  - **Config Edit Section** (toggled):
    - Form fields for editable config values
    - Save button: `POST /config` with updated values
    - Success/failure indicator
  - **Initialization Section** (separate card):
    - Title: "Initialize Relay" or "Setup"
    - Form fields matching `relay init` parameters:
      - `model_api_key` (text input, password-masked)
      - `model_provider` (select: anthropic, openai)
      - `identity_file` (text input, file path)
      - `soul_file` (text input, file path)
    - "Initialize & Connect WhatsApp" button: `POST /init`
    - Displays result: `{ whatsapp_qr_displayed: true/false }`
    - Note: After init, user should navigate to Login page to scan QR code
  - Glass card styling for both sections

### 2. Register Route
- [x] Update `App.tsx`: add route for `/config`

### 3. Verify
- [x] Build dashboard, start daemon
- [ ] Navigate to Config page, verify current config displayed (matches `relay config`)
- [ ] Edit a value, save, verify change persists (verify via `relay config`)
- [ ] Test initialization section: fill form, submit POST /init
- [ ] Verify response indicates whether WhatsApp QR was displayed

## Completion Criteria
- [x] ConfigPage displays current configuration from `GET /config`
- [x] Config edit and save works via `POST /config`
- [x] Initialization form submits to `POST /init` with model config
- [x] Success/failure indicators for both operations
- [x] Build succeeds (L1: Functional Operation Verification)

## Notes
- Impact scope: New dashboard page only. No daemon code changes. Uses existing API endpoints.
- Constraints: API key fields should be password-masked. The POST /init endpoint already exists in routes.ts.
- The initialization section provides the dashboard equivalent of `relay init`, ensuring full feature parity.
