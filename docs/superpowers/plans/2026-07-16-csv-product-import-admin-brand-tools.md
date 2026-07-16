# CSV Product Import and Admin Brand Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import product rows from the existing CSV into the products database and improve admin product management with brand rename, brand filtering, and sorting.

**Architecture:** Keep CSV parsing in a small backend utility so it can be tested without a database. Add a backend CLI script that uses that parser and inserts missing products through the existing SQLAlchemy models. Add admin-side controls inside the existing dashboard instead of creating new pages.

**Tech Stack:** Python 3.13, pytest, SQLAlchemy async sessions, React, TypeScript, Vite, existing admin API wrapper.

## Global Constraints

- Import only product rows from `Prestige Medical Supply Pricelist - Pricelist .csv`.
- Do not import prices.
- Product fields imported: name, brand, serial number/NDC when available, image URL only if present.
- Skip duplicate products by brand, name, and serial number.
- Keep the existing product form fields: brand, product name, serial number, short description, image, active status.
- Admin product filtering/sorting must happen client-side using already-loaded products.

---

### Task 1: Backend CSV parser and import command

**Files:**
- Create: `backend/app/utils/product_csv_importer.py`
- Create: `backend/scripts/import_products_csv.py`
- Create: `backend/tests/test_product_csv_importer.py`

**Interfaces:**
- Produces: `parse_product_csv(path: str | Path, default_image_url: str = "/uploads/product-placeholder.svg") -> list[ImportedProduct]`
- Produces: `ImportedProduct` dataclass with `name`, `brand`, `serial_number`, `short_description`, `image_url`, `category`

- [ ] Add a failing parser test using sample rows from the CSV.
- [ ] Run `python -m pytest backend/tests/test_product_csv_importer.py -q` and confirm it fails because the parser module does not exist.
- [ ] Implement parser that detects section header rows and product rows.
- [ ] Add CLI script that imports parsed products into the database and skips duplicates.
- [ ] Run parser tests again and confirm they pass.

### Task 2: Admin filters, sorting, and brand rename

**Files:**
- Modify: `frontend/src/routes/admin.dashboard.tsx`

**Interfaces:**
- Consumes: existing `Supply[]`, `availableBrands`, and `adminApi.from("supplies").update(...)`
- Produces: brand filter dropdown, product sort dropdown, and brand rename dialog.

- [ ] Add state for selected brand filter, selected product sort, brand rename dialog, old brand, and new brand.
- [ ] Update filtered products so search, brand filter, and sort are applied together.
- [ ] Add dashboard controls for brand filter, sort, and edit brand.
- [ ] Implement brand rename by updating all products with the selected old brand.

### Task 3: Verification

**Files:**
- Verify all changed files.

- [ ] Run `python -m pytest backend/tests/test_product_csv_importer.py -q`.
- [ ] Run `python -m compileall backend/app backend/scripts`.
- [ ] Run `npm run build` in `frontend`.
- [ ] Run eslint on touched frontend files.
