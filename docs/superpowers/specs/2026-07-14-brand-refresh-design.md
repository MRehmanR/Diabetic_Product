# Diabetics King Brand Refresh Design

## Scope

This phase updates the active TanStack frontend in `frontend/`. It does not modify the archived Next.js implementation in `frontend_1/`, backend behavior, admin credentials, or EC2 deployment. CI/CD will be designed separately after the site refresh is complete.

## Brand and Content

- The public business name is `Diabetics King`.
- The homepage hero heading is exactly `We Buy your Diabetic Unused Products on Top Dollars`.
- The business phone number is `+16786580698` and is read from the frontend environment as `VITE_BUSINESS_PHONE`.
- WhatsApp URLs derive their digit-only recipient value from the configured phone number, so one environment change updates both displayed phone numbers and WhatsApp destinations.
- The Facebook URL is `https://www.facebook.com/profile.php?id=61590383957242` and appears in the existing hero and footer links.
- Public headings, descriptions, image alternative text, page titles, Open Graph metadata, and customer-facing messages use `Diabetics King` instead of `Diabaticking`.
- Supporting copy uses plain, friendly language focused on fair offers, easy steps, and help from real people. Technical implementation details such as “backend catalog” do not appear in customer-facing marketing copy.

## Configuration

`frontend/src/lib/data.ts` remains the single application-level business configuration module. It reads `import.meta.env.VITE_BUSINESS_PHONE`, trims it, and falls back to `+16786580698` when the variable is missing or blank. The displayed phone preserves the configured value. The WhatsApp recipient removes all non-digit characters.

`frontend/.env.example` documents:

```dotenv
VITE_API_URL=http://localhost:8000/api
VITE_BUSINESS_PHONE=+16786580698
```

The existing local `frontend/.env` receives the phone setting for immediate local use, but remains ignored as runtime configuration. No secrets are committed.

## Visual Direction

The selected direction is “Friendly & Optimistic.” The interface keeps its current structure and components while changing its visual character:

- warm ivory backgrounds replace cool white and blue-gray surfaces;
- golden ochre is the primary brand accent;
- a muted, natural green remains available for secondary and WhatsApp actions;
- borders and shadows use warmer neutral hues;
- gradients are subtle cream-to-gold treatments rather than clinical blue-to-green treatments;
- rounded cards and existing spacing remain, avoiding an unrelated layout rebuild;
- both light and dark theme tokens remain legible and accessible.

## Affected Components

- `frontend/src/lib/data.ts`: business name, phone configuration, WhatsApp normalization, tagline, Facebook URL, and customer message text.
- `frontend/src/routes/index.tsx`: exact hero heading, welcoming supporting copy, human-focused benefit copy, call to action, and homepage metadata.
- `frontend/src/components/Header.tsx` and `frontend/src/components/Footer.tsx`: business name and accessible logo text from shared configuration.
- Public routes and root metadata: remaining customer-visible old brand references are changed to `Diabetics King`.
- Admin route metadata: browser titles use the new business name; authentication and admin functionality do not change.
- `frontend/src/styles.css`: Friendly & Optimistic theme tokens for light and dark modes.

## Error Handling

A missing or empty `VITE_BUSINESS_PHONE` uses the provided phone number as a safe fallback. Formatting characters in the configured phone value cannot break WhatsApp links because the recipient is normalized to digits. Existing product-loading and form error handling remain unchanged.

## Verification

- A production frontend build must succeed.
- Frontend lint must report no new errors caused by this work.
- Repository searches must show no unintended public `Diabaticking` references in active frontend source.
- Repository searches must show no old hard-coded business phone in active frontend source.
- The built application must contain the new brand name, hero text, Facebook URL, and configured phone behavior.
- Key pages are visually checked at desktop and mobile widths for readable contrast and layout stability.

## Deferred CI/CD Work

After this phase, the EC2 pipeline will be designed around the user’s current terminal-based startup commands. The later design will identify the repository path, operating system, frontend/backend commands, persistent environment-file locations, reverse proxy, and safe restart strategy before creating a main-branch GitHub Actions deployment workflow.
