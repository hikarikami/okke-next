<script lang="ts">
	import { Combobox } from 'bits-ui';
	import { cn } from './cn.js';
	import type { Snippet } from 'svelte';

	type Width = 'trigger' | 'auto';

	let {
		class: className,
		children,
		footer,
		sideOffset = 4,
		width = 'trigger',
		...rest
	}: {
		class?: string;
		children?: Snippet;
		footer?: Snippet;
		sideOffset?: number;
		width?: Width;
		[key: string]: unknown;
	} = $props();
</script>

<Combobox.Content
	{sideOffset}
	class={cn(
		'z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900',
		className
	)}
	style={width === 'trigger' ? 'width: var(--bits-floating-anchor-width)' : undefined}
	{...rest}
>
	<Combobox.Viewport class="max-h-60 overflow-auto py-1.5">
		{@render children?.()}
	</Combobox.Viewport>
	{@render footer?.()}
</Combobox.Content>
