import { db } from '$lib/server/db';
import { contacts, companies } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const rows = await db
		.select({
			id: contacts.id,
			name: contacts.name,
			email: contacts.email,
			companyId: contacts.companyId,
			companyName: sql<string | null>`${companies.name}`
		})
		.from(contacts)
		.leftJoin(companies, eq(contacts.companyId, companies.id))
		.where(eq(contacts.userId, userId))
		.orderBy(contacts.name);

	const allCompanies = await db
		.select()
		.from(companies)
		.where(eq(companies.userId, userId))
		.orderBy(companies.name);

	return { contacts: rows, companies: allCompanies };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const name = (data.get('name') as string | null)?.trim();
		const email = (data.get('email') as string | null)?.trim() ?? '';
		const companyId = (data.get('companyId') as string | null) || null;
		const newCompanyName = (data.get('newCompanyName') as string | null)?.trim();

		if (!name) return fail(400, { message: 'Name is required' });

		const now = new Date().toISOString();

		let resolvedCompanyId = companyId;

		// If a new company name was provided, create the company first
		if (newCompanyName && !companyId) {
			const [inserted] = await db
				.insert(companies)
				.values({ userId, name: newCompanyName })
				.returning({ id: companies.id });
			resolvedCompanyId = inserted.id;
		}

		await db.insert(contacts).values({
			userId,
			name,
			email,
			companyId: resolvedCompanyId,
			createdAt: now,
			updatedAt: now
		});
	},

	delete: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const id = data.get('id') as string | null;
		if (!id) return fail(400, { message: 'Missing id' });
		await db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.userId, userId)));
	}
};
