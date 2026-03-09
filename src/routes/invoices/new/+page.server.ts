import { db } from '$lib/server/db';
import { invoices, contacts, businessSettings } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { InvoiceTheme } from '$lib/types/business';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Compute next invoice number
	const [last] = await db
		.select({ number: invoices.number })
		.from(invoices)
		.orderBy(desc(invoices.createdAt))
		.limit(1);

	let nextNumber = 'INV-001';
	if (last) {
		const match = last.number.match(/(\d+)$/);
		if (match) {
			const n = parseInt(match[1]) + 1;
			nextNumber = `INV-${String(n).padStart(3, '0')}`;
		}
	}

	const [allContacts, [settings]] = await Promise.all([
		db.select().from(contacts).orderBy(contacts.name),
		db.select({ invoiceTheme: businessSettings.invoiceTheme, brandColour: businessSettings.brandColour }).from(businessSettings).where(eq(businessSettings.id, 'default'))
	]);

	return {
		nextNumber,
		contacts: allContacts,
		invoiceTheme: ((settings?.invoiceTheme ?? 'classic') as InvoiceTheme),
		brandColour: settings?.brandColour ?? '#37a87d'
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();

		const number = (data.get('number') as string | null)?.trim();
		const status = (data.get('status') as string | null) ?? 'draft';
		const issueDate = data.get('issueDate') as string | null;
		const dueDate = data.get('dueDate') as string | null;
		const fromJson = data.get('fromJson') as string | null;
		const billToJson = data.get('billToJson') as string | null;
		const lineItemsJson = data.get('lineItemsJson') as string | null;
		const taxEnabled = data.get('taxEnabled') === 'true';
		const taxRate = parseFloat((data.get('taxRate') as string | null) ?? '0');
		const subtotal = parseFloat((data.get('subtotal') as string | null) ?? '0');
		const taxAmount = parseFloat((data.get('taxAmount') as string | null) ?? '0');
		const total = parseFloat((data.get('total') as string | null) ?? '0');
		const notes = (data.get('notes') as string | null) || null;
		const paymentTerms = (data.get('paymentTerms') as string | null) || null;

		if (!number || !issueDate || !dueDate || !fromJson || !billToJson || !lineItemsJson) {
			return fail(400, { message: 'Missing required fields' });
		}

		const now = new Date().toISOString();
		const [inserted] = await db
			.insert(invoices)
			.values({
				number,
				status: status as 'draft' | 'sent',
				issueDate,
				dueDate,
				fromJson,
				billToJson,
				lineItemsJson,
				taxEnabled,
				taxRate,
				subtotal,
				taxAmount,
				total,
				notes,
				paymentTerms,
				createdAt: now,
				updatedAt: now
			})
			.returning({ id: invoices.id });

		redirect(303, `/invoices/${inserted.id}`);
	},

	createContact: async ({ request }) => {
		const data = await request.formData();
		const name = (data.get('name') as string | null)?.trim();

		if (!name) return fail(400, { message: 'Missing name' });

		const [row] = await db
			.insert(contacts)
			.values({ name })
			.returning({ id: contacts.id });

		return { createdContactId: row.id };
	}
};
