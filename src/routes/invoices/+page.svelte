<script lang="ts">
	let { data } = $props();
	import { FileText, Plus, Clock, Send, Pencil, Trash2 } from 'lucide-svelte';
	import Table from '$lib/components/ui/Table.svelte';
	import { Popover } from '$lib/components/ui/popover.js';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	const fmt = (n: number) =>
		n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const fmtDate = (d: string) =>
		new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});

	let deletePopoverId = $state<string | undefined>(undefined);

	const columns = [
		{ key: 'number', label: 'Invoice #', width: '100px' },
		{ key: 'client', label: 'Client' },
		{ key: 'issueDate', label: 'Issue Date' },
		{ key: 'dueDate', label: 'Due Date', width: '120px' },
		{ key: 'total', label: 'Total', width: '110px', align: 'right' as const },
		{ key: 'status', label: 'Status', width: '90px' },
		{ key: 'actions', label: '', width: '72px', align: 'right' as const }
	];
</script>

<div class="p-6">
	<!-- Page header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Invoices</h1>
			<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Create and manage your invoices</p>
		</div>
		<a
			href="/invoices/new"
			class="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
		>
			<Plus size={16} />
			New invoice
		</a>
	</div>

	<!-- Invoice table -->
	<Table
		{columns}
		rows={data.invoices}
		rowHref={(invoice) => `/invoices/${invoice.id}`}
		emptyTitle="No invoices yet"
		emptySubtitle="Create your first invoice to get started"
	>
		{#snippet emptyIcon()}
			<div class="mb-3 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
				<FileText size={24} class="text-gray-400" />
			</div>
		{/snippet}

		{#snippet emptyAction()}
			<a
				href="/invoices/new"
				class="mt-4 flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
			>
				<Plus size={14} />
				New invoice
			</a>
		{/snippet}

		{#snippet cell(key, invoice)}
			{#if key === 'number'}
				<span class="text-sm font-medium text-primary-600 dark:text-primary-400">
					{invoice.number}
				</span>
			{:else if key === 'client'}
				<span class="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
					{invoice.billTo.name}
				</span>
			{:else if key === 'issueDate'}
				<span class="text-sm text-gray-500 dark:text-gray-400">{fmtDate(invoice.issueDate)}</span>
			{:else if key === 'dueDate'}
				<span class="text-sm text-gray-500 dark:text-gray-400">{fmtDate(invoice.dueDate)}</span>
			{:else if key === 'total'}
				<span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
					${fmt(invoice.total)}
				</span>
			{:else if key === 'status'}
				{#if invoice.status === 'sent'}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
					>
						<Send size={10} />
						Sent
					</span>
				{:else}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
					>
						<Clock size={10} />
						Draft
					</span>
				{/if}
			{:else if key === 'actions'}
				{#if invoice.status === 'draft'}
					<div class="flex items-center justify-end gap-1">
						<button
							type="button"
							onclick={(e) => { e.preventDefault(); e.stopPropagation(); goto(`/invoices/${invoice.id}/edit`); }}
							class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
							aria-label="Edit {invoice.number}"
						>
							<Pencil size={13} />
						</button>
						<Popover.Root
							open={deletePopoverId === invoice.id}
							onOpenChange={(v) => { deletePopoverId = v ? invoice.id : undefined; }}
						>
							<Popover.Trigger
								onclick={(e) => { e.preventDefault(); e.stopPropagation(); }}
								class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
								aria-label="Delete {invoice.number}"
							>
								<Trash2 size={13} />
							</Popover.Trigger>
							<Popover.Portal>
								<Popover.Content
									class="z-70 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900"
									sideOffset={6}
									align="end"
								>
									<p class="text-sm font-medium text-gray-900 dark:text-gray-100">
										Delete <strong>{invoice.number}</strong>?
									</p>
									<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
										This action cannot be undone.
									</p>
									<div class="mt-3 flex gap-2">
										<form
											method="POST"
											action="?/delete"
											use:enhance={() => ({ update }) => {
												deletePopoverId = undefined;
												update();
											}}
										>
											<input type="hidden" name="id" value={invoice.id} />
											<button
												type="submit"
												class="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
											>
												Delete
											</button>
										</form>
										<button
											onclick={() => { deletePopoverId = undefined; }}
											class="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
										>
											Cancel
										</button>
									</div>
								</Popover.Content>
							</Popover.Portal>
						</Popover.Root>
					</div>
				{/if}
			{/if}
		{/snippet}
	</Table>
</div>
