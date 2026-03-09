<script lang="ts">
	import { Building2, Upload, X, FileText, Eye, Loader2 } from 'lucide-svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import Radio from '$lib/components/ui/Radio.svelte';
	import { Card, CardHeader, CardContent, CardSection, CardFooter } from '$lib/components/ui/card.js';
	import ColourPicker from '$lib/components/ui/ColourPicker.svelte';
	import type { BusinessSettings, InvoiceTheme } from '$lib/types/business.js';
	import { enhance } from '$app/forms';
	import { Dialog } from '$lib/components/ui/dialog.js';
	import InvoiceTemplate from '$lib/components/InvoiceTemplate.svelte';
	import type { Invoice } from '$lib/types/invoice.js';

	const THEMES: { id: InvoiceTheme; label: string; description: string }[] = [
		{ id: 'classic', label: 'Classic', description: 'Clean with indigo accents' },
		{ id: 'modern', label: 'Modern', description: 'Dark header, teal totals' },
		{ id: 'minimal', label: 'Minimal', description: 'Monochrome, all whitespace' },
		{ id: 'bold', label: 'Bold', description: 'Green sidebar accent' }
	];

	let { data } = $props();

	// Work on a local draft so unsaved changes don't affect server data
	let draft = $state<BusinessSettings>(structuredClone(data.settings));

	let saved = $state(false);
	let themeSaved = $state(false);
	let saving = $state(false);
	let themeSaving = $state(false);
	let previewOpen = $state(false);
	let logoInputEl: HTMLInputElement;

	const sampleInvoice = $derived<Invoice>({
		id: 'preview',
		number: 'INV-001',
		status: 'draft',
		issueDate: new Date().toISOString().slice(0, 10),
		dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
		from: {
			name: draft.name || 'Your Business',
			address: [
				draft.streetAddress.street,
				[draft.streetAddress.suburb, draft.streetAddress.state, draft.streetAddress.postcode].filter(Boolean).join(' ')
			].filter(Boolean).join('\n') || undefined,
			email: draft.email || undefined,
			phone: draft.phone || undefined
		},
		billTo: {
			name: 'Sample Client Pty Ltd',
			address: '1 Business Road\nMelbourne VIC 3000',
			email: 'accounts@sampleclient.com'
		},
		lineItems: [
			{ id: '1', description: 'Professional Services', quantity: 8, unitPrice: 150, total: 1200 },
			{ id: '2', description: 'Project Management', quantity: 4, unitPrice: 95, total: 380 },
			{ id: '3', description: 'Software License', quantity: 1, unitPrice: 299, total: 299 }
		],
		taxEnabled: true,
		taxRate: 10,
		subtotal: 1879,
		taxAmount: 187.90,
		total: 2066.90,
		notes: 'Thank you for your business.',
		paymentTerms: 'Bank: Sample Bank\nBSB: 062-000\nAccount: 1234 5678',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});

	function handleLogoUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			draft.logoUrl = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	function removeLogo() {
		draft.logoUrl = '';
		if (logoInputEl) logoInputEl.value = '';
	}


</script>

