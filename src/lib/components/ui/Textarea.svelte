<script lang="ts">
	import { cn } from './cn.js';

	let {
		class: className,
		value = $bindable(),
		rows = 3,
		...rest
	}: { class?: string; value?: string; rows?: number; [key: string]: unknown } = $props();
</script>

<textarea
	bind:value
	{rows}
	class={cn(
		'w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-primary-500 dark:focus:ring-primary-900/30',
		className
	)}
	{...rest}
></textarea>
