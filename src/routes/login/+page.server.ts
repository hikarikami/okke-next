import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}
	return {
		googleEnabled: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
	};
};

export const actions: Actions = {
	signIn: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email')?.toString() ?? '';
		const password = data.get('password')?.toString() ?? '';

		if (!email || !password) {
			return fail(400, { action: 'signIn', message: 'Email and password are required' });
		}

		try {
			await auth.api.signInEmail({
				body: { email, password },
				headers: event.request.headers
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { action: 'signIn', message: 'Invalid email or password' });
			}
			return fail(500, { action: 'signIn', message: 'An unexpected error occurred' });
		}

		redirect(302, '/dashboard');
	},

	signUp: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email')?.toString() ?? '';
		const password = data.get('password')?.toString() ?? '';
		const confirmPassword = data.get('confirmPassword')?.toString() ?? '';

		if (!email || !password) {
			return fail(400, { action: 'signUp', message: 'All fields are required' });
		}
		if (password !== confirmPassword) {
			return fail(400, { action: 'signUp', message: 'Passwords do not match' });
		}
		if (password.length < 10) {
			return fail(400, { action: 'signUp', message: 'Password must be at least 10 characters' });
		}

		// Use email prefix as a temporary placeholder name — user sets their real name during onboarding
		const placeholderName = email.split('@')[0];

		try {
			await auth.api.signUpEmail({
				body: { name: placeholderName, email, password },
				headers: event.request.headers
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { action: 'signUp', message: error.message || 'Registration failed' });
			}
			return fail(500, { action: 'signUp', message: 'An unexpected error occurred' });
		}

		redirect(302, '/onboarding');
	}
};
