import { db } from '$lib/server/db';
import { invoices } from '$lib/server/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const rows = await db
		.select()
		.from(invoices)
		.where(eq(invoices.userId, userId))
		.orderBy(desc(invoices.createdAt));

	const parsed = rows.map((r) => ({
		...r,
		from: JSON.parse(r.fromJson),
		billTo: JSON.parse(r.billToJson),
		lineItems: JSON.parse(r.lineItemsJson)
	}));

	return { invoices: parsed };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const id = data.get('id') as string;
		if (!id) return fail(400, { message: 'Missing id' });
		await db.delete(invoices).where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
	}
};
