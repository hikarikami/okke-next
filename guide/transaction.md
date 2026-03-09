# Transactions Module

**Status:** Phase 1
**Last Updated:** 2026-03-07

---

## Overview

The **Transactions module** is the core system for recording financial activity within the application.

Transactions represent **income or expenses** and are manually entered by the user.

This phase focuses on:

- Manually creating transactions
- Viewing transactions in a list
- Storing them in a database
- Providing a simple and efficient workflow for adding multiple entries

Automation, receipts, and recurring transactions will be added in later phases.

---

## Goals

The Transactions module should allow users to:

1. Record income or expenses quickly
2. View transactions over time
3. Add multiple entries in one workflow
4. See newly added entries reflected immediately in the transaction list

The design should prioritise **speed, clarity, and minimal friction**.

---

## Non-Goals (Phase 1)

The following are **explicitly out of scope** for this phase:

- Recurring transactions
- Receipt uploads or attachments
- Bank integrations
- Automatic categorisation
- Bulk imports
- Advanced filtering
- Reporting or analytics

The system should be **structured to support these features later**.

---

## Core Concepts

### Transaction

A transaction represents **a single financial record** — either income or an expense — with metadata describing the event.

---

## Functional Requirements

### 1. Transaction List

Users must be able to view a list of transactions.

**Capabilities:**

- View all transactions
- Navigate by **month**
- Select a **custom date range**

**Display fields per row:**

- Date
- Description / Name
- Category
- Type (Income / Expense)
- Amount

**Future considerations (not Phase 1):**

- Filtering and sorting
- Receipt indicators
- Recurring indicators

---

### 2. Add Transaction Workflow

Users can create transactions using a **modal workflow** that opens on top of the current page.

This workflow allows users to:

- Add one transaction
- Add multiple transactions in sequence
- Review entries before committing them to the database

---

### 3. Add Transaction Modal

**Modal behaviour:**

- Appears as an overlay
- Does not navigate away from the transaction list
- Allows users to work through entries as a small workflow

---

### 4. Transaction Entry Fields

Each transaction entry includes the following fields.

**Type** — Required
Options: Income, Expense

**Description / Name** — Required
Free text describing the transaction. Examples: "Coffee with client", "Monthly salary", "Adobe subscription"

**Amount** — Required
Numeric currency value. Must be positive and non-empty.

**Category** — Required
User selects a category from the Categories module.

**Date** — Required
Defaults to today's date. User can modify it.

---

### 5. Multi-Entry Workflow

The modal supports **adding multiple transactions before saving**, allowing users to quickly record several expenses at once.

**Behaviour:**

When a user creates an entry, it is added to a **temporary transaction queue** inside the modal and is **not written to the database immediately**.

**Navigation controls:**

- Previous entry
- Next entry
- Add new entry

**Entry position indicator:**

Displays the user's position in the queue, e.g. "Viewing 1 of 3 entries".

Users must be able to navigate between entries and edit them before saving.

---

### 6. Saving Entries

When the user confirms the workflow, all entries are written to the database **in a single operation**.

**Save options:**

- **Save & Close** — saves entries and closes the modal
- **Save & Add Another** — saves entries and immediately starts a new entry workflow

---

### 7. Confirmation Feedback

After saving, display a **non-obtrusive toast notification**.

Example: "3 transactions added"

---

### 8. Updating the Transaction List

After saving:

- Newly added entries appear immediately
- List remains in the same date range view
- No page refresh required

---

## Data Model

### Transaction

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string (UUID) | yes | Auto-generated |
| `type` | `income` \| `expense` | yes | |
| `description` | string | yes | |
| `amount` | number | yes | Positive value |
| `categoryId` | string | yes | FK to Category |
| `date` | ISO date string | yes | |
| `createdAt` | ISO datetime | yes | Auto-set |
| `updatedAt` | ISO datetime | yes | Auto-set |

---

## Database Behaviour

Transactions should be:

- Stored individually
- Created via batch insert when multiple entries are saved together (reduces database writes and API overhead)

---

## UX Requirements

The experience should prioritise **speed and clarity**.

- Minimal fields
- Fast keyboard entry
- Clear progress indicator
- No disruptive page changes

---

## Edge Cases

**Invalid amount** — User attempts to save without an amount: show validation error, prevent saving.

**Missing category** — Category must be selected before saving: show validation error.

**Closing modal with unsaved entries** — Prompt the user:

> "You have unsaved entries. Discard them?"

Options: Discard / Continue editing

---

## Local Development Mode

To support development without a database, the application should support running **without a database**.

In this mode transactions should remain fully usable within the UI, with data stored in memory or localStorage for the session.

### Storage Modes

**Database mode (production)** — Transactions stored in a persistent database (SQLite or PostgreSQL via Drizzle ORM). Data persists across sessions.

**Local mode (development)** — Transactions stored in memory or browser localStorage. No database required. Data resets on page reload (unless localStorage is used).

### Storage Abstraction Layer

A repository/service layer separates storage logic from the UI:

```ts
interface TransactionRepository {
  getTransactions(range: DateRange): Promise<Transaction[]>
  createTransactions(transactions: NewTransaction[]): Promise<Transaction[]>
  updateTransaction(transaction: Transaction): Promise<Transaction>
  deleteTransaction(id: string): Promise<void>
}
```

Two implementations:

- **DatabaseTransactionRepository** — uses Drizzle ORM queries
- **LocalTransactionRepository** — uses in-memory array or localStorage

### Environment Configuration

Storage mode is controlled via environment variable:

```
STORAGE_MODE=local      # default for development
STORAGE_MODE=database   # production
```

Running the app locally should require only:

```
npm install
npm run dev
```

No database setup should be required during development.

---

## Implementation Notes

Recommended architecture:

- Modal state managed locally in component
- Temporary transaction queue stored in component state
- Batch insert endpoint for final save
- Transaction list refreshed after save
- Keep code clean and modular across multiple files — functions should be importable from other pages as the app grows

---

## Future Enhancements

**Recurring transactions** — Allow transactions to repeat weekly, monthly, or annually.

**Receipt attachments** — Allow photo or PDF upload per transaction.

**Additional filters** — Category filtering, amount range, and search on the transaction list.

**Local mode enhancements** — Mock seed data, reset functionality, and demo datasets for UI testing and design reviews.

---

## Success Criteria

The Transactions module is successful if users can:

1. Add transactions quickly
2. Add multiple entries in one workflow
3. Review entries before saving
4. See transactions immediately in the list
5. Use the workflow daily without friction
