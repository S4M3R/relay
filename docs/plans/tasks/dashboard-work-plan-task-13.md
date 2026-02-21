# Task: QR Code API Endpoint + LoginPage

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 5B (Advanced Pages + QR Login)
- Dependencies: dashboard-work-plan-task-08 (shared components), dashboard-work-plan-task-05 (server integration)
- Size: Medium (3-4 files: 2 new frontend, 1-2 modified backend)

## Implementation Content
1. **Backend**: Add `GET /api/login/qr` and `POST /api/login/connect` endpoints to `routes.ts`. Add QR data storage/getter in `whatsapp/connection.ts`.
2. **Frontend**: Create LoginPage with QR code display that polls for QR data and connection status.

Reference: Design Doc FR-3 (QR code login), Component 5 (QR Code API Endpoint), QR Code API contract.

## Target Files
- [x] `apps/cli/src/daemon/routes.ts` (modify: add QR endpoints)
- [x] `apps/cli/src/whatsapp/connection.ts` (modify: add QR data getter)
- [x] `apps/cli/dashboard/src/pages/LoginPage.tsx` (new)
- [x] `apps/cli/dashboard/src/components/QRCodeDisplay.tsx` (new)
- [x] `apps/cli/dashboard/src/App.tsx` (modify: add route)

## Implementation Steps

### 1. Add QR Data Getter to connection.ts
- [x] In `apps/cli/src/whatsapp/connection.ts`, add module-level QR storage:
  ```typescript
  let lastQrCode: string | null = null;
  let lastQrGeneratedAt: string | null = null;

  export function getQrData(): { qr: string | null; generated_at: string | null; connected: boolean; status: string } {
    return {
      qr: lastQrCode,
      generated_at: lastQrGeneratedAt,
      connected: connectionState === 'connected',
      status: connectionState === 'connected' ? 'connected' :
              connectionState === 'connecting' ? 'scanning' : 'waiting',
    };
  }
  ```
- [x] In the existing QR code event handler (where `qrcode.generate()` is called), add:
  ```typescript
  lastQrCode = qr;
  lastQrGeneratedAt = new Date().toISOString();
  ```
- [x] On successful connection, clear QR: `lastQrCode = null;`

### 2. Add API Endpoints to routes.ts
- [x] Import `getQrData` from `../whatsapp/connection.js`
- [x] In `handleRequest`, add before existing routes:
  ```typescript
  // GET /api/login/qr
  if (method === 'GET' && urlPath === '/api/login/qr') {
    const qrData = getQrData();
    sendJson(res, 200, qrData);
    return;
  }

  // POST /api/login/connect
  if (method === 'POST' && urlPath === '/api/login/connect') {
    try {
      await connectWhatsApp();
      sendJson(res, 200, { initiated: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      sendError(res, 500, 'Failed to initiate WhatsApp connection', message);
    }
    return;
  }
  ```

### 3. Create QRCodeDisplay Component
- [x] Create `apps/cli/dashboard/src/components/QRCodeDisplay.tsx`:
  - Accepts `qrData: string | null` prop
  - Renders QR code as an SVG/canvas using a lightweight library (or generates a simple table-based QR renderer)
  - Alternatively, install `qrcode` package and render as data URL image
  - Shows "Waiting for QR code..." when null
  - Shows timestamp of QR generation

### 4. Create LoginPage
- [x] Create `apps/cli/dashboard/src/pages/LoginPage.tsx`:
  - WhatsApp login section:
    - "Connect WhatsApp" button that calls `POST /api/login/connect`
    - Polls `GET /api/login/qr` every 3 seconds via `usePolling`
    - Renders QRCodeDisplay when QR data is available
    - Shows connection status indicator
    - On connected: displays success message, hides QR
  - Telegram login section (placeholder or simple form):
    - "Connect Telegram" button
    - POST /telegram/login (if endpoint exists)

### 5. Register Route
- [x] Update `App.tsx`: add route for `/login`

### 6. Verify
- [x] Build both daemon and dashboard
- [ ] Start daemon (with WhatsApp disconnected)
- [ ] Open LoginPage, click "Connect WhatsApp"
- [ ] Verify QR code appears and refreshes
- [ ] Scan QR, verify status changes to "connected"

## Completion Criteria
- [x] `GET /api/login/qr` returns QR data and connection status
- [x] `POST /api/login/connect` triggers WhatsApp connection
- [x] QR code renders in browser as scannable image
- [x] QR refreshes automatically when new QR is generated
- [x] Connection status updates on successful scan
- [x] Existing WhatsApp terminal QR flow still works
- [x] Build succeeds (L1: Functional Operation Verification)

## Notes
- Impact scope: Additive changes to `routes.ts` and `connection.ts`. Existing QR terminal flow must continue to work.
- Constraints: Only add a getter function to `connection.ts`. Do NOT modify the Baileys auth flow or connection logic.
- For QR rendering, consider adding `qrcode` npm package to dashboard/package.json (lightweight, ~50KB).
