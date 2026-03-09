<script lang="ts">
	import { Select } from 'bits-ui';
	import { cn } from './cn.js';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: { class?: string; value: string; children?: Snippet; [key: string]: unknown } = $props();
</script>

<Select.Item
	class={cn(
		'flex cursor-pointer items-center px-2.5 py-1.5 text-sm text-gray-700 outline-none data-[highlighted]:bg-gray-50 dark:text-gray-300 dark:data-[highlighted]:bg-gray-800/60',
		className
	)}
	{...rest}
>
	{@render children?.()}
</Select.Item>
