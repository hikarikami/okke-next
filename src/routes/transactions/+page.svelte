<script lang="ts">
	import { ChevronLeft, ChevronRight, Plus, TrendingUp, TrendingDown, Wallet, Trash2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import AddTransactionModal from './AddTransactionModal.svelte';
	import Table from '$lib/components/ui/Table.svelte';

	let { data } = $props();

	let modalOpen = $state(false);

	const monthLabel = $derived(
		new Date(data.currentMonth.year, data.currentMonth.month - 1, 1).toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric'
		})
	);

	function navigate(offset: number) {
		let { year, month } = data.currentMonth;
		month += offset;
		if (month > 12) { month = 1; year++; }
		if (month < 1) { month = 12; year--; }
		goto(`?month=${year}-${String(month).padStart(2, '0')}`, { replaceState: false });
	}

	function formatAmount(amount: number): string {
		return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	const columns = [
		{ key: 'description', label: 'Description' },
		{ key: 'category', label: 'Category' },
		{ key: 'date', label: 'Date', width: '120px' },
		{ key: 'amount', label: 'Amount', width: '100px', align: 'right' as const },
		{ key: 'actions', label: '', width: '40px' }
	];
</script>

<div class="p-6">
	<!-- Page header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Transactions</h1>
			<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Track your income and expenses</p>
		</div>
		<button
			onclick={() => (modalOpen = true)}
			class="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
		>
			<Plus size={16} />
			Add transaction
		</button>
	</div>

	<!-- Month navigation -->
	<div class="mb-4 flex items-center gap-3">
		<button
			onclick={() => navigate(-1)}
			class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
		>
			<ChevronLeft size={16} />
		</button>
		<span class="min-w-36 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
			{monthLabel}
		</span>
		<button
			onclick={() => navigate(1)}
			class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
		>
			<ChevronRight size={16} />
		</button>
	</div>

	<!-- Summary bar -->
	<div class="mb-6 grid grid-cols-3 gap-3">
		<div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
			<div class="flex items-center gap-2">
				<div class="rounded-md bg-emerald-50 p-1.5 dark:bg-emerald-900/20">
					<TrendingUp size={14} class="text-emerald-600 dark:text-emerald-400" />
				</div>
				<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Income</span>
			</div>
			<p class="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
				${formatAmount(data.totalIncome)}
			</p>
		</div>
		<div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
			<div class="flex items-center gap-2">
				<div class="rounded-md bg-red-50 p-1.5 dark:bg-red-900/20">
					<TrendingDown size={14} class="text-red-500 dark:text-red-400" />
				</div>
				<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Expenses</span>
			</div>
			<p class="mt-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
				${formatAmount(data.totalExpenses)}
			</p>
		</div>
		<div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
			<div class="flex items-center gap-2">
				<div class="rounded-md bg-primary-50 p-1.5 dark:bg-primary-900/20">
					<Wallet size={14} class="text-primary-600 dark:text-primary-400" />
				</div>
				<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Balance</span>
			</div>
			<p class="mt-2 text-lg font-semibold text-primary-600 dark:text-primary-400">
				${formatAmount(data.balance)}
			</p>
		</div>
	</div>

	<!-- Transaction table -->
	<Table
		{columns}
		rows={data.transactions}
		emptyTitle="No transactions this month"
		emptySubtitle="Add your first transaction to get started"
	>
		{#snippet emptyIcon()}
			<div class="mb-3 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
				<Wallet size={24} class="text-gray-400" />
			</div>
		{/snippet}

		{#snippet emptyAction()}
			<button
				onclick={() => (modalOpen = true)}
				class="mt-4 flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
			>
				<Plus size={14} />
				Add transaction
			</button>
		{/snippet}

		{#snippet cell(key, tx)}
			{#if key === 'description'}
				<p class="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
					{tx.description}
				</p>
				<span
					class="mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium {tx.type ===
					'income'
						? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
						: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}"
				>
					{tx.type}
				</span>
			{:else if key === 'category'}
				<span class="truncate text-sm text-gray-500 dark:text-gray-400">
					{tx.categoryLabel ?? 'Uncategorised'}
				</span>
			{:else if key === 'date'}
				<span class="text-sm text-gray-500 dark:text-gray-400">{tx.date}</span>
			{:else if key === 'amount'}
				<span
					class="text-sm font-semibold {tx.type === 'income'
						? 'text-emerald-600 dark:text-emerald-400'
						: 'text-gray-700 dark:text-gray-300'}"
				>
					{tx.type === 'income' ? '+' : '-'}${formatAmount(tx.amount)}
				</span>
					{:else if key === 'actions'}
				<form method="POST" action="?/delete" use:enhance>
					<input type="hidden" name="id" value={tx.id} />
					<button
						type="submit"
						class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
						aria-label="Delete transaction"
					>
						<Trash2 size={14} />
					</button>
				</form>
			{/if}
		{/snippet}
	</Table>
</div>

<AddTransactionModal bind:open={modalOpen} categories={data.categories} onclose={() => (modalOpen = false)} />
