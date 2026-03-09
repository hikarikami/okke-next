import { db } from '$lib/server/db';
import { categories, transactions } from '$lib/server/db/schema';
import { CATEGORY_COLORS } from '$lib/types/transaction';
import { fail } from '@sveltejs/kit';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Read ?month=YYYY-MM from URL, default to current month
	const monthParam = url.searchParams.get('month');
	const now = new Date();
	const year = monthParam ? parseInt(monthParam.split('-')[0]) : now.getFullYear();
	const month = monthParam ? parseInt(monthParam.split('-')[1]) : now.getMonth() + 1;

	const from = `${year}-${String(month).padStart(2, '0')}-01`;
	const lastDay = new Date(year, month, 0).getDate();
	const to = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

	const rows = await db
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
		.where(and(gte(transactions.date, from), lte(transactions.date, to)))
		.orderBy(sql`${transactions.date} desc`);

	const allCategories = await db
		.select()
		.from(categories)
		.orderBy(categories.label);

	const txs = rows.map((r) => ({
		...r,
		amount: r.amountCents / 100
	}));

	const totalIncome = txs
		.filter((t) => t.type === 'income')
		.reduce((sum, t) => sum + t.amount, 0);
	const totalExpenses = txs
		.filter((t) => t.type === 'expense')
		.reduce((sum, t) => sum + t.amount, 0);

	return {
		transactions: txs,
		categories: allCategories,
		totalIncome,
		totalExpenses,
		balance: totalIncome - totalExpenses,
		currentMonth: { year, month }
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const type = data.get('type') as string | null;
		const description = (data.get('description') as string | null)?.trim();
		const amount = data.get('amount') as string | null;
		const categoryId = (data.get('categoryId') as string | null) || null;
		const date = data.get('date') as string | null;

		if (!type || !description || !amount || !date) {
			return fail(400, { message: 'Missing required fields' });
		}

		const amountCents = Math.round(parseFloat(amount) * 100);
		if (isNaN(amountCents) || amountCents <= 0) {
			return fail(400, { message: 'Invalid amount' });
		}

		const now = new Date().toISOString();
		await db.insert(transactions).values({
			type: type as 'income' | 'expense',
			description,
			amountCents,
			categoryId,
			date,
			createdAt: now,
			updatedAt: now
		});
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string | null;
		if (!id) return fail(400, { message: 'Missing id' });
		await db.delete(transactions).where(eq(transactions.id, id));
	},

	createCategory: async ({ request }) => {
		const data = await request.formData();
		const label = (data.get('label') as string | null)?.trim();
		const type = data.get('type') as string | null;

		if (!label || !type) return fail(400, { message: 'Missing fields' });

		const existingColors = (await db.select({ color: categories.color }).from(categories)).map(
			(r) => r.color
		);
		const color =
			CATEGORY_COLORS.find((c) => !existingColors.includes(c)) ?? CATEGORY_COLORS[0];

		const [row] = await db
			.insert(categories)
			.values({ label, type: type as 'income' | 'expense' | 'both', color })
			.returning({ id: categories.id });

		return { createdCategoryId: row.id };
	}
};
