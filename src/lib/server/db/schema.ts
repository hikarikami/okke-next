import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

// ── Categories ──────────────────────────────────────────────────────────────
export const categories = sqliteTable('categories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	label: text('label').notNull(),
	type: text('type', { enum: ['income', 'expense', 'both'] }).notNull(),
	color: text('color').notNull()
});

// ── Transactions ─────────────────────────────────────────────────────────────
export const transactions = sqliteTable('transactions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	type: text('type', { enum: ['income', 'expense'] }).notNull(),
	description: text('description').notNull(),
	// stored as cents (integer) to avoid floating point issues
	amountCents: integer('amount_cents').notNull(),
	categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
	date: text('date').notNull(), // YYYY-MM-DD
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
});

// ── Companies ────────────────────────────────────────────────────────────────
export const companies = sqliteTable('companies', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull()
});

// ── Contacts ─────────────────────────────────────────────────────────────────
export const contacts = sqliteTable('contacts', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	email: text('email').notNull().default(''),
	companyId: text('company_id').references(() => companies.id, { onDelete: 'set null' }),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
});

// ── Invoices ─────────────────────────────────────────────────────────────────
// from, billTo, and lineItems are serialised as JSON strings
export const invoices = sqliteTable('invoices', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	number: text('number').notNull(),
	status: text('status', { enum: ['draft', 'sent'] }).notNull().default('draft'),
	issueDate: text('issue_date').notNull(),
	dueDate: text('due_date').notNull(),
	fromJson: text('from_json').notNull().default('{}'),
	billToJson: text('bill_to_json').notNull().default('{}'),
	lineItemsJson: text('line_items_json').notNull().default('[]'),
	taxEnabled: integer('tax_enabled', { mode: 'boolean' }).notNull().default(false),
	taxRate: real('tax_rate').notNull().default(0),
	subtotal: real('subtotal').notNull().default(0),
	taxAmount: real('tax_amount').notNull().default(0),
	total: real('total').notNull().default(0),
	notes: text('notes'),
	paymentTerms: text('payment_terms'),
	createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
});

// ── Business Settings ────────────────────────────────────────────────────────
// Single-row table (always id = 'default')
export const businessSettings = sqliteTable('business_settings', {
	id: text('id').primaryKey().default('default'),
	name: text('name').notNull().default(''),
	abn: text('abn').notNull().default(''),
	streetAddressJson: text('street_address_json').notNull().default('{}'),
	postalAddressSameAsStreet: integer('postal_address_same_as_street', { mode: 'boolean' })
		.notNull()
		.default(true),
	postalAddressJson: text('postal_address_json').notNull().default('{}'),
	phone: text('phone').notNull().default(''),
	website: text('website').notNull().default(''),
	email: text('email').notNull().default(''),
	logoUrl: text('logo_url').notNull().default(''),
	invoiceTheme: text('invoice_theme').notNull().default('classic'),
	brandColour: text('brand_colour').notNull().default('#37a87d')
});

export * from './auth.schema';
