import { db } from '$lib/server/db';
import { invoices, businessSettings } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { InvoiceTheme } from '$lib/types/business';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [[row], [settings]] = await Promise.all([
		db.select().from(invoices).where(eq(invoices.id, params.id)),
		db.select({ invoiceTheme: businessSettings.invoiceTheme, brandColour: businessSettings.brandColour }).from(businessSettings).where(eq(businessSettings.id, 'default'))
	]);
	if (!row) throw error(404, 'Invoice not found');

	return {
		invoice: {
			...row,
			from: JSON.parse(row.fromJson),
			billTo: JSON.parse(row.billToJson),
			lineItems: JSON.parse(row.lineItemsJson),
			notes: row.notes ?? undefined,
			paymentTerms: row.paymentTerms ?? undefined
		},
		invoiceTheme: ((settings?.invoiceTheme ?? 'classic') as InvoiceTheme),
		brandColour: settings?.brandColour ?? '#37a87d'
	};
};

export const actions: Actions = {
	markSent: async ({ params }) => {
		await db
			.update(invoices)
			.set({ status: 'sent', updatedAt: new Date().toISOString() })
			.where(eq(invoices.id, params.id));
	},

	delete: async ({ params }) => {
		await db.delete(invoices).where(eq(invoices.id, params.id));
		redirect(303, '/invoices');
	}
};
