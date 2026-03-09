<script lang="ts">
	import { cn } from './cn.js';

	let {
		class: className,
		checked = false,
		disabled = false,
		id,
		name,
		value,
		...rest
	}: {
		class?: string;
		checked?: boolean;
		disabled?: boolean;
		id?: string;
		name?: string;
		value?: string;
		[key: string]: unknown;
	} = $props();
</script>

<!--
	Radio is a controlled component — the parent manages which option is
	selected by passing checked={group === value} and handling onchange.
	Native input is positioned over the visual element (opacity-0) so it
	receives all native interactions (click, keyboard, form submission)
	while the custom visual reacts to the `checked` prop.
-->
<span
	class={cn(
		'relative inline-flex h-4 w-4 shrink-0',
		disabled && 'cursor-not-allowed opacity-50',
		className
	)}
>
	<input
		type="radio"
		{id}
		{name}
		{value}
		{checked}
		{disabled}
		class="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
		{...rest}
	/>
	<span
		class={cn(
			'pointer-events-none flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-200',
			checked
				? 'border-primary-600 bg-white dark:border-primary-500 dark:bg-gray-900'
				: 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
			'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-200 peer-focus-visible:ring-offset-1 peer-focus-visible:border-primary-600 dark:peer-focus-visible:ring-primary-900/30'
		)}
		aria-hidden="true"
	>
		<span
			class={cn(
				'rounded-full bg-primary-600 transition-all duration-150 dark:bg-primary-500',
				checked ? 'h-2 w-2 scale-100 opacity-100' : 'h-2 w-2 scale-0 opacity-0'
			)}
		></span>
	</span>
</span>
