<script lang="ts">
	import { Combobox } from 'bits-ui';
	import { cn } from './cn.js';
	import { X } from 'lucide-svelte';

	let {
		class: className,
		ref = $bindable<HTMLInputElement | null>(null),
		onclear,
		openOnFocus = false,
		open = $bindable(false),
		onfocus,
		...rest
	}: {
		class?: string;
		ref?: HTMLInputElement | null;
		onclear?: () => void;
		/**
		 * When true, the dropdown opens immediately on focus without requiring any typing.
		 * When false (default), the dropdown only opens once the user starts typing.
		 */
		openOnFocus?: boolean;
		/** Bind this to the same variable as `bind:open` on `Combobox.Root` when using `openOnFocus`. */
		open?: boolean;
		onfocus?: (e: FocusEvent & { currentTarget: HTMLInputElement }) => void;
		[key: string]: unknown;
	} = $props();

	function handleFocus(e: FocusEvent & { currentTarget: HTMLInputElement }) {
		if (openOnFocus) open = true;
		onfocus?.(e);
	}
</script>

<Combobox.Input
	bind:ref
	class={cn(
		'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-primary-600 focus:ring-2 focus:ring-primary-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-primary-500 dark:focus:ring-primary-900/30',
		onclear ? 'pr-8' : '',
		className
	)}
	onfocus={handleFocus}
	{...rest}
/>
{#if onclear}
	<button
		type="button"
		onmousedown={(e) => { e.preventDefault(); onclear(); }}
		class="absolute right-2 top-1/2 -translate-y-1/2 z-[1] flex h-5 w-5 items-center justify-center rounded text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-400"
		aria-label="Clear selection"
	>
		<X size={12} />
	</button>
{/if}
