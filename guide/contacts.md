# Contacts Module

**Status:** MVP
**Last Updated:** 2026-03-07

---

## Overview

The **Contacts module** stores and manages the people you do business with — clients, freelancers, vendors, or anyone you might invoice or transact with.

A contact is a named person with an email address and an optional company association.

---

## Goals

As the app grows, invoices and transactions need to reference real people. Rather than re-typing names and emails across documents, contacts serve as a **single source of truth** for client/contact data.

This unlocks:

- Faster invoice creation (pick a contact instead of typing details)
- Filtering transactions by contact
- Reporting grouped by company

---

## Current Features

- **List view** — table showing all contacts with name, email, and company
- **New contact modal** — create a contact with name, email, and optional company assignment
- Seed data included for development (e.g. Alice Johnson / Acme Corp, Bob Martinez / Globex Solutions)

---

## Data Model

### Contact

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string (UUID) | yes | Auto-generated |
| `name` | string | yes | Full name |
| `email` | string | yes | Primary email address |
| `companyId` | string | no | FK to Company |
| `createdAt` | ISO datetime | yes | Auto-set on create |
| `updatedAt` | ISO datetime | yes | Auto-set on create/update |

### Company

Contacts can optionally belong to a Company. Companies act as a grouping layer — useful when multiple contacts work at the same client organisation.

The Company model is intentionally minimal for now and will be expanded into its own module later.

| Field | Type | Required |
|-------|------|----------|
| `id` | string (UUID) | yes |
| `name` | string | yes |

---

## Integration Points

- **Invoices** — contacts will be selectable as the bill-to recipient, pre-filling name and email on the invoice form
- **Transactions** — optionally tag a transaction against a contact for per-client reporting

---

## Planned Features

- Assign contacts to invoices (bill-to field picker)
- Contact detail / edit page
- Company management UI (create, rename, delete companies)
- Search and filter contacts by company
- Import contacts from CSV
- Notes / activity log per contact
