# Product Overview — Personal Finance Tracker

**Status:** Active
**Last Updated:** 2026-03-07

---

## Overview

A lightweight personal finance tracker for recording **expenses and income** with minimal friction.

The goal is a **fast, simple, and private-first tool** that helps individuals understand where their money is going without the complexity of traditional accounting software.

Target users:

- Personal use
- Freelancers
- Micro businesses
- Sole traders

The product focuses on **tracking, categorisation, and invoicing** — not full accounting.

---

## Goals

### Primary Goals

- Provide an extremely **simple way to track income and expenses**
- Allow users to **see their financial activity clearly**
- Keep the interface **fast, uncluttered, and pleasant to use**
- Avoid accounting complexity

### Secondary Goals

Provide a foundation that could later support:

- Tax summaries
- Reporting
- Receipt uploads
- Automation
- Bank integrations

---

## Non-Goals (MVP)

The following are **explicitly out of scope for MVP**:

- Double-entry accounting
- Bank integrations
- Tax calculations
- Receipt OCR
- Multi-user accounts
- Mobile apps
- Financial forecasting

---

## Target Users

### Primary User

**Individuals who want a quick way to track money**

Examples:

- Freelancers
- Contractors
- Side-hustle creators
- People wanting basic budgeting insight

### User Characteristics

- Wants something **simpler than Xero / QuickBooks**
- Does not want accounting complexity
- Wants fast manual entry

---

## Core Product Principles

### 1. Simplicity First

Every interaction should be extremely straightforward.

### 2. Fast Entry

Recording an expense or income item should take **seconds**.

### 3. Clear Overview

Users should be able to immediately understand:

- Money coming in
- Money going out
- Current balance

### 4. Calm Interface

The UI should feel:

- Minimal
- Distraction-free
- Modern
- Friendly and approachable

---

## Feature Set

### Transactions

Users can record financial transactions. See [transaction.md](transaction.md) for the full spec.

A transaction includes:

- Amount
- Type (expense / income)
- Category
- Date
- Optional note

### Categories

Users can organise transactions into categories.

Examples — Expenses: Food, Rent, Transport, Software, Equipment
Examples — Income: Client payment, Salary, Refund, Misc income

### Invoices

Users can create, preview, and export professional invoices. See [invoice.md](invoice.md) for the full spec.

### Contacts

Users can manage clients and contacts for use across invoices and transactions. See [contacts.md](contacts.md) for the full spec.

### Dashboard

Simple financial summary showing:

- Total income
- Total expenses
- Current balance
- Recent transactions

---

## Core Screens

### Dashboard

Shows balance, total income, total expenses, and recent transactions.

### Transactions Page

Main transaction table. Users can view, add, and edit transactions.

### Invoices Page

Invoice list with create, view, and PDF export capabilities.

### Contacts Page

Manage clients and contacts.

---

## Data Model (Summary)

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

### Category

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string (UUID) | yes | Auto-generated |
| `name` | string | yes | |
| `type` | `income` \| `expense` | yes | |

### Invoice

See [invoice.md](invoice.md) for the full Invoice data model.

### Contact

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string (UUID) | yes | Auto-generated |
| `name` | string | yes | Full name |
| `email` | string | yes | Primary email |
| `companyId` | string | no | FK to Company |
| `createdAt` | ISO datetime | yes | Auto-set |
| `updatedAt` | ISO datetime | yes | Auto-set |
