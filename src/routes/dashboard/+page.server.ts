import { db } from '$lib/server/db';
import { categories, transactions } from '$lib/server/db/schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;
	const now = new Date();
	const y = now.getFullYear();
	const m = now.getMonth() + 1;

	const fmt = (year: number, month: number, day: number) =>
		`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

	const thisFrom = fmt(y, m, 1);
	const thisTo = fmt(y, m, new Date(y, m, 0).getDate());

	const prevM = m === 1 ? 12 : m - 1;
	const prevY = m === 1 ? y - 1 : y;
	const prevFrom = fmt(prevY, prevM, 1);
	const prevTo = fmt(prevY, prevM, new Date(prevY, prevM, 0).getDate());

	const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

	// Current month transactions with category info
	const txRows = await db
		.select({
			id: transactions.id,
			type: transactions.type,
			description: transactions.description,
			amountCents: transactions.amountCents,
			categoryId: transactions.categoryId,
			categoryLabel: sql<string | null>`${categories.label}`,
			categoryColor: sql<string | null>`${categories.color}`,
			date: transactions.date
		})
		.from(transactions)
		.leftJoin(categories, eq(transactions.categoryId, categories.id))
		.where(
			and(
				eq(transactions.userId, userId),
				gte(transactions.date, thisFrom),
				lte(transactions.date, thisTo)
			)
		)
		.orderBy(sql`${transactions.date} desc`);

	// Previous month totals
	const prevRows = await db
		.select({ type: transactions.type, amountCents: transactions.amountCents })
		.from(transactions)
		.where(
			and(
				eq(transactions.userId, userId),
				gte(transactions.date, prevFrom),
				lte(transactions.date, prevTo)
			)
		);

	const txs = txRows.map((r) => ({ ...r, amount: r.amountCents / 100 }));

	const totalIncome = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
	const totalExpenses = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
	const balance = totalIncome - totalExpenses;

	const prevIncome = prevRows.filter((t) => t.type === 'income').reduce((s, t) => s + t.amountCents / 100, 0);
	const prevExpenses = prevRows.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amountCents / 100, 0);
	const prevBalance = prevIncome - prevExpenses;

	const pctChange = (curr: number, prev: number) => {
		if (prev === 0) return null;
		return ((curr - prev) / prev) * 100;
	};

	// Expense breakdown by category
	const expenseMap = new Map<string, { label: string; color: string; value: number }>();
	for (const tx of txs.filter((t) => t.type === 'expense')) {
		const key = tx.categoryId ?? 'uncategorised';
		const label = tx.categoryLabel ?? 'Uncategorised';
		const color = tx.categoryColor ?? '#6b7280';
		const existing = expenseMap.get(key);
		if (existing) {
			existing.value += tx.amount;
		} else {
			expenseMap.set(key, { label, color, value: tx.amount });
		}
	}
	const expenseCategories = Array.from(expenseMap.entries()).map(([key, v]) => ({ key, ...v }));

	// Recent transactions (last 5)
	const recentTransactions = txs.slice(0, 5);

	return {
		monthLabel,
		totalIncome,
		totalExpenses,
		balance,
		incomeChange: pctChange(totalIncome, prevIncome),
		expensesChange: pctChange(totalExpenses, prevExpenses),
		balanceChange: pctChange(balance, prevBalance),
		expenseCategories,
		recentTransactions
	};
};
