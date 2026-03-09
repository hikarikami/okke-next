<script lang="ts">
	import { Select } from 'bits-ui';
	import { cn } from './cn.js';

	type Width = 'trigger' | 'auto';
	type Position = 'popper' | 'item-aligned';

	let {
		class: className,
		width = 'trigger',
		position = 'popper',
		...rest
	}: {
		class?: string;
		width?: Width;
		position?: Position;
		[key: string]: unknown;
	} = $props();
</script>

<Select.Content
	class={cn(
		'z-50 overflow-hidden rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-900',
		className
	)}
	style={width === 'trigger' ? 'width: var(--bits-floating-anchor-width)' : undefined}
	{...rest}
/>
