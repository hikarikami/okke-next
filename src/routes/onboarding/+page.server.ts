import { db } from '$lib/server/db';
import { businessSettings, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');

	const [existing] = await db
		.select({ id: businessSettings.id })
		.from(businessSettings)
		.where(eq(businessSettings.userId, locals.user.id));

	if (existing) redirect(302, '/dashboard');

	return { user: locals.user };
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.user) redirect(302, '/login');
		const userId = locals.user.id;
		const data = await request.formData();

		const userName = (data.get('userName') as string)?.trim() ?? '';
		const name = (data.get('name') as string) ?? '';
		const abn = (data.get('abn') as string) ?? '';
		const email = (data.get('email') as string) ?? '';
		const phone = (data.get('phone') as string) ?? '';
		const website = (data.get('website') as string) ?? '';

		if (userName) {
			await db.update(user).set({ name: userName }).where(eq(user.id, userId));
		}

		await db
			.insert(businessSettings)
			.values({
				userId,
				name,
				abn,
				email,
				phone,
				website,
				streetAddressJson: '{}',
				postalAddressJson: '{}'
			})
			.onConflictDoUpdate({
				target: businessSettings.userId,
				set: { name, abn, email, phone, website }
			});

		redirect(302, '/dashboard');
	},

	skip: async ({ locals }) => {
		if (!locals.user) redirect(302, '/login');

		// Insert an empty row so onboarding isn't shown again
		await db
			.insert(businessSettings)
			.values({
				userId: locals.user.id,
				streetAddressJson: '{}',
				postalAddressJson: '{}'
			})
			.onConflictDoNothing();

		redirect(302, '/dashboard');
	}
};
