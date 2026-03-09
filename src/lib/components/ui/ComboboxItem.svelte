<script lang="ts">
	import { Combobox } from 'bits-ui';
	import { cn } from './cn.js';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		value,
		...rest
	}: { class?: string; children?: Snippet; value: string; [key: string]: unknown } = $props();
</script>

<Combobox.Item
	{value}
	class={cn(
		'flex cursor-pointer items-center px-2.5 py-1.5 text-sm text-gray-700 outline-none data-[highlighted]:bg-gray-50 dark:text-gray-300 dark:data-[highlighted]:bg-gray-800/60',
		className
	)}
	{...rest}
>
	{@render children?.()}
</Combobox.Item>
