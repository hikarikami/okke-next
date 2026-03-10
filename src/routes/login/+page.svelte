<script lang="ts">
	import { enhance } from '$app/forms';
	import { Wallet, Eye, EyeOff, Loader2, Check, X } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { authClient } from '$lib/auth-client';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	let tab: 'signin' | 'signup' = $state('signin');
	let showPassword = $state(false);
	let showConfirm = $state(false);
	let loading = $state(false);
	let googleLoading = $state(false);
	let signupPassword = $state('');

	const requirements = $derived([
		{ label: '10+ characters', met: signupPassword.length >= 10 },
		{ label: 'One number', met: /\d/.test(signupPassword) },
		{ label: 'One special character', met: /[^A-Za-z0-9]/.test(signupPassword) },
		{ label: 'One uppercase letter', met: /[A-Z]/.test(signupPassword) }
	]);

	const strength = $derived(requirements.filter((r) => r.met).length);

	const strengthLabel = $derived(
		strength === 0 ? '' :
		strength === 1 ? 'Weak' :
		strength === 2 ? 'Fair' :
		strength === 3 ? 'Good' :
		'Strong'
	);

	const strengthColor = $derived(
		strength === 1 ? 'text-red-500' :
		strength === 2 ? 'text-amber-500' :
		strength === 3 ? 'text-yellow-500' :
		strength === 4 ? 'text-emerald-500' :
		''
	);

	async function signInWithGoogle() {
		googleLoading = true;
		await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
	}
</script>

<svelte:head>
	<title>Sign in – Okke</title>
</svelte:head>

{#snippet googleButton()}
	<div class="mt-4 flex items-center gap-3">
		<div class="h-px flex-1 bg-gray-200"></div>
		<span class="text-xs text-gray-400">or</span>
		<div class="h-px flex-1 bg-gray-200"></div>
	</div>
	<button
		type="button"
		onclick={signInWithGoogle}
		disabled={googleLoading}
		class="mt-4 flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
	>
		<svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
			<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
			<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
			<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
		</svg>
		{googleLoading ? 'Redirecting…' : 'Continue with Google'}
	</button>
{/snippet}

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
	<!-- Logo -->
	<a href="/" class="mb-8 flex items-center gap-2">
		<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
			<Wallet size={18} class="text-white" />
		</div>
		<span class="text-lg font-semibold tracking-tight text-gray-900">Okke</span>
	</a>

	<div class="w-full max-w-sm">
		<!-- Card -->
		<div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
			<!-- Tabs -->
			<div class="mb-7 flex rounded-lg bg-gray-100 p-1">
				<button
					type="button"
					onclick={() => (tab = 'signin')}
					class="flex-1 cursor-pointer rounded-md py-1.5 text-sm font-medium transition-colors {tab === 'signin'
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'}"
				>
					Sign in
				</button>
				<button
					type="button"
					onclick={() => (tab = 'signup')}
					class="flex-1 cursor-pointer rounded-md py-1.5 text-sm font-medium transition-colors {tab === 'signup'
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-500 hover:text-gray-700'}"
				>
					Create account
				</button>
			</div>

			{#if tab === 'signin'}
				<form
					method="post"
					action="?/signIn"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
					class="space-y-4"
				>
					<div>
						<label for="signin-email" class="block text-sm font-medium text-gray-700">Email</label>
						<input
							id="signin-email"
							type="email"
							name="email"
							required
							autocomplete="email"
							class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label for="signin-password" class="block text-sm font-medium text-gray-700">Password</label>
						<div class="relative mt-1">
							<input
								id="signin-password"
								type={showPassword ? 'text' : 'password'}
								name="password"
								required
								autocomplete="current-password"
								class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
								placeholder="••••••••"
							/>
							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{#if showPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
							</button>
						</div>
					</div>

					{#if form?.action === 'signIn' && form?.message}
						<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{form.message}</p>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{#if loading}<Loader2 size={14} class="animate-spin" />{/if}
						{loading ? 'Signing in…' : 'Sign in'}
					</button>
				</form>

				{#if data.googleEnabled}{@render googleButton()}{/if}
			{:else}
				<form
					method="post"
					action="?/signUp"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
					class="space-y-4"
				>
					<div>
						<label for="signup-email" class="block text-sm font-medium text-gray-700">Email</label>
						<input
							id="signup-email"
							type="email"
							name="email"
							required
							autocomplete="email"
							class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label for="signup-password" class="block text-sm font-medium text-gray-700">Password</label>
						<div class="relative mt-1">
							<input
								id="signup-password"
								type={showPassword ? 'text' : 'password'}
								name="password"
								required
								minlength="10"
								autocomplete="new-password"
								bind:value={signupPassword}
								class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
								placeholder="Min. 10 characters"
							/>
							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{#if showPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
							</button>
						</div>

						{#if signupPassword.length > 0}
							<div class="mt-3 space-y-2.5">
								<!-- Strength bar -->
								<div class="flex items-center gap-2">
									<div class="flex flex-1 gap-1">
										{#each [0, 1, 2, 3] as i (i)}
											<div
												class="h-1 flex-1 rounded-full transition-all duration-300 {i < strength
													? strength === 1
														? 'bg-red-400'
														: strength === 2
															? 'bg-amber-400'
															: strength === 3
																? 'bg-yellow-400'
																: 'bg-emerald-400'
													: 'bg-gray-100'}"
											></div>
										{/each}
									</div>
									{#if strengthLabel}
										<span class="text-xs font-medium {strengthColor} w-12 text-right">{strengthLabel}</span>
									{/if}
								</div>

								<!-- Requirements checklist -->
								<ul class="space-y-1">
									{#each requirements as req (req.label)}
										<li class="flex items-center gap-1.5 text-xs {req.met ? 'text-emerald-600' : 'text-gray-400'}">
											{#if req.met}
												<Check size={11} class="shrink-0" />
											{:else}
												<X size={11} class="shrink-0" />
											{/if}
											{req.label}
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>

					<div>
						<label for="signup-confirm" class="block text-sm font-medium text-gray-700">Confirm password</label>
						<div class="relative mt-1">
							<input
								id="signup-confirm"
								type={showConfirm ? 'text' : 'password'}
								name="confirmPassword"
								required
								autocomplete="new-password"
								class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
								placeholder="••••••••"
							/>
							<button
								type="button"
								onclick={() => (showConfirm = !showConfirm)}
								class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600"
								aria-label={showConfirm ? 'Hide password' : 'Show password'}
							>
								{#if showConfirm}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
							</button>
						</div>
					</div>

					{#if form?.action === 'signUp' && form?.message}
						<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{form.message}</p>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{#if loading}<Loader2 size={14} class="animate-spin" />{/if}
						{loading ? 'Creating account…' : 'Create account'}
					</button>

					<p class="text-center text-xs text-gray-400">
						By creating an account you agree to our
						<a href="/terms" class="text-primary-600 hover:underline">Terms</a> and
						<a href="/privacy" class="text-primary-600 hover:underline">Privacy Policy</a>.
					</p>
				</form>

				{#if data.googleEnabled}{@render googleButton()}{/if}
			{/if}
		</div>
	</div>
</div>
