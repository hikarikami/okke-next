/**
 * Seed script — populate the database with sample data for a user.
 * Usage: npx tsx src/lib/server/db/seed.ts <userId>
 * The userId must already exist in the user table (sign up first, then grab your id).
 */
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { categories, transactions } from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({ url: process.env.DATABASE_URL ?? 'file:local.db' });
const db = drizzle(client);

const DEFAULT_CATEGORIES = [
	{ id: 'client-payment', label: 'Client Payment', type: 'income' as const, color: '#22c55e' },
	{ id: 'salary', label: 'Salary', type: 'income' as const, color: '#3b82f6' },
	{ id: 'refund', label: 'Refund', type: 'income' as const, color: '#06b6d4' },
	{ id: 'misc-income', label: 'Misc Income', type: 'income' as const, color: '#a855f7' },
	{ id: 'food', label: 'Food', type: 'expense' as const, color: '#ef4444' },
	{ id: 'rent', label: 'Rent', type: 'expense' as const, color: '#f97316' },
	{ id: 'transport', label: 'Transport', type: 'expense' as const, color: '#eab308' },
	{ id: 'software', label: 'Software', type: 'expense' as const, color: '#8b5cf6' },
	{ id: 'equipment', label: 'Equipment', type: 'expense' as const, color: '#ec4899' },
	{ id: 'other', label: 'Other', type: 'both' as const, color: '#6b7280' }
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const monthStart = (y: number, m: number) => new Date(y, m, 1);
const y = today.getFullYear();
const m = today.getMonth();

const SEED_TRANSACTIONS = [
	{
		type: 'income' as const,
		description: 'Client payment — Acme Corp',
		amountCents: 240000,
		categoryId: 'client-payment',
		date: fmt(new Date(y, m, 5))
	},
	{
		type: 'expense' as const,
		description: 'AWS — Monthly subscription',
		amountCents: 8900,
		categoryId: 'software',
		date: fmt(new Date(y, m, 4))
	},
	{
		type: 'expense' as const,
		description: 'Office supplies',
		amountCents: 14250,
		categoryId: 'equipment',
		date: fmt(new Date(y, m, 3))
	},
	{
		type: 'income' as const,
		description: 'Freelance project — Logo design',
		amountCents: 85000,
		categoryId: 'client-payment',
		date: fmt(new Date(y, m, 2))
	},
	{
		type: 'expense' as const,
		description: 'Train pass — Monthly',
		amountCents: 6800,
		categoryId: 'transport',
		date: fmt(new Date(y, m, 1))
	},
	{
		type: 'income' as const,
		description: 'Consulting retainer',
		amountCents: 320000,
		categoryId: 'salary',
		date: fmt(monthStart(y, m - 1))
	},
	{
		type: 'expense' as const,
		description: 'Groceries',
		amountCents: 18520,
		categoryId: 'food',
		date: fmt(new Date(y, m - 1, 20))
	}
];

async function seed(userId: string) {
	console.log(`Seeding categories for user ${userId}…`);
	for (const cat of DEFAULT_CATEGORIES) {
		await db.insert(categories).values({ ...cat, userId }).onConflictDoNothing();
	}

	console.log('Seeding transactions…');
	const now = new Date().toISOString();
	for (const tx of SEED_TRANSACTIONS) {
		await db
			.insert(transactions)
			.values({ ...tx, userId, createdAt: now, updatedAt: now })
			.onConflictDoNothing();
	}

	console.log('Done!');
	client.close();
}

const userId = process.argv[2];
if (!userId) {
	console.error('Usage: npx tsx src/lib/server/db/seed.ts <userId>');
	process.exit(1);
}

seed(userId).catch((err) => {
	console.error(err);
	process.exit(1);
});
