<script lang="ts">
	import { cn } from './cn.js';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: { class?: string; children?: Snippet; [key: string]: unknown } = $props();
</script>

<label class={cn('mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400', className)} {...rest}>
	{@render children?.()}
</label>
