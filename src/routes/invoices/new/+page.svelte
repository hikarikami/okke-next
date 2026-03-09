<script lang="ts">
	import { enhance } from '$app/forms';
	import InvoiceTemplate from '$lib/components/InvoiceTemplate.svelte';
	import type { Invoice, InvoiceLineItem } from '$lib/types/invoice';
	import { Plus, Trash2, ArrowLeft, Printer, Loader2 } from 'lucide-svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import DatePicker from '$lib/components/ui/DatePicker.svelte';
	import { Combobox } from '$lib/components/ui/combobox.js';
	import ComboboxInput from '$lib/components/ui/ComboboxInput.svelte';
	import ComboboxContent from '$lib/components/ui/ComboboxContent.svelte';
	import ComboboxItem from '$lib/components/ui/ComboboxItem.svelte';

	let { data } = $props();
	const invoiceTheme = data.invoiceTheme;
	const brandColour = data.brandColour;

const today = new Date().toISOString().slice(0, 10);
	const due30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

	// --- Form state ---
	let invoiceNumber = $state(data.nextNumber);
	let issueDate = $state(today);
	let dueDate = $state(due30);

	let fromName = $state('');
	let fromAddress = $state('');
	let fromEmail = $state('');
	let fromPhone = $state('');

	let toName = $state('');
	let toAddress = $state('');
	let toEmail = $state('');

	// Contact picker state
	let contactInput = $state('');
	let contactInputFocused = $state(false);
	let contactInputEl = $state<HTMLInputElement | null>(null);
	let selectedContactId = $state('');
	let contactComboOpen = $state(false);

	const matchedContacts = $derived(
		(contactInput.trim()
			? data.contacts.filter((c) =>
					c.name.toLowerCase().includes(contactInput.toLowerCase())
				)
			: data.contacts
		).sort((a, b) => a.name.localeCompare(b.name))
	);

	const selectedContact = $derived(
		selectedContactId
			? (data.contacts.find((c) => c.id === selectedContactId) ?? null)
			: null
	);

	function selectContact(id: string) {
		const contact = data.contacts.find((c) => c.id === id);
		if (!contact) return;
		selectedContactId = id;
		toName = contact.name;
		toEmail = contact.email;
		contactInput = '';
		contactInputEl?.blur();
	}

	let lineItems = $state<InvoiceLineItem[]>([
		{ id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0, total: 0 }
	]);

	let taxEnabled = $state(false);
	let taxRate = $state(10);
	let notes = $state('');
	let paymentTerms = $state('');

	// --- Derived totals ---
	const subtotal = $derived(lineItems.reduce((s, li) => s + li.total, 0));
	const taxAmount = $derived(taxEnabled ? (subtotal * taxRate) / 100 : 0);
	const total = $derived(subtotal + taxAmount);

	// --- Live preview invoice object ---
	const previewInvoice = $derived<Invoice>({
		id: 'preview',
		number: invoiceNumber,
		status: 'draft',
		issueDate,
		dueDate,
		from: {
			name: fromName || 'Your Name',
			address: fromAddress || undefined,
			email: fromEmail || undefined,
			phone: fromPhone || undefined
		},
		billTo: {
			name: toName || 'Client Name',
			address: toAddress || undefined,
			email: toEmail || undefined
		},
		lineItems: lineItems.filter((li) => li.description),
		taxEnabled,
		taxRate,
		subtotal,
		taxAmount,
		total,
		notes: notes || undefined,
		paymentTerms: paymentTerms || undefined,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});

	function updateLineItem(id: string, field: keyof InvoiceLineItem, value: string | number) {
		lineItems = lineItems.map((li) => {
			if (li.id !== id) return li;
			const updated = { ...li, [field]: value };
			updated.total = updated.quantity * updated.unitPrice;
			return updated;
		});
	}

	function addLineItem() {
		lineItems = [
			...lineItems,
			{ id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0, total: 0 }
		];
	}

	function removeLineItem(id: string) {
		if (lineItems.length <= 1) return;
		lineItems = lineItems.filter((li) => li.id !== id);
	}

	const fmt = (n: number) =>
		n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	function printPreview() {
		const el = document.getElementById('invoice-preview');
		if (!el) return;
		const win = window.open('', '_blank');
		if (!win) return;
		win.document.write(`<!DOCTYPE html><html><head><title>${invoiceNumber}</title>
<style>*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}body{margin:0;padding:0;background:#fff;}@page{margin:10mm;}</style>
</head><body>${el.outerHTML}</body></html>`);
		win.document.close();
		win.focus();
		win.print();
		win.close();
	}

	const sectionClass =
		'rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900';

	const fromJson = $derived(JSON.stringify({
		name: fromName,
		address: fromAddress || undefined,
		email: fromEmail || undefined,
		phone: fromPhone || undefined
	}));
	const billToJson = $derived(JSON.stringify({
		name: toName,
		address: toAddress || undefined,
		email: toEmail || undefined
	}));
	const lineItemsJson = $derived(JSON.stringify(lineItems));
	let loading = $state(false);
