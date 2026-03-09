import { db } from '$lib/server/db';
import { categories, transactions } from '$lib/server/db/schema';
import { CATEGORY_COLORS } from '$lib/types/transaction';
import { fail } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const rows = await db
		.select({
			id: categories.id,
			label: categories.label,
			type: categories.type,
			color: categories.color,
			transactionCount: sql<number>`count(${transactions.id})`
		})
		.from(categories)
		.leftJoin(transactions, and(eq(transactions.categoryId, categories.id), eq(transactions.userId, userId)))
		.where(eq(categories.userId, userId))
		.groupBy(categories.id)
		.orderBy(categories.label);

	const usedColors = new Set(rows.map((r) => r.color));
	const nextColor = CATEGORY_COLORS.find((c) => !usedColors.has(c)) ?? CATEGORY_COLORS[0];

	return { categories: rows, nextColor };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const label = (data.get('label') as string | null)?.trim();
		const type = data.get('type') as string | null;
		const color = data.get('color') as string | null;

		if (!label || !type || !color) return fail(400, { message: 'Missing fields' });

		await db.insert(categories).values({
			userId,
			label,
			type: type as 'income' | 'expense' | 'both',
			color
		});
	},

	update: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const id = data.get('id') as string | null;
		const label = (data.get('label') as string | null)?.trim();
		const type = data.get('type') as string | null;
		const color = data.get('color') as string | null;

		if (!id || !label || !type || !color) return fail(400, { message: 'Missing fields' });

		await db
			.update(categories)
			.set({ label, type: type as 'income' | 'expense' | 'both', color })
			.where(and(eq(categories.id, id), eq(categories.userId, userId)));
	},

	delete: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const id = data.get('id') as string | null;

		if (!id) return fail(400, { message: 'Missing id' });

		// Null out categoryId on this user's transactions that use this category
		await db
			.update(transactions)
			.set({ categoryId: null })
			.where(and(eq(transactions.categoryId, id), eq(transactions.userId, userId)));

		await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, userId)));
	}
};
