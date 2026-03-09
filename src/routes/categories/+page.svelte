<script lang="ts">
	import { Tag, Plus, Pencil, Trash2 } from 'lucide-svelte';
	import type { Category } from '$lib/types/transaction';
	import Table from '$lib/components/ui/Table.svelte';
	import CategoryModal from './CategoryModal.svelte';
	import { Popover } from '$lib/components/ui/popover.js';
	import { enhance } from '$app/forms';

	let { data } = $props();

	let modalOpen = $state(false);
	let editTarget = $state<Category | undefined>(undefined);
	let deletePopoverId = $state<string | undefined>(undefined);

	function openCreate() {
		editTarget = undefined;
		modalOpen = true;
	}

	function openEdit(cat: Category) {
		editTarget = cat;
		modalOpen = true;
	}

	const columns = [
		{ key: 'category', label: 'Category' },
		{ key: 'type', label: 'Applies to', width: '130px' },
		{ key: 'count', label: 'Transactions', width: '120px', align: 'right' as const },
		{ key: 'actions', label: '', width: '80px', align: 'right' as const }
	];

	const TYPE_LABELS: Record<string, string> = {
		income: 'Income',
		expense: 'Expense',
		both: 'Both'
	};

	const TYPE_STYLES: Record<string, string> = {
		income: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
		expense: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
		both: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
	};
</script>

<div class="p-6">
	<!-- Page header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Categories</h1>
			<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
				Organise your transactions with categories
			</p>
		</div>
		<button
			onclick={openCreate}
			class="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
		>
			<Plus size={16} />
			New category
		</button>
	</div>

	<!-- Categories table -->
	<Table
		{columns}
		rows={data.categories}
		emptyTitle="No categories yet"
		emptySubtitle="Create your first category to get started"
	>
		{#snippet emptyIcon()}
			<div class="mb-3 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
				<Tag size={24} class="text-gray-400" />
			</div>
		{/snippet}

		{#snippet emptyAction()}
			<button
				onclick={openCreate}
				class="mt-4 flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
			>
				<Plus size={14} />
				New category
			</button>
		{/snippet}

		{#snippet cell(key, cat)}
			{#if key === 'category'}
				<span
					class="inline-flex items-center rounded px-2.5 py-1 text-xs font-medium"
					style="background-color: {cat.color}22; color: {cat.color};"
				>
					{cat.label}
				</span>
			{:else if key === 'type'}
				<span
					class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium {TYPE_STYLES[cat.type]}"
				>
					{TYPE_LABELS[cat.type]}
				</span>
			{:else if key === 'count'}
				<span class="text-sm text-gray-500 dark:text-gray-400">
					{cat.transactionCount}
				</span>
			{:else if key === 'actions'}
				<div class="flex items-center justify-end gap-1">
					<button
						onclick={() => openEdit(cat)}
						class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
						aria-label="Edit {cat.label}"
					>
						<Pencil size={13} />
					</button>
					<Popover.Root
						open={deletePopoverId === cat.id}
						onOpenChange={(v) => { deletePopoverId = v ? cat.id : undefined; }}
					>
						<Popover.Trigger
							class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
							aria-label="Delete {cat.label}"
						>
							<Trash2 size={13} />
						</Popover.Trigger>
						<Popover.Portal>
							<Popover.Content
								class="z-[70] w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900"
								sideOffset={6}
								align="end"
							>
								<p class="text-sm font-medium text-gray-900 dark:text-gray-100">
									Delete <strong>{cat.label}</strong>?
								</p>
								{#if cat.transactionCount > 0}
									<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
										{cat.transactionCount} transaction{cat.transactionCount === 1 ? '' : 's'} will become uncategorised.
									</p>
								{/if}
								<div class="mt-3 flex gap-2">
									<form method="POST" action="?/delete" use:enhance={() => ({ update }) => {
										deletePopoverId = undefined;
										update();
									}}>
										<input type="hidden" name="id" value={cat.id} />
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
		{/snippet}
	</Table>
</div>

<CategoryModal
	bind:open={modalOpen}
	category={editTarget}
	nextColor={data.nextColor}
	onclose={() => { modalOpen = false; editTarget = undefined; }}
/>
