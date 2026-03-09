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
		'flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
