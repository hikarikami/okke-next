import { db } from '$lib/server/db';
import { businessSettings } from '$lib/server/db/schema';
import { DEFAULT_BUSINESS_SETTINGS, type InvoiceTheme } from '$lib/types/business';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [row] = await db.select().from(businessSettings).where(eq(businessSettings.id, 'default'));

	if (!row) {
		// Return defaults without persisting yet
		return { settings: DEFAULT_BUSINESS_SETTINGS };
	}

	return {
		settings: {
			name: row.name,
			abn: row.abn,
			streetAddress: JSON.parse(row.streetAddressJson),
			postalAddressSameAsStreet: row.postalAddressSameAsStreet,
			postalAddress: JSON.parse(row.postalAddressJson),
			phone: row.phone,
			website: row.website,
			email: row.email,
			logoUrl: row.logoUrl,
			invoiceTheme: (row.invoiceTheme as InvoiceTheme) ?? 'classic',
			brandColour: row.brandColour ?? '#37a87d'
		}
	};
};

export const actions: Actions = {
	save: async ({ request }) => {
		const data = await request.formData();

		const name = (data.get('name') as string) ?? '';
		const abn = (data.get('abn') as string) ?? '';
		const email = (data.get('email') as string) ?? '';
		const phone = (data.get('phone') as string) ?? '';
		const website = (data.get('website') as string) ?? '';
		const logoUrl = (data.get('logoUrl') as string) ?? '';
		const invoiceTheme = ((data.get('invoiceTheme') as string) ?? 'classic') as InvoiceTheme;
		const brandColour = (data.get('brandColour') as string) || '#37a87d';
		const postalAddressSameAsStreet = data.get('postalAddressSameAsStreet') === 'true';

		const streetAddress = {
			street: (data.get('streetStreet') as string) ?? '',
			street2: (data.get('streetStreet2') as string) ?? '',
			suburb: (data.get('streetSuburb') as string) ?? '',
			state: (data.get('streetState') as string) ?? '',
			postcode: (data.get('streetPostcode') as string) ?? '',
			country: (data.get('streetCountry') as string) ?? 'Australia'
		};

		const postalAddress = postalAddressSameAsStreet
			? { ...streetAddress }
			: {
					street: (data.get('postalStreet') as string) ?? '',
					street2: (data.get('postalStreet2') as string) ?? '',
					suburb: (data.get('postalSuburb') as string) ?? '',
					state: (data.get('postalState') as string) ?? '',
					postcode: (data.get('postalPostcode') as string) ?? '',
					country: (data.get('postalCountry') as string) ?? 'Australia'
				};

		await db
			.insert(businessSettings)
			.values({
				id: 'default',
				name,
				abn,
				email,
				phone,
				website,
				logoUrl,
				invoiceTheme,
				brandColour,
				postalAddressSameAsStreet,
				streetAddressJson: JSON.stringify(streetAddress),
				postalAddressJson: JSON.stringify(postalAddress)
			})
			.onConflictDoUpdate({
				target: businessSettings.id,
				set: {
					name,
					abn,
					email,
					phone,
					website,
					logoUrl,
					invoiceTheme,
					brandColour,
					postalAddressSameAsStreet,
					streetAddressJson: JSON.stringify(streetAddress),
					postalAddressJson: JSON.stringify(postalAddress)
				}
			});
	}
};
