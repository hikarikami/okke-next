<script lang="ts">
	import { cn } from './cn.js';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: { class?: string; children?: Snippet; [key: string]: unknown } = $props();
</script>

<div
	class={cn(
		'rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
