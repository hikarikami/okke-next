<script lang="ts">
	import { TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-svelte';
	import { PieChart, Tooltip } from 'layerchart';

	let { data } = $props();

	const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	const fmtPct = (n: number | null) => n == null ? '—' : (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

	const stats = $derived([
		{
			label: 'Total Income',
			value: '$' + fmt(data.totalIncome),
			change: fmtPct(data.incomeChange),
			positive: (data.incomeChange ?? 0) >= 0,
			icon: TrendingUp,
			color: 'text-emerald-600 dark:text-emerald-400',
			bg: 'bg-emerald-50 dark:bg-emerald-900/20'
		},
		{
			label: 'Total Expenses',
			value: '$' + fmt(data.totalExpenses),
			change: fmtPct(data.expensesChange),
			positive: (data.expensesChange ?? 0) <= 0,
			icon: TrendingDown,
			color: 'text-red-500 dark:text-red-400',
			bg: 'bg-red-50 dark:bg-red-900/20'
		},
		{
			label: 'Balance',
			value: '$' + fmt(data.balance),
			change: fmtPct(data.balanceChange),
			positive: (data.balanceChange ?? 0) >= 0,
			icon: Wallet,
			color: 'text-primary-600 dark:text-primary-400',
			bg: 'bg-primary-50 dark:bg-primary-900/20'
		}
	]);
</script>

<div class="p-6">
	<!-- Page header -->
	<div class="mb-6">
		<h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
		<p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{data.monthLabel}</p>
	</div>

	<!-- Stats cards -->
	<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
		{#each stats as stat (stat.label)}
			<div
				class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
			>
				<div class="flex items-start justify-between">
					<div>
						<p class="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
						<p class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
							{stat.value}
						</p>
					</div>
					<div class="rounded-lg p-2 {stat.bg}">
						<stat.icon size={20} class={stat.color} />
					</div>
				</div>
				<p
					class="mt-3 text-xs font-medium {stat.positive
						? 'text-emerald-600 dark:text-emerald-400'
						: 'text-red-500 dark:text-red-400'}"
				>
					{stat.change} vs last month
				</p>
			</div>
		{/each}
	</div>

	<!-- Charts + Transactions row -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
		<!-- Expense Breakdown Donut Chart -->
		<div
			class="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="mb-1">
				<h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
					Expenses by Category
				</h2>
				<p class="mt-0.5 text-xs text-gray-400">{data.monthLabel}</p>
			</div>

			<!-- Donut chart -->
			<div class="h-52">
				<PieChart
					data={data.expenseCategories}
					key="key"
					label="label"
					value="value"
					c="color"
					innerRadius={0.62}
					padAngle={0.03}
					cornerRadius={3}
				>
					<svelte:fragment slot="tooltip">
						<Tooltip.Root
							variant="none"
							classes={{
								container:
									'rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900'
							}}
							let:data
						>
							<div class="flex items-center gap-2.5">
								<span
									class="h-2.5 w-2.5 shrink-0 rounded-full"
									style="background-color: {data.color}"
								></span>
								<span class="text-xs text-gray-700 dark:text-gray-300">{data.label}</span>
								<span class="text-xs font-semibold text-gray-900 dark:text-gray-100">
									${data.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
								</span>
							</div>
						</Tooltip.Root>
					</svelte:fragment>
				</PieChart>
			</div>

			<!-- Legend -->
			<div class="mt-3 space-y-2.5">
				{#each data.expenseCategories as cat (cat.key)}
					{@const pct = data.totalExpenses > 0 ? Math.round((cat.value / data.totalExpenses) * 100) : 0}
					<div class="flex items-center justify-between">
						<div class="flex min-w-0 items-center gap-2">
							<span
								class="h-2.5 w-2.5 shrink-0 rounded-full"
								style="background-color: {cat.color}"
							></span>
							<span class="truncate text-xs text-gray-600 dark:text-gray-400">{cat.label}</span>
						</div>
						<div class="ml-3 flex shrink-0 items-center gap-2">
							<span class="text-xs font-medium text-gray-900 dark:text-gray-100">
								${cat.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
							</span>
							<span class="w-7 text-right text-xs text-gray-400">{pct}%</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Recent transactions -->
		<div
			class="lg:col-span-3 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
		>
			<div
				class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
			>
				<h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Transactions</h2>
				<a
					href="/transactions"
					class="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
				>
					View all <ArrowRight size={12} />
				</a>
			</div>

			<div class="divide-y divide-gray-100 dark:divide-gray-800">
				{#each data.recentTransactions as tx (tx.id)}
					<div class="flex items-center justify-between px-5 py-3.5">
						<div class="min-w-0">
							<p class="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
								{tx.description}
							</p>
							<p class="mt-0.5 text-xs text-gray-400">{tx.categoryLabel ?? 'Uncategorised'} &middot; {tx.date}</p>
						</div>
						<span
							class="ml-4 shrink-0 text-sm font-semibold {tx.type === 'income'
								? 'text-emerald-600 dark:text-emerald-400'
								: 'text-gray-700 dark:text-gray-300'}"
						>
							{tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
						</span>
					</div>
				{/each}
				{#if data.recentTransactions.length === 0}
					<p class="px-5 py-8 text-center text-sm text-gray-400">No transactions this month</p>
				{/if}
			</div>
		</div>
	</div>
</div>
