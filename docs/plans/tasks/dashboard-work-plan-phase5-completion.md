# Phase 5 Completion: Advanced Pages + QR Login

Plan: dashboard-work-plan.md
Tasks in Phase: dashboard-work-plan-task-12, dashboard-work-plan-task-13, dashboard-work-plan-task-14, dashboard-work-plan-task-15

## Task Completion Checklist
- [ ] Task 12: TranscriptPage
- [ ] Task 13: QR Code API endpoint + LoginPage
- [ ] Task 14: CallPage + TelegramLoginPage
- [ ] Task 15: ConfigPage (includes relay init / POST /init)

## Phase Completion Criteria
- [ ] TranscriptPage shows messages in chat-style view with 3-second polling
- [ ] New messages append without scroll position loss
- [ ] QR code renders in browser and refreshes when new QR is generated
- [ ] WhatsApp connection status updates in dashboard after successful QR scan
- [ ] ConfigPage displays and saves configuration
- [ ] ConfigPage includes relay init (POST /init) form
- [ ] CallPage form submits call initiation
- [ ] TelegramLoginPage triggers auth flow
- [ ] All 9 dashboard pages functional
- [ ] Build succeeds: `npm run build` from `apps/cli/`

## E2E Verification Procedures
1. Build and start daemon: `cd apps/cli && npm run build && relay start`
2. Open dashboard: `relay dashboard`
3. **Transcript**: Navigate to a transcript page, verify messages match `relay transcript <id>`, wait for polling update
4. **QR Login**: Navigate to Login page, click "Connect WhatsApp", verify QR code appears, scan with phone, verify status changes to "connected"
5. **Config**: Navigate to Config page, verify settings match `relay config`, edit a value, save, verify change via `relay config`
6. **Init**: On Config page, fill initialization form, submit, verify POST /init response
7. **Call**: Navigate to Call page, fill form, verify submission reaches daemon (check daemon logs)
8. **Telegram**: Navigate to Telegram Login, verify auth flow triggers
