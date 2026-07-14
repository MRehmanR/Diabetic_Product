# Diabetics King Brand Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the active frontend to present Diabetics King with an environment-configured phone number, new hero copy, supplied Facebook page, and a warmer public tone.

**Architecture:** Keep the active TanStack frontend as-is and centralize brand/contact values in `frontend/src/lib/data.ts`. The phone display value comes from `VITE_BUSINESS_PHONE` with a safe fallback, while WhatsApp links consume a digit-only derived value. Page components read from `BUSINESS` and receive copy/theme updates without changing backend/admin behavior.

**Tech Stack:** TanStack React Start, Vite environment variables, React, TypeScript, Tailwind CSS v4 tokens, lucide-react.

## Global Constraints

- Active app only: modify `frontend/`; do not update archived `frontend_1/`.
- Business name: `Diabetics King`.
- Phone number: `+16786580698`.
- Phone env key: `VITE_BUSINESS_PHONE`.
- Hero text: `We Buy your Diabetic Unused Products on Top Dollars`.
- Facebook page: `https://www.facebook.com/profile.php?id=61590383957242`.
- WhatsApp links must strip non-digits from the configured phone value.
- Keep backend/API/admin authentication behavior unchanged.
- Existing old-brand email must not be replaced with an invented address.

---

### Task 1: Environment-Backed Business Config

**Files:**
- Modify: `frontend/src/lib/data.ts`
- Modify: `frontend/.env`
- Create: `frontend/.env.example`

**Interfaces:**
- Produces: `BUSINESS.name: string`, `BUSINESS.tagline: string`, `BUSINESS.phone: string`, `BUSINESS.whatsapp: string`, `BUSINESS.facebook: string`.
- Consumes: `import.meta.env.VITE_BUSINESS_PHONE`.

- [ ] **Step 1: Run red contract checks**

Run:

```bash
rg -n "VITE_BUSINESS_PHONE" frontend/src frontend/.env frontend/.env.example
```

Expected before implementation: FAIL/no matches or `frontend/.env.example` missing.

Run:

```bash
rg -n "Diabaticking|web\\.facebook|923253621336|\\+92 325" frontend/src frontend/.env frontend/.env.example
```

Expected before implementation: FAIL with old public brand/phone/Facebook matches.

- [ ] **Step 2: Add env phone resolution**

In `frontend/src/lib/data.ts`, replace the current `BUSINESS` constant with:

```ts
const DEFAULT_BUSINESS_PHONE = "+16786580698";
const businessPhone = import.meta.env.VITE_BUSINESS_PHONE?.trim() || DEFAULT_BUSINESS_PHONE;
const businessWhatsapp = businessPhone.replace(/\D/g, "") || DEFAULT_BUSINESS_PHONE.replace(/\D/g, "");

export const BUSINESS = {
  name: "Diabetics King",
  tagline: "We Buy your Diabetic Unused Products on Top Dollars",
  whatsapp: businessWhatsapp,
  phone: businessPhone,
  email: "info@diabaticking.com",
  facebook: "https://www.facebook.com/profile.php?id=61590383957242",
  city: "United States",
};
```

- [ ] **Step 3: Add frontend env values**

Append this line to `frontend/.env`:

```bash
VITE_BUSINESS_PHONE=+16786580698
```

Create `frontend/.env.example`:

```bash
VITE_API_URL=http://localhost:8000/api
VITE_BUSINESS_PHONE=+16786580698
```

- [ ] **Step 4: Run green config checks**

Run:

```bash
rg -n "VITE_BUSINESS_PHONE" frontend/src frontend/.env frontend/.env.example
```

Expected: PASS with matches in `frontend/src/lib/data.ts`, `frontend/.env`, and `frontend/.env.example`.

Run:

```bash
rg -n "Diabaticking|web\\.facebook|923253621336|\\+92 325" frontend/src frontend/.env frontend/.env.example
```

Expected: only the unchanged operational email may remain in `frontend/src/lib/data.ts`; no old brand display text, old WhatsApp number, old phone display, or `web.facebook` URL.

### Task 2: Public Copy and Metadata Refresh

