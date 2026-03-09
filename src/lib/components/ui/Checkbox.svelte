<script lang="ts">
	import { cn } from './cn.js';

	let {
		class: className,
		checked = $bindable(false),
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
	Native input is positioned over the visual element (opacity-0) so it
	receives all native interactions (click, keyboard, form submission)
	while the custom visual reacts to Svelte's reactive `checked` state.
-->
<span
	class={cn(
		'relative inline-flex h-4 w-4 shrink-0',
		disabled && 'cursor-not-allowed opacity-50',
		className
	)}
>
	<input
		type="checkbox"
		{id}
		{name}
		{value}
		{disabled}
		bind:checked
		class="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
		{...rest}
	/>
	<span
		class={cn(
			'pointer-events-none flex h-4 w-4 items-center justify-center rounded border transition-all duration-200',
			checked
				? 'border-primary-600 bg-primary-600 dark:border-primary-500 dark:bg-primary-500'
				: 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
			'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-200 peer-focus-visible:ring-offset-1 peer-focus-visible:border-primary-600 dark:peer-focus-visible:ring-primary-900/30'
		)}
		aria-hidden="true"
	>
		<svg
			class={cn(
				'text-white transition-all duration-150',
				checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
			)}
			width="10"
			height="8"
			viewBox="0 0 10 8"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<polyline points="1 4 3.5 6.5 9 1" />
		</svg>
	</span>
</span>
