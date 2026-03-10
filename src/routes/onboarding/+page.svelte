<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { Building2, Mail, Phone, Globe, Loader2, Check, User } from 'lucide-svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import type { PageData } from './$types';
	import favicon from '$lib/assets/favicon.svg';

	let { data }: { data: PageData } = $props();

	let step = $state(1);
	let saving = $state(false);
	let skipping = $state(false);

	let userName = $state(untrack(() => data.user.name ?? ''));
	let name = $state('');
	let abn = $state('');
	let email = $state(untrack(() => data.user.email ?? ''));
	let phone = $state('');
	let website = $state('');

	const TOTAL_STEPS = 4;

	function next() {
		if (step < TOTAL_STEPS) step++;
	}

	function back() {
		if (step > 1) step--;
	}
</script>

<svelte:head>
	<title>Welcome – Okke</title>
</svelte:head>

<div class="flex h-screen bg-white dark:bg-gray-950">
	<!-- Left panel -->
	<div class="relative flex flex-1 flex-col overflow-y-auto px-8 py-10 sm:px-12 lg:px-16 ">
		<!-- Logo -->
		<div class="flex items-center gap-2">
			<img src={favicon} alt="Okke" class="h-7 w-7" />
			<span class="text-base font-semibold text-gray-900 dark:text-gray-100">Okke</span>
		</div>

		<!-- Step progress -->
		<div class="mt-10 flex items-center gap-2">
			{#each Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1) as s (s)}
				<div
					class="h-1.5 w-8 rounded-full transition-colors duration-300 {s <= step
						? 'bg-primary-600'
						: 'bg-gray-200 dark:bg-gray-700'}"
				></div>
			{/each}
			<span class="ml-2 text-sm text-gray-400">Step {step} of {TOTAL_STEPS}</span>
		</div>

		<!-- Main form area -->
		<div class="mt-12 flex flex-1 flex-col">
			<!-- Hidden inputs always present so form submission sends all data -->
			<form
				id="onboarding-form"
				method="POST"
				action="?/save"
				use:enhance={() => {
					saving = true;
					return async ({ update }) => {
						await update();
						saving = false;
					};
				}}
			>
				<input type="hidden" name="userName" value={userName} />
				<input type="hidden" name="name" value={name} />
				<input type="hidden" name="abn" value={abn} />
				<input type="hidden" name="email" value={email} />
				<input type="hidden" name="phone" value={phone} />
				<input type="hidden" name="website" value={website} />

				<!-- Step 1: Your name -->
				{#if step === 1}
					<div>
						<h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
							What's your name?
						</h1>
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
							So we know what to call you.
						</p>

						<div class="mt-8 max-w-sm space-y-5">
							<div>
								<Label for="userName">Full name</Label>
								<Input
									id="userName"
									type="text"
									placeholder="Jane Smith"
									bind:value={userName}
									autofocus
									autocomplete="name"
								/>
							</div>
						</div>
					</div>
				{/if}

				<!-- Step 2: Business basics -->
				{#if step === 2}
					<div>
						<h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
							Tell us about your business
						</h1>
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
							This info will appear on your invoices. You can update it anytime in settings.
						</p>

						<div class="mt-8 max-w-sm space-y-5">
							<div>
								<Label for="name">Business Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="Acme Pty Ltd"
									bind:value={name}
									autofocus
								/>
							</div>
							<div>
								<Label for="abn">
									ABN
									<span class="ml-1 text-sm font-normal text-gray-400 italic">(optional)</span>
								</Label>
								<Input
									id="abn"
									type="text"
									placeholder="12 345 678 901"
									bind:value={abn}
								/>
								<Button variant="secondary" size="xs" class="mt-1">Where can I find this?</Button>
							</div>
						</div>
					</div>
				{/if}

				<!-- Step 3: Contact details -->
				{#if step === 3}
					<div>
						<h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
							How can clients reach you?
						</h1>
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Contact details shown on invoices so clients know how to get in touch.
						</p>

						<div class="mt-8 max-w-sm space-y-5">
							<div>
								<Label for="email">Business Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="hello@yourbusiness.com"
									bind:value={email}
									autofocus
								/>
							</div>
							<div>
								<Label for="phone">
									Phone
									<span class="ml-1 text-sm font-normal text-gray-400">(optional)</span>
								</Label>
								<Input
									id="phone"
									type="tel"
									placeholder="+61 4XX XXX XXX"
									bind:value={phone}
								/>
							</div>
							<div>
								<Label for="website">
									Website
									<span class="ml-1 text-sm font-normal text-gray-400">(optional)</span>
								</Label>
								<Input
									id="website"
									type="url"
									placeholder="https://yourbusiness.com"
									bind:value={website}
								/>
							</div>
						</div>
					</div>
				{/if}

				<!-- Step 4: Done -->
				{#if step === 4}
					<div>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20"
						>
							<Check size={22} class="text-primary-600 dark:text-primary-400" />
						</div>
						<h1 class="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
							You're all set{userName ? `, ${userName.split(' ')[0]}` : ''}!
						</h1>
						<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Your business profile is ready. Head to your dashboard to start creating invoices and
							tracking transactions.
						</p>

						{#if name}
							<div
								class="mt-6 max-w-sm rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
							>
								<p class="text-sm font-medium text-gray-500 dark:text-gray-400">
									Saved as
								</p>
								<p class="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
									{name}
								</p>
								{#if email}
									<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{email}</p>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</form>

			<!-- Navigation -->
			<div class="mt-10 flex items-center gap-3">
				{#if step > 1 && step < TOTAL_STEPS}
					<button
						type="button"
						onclick={back}
						class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
					>
						Back
					</button>
				{/if}

				{#if step < TOTAL_STEPS}
					<button
						type="button"
						onclick={next}
						class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
					>
						Next
					</button>
				{:else}
					<button
						type="submit"
						form="onboarding-form"
						disabled={saving}
						class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
					>
						{#if saving}
							<Loader2 size={14} class="animate-spin" />
						{/if}
						Go to dashboard
					</button>
				{/if}

				<!-- Skip -->
				{#if step < TOTAL_STEPS}
					<form
						method="POST"
						action="?/skip"
						use:enhance={() => {
							skipping = true;
							return async ({ update }) => {
								await update();
								skipping = false;
							};
						}}
					>
						<button
							type="submit"
							disabled={skipping}
							class="text-sm text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-60 dark:hover:text-gray-300"
						>
							{skipping ? 'Skipping...' : 'Skip for now'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>

	<!-- Right panel -->
	<div class="hidden w-4/12 shrink-0 items-center justify-center bg-gray-900 lg:flex">
		<div class="w-96">
			{#if step === 1}
				<!-- Name step preview -->
				<div class="flex flex-col items-center gap-4 text-center">
					<div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-900/30">
						{#if userName}
							<span class="text-2xl font-bold text-primary-400">
								{userName.charAt(0).toUpperCase()}
							</span>
						{:else}
							<User size={28} class="text-primary-400" />
						{/if}
					</div>
					{#if userName}
						<p class="text-lg font-semibold text-white">{userName}</p>
					{:else}
						<div class="h-4 w-32 rounded bg-gray-800"></div>
					{/if}
					<p class="mt-8 text-center text-base text-gray-400">
						This is the name we'll use to personalise your experience.
					</p>
				</div>
			{:else}
				<!-- Business card preview -->
				<div
					class="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl transition-all duration-500"
				>
					<div class="h-2 w-full bg-primary-500"></div>

					<div class="p-7">
						<div class="mb-5 flex items-center gap-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-900/30 transition-colors"
							>
								{#if name}
									<span class="text-sm font-bold text-primary-400">
										{name.charAt(0).toUpperCase()}
									</span>
								{:else}
									<Building2 size={24} class="text-primary-400" />
								{/if}
							</div>
							<div class="flex-1 overflow-hidden">
								{#if name}
									<p class="truncate text-sm font-semibold text-white transition-opacity duration-300">
										{name}
									</p>
									{#if abn}
										<p class="text-sm text-gray-400">ABN {abn}</p>
									{/if}
								{:else}
									<div class="h-3 w-28 rounded bg-gray-800"></div>
									<div class="mt-1.5 h-2 w-16 rounded bg-gray-800"></div>
								{/if}
							</div>
						</div>

						<div class="mb-5 h-px w-full bg-gray-800"></div>

						<div class="space-y-3">
							<div class="flex items-center gap-2.5">
								<Mail size={13} class="shrink-0 text-primary-600" />
								{#if email}
									<span class="truncate text-sm text-gray-300 transition-opacity duration-300">{email}</span>
								{:else}
									<div class="h-2 w-36 rounded bg-gray-800"></div>
								{/if}
							</div>
							<div class="flex items-center gap-2.5">
								<Phone size={13} class="shrink-0 text-primary-600" />
								{#if phone}
									<span class="text-sm text-gray-300 transition-opacity duration-300">{phone}</span>
								{:else}
									<div class="h-2 w-24 rounded bg-gray-800"></div>
								{/if}
							</div>
							<div class="flex items-center gap-2.5">
								<Globe size={13} class="shrink-0 text-primary-600" />
								{#if website}
									<span class="truncate text-sm text-gray-300 transition-opacity duration-300"
										>{website.replace(/^https?:\/\//, '')}</span
									>
								{:else}
									<div class="h-2 w-28 rounded bg-gray-800"></div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<p class="mt-12 text-center text-base text-gray-400">
					We'll use your business info to generate professional invoices. You can change these at any time in settings.
				</p>
			{/if}
		</div>
	</div>
</div>
