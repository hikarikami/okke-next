<script lang="ts">
	import { cn } from './cn.js';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		description,
		icon,
		actions,
		...rest
	}: {
		class?: string;
		/** Main heading — can be plain text or rich markup */
		children?: Snippet;
		/** Short subtitle rendered below the heading */
		description?: string;
		/** Optional icon badge rendered to the left of the heading */
		icon?: Snippet;
		/** Optional content anchored to the right (e.g. a button or menu) */
		actions?: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<div
	class={cn(
		'flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800',
		className
	)}
	{...rest}
>
	<div class="flex items-center gap-3">
		{#if icon}
			{@render icon()}
		{/if}
		<div>
			<h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
				{@render children?.()}
			</h2>
			{#if description}
				<p class="text-xs text-gray-500 dark:text-gray-400">{description}</p>
			{/if}
		</div>
	</div>
	{#if actions}
		{@render actions()}
	{/if}
</div>
