import { db } from '$lib/server/db';
import { invoices, contacts, businessSettings } from '$lib/server/db/schema';
import { error, redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { InvoiceTheme } from '$lib/types/business';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [[row], allContacts, [settings]] = await Promise.all([
		db.select().from(invoices).where(eq(invoices.id, params.id)),
		db.select().from(contacts).orderBy(contacts.name),
		db
			.select({ invoiceTheme: businessSettings.invoiceTheme, brandColour: businessSettings.brandColour })
			.from(businessSettings)
			.where(eq(businessSettings.id, 'default'))
	]);

	if (!row) throw error(404, 'Invoice not found');
	if (row.status !== 'draft') throw error(403, 'Only draft invoices can be edited');

	return {
		invoice: {
			...row,
			from: JSON.parse(row.fromJson),
			billTo: JSON.parse(row.billToJson),
			lineItems: JSON.parse(row.lineItemsJson),
			notes: row.notes ?? undefined,
			paymentTerms: row.paymentTerms ?? undefined
		},
		contacts: allContacts,
		invoiceTheme: ((settings?.invoiceTheme ?? 'classic') as InvoiceTheme),
		brandColour: settings?.brandColour ?? '#37a87d'
	};
};

export const actions: Actions = {
	update: async ({ params, request }) => {
		const data = await request.formData();

		const number = (data.get('number') as string | null)?.trim();
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

		await db
			.update(invoices)
			.set({
				number,
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
				updatedAt: new Date().toISOString()
			})
			.where(eq(invoices.id, params.id));

		redirect(303, `/invoices/${params.id}`);
	}
};
