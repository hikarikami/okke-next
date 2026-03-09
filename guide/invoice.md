# Invoices Module

**Status:** MVP
**Last Updated:** 2026-03-07

---

## Overview

The **Invoices module** allows sole traders and small business owners to create, view, and manage invoices. Invoices are rendered as styled HTML and can be exported to PDF via a client-side JS library. Data is persisted to the database when available, with a local/mock fallback for development.

---

## Goals

- Give users a dedicated place to create and manage invoices
- Produce an HTML-based invoice that is both screen-readable and accurately exportable to PDF
- Keep the implementation minimal but extensible — no over-engineering for MVP
- Work without a database (mock/localStorage fallback) until DB is wired up

---

## Non-Goals (MVP)

- Invoice editing after creation
- Email sending of invoices
- Recurring invoices / scheduling
- Multi-currency support
- Client/contact management via a picker (freeform text fields for now)
- Payment tracking / mark-as-paid workflow
- Custom invoice templates / branding editor

---

## User Stories

| # | As a… | I want to… | So that… |
|---|-------|-----------|----------|
| 1 | User | Navigate to an Invoices section via the sidebar | I can manage all my invoices in one place |
| 2 | User | Click "New Invoice" and fill in a simple form | I can capture the details of work done |
| 3 | User | See a live-rendered HTML invoice preview as I fill in the form | I know how it will look before saving |
| 4 | User | Save the invoice to the app | It persists and I can return to it |
| 5 | User | Download / print the invoice as a PDF | I can send it to clients |
| 6 | Dev | Use a mock data layer when DB is unavailable | I can build and test without a live DB |

---

## Navigation & Routing

"Invoices" is included in the existing sidebar navigation.

Routes:

- `/invoices` — Invoice list view
- `/invoices/new` — Create invoice flow
- `/invoices/:id` — Invoice detail / preview view

---

## Feature Breakdown

### Invoice List Page (`/invoices`)

- Table/list of all saved invoices
- Columns: Invoice #, Client Name, Issue Date, Due Date, Total, Status (Draft / Sent — MVP uses Draft only)
- "New Invoice" CTA button (prominent, top-right)
- Empty state with prompt to create first invoice
- Each row links to the invoice detail view

---

### Create Invoice Flow (`/invoices/new`)

A single-page form with a **live HTML preview panel** alongside (split-pane on desktop, stacked on mobile).

#### Form Fields (Left Panel)

**Invoice Meta**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Invoice Number | Text | Yes | Auto-incremented (e.g. INV-001), editable |
| Issue Date | Date | Yes | Defaults to today |
| Due Date | Date | Yes | Defaults to today + 30 days |

**From (Sender — pre-filled from user profile if available)**

| Field | Type | Required |
|-------|------|----------|
| Business / Your Name | Text | Yes |
| Address (multi-line) | Textarea | No |
| Email | Email | No |
| Phone | Text | No |

**Bill To (Client)**

| Field | Type | Required |
|-------|------|----------|
| Client Name | Text | Yes |
| Client Address (multi-line) | Textarea | No |
| Client Email | Email | No |

**Line Items** (repeatable rows)

| Field | Type | Required |
|-------|------|----------|
| Description | Text | Yes |
| Quantity | Number | Yes |
| Unit Price | Number | Yes |
| Line Total | Auto-calculated | — |

- "Add Line Item" button to append a new row
- "Remove" button per row (minimum 1 row always present)

**Totals (auto-calculated)**

- Subtotal
- Tax % (optional, single rate — e.g. GST 10%) with toggle to enable/disable
- Total

**Notes / Terms**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Notes | Textarea | No | e.g. "Thank you for your business" |
| Payment Terms | Textarea | No | e.g. bank details |

#### Actions

- **Save Invoice** — persists to DB (or mock store) and redirects to `/invoices/:id`
- **Cancel** — returns to `/invoices`

---

### Invoice Detail / Preview Page (`/invoices/:id`)

- Renders the full HTML invoice (same template used during creation preview)
- Action buttons:
  - **Download PDF** — triggers PDF generation
  - **Print** — browser print dialog (optional convenience)
  - **Back to Invoices**
- Post-MVP: Edit, Delete, Mark as Sent

---

## Invoice HTML Template

The invoice is a **single self-contained component**. It should:

