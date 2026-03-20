# TODO-ACCOUNT.md - Center Owner Account Page

## Status: [Completed ✅]

### Steps:
- [x] 1. Create src/app/(protected)/account/page.js with form UI (Details + Security sections, edit/save, PUT API for username/password)
- [x] 2. Update src/components/AppShell.js: add Account nav link after Earnings (CO only), add title for /account
- [x] 3. API already supports PUT username/password
- [x] 4. Ready to test

**Test command:** `npm run dev`

Login as center owner (owner.lucena / owner123), select center, navigate Dashboard > Center Info > Earnings > **Account**, toggle Edit, change username/password (match confirm), Save.

**UI:** Matches dashboard/earnings/centers: indigo/purple gradients, User/Lock icons (inline SVG), form validation, restricted CO only.

**Features:** Edit username/password (API persist), name/email/phone (mock log), password confirm.

**Notes:** Owner details mock-generated (enhance mocks/DB later for persist).