**Files:**
- Modify: `frontend/src/components/Header.tsx`
- Modify: `frontend/src/components/Footer.tsx`
- Modify: `frontend/src/components/HeroSlideshow.tsx`
- Modify: `frontend/src/routes/__root.tsx`
- Modify: `frontend/src/routes/index.tsx`
- Modify: `frontend/src/routes/about.tsx`
- Modify: `frontend/src/routes/contact.tsx`
- Modify: `frontend/src/routes/products.index.tsx`
- Modify: `frontend/src/routes/products.$id.tsx`
- Modify: `frontend/src/routes/admin.login.tsx`
- Modify: `frontend/src/routes/admin.setup.tsx`
- Modify: `frontend/src/routes/admin.dashboard.tsx`
- Modify: `frontend/src/routes/admin.forgot-password.tsx`
- Modify: `frontend/src/routes/admin.reset-password.tsx`

**Interfaces:**
- Consumes: `BUSINESS` from `frontend/src/lib/data.ts`.
- Produces: public metadata, headings, alt text, hero copy, and CTAs reflecting `Diabetics King`.

- [ ] **Step 1: Replace old brand text in metadata and navigation**

Update titles, OG metadata, header logo alt text, footer logo alt text, and visible headings from `Diabaticking` to `BUSINESS.name` or the literal `Diabetics King`.

- [ ] **Step 2: Update hero section copy**

In `frontend/src/routes/index.tsx`, set the H1 to:

```tsx
We Buy your Diabetic Unused Products on Top Dollars
```

Set the supporting paragraph to a warm, direct message:

```tsx
Tell us what sealed diabetic products you have, share the condition and expiry, and we will follow up on WhatsApp with a fair offer.
```

- [ ] **Step 3: Remove customer-facing backend wording**

Replace visible public phrases like `backend catalog`, `backend form`, and `backend connected` with customer-friendly wording such as `current buying list`, `quick offer form`, and `review team`.

- [ ] **Step 4: Keep old email out of public contact display**

Because no new email was provided, remove the footer/contact visible email rows and email icon imports. Keep the stored `BUSINESS.email` value unchanged for now.

- [ ] **Step 5: Run copy checks**

Run:

```bash
rg -n "Diabaticking|backend catalog|backend form|backend connected|Backend Catalog|backend-powered|web\\.facebook|923253621336|\\+92 325" frontend/src
```

Expected: only admin route titles may contain `Admin ... - Diabetics King`; no old brand, backend-facing public language, old phone, old WhatsApp number, or old Facebook URL.

### Task 3: Warm Friendly Theme Update

**Files:**
- Modify: `frontend/src/styles.css`

**Interfaces:**
- Produces: updated CSS variables used by existing Tailwind utilities.

- [ ] **Step 1: Update theme tokens**

Adjust `:root` and `.dark` tokens toward the selected friendly/optimistic direction: warm ivory background, golden primary, muted green secondary, calm teal WhatsApp, and soft shadows. Preserve existing variable names so components keep working.

- [ ] **Step 2: Run theme scan**

Run:

```bash
rg -n "0\\.62 0\\.17 251|0\\.71 0\\.17 152|#1E88E5|#4CAF50" frontend/src/styles.css
```

Expected: no matches for the old blue/green theme comments or primary token values.

### Task 4: Verification and Commit

**Files:**
- Verify: `frontend/src`
- Verify: `frontend/.env`
- Verify: `frontend/.env.example`

**Interfaces:**
- Consumes: all previous task outputs.
- Produces: a verified working tree ready for the next CI/CD task.

- [ ] **Step 1: Run final brand/static checks**

Run:

```bash
rg -n "Diabaticking|web\\.facebook|923253621336|\\+92 325" frontend/src frontend/.env frontend/.env.example
```

Expected: only the unchanged email string may remain.

Run:

```bash
rg -n "Diabetics King|We Buy your Diabetic Unused Products on Top Dollars|VITE_BUSINESS_PHONE|facebook.com/profile.php\\?id=61590383957242" frontend/src frontend/.env frontend/.env.example
```

Expected: matches for the requested business name, hero text, env key, and Facebook URL.

- [ ] **Step 2: Attempt frontend verification**

Run:

```bash
cd frontend && npm run lint
cd frontend && npm run build
```

Expected on a machine with Node/npm installed: PASS. If this machine still lacks Node/npm, record the exact blocker.

- [ ] **Step 3: Inspect git status**

Run:

```bash
git status --short
```

Expected: only intended frontend/docs files plus pre-existing untracked root `.gitignore` and `.superpowers/`.

- [ ] **Step 4: Commit implementation**

Run:

```bash
git add docs/superpowers/plans/2026-07-14-brand-refresh.md frontend/src frontend/.env frontend/.env.example
git commit -m "feat: refresh Diabetics King branding"
```

Expected: commit succeeds without staging root `.gitignore` or `.superpowers/`.