- Use inline or scoped CSS so it renders consistently when passed to the PDF library
- Use a clean, professional layout:
  - Header: logo placeholder (left) + invoice title & number (right)
  - Two-column block: From address (left) | Bill To address (right)
  - Line items table with alternating row shading
  - Totals block aligned to the right
  - Notes / payment terms at the bottom
  - Footer: page number placeholder
- Be driven entirely by a data object (no hardcoded values in the template)
- Use a neutral, business-appropriate colour palette (white background, dark text, single accent colour via CSS variable)

---

## PDF Generation

### Library: `html2pdf.js` (client-side MVP)

Wraps `html2canvas` + `jsPDF`. Takes a DOM element and converts it to a pixel-accurate PDF with no backend dependency.

```bash
npm install html2pdf.js
```

**Usage pattern:**

```js
import html2pdf from 'html2pdf.js';

const exportPDF = () => {
  const element = document.getElementById('invoice-preview');
  html2pdf().set({
    margin: 10,
    filename: `INV-${invoice.number}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(element).save();
};
```

> **Note:** Because `html2pdf.js` renders via canvas, use only web-safe or loaded fonts, and avoid CSS Grid gaps — use flexbox or table layout for line items instead.

**Alternative (post-MVP):** Puppeteer or Playwright for server-rendered PDFs if client-side quality is insufficient.

---

## Data Model

### Invoice

```ts
interface Invoice {
  id: string;                  // uuid
  number: string;              // e.g. "INV-001"
  status: 'draft' | 'sent';   // MVP: always 'draft'
  issueDate: string;           // ISO date string
  dueDate: string;             // ISO date string

  from: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
  };

  billTo: {
    name: string;
    address?: string;
    email?: string;
  };

  lineItems: Array<{
    id: string;                // uuid
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;             // quantity * unitPrice
  }>;

  taxEnabled: boolean;
  taxRate: number;             // e.g. 10 (for 10%)
  subtotal: number;
  taxAmount: number;
  total: number;

  notes?: string;
  paymentTerms?: string;

  createdAt: string;           // ISO timestamp
  updatedAt: string;           // ISO timestamp
}
```

---

## Data Layer / Storage

### Mock / Development (no DB)

Use an in-memory store or `localStorage` as a fallback, exposed via a consistent service interface:

```ts
// services/invoiceService.ts
getAll(): Promise<Invoice[]>
getById(id: string): Promise<Invoice | null>
create(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice>
update(id: string, data: Partial<Invoice>): Promise<Invoice>
delete(id: string): Promise<void>
```

The mock implementation satisfies this interface with in-memory/localStorage data. The real DB implementation (Drizzle ORM) satisfies the same interface — **no UI code changes needed when DB is wired up**.

### DB (when available)

- Single `invoices` table storing the full invoice as JSON (JSONB if Postgres) or normalised if preferred
- Managed via Drizzle ORM

---

## Tech Stack

| Concern | Detail |
|---------|--------|
| Framework | SvelteKit |
| Routing | SvelteKit file-based routing (`/routes`) |
| Styling | Tailwind CSS |
| PDF | `html2pdf.js` (client-side MVP) |
| State | Local component state + service layer |
| DB (future) | Drizzle ORM |

---

## Acceptance Criteria

- [ ] "Invoices" appears in the sidebar and navigates to `/invoices`
- [ ] User can click "New Invoice" and complete the form
- [ ] Adding / removing line items updates totals in real time
- [ ] A live HTML invoice preview updates as the form is edited
- [ ] Saving an invoice stores it (mock or DB) and redirects to the detail view
- [ ] The detail view renders the full HTML invoice
- [ ] "Download PDF" produces an A4 PDF matching the HTML preview
- [ ] All functionality works with no DB connected (mock store)
- [ ] Invoice list shows all saved invoices

---

## Open Questions

1. **Invoice numbering** — Global sequence (INV-001, INV-002…) or reset per year (INV-2026-001)? Assume global for MVP.
2. **Tax label** — Make configurable (default: "Tax") to support GST, VAT, etc.
3. **Logo** — Skip for MVP; include a placeholder image slot, upload post-MVP.
4. **Currency** — Single currency only for MVP. Symbol configurable (default: `$`).

---

## Future Iterations

- Invoice editing & deletion
- Mark as sent / paid
- Email delivery
- Contact picker for bill-to field (linked to Contacts module)
- Recurring invoices
- Custom branding / logo upload
- Multi-currency
- Bulk export
- Xero / QuickBooks sync

---

*Implementation order: data model → service layer → list page → create form → preview → PDF export.*
