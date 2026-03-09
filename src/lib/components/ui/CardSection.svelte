<script lang="ts">
	import { cn } from './cn.js';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		title,
		actions,
		children,
		...rest
	}: {
		class?: string;
		/** Optional section heading rendered as an uppercase label */
		title?: string;
		/** Optional content anchored to the right of the section heading */
		actions?: Snippet;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<div class={cn('', className)} {...rest}>
	{#if title || actions}
		<div class="mb-3 flex items-center justify-between">
			{#if title}
				<h3 class="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</h3>
			{/if}
			{#if actions}
				{@render actions()}
			{/if}
		</div>
	{/if}
	{@render children?.()}
</div>