</script>

<form method="POST" action="?/create" use:enhance={() => { loading = true; return async ({ update }) => { await update(); loading = false; }; }}>
<div class="flex h-full flex-col">
	<!-- Page header -->
	<div
		class="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900"
	>
		<div class="flex items-center gap-3">
			<a
				href="/invoices"
				class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
			>
				<ArrowLeft size={16} />
			</a>
			<div>
				<h1 class="text-base font-semibold text-gray-900 dark:text-gray-100">New Invoice</h1>
				<p class="text-xs text-gray-400">{invoiceNumber}</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<!-- Hidden inputs for server action -->
			<input type="hidden" name="number" value={invoiceNumber} />
			<input type="hidden" name="status" value="draft" />
			<input type="hidden" name="issueDate" value={issueDate} />
			<input type="hidden" name="dueDate" value={dueDate} />
			<input type="hidden" name="fromJson" value={fromJson} />
			<input type="hidden" name="billToJson" value={billToJson} />
			<input type="hidden" name="lineItemsJson" value={lineItemsJson} />
			<input type="hidden" name="taxEnabled" value={String(taxEnabled)} />
			<input type="hidden" name="taxRate" value={String(taxRate)} />
			<input type="hidden" name="subtotal" value={String(subtotal)} />
			<input type="hidden" name="taxAmount" value={String(taxAmount)} />
			<input type="hidden" name="total" value={String(total)} />
			<input type="hidden" name="notes" value={notes} />
			<input type="hidden" name="paymentTerms" value={paymentTerms} />
			<a
				href="/invoices"
				class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
			>
				Cancel
			</a>
			<button
				type="button"
				onclick={printPreview}
				class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
			>
				<Printer size={14} />
				Print
			</button>
			<button
				type="submit"
				disabled={!fromName || !toName || loading}
				class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if loading}<Loader2 size={14} class="animate-spin" />{/if}
				Save invoice
			</button>
		</div>
	</div>

	<!-- Split pane -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Left: Form -->
		<div class="flex w-5/12 shrink-0 flex-col gap-4 overflow-y-auto p-6">
			<!-- Invoice meta -->
			<div class={sectionClass}>
				<h2 class="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Invoice Details</h2>
				<div class="grid grid-cols-1 gap-3">
					<div>
						<Label>Invoice #</Label>
						<Input bind:value={invoiceNumber} />
					</div>
					<div>
						<Label>Issue Date</Label>
						<DatePicker bind:value={issueDate} />
					</div>
					<div>
						<Label>Due Date</Label>
						<DatePicker bind:value={dueDate} />
					</div>
				</div>
			</div>

			<!-- From -->
			<div class={sectionClass}>
				<h2 class="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">From</h2>
				<div class="flex flex-col gap-3">
					<div>
						<Label>Your Name / Business <span class="text-red-400">*</span></Label>
						<Input bind:value={fromName} placeholder="Jane Smith Design" />
					</div>
					<div>
						<Label>Address</Label>
						<Textarea
							bind:value={fromAddress}
							rows={2}
							placeholder="42 Creative Lane&#10;Sydney NSW 2000"
						/>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<Label>Email</Label>
							<Input type="email" bind:value={fromEmail} placeholder="you@example.com" />
						</div>
						<div>
							<Label>Phone</Label>
							<Input bind:value={fromPhone} placeholder="+61 400 000 000" />
						</div>
					</div>
				</div>
			</div>

			<!-- Bill To -->
			<div class={sectionClass}>
				<h2 class="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Bill To</h2>
				<div class="flex flex-col gap-3">
					<div>
						<Label>Client <span class="text-red-400">*</span></Label>
						{#snippet contactFooter()}
							{#if contactInput.trim()}
								<div class="border-t border-gray-100 p-1 dark:border-gray-800">
									<form
										method="POST"
										action="?/createContact"
										use:enhance={() => async ({ result, update }) => {
											if (result.type === 'success') {
												const id = (result.data as { createdContactId?: string } | null)?.createdContactId;
												await update();
												if (id) selectContact(id);
												contactComboOpen = false;
											}
										}}
									>
										<input type="hidden" name="name" value={contactInput.trim()} />
										<button
											type="submit"
											class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
										>
											<Plus size={13} />
											Create "{contactInput.trim()}"
										</button>
									</form>
								</div>
							{/if}
						{/snippet}
						<Combobox.Root
							type="single"
							bind:open={contactComboOpen}
							value={selectedContactId}
							onValueChange={(v) => {
								if (v) selectContact(v);
							}}
						>
							<div class="relative">
								{#if selectedContact && !contactInputFocused}
									<span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-900 dark:text-gray-100">
										{selectedContact.name}
									</span>
								{/if}
								<ComboboxInput
									bind:ref={contactInputEl}
									openOnFocus
									bind:open={contactComboOpen}
									oninput={(e: Event & { currentTarget: HTMLInputElement }) => {
										contactInput = e.currentTarget.value;
										if (selectedContactId) {
											selectedContactId = '';
											toEmail = '';
										}
										toName = e.currentTarget.value;
									}}
									onfocus={(e: FocusEvent & { currentTarget: HTMLInputElement }) => {
										contactInputFocused = true;
										contactInput = '';
										e.currentTarget.select();
									}}
									onblur={() => { contactInputFocused = false; }}
									placeholder={selectedContact ? '' : 'Search or create a contact...'}
									class={selectedContact && !contactInputFocused ? 'text-transparent dark:text-transparent' : ''}
									onclear={selectedContactId ? () => {
										selectedContactId = '';
										toName = '';
										toEmail = '';
										contactInput = '';
									} : undefined}
								/>
							</div>
							<Combobox.Portal>
								<ComboboxContent sideOffset={4} footer={contactFooter}>
									{#each matchedContacts as contact (contact.id)}
										<ComboboxItem value={contact.id} label={contact.name}>
											<div class="flex flex-col">
												<span class="text-sm font-medium text-gray-800 dark:text-gray-200">{contact.name}</span>
												{#if contact.email}
													<span class="text-xs text-gray-400">{contact.email}</span>
												{/if}
											</div>
										</ComboboxItem>
									{/each}
									{#if matchedContacts.length === 0}
										<div class="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">No contacts found</div>
									{/if}
								</ComboboxContent>
							</Combobox.Portal>
						</Combobox.Root>
					</div>
					<div>
						<Label>Address</Label>
						<Textarea
							bind:value={toAddress}
							rows={2}
							placeholder="1 Business Rd&#10;Melbourne VIC 3000"
						/>
					</div>
					<div>
						<Label>Email</Label>
						<Input type="email" bind:value={toEmail} placeholder="accounts@client.com" />
					</div>
				</div>
			</div>

			<!-- Line items -->
			<div class={sectionClass}>
				<h2 class="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Line Items</h2>

				<div class="mb-2 grid grid-cols-[1fr_52px_80px_72px_28px] items-center gap-2">
					<span class="text-[11px] font-medium uppercase tracking-wide text-gray-400">Description</span>
					<span class="text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">Qty</span>
					<span class="text-right text-[11px] font-medium uppercase tracking-wide text-gray-400">Price</span>
					<span class="text-right text-[11px] font-medium uppercase tracking-wide text-gray-400">Total</span>
					<span></span>
				</div>

				<div class="flex flex-col gap-2">
					{#each lineItems as li (li.id)}
						<div class="grid grid-cols-[1fr_52px_80px_72px_28px] items-center gap-2">
							<Input
								value={li.description}
								oninput={(e: Event & { currentTarget: HTMLInputElement }) => updateLineItem(li.id, 'description', e.currentTarget.value)}
								placeholder="Service or product"
							/>
							<Input
								type="number"
								min="0"
								value={li.quantity}
								oninput={(e: Event & { currentTarget: HTMLInputElement }) =>
									updateLineItem(li.id, 'quantity', parseFloat(e.currentTarget.value) || 0)}
								class="text-center"
							/>
							<Input
								type="number"
								min="0"
								step="0.01"
								value={li.unitPrice}
								oninput={(e: Event & { currentTarget: HTMLInputElement }) =>
									updateLineItem(li.id, 'unitPrice', parseFloat(e.currentTarget.value) || 0)}
								class="text-right"
							/>
							<span class="text-right text-sm font-medium text-gray-700 dark:text-gray-300">
								${fmt(li.total)}
							</span>
							<button
								onclick={() => removeLineItem(li.id)}
								disabled={lineItems.length <= 1}
								class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-900/20 dark:hover:text-red-400"
							>
								<Trash2 size={13} />
							</button>
						</div>
					{/each}
				</div>

				<button
					onclick={addLineItem}
					class="mt-3 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
				>
					<Plus size={13} />
					Add line item
				</button>

				<!-- Totals summary -->
				<div class="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
					<div class="flex items-center justify-between py-1 text-sm text-gray-500">
						<span>Subtotal</span>
						<span>${fmt(subtotal)}</span>
					</div>

					<div class="flex items-center justify-between py-1">
						<label class="flex items-center gap-2 text-sm text-gray-500">
							<input
								type="checkbox"
								bind:checked={taxEnabled}
								class="h-3.5 w-3.5 rounded accent-primary-600"
							/>
							Tax
							{#if taxEnabled}
								<input
									type="number"
									min="0"
									max="100"
									bind:value={taxRate}
									class="w-14 rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
								/>
								<span class="text-xs text-gray-400">%</span>
							{/if}
						</label>
						<span class="text-sm text-gray-500">{taxEnabled ? `$${fmt(taxAmount)}` : '—'}</span>
					</div>

					<div class="flex items-center justify-between border-t border-gray-100 pt-2 dark:border-gray-800">
						<span class="text-sm font-semibold text-gray-800 dark:text-gray-200">Total</span>
						<span class="text-base font-bold text-primary-600 dark:text-primary-400">
							${fmt(total)}
						</span>
					</div>
				</div>
			</div>

			<!-- Notes / Payment terms -->
			<div class={sectionClass}>
				<h2 class="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Notes & Terms</h2>
				<div class="flex flex-col gap-3">
					<div>
						<Label>Notes</Label>
						<Textarea
							bind:value={notes}
							placeholder="e.g. Thank you for your business!"
						/>
					</div>
					<div>
						<Label>Payment Details</Label>
						<Textarea
							bind:value={paymentTerms}
							placeholder="e.g. BSB: 062-000&#10;Account: 1234 5678"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Right: Live preview -->
		<div class="flex flex-1 flex-col overflow-y-auto border-l border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
			<div class="shrink-0 border-b border-gray-200 px-6 py-3 dark:border-gray-800">
				<span class="text-xs font-medium text-gray-400">Live Preview</span>
			</div>
			<div class="flex-1 overflow-y-auto p-6">
				<div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700">
					<InvoiceTemplate invoice={previewInvoice} theme={invoiceTheme} {brandColour} />
				</div>
			</div>
		</div>
	</div>
</div>
</form>

