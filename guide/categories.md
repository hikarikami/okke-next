# Categories Module

**Status:** MVP
**Last Updated:** 2026-03-07

---

## Overview

The **Categories module** provides a classification system for transactions. Every transaction must belong to a category, which enables organised viewing and future reporting.

Categories are scoped to a type — income or expense — so they only appear in relevant contexts.

---

## Goals

- Give every transaction a meaningful label
- Keep categorisation simple and fast (a dropdown, not a complex UI)
- Provide sensible defaults out of the box so users don't need to set anything up before recording their first transaction

---

## Non-Goals (MVP)

- Custom category colours or icons
- Category budgets or limits
- Merging or archiving categories
- Sub-categories / nesting
- Per-user category customisation (categories are shared/global for now)

---

## Default Categories

Seeded on first run. Users can add to these but cannot delete defaults in MVP.

**Expense categories:**

- Food & Drink
- Rent & Utilities
- Transport
- Software & Subscriptions
- Equipment & Hardware
- Marketing & Advertising
- Professional Services
- Other Expense

**Income categories:**

- Client Payment
- Salary
- Freelance / Contract
- Refund
- Other Income

---

## Current Features

- **List view** — displays all categories grouped by type (Income / Expense)
- **Add category** — create a new category with a name and type
- **Used in transactions** — category selector on the transaction entry form pulls from this list, filtered by the selected transaction type

---

## Data Model

### Category

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string (UUID) | yes | Auto-generated |
| `name` | string | yes | e.g. "Transport" |
| `type` | `income` \| `expense` | yes | Determines which transaction types it applies to |
| `createdAt` | ISO datetime | yes | Auto-set on create |

---

## Functional Requirements

### Category List Page (`/categories`)

- Displays all categories grouped by type
- Shows how many transactions use each category (future — not MVP)
- "Add Category" button to create a new one

### Add Category

Simple inline form or modal:

- Name (required, text)
- Type (required, income or expense)

No editing or deleting in MVP.

### Category Selector (used in transaction form)

- Rendered as a searchable dropdown
- Filtered to only show categories matching the selected transaction type
- Displays an "Add category" shortcut if no match found (post-MVP)

---

## Integration Points

- **Transactions** — every transaction requires a `categoryId`; the selector is filtered by transaction type
- **Dashboard / Reporting (future)** — spending breakdowns grouped by category

---

## Planned Features

- Edit and delete categories
- Category usage counts in the list view
- "Add category" shortcut directly from the transaction form
- Spending breakdown by category on the dashboard
- Category budgets