<div class="p-6">
	<!-- Page header -->
	<div class="mb-6">
		<h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
		<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Manage your account and business preferences</p>
	</div>

	<!-- Business Settings card -->
	<Card>
		<CardHeader description="Used on invoices and reports">
			{#snippet icon()}
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
					<Building2 size={16} class="text-primary-600 dark:text-primary-400" />
				</div>
			{/snippet}
			Business Information
		</CardHeader>

		<form method="POST" action="?/save" use:enhance={() => { saving = true; return async ({ result, update }) => { if (result.type === 'success') { saved = true; setTimeout(() => saved = false, 3000); } await update({ reset: false }); saving = false; }; }}>
		<input type="hidden" name="logoUrl" value={draft.logoUrl} />
		<input type="hidden" name="postalAddressSameAsStreet" value={String(draft.postalAddressSameAsStreet)} />
		<input type="hidden" name="invoiceTheme" value={draft.invoiceTheme} />
		<input type="hidden" name="brandColour" value={draft.brandColour} />
	<CardContent>
			<!-- Logo -->
			<CardSection title="Business Logo">
				<div class="flex items-center gap-4">
					{#if draft.logoUrl}
						<div class="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
							<img src={draft.logoUrl} alt="Business logo" class="h-full w-full object-contain" />
							<button
								onclick={removeLogo}
								class="absolute right-0.5 top-0.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
								aria-label="Remove logo"
							>
								<X size={10} class="text-gray-500" />
							</button>
						</div>
					{:else}
						<div class="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
							<Building2 size={20} class="text-gray-300 dark:text-gray-600" />
						</div>
					{/if}
					<div>
						<input
							bind:this={logoInputEl}
							type="file"
							accept="image/*"
							class="hidden"
							id="logo-upload"
							onchange={handleLogoUpload}
						/>
						<label
							for="logo-upload"
							class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							<Upload size={13} />
							Upload logo
						</label>
						<p class="mt-1.5 text-xs text-gray-400">PNG, JPG or SVG. Max 2MB.</p>
					</div>
				</div>
			</CardSection>

			<!-- Core details -->
			<CardSection title="Core Details">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl">
					<div>
						<Label for="business-name">Business Name</Label>
						<Input
							id="business-name"
							type="text"
							placeholder="Acme Pty Ltd"
							name="name" bind:value={draft.name}
						/>
					</div>
					<div>
						<Label for="abn">ABN</Label>
						<Input
							id="abn"
							type="text"
							placeholder="12 345 678 901"
							name="abn" bind:value={draft.abn}
						/>
					</div>
				</div>
			</CardSection>

			<!-- Contact -->
			<CardSection title="Contact">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-2xl">
					<div>
						<Label for="email">Email Address</Label>
						<Input
							id="email"
							type="email"
							placeholder="hello@yourbusiness.com"
							name="email" bind:value={draft.email}
						/>
					</div>
					<div>
						<Label for="phone">Phone Number</Label>
						<Input
							id="phone"
							type="tel"
							placeholder="+61 4XX XXX XXX"
							name="phone" bind:value={draft.phone}
						/>
					</div>
					<div>
						<Label for="website">Website</Label>
						<Input
							id="website"
							type="url"
							placeholder="https://yourbusiness.com"
							name="website" bind:value={draft.website}
						/>
					</div>
				</div>
			</CardSection>

			<!-- Street address -->
			<CardSection title="Street Address">
				<div class="space-y-3 max-w-2xl">
					<div>
						<Label for="country">Country</Label>
						<Input
							id="country"
							type="text"
							placeholder="Australia"
							name="streetCountry" bind:value={draft.streetAddress.country}
						/>
					</div>
					<div>
						<Label for="street">Address line 1</Label>
						<Input
							id="street"
							type="text"
							placeholder="123 Example St"
							name="streetStreet" bind:value={draft.streetAddress.street}
						/>
					</div>
						<div>
						<Label for="street2">Address line 2 <span class="text-gray-400 italic">(Optional)</span></Label>
						<Input
							id="street2"
							type="text"
							placeholder="Apartment, Unit Number, etc."
							name="streetStreet2" bind:value={draft.streetAddress.street2}
						/>
					</div>
					
						<div>
							<Label for="suburb">Suburb or City</Label>
							<Input
								id="suburb"
								type="text"
								placeholder=""
								name="streetSuburb" bind:value={draft.streetAddress.suburb}
							/>
						</div>
						<div class="grid grid-cols-2 gap-x-4 ">
						<div>
							<Label for="state">State</Label>
							<Input
								id="state"
								type="text"
								placeholder="NSW"
								name="streetState" bind:value={draft.streetAddress.state}
							/>
						</div>
						<div>
							<Label for="postcode">Postcode</Label>
							<Input
								id="postcode"
								type="text"
								placeholder="2000"
								name="streetPostcode" bind:value={draft.streetAddress.postcode}
							/>
						</div>
					</div>
				
				</div>
			</CardSection>

			<!-- Postal address -->
			<CardSection title="Postal Address">
				{#snippet actions()}
					<label class="flex cursor-pointer items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
						<Checkbox bind:checked={draft.postalAddressSameAsStreet} />
						Same as street address
					</label>
				{/snippet}

				{#if !draft.postalAddressSameAsStreet}
					<div class="space-y-3 max-w-2xl">
						<div>
							<Label for="postal-country">Country</Label>
							<Input
								id="postal-country"
								type="text"
								placeholder="Australia"
								name="postalCountry" bind:value={draft.postalAddress.country}
							/>
						</div>
						<div>
							<Label for="postal-street">Address line 1</Label>
							<Input
								id="postal-street"
								type="text"
								placeholder="123 Example St"
								name="postalStreet" bind:value={draft.postalAddress.street}
							/>
						</div>
						<div>
							<Label for="postal-street2">Address line 2 <span class="text-gray-400 italic">(Optional)</span></Label>
							<Input
								id="postal-street2"
								type="text"
								placeholder="Apartment, Unit Number, etc."
								name="postalStreet2" bind:value={draft.postalAddress.street2}
							/>
						</div>
						<div>
							<Label for="postal-suburb">Suburb or City</Label>
							<Input
								id="postal-suburb"
								type="text"
								placeholder=""
								name="postalSuburb" bind:value={draft.postalAddress.suburb}
							/>
						</div>
						<div class="grid grid-cols-2 gap-x-4">
							<div>
								<Label for="postal-state">State</Label>
								<Input
									id="postal-state"
									type="text"
									placeholder="NSW"
									name="postalState" bind:value={draft.postalAddress.state}
								/>
							</div>
							<div>
								<Label for="postal-postcode">Postcode</Label>
								<Input
									id="postal-postcode"
									type="text"
									placeholder="2000"
									name="postalPostcode" bind:value={draft.postalAddress.postcode}
								/>
							</div>
						</div>
					</div>
				{/if}
			</CardSection>
		</CardContent>

		<CardFooter class="justify-start">
		
			<button type="submit"

				disabled={saving}
			class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-600 dark:hover:bg-primary-700"
			>
				{#if saving}<Loader2 size={14} class="animate-spin" />{/if}
				Save changes
			</button>
				{#if saved}
				<p class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Changes saved</p>
			{/if}
		</CardFooter>
	</form>
	</Card>

	<!-- Invoice Themes card -->
	<Card class="mt-6">
		<CardHeader description="Brand colour and layout for invoices and documents">
			{#snippet icon()}
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
					<FileText size={16} class="text-primary-600 dark:text-primary-400" />
				</div>
			{/snippet}
			{#snippet actions()}
				<button
					type="button"
					onclick={() => { previewOpen = true; }}
					class="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
				>
					<Eye size={13} />
					Preview
				</button>
			{/snippet}
			Invoice Appearance
		</CardHeader>

		<form method="POST" action="?/save" use:enhance={() => { themeSaving = true; return async ({ result, update }) => { if (result.type === 'success') { themeSaved = true; setTimeout(() => themeSaved = false, 3000); } await update({ reset: false }); themeSaving = false; }; }}>
			<!-- Pass all existing fields unchanged so they don't get wiped -->
			<input type="hidden" name="logoUrl" value={draft.logoUrl} />
			<input type="hidden" name="postalAddressSameAsStreet" value={String(draft.postalAddressSameAsStreet)} />
			<input type="hidden" name="name" value={draft.name} />
			<input type="hidden" name="abn" value={draft.abn} />
			<input type="hidden" name="email" value={draft.email} />
			<input type="hidden" name="phone" value={draft.phone} />
			<input type="hidden" name="website" value={draft.website} />
			<input type="hidden" name="streetStreet" value={draft.streetAddress.street} />
			<input type="hidden" name="streetStreet2" value={draft.streetAddress.street2 ?? ''} />
			<input type="hidden" name="postalStreet2" value={draft.postalAddress.street2 ?? ''} />
			<input type="hidden" name="streetSuburb" value={draft.streetAddress.suburb} />
			<input type="hidden" name="streetState" value={draft.streetAddress.state} />
			<input type="hidden" name="streetPostcode" value={draft.streetAddress.postcode} />
			<input type="hidden" name="streetCountry" value={draft.streetAddress.country} />
			<input type="hidden" name="postalStreet" value={draft.postalAddress.street} />
			<input type="hidden" name="postalSuburb" value={draft.postalAddress.suburb} />
			<input type="hidden" name="postalState" value={draft.postalAddress.state} />
			<input type="hidden" name="postalPostcode" value={draft.postalAddress.postcode} />
			<input type="hidden" name="postalCountry" value={draft.postalAddress.country} />
			<input type="hidden" name="invoiceTheme" value={draft.invoiceTheme} />
			<input type="hidden" name="brandColour" value={draft.brandColour} />

			<CardContent>
				<CardSection title="Brand Colour">
					<div class="flex items-center gap-4">
						<ColourPicker bind:value={draft.brandColour} />
						<p class="text-xs text-gray-400 dark:text-gray-500">
							Used as the accent colour across all invoice templates.
						</p>
					</div>
				</CardSection>

				<CardSection title="Template">
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-4xl">
						{#each THEMES as t (t.id)}
							<label class="cursor-pointer">
								<Radio
									name="invoiceThemeSelect"
									value={t.id}
									class="sr-only"
									checked={draft.invoiceTheme === t.id}
									onchange={() => { draft.invoiceTheme = t.id; }}
								/>
								<div class="
									rounded-xl border p-3 transition-all
									{draft.invoiceTheme === t.id
										? 'outline-2 outline-primary-200 border-primary-600 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
										: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'}
								">
									<!-- Theme thumbnail -->
									<div class="mb-3 h-28 w-full overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
										{#if t.id === 'classic'}
											<!-- Classic: white bg, colored top-right title, divider line -->
											<div class="flex h-full flex-col bg-white p-2">
												<div class="mb-1.5 flex items-center justify-between">
													<div class="flex items-center gap-1">
														<div class="h-3.5 w-3.5 rounded" style="background-color: {draft.brandColour}"></div>
														<div class="h-1.5 w-10 rounded bg-gray-300"></div>
													</div>
													<div class="text-right">
														<div class="h-2 w-10 rounded bg-gray-800" style="font-size:0"></div>
														<div class="mt-0.5 h-1.5 w-8 rounded" style="font-size:0; margin-left:auto; background-color: {draft.brandColour}"></div>
													</div>
												</div>
												<div class="mb-1.5 h-px w-full" style="background-color: {draft.brandColour}"></div>
												<div class="mb-1.5 flex gap-2">
													<div class="flex-1 space-y-0.5">
														<div class="h-1 w-8 rounded bg-gray-200"></div>
														<div class="h-1 w-12 rounded bg-gray-300"></div>
													</div>
													<div class="flex-1 space-y-0.5">
														<div class="h-1 w-8 rounded bg-gray-200"></div>
														<div class="h-1 w-12 rounded bg-gray-300"></div>
													</div>
												</div>
												<div class="flex-1 rounded bg-gray-100"></div>
											</div>
										{:else if t.id === 'modern'}
											<!-- Modern: dark header, white body -->
											<div class="flex h-full flex-col bg-white">
												<div class="flex items-center justify-between bg-slate-900 px-2 py-2">
													<div class="space-y-0.5">
														<div class="h-1.5 w-12 rounded bg-white/80"></div>
														<div class="h-1 w-8 rounded bg-white/30"></div>
													</div>
													<div class="text-right">
														<div class="h-1 w-6 rounded bg-white/30" style="margin-left:auto;"></div>
														<div class="h-2 w-10 rounded bg-white/90"></div>
													</div>
												</div>
												<div class="flex flex-1 flex-col gap-1 p-2">
													<div class="flex gap-2">
														<div class="flex-1 space-y-0.5">
															<div class="h-1 w-6 rounded bg-gray-200"></div>
															<div class="h-1 w-10 rounded bg-gray-300"></div>
														</div>
														<div class="flex-1 space-y-0.5">
															<div class="h-1 w-6 rounded bg-gray-200"></div>
															<div class="h-1 w-10 rounded bg-gray-300"></div>
														</div>
													</div>
													<div class="flex-1 rounded bg-gray-100"></div>
													<div class="flex justify-end">
														<div class="h-2 w-10 rounded" style="background-color: {draft.brandColour}"></div>
													</div>
												</div>
											</div>
										{:else if t.id === 'minimal'}
											<!-- Minimal: all white, thin lines -->
											<div class="flex h-full flex-col bg-white p-2">
												<div class="mb-1.5 flex items-end justify-between">
													<div class="h-2 w-14 rounded bg-gray-800"></div>
													<div class="text-right">
														<div class="h-1 w-6 rounded bg-gray-200" style="margin-left:auto;"></div>
														<div class="h-1.5 w-10 rounded" style="background-color: {draft.brandColour}"></div>
													</div>
												</div>
												<div class="mb-1.5 h-px w-full bg-gray-200"></div>
												<div class="mb-1 flex gap-2">
													<div class="flex-1 space-y-0.5">
														<div class="h-0.5 w-6 rounded bg-gray-200"></div>
														<div class="h-1 w-10 rounded bg-gray-400"></div>
													</div>
													<div class="flex-1 space-y-0.5">
														<div class="h-0.5 w-6 rounded bg-gray-200"></div>
														<div class="h-1 w-10 rounded bg-gray-400"></div>
													</div>
												</div>
												<div class="mb-1 h-px w-full bg-gray-100"></div>
												<div class="flex-1 space-y-0.5">
													<div class="h-0.5 w-full rounded bg-gray-100"></div>
													<div class="h-0.5 w-full rounded bg-gray-100"></div>
													<div class="h-0.5 w-full rounded bg-gray-100"></div>
												</div>
											</div>
										{:else}
											<!-- Bold: green sidebar + white content -->
											<div class="flex h-full overflow-hidden">
												<div class="flex w-8 flex-col p-1.5" style="background-color: {draft.brandColour}">
													<div class="mb-1 h-3 w-3 rounded-full bg-white/30"></div>
													<div class="mb-1 h-1 w-full rounded bg-white/60"></div>
													<div class="mb-2 h-px w-full bg-white/20"></div>
													<div class="h-1 w-4 rounded bg-white/40"></div>
													<div class="mt-0.5 h-1.5 w-full rounded bg-white/80"></div>
												</div>
												<div class="flex flex-1 flex-col gap-1 bg-white p-1.5">
													<div class="flex gap-1">
														<div class="flex-1 space-y-0.5">
															<div class="h-0.5 w-4 rounded" style="background-color: {draft.brandColour}66"></div>
															<div class="h-1 w-8 rounded bg-gray-300"></div>
														</div>
														<div class="flex-1 space-y-0.5">
															<div class="h-0.5 w-4 rounded" style="background-color: {draft.brandColour}66"></div>
															<div class="h-1 w-8 rounded bg-gray-300"></div>
														</div>
													</div>
													<div class="flex-1 rounded bg-gray-100"></div>
													<div class="flex justify-end">
														<div class="h-1.5 w-8 rounded" style="background-color: {draft.brandColour}"></div>
													</div>
												</div>
											</div>
										{/if}
									</div>
									<div class="font-medium text-gray-900 dark:text-gray-100 text-xs">{t.label}</div>
									<div class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{t.description}</div>
								</div>
							</label>
						{/each}
					</div>
				</CardSection>
			</CardContent>

			<CardFooter class="justify-start">
				
				<button
					type="submit"
					disabled={themeSaving}
				class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-600 dark:hover:bg-primary-700"
				>
					{#if themeSaving}<Loader2 size={14} class="animate-spin" />{/if}
					Save appearance
				</button>
				{#if themeSaved}
					<p class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Appearance saved</p>
				{/if}
			</CardFooter>
		</form>
	</Card>
</div>

<Dialog.Root bind:open={previewOpen} onOpenChange={(v) => { previewOpen = v; }}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
		<Dialog.Content
			class="fixed overflow-hidden left-1/2 top-1/2 z-50 flex max-h-[90vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			onEscapeKeydown={() => { previewOpen = false; }}
			onInteractOutside={() => { previewOpen = false; }}
		>
			<!-- Modal header -->
			<div class="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
				<Dialog.Title class="text-sm font-semibold text-gray-900 dark:text-gray-100">
					Invoice Preview
				</Dialog.Title>
				<button
					type="button"
					onclick={() => { previewOpen = false; }}
					class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
				>
					<X size={15} />
				</button>
			</div>

			<!-- Invoice preview -->
			<div class="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-950 ">
				<div class="mx-auto max-w-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700">
					<InvoiceTemplate invoice={sampleInvoice} theme={draft.invoiceTheme} brandColour={draft.brandColour} />
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
