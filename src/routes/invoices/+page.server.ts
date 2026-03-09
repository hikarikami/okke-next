import { db } from '$lib/server/db';
import { invoices } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(invoices).orderBy(desc(invoices.createdAt));

	const parsed = rows.map((r) => ({
		...r,
		from: JSON.parse(r.fromJson),
		billTo: JSON.parse(r.billToJson),
		lineItems: JSON.parse(r.lineItemsJson)
	}));

	return { invoices: parsed };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		if (!id) return fail(400, { message: 'Missing id' });
		await db.delete(invoices).where(eq(invoices.id, id));
	}
};
