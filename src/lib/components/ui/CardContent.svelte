<script lang="ts">
	import { cn } from './cn.js';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: { class?: string; children?: Snippet; [key: string]: unknown } = $props();
</script>

<div class={cn('space-y-8 p-6', className)} {...rest}>
	{@render children?.()}
</div>
