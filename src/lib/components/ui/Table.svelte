<script lang="ts" generics="TRow">
	import type { Snippet } from 'svelte';

	type Column = {
		key: string;
		label: string;
		width?: string;
		align?: 'left' | 'right' | 'center';
	};

	let {
		columns,
		rows,
		rowHref,
		emptyTitle = 'No items',
		emptySubtitle,
		cell,
		emptyIcon,
		emptyAction
	}: {
		columns: Column[];
		rows: TRow[];
		rowHref?: (row: TRow) => string;
		emptyTitle?: string;
		emptySubtitle?: string;
		cell: Snippet<[string, TRow]>;
		emptyIcon?: Snippet;
		emptyAction?: Snippet;
	} = $props();

	const gridTemplate = $derived(columns.map((c) => c.width ?? '1fr').join(' '));

	function cellAlign(align?: 'left' | 'right' | 'center') {
		if (align === 'right') return 'text-right';
		if (align === 'center') return 'text-center';
		return '';
	}

	const rowClass =
		'grid items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50';
</script>

<div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
	{#if rows.length === 0}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			{#if emptyIcon}
				{@render emptyIcon()}
			{/if}
			<p class="text-sm font-medium text-gray-600 dark:text-gray-400">{emptyTitle}</p>
			{#if emptySubtitle}
				<p class="mt-1 text-xs text-gray-400 dark:text-gray-500">{emptySubtitle}</p>
			{/if}
			{#if emptyAction}
				{@render emptyAction()}
			{/if}
		</div>
	{:else}
		<!-- Header -->
		<div
			class="grid gap-4 border-b border-gray-100 px-5 py-3 dark:border-gray-800"
			style="grid-template-columns: {gridTemplate}"
		>
			{#each columns as col (col.key)}
				<span
					class="text-xs font-medium uppercase tracking-wide text-gray-400 {cellAlign(col.align)}"
				>
					{col.label}
				</span>
			{/each}
		</div>

		<!-- Rows -->
		<div class="divide-y divide-gray-200 dark:divide-gray-800">
			{#each rows as row (rowHref ? rowHref(row) : row)}
				{#if rowHref}
					<a
						href={rowHref(row)}
						class={rowClass}
						style="grid-template-columns: {gridTemplate}"
					>
						{#each columns as col (col.key)}
							<div class="min-w-0 {cellAlign(col.align)}">
								{@render cell(col.key, row)}
							</div>
						{/each}
					</a>
				{:else}
					<div class={rowClass} style="grid-template-columns: {gridTemplate}">
						{#each columns as col (col.key)}
							<div class="min-w-0 {cellAlign(col.align)}">
								{@render cell(col.key, row)}
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
